import { Complaint, CaseRelationship } from '../types';
import { db } from './db';

export interface OverlapMatch {
  candidateCase: Complaint;
  score: number;
  reasons: string[];
  crossBureau: boolean;
  needsCoordination: boolean;
  existingRelationship?: CaseRelationship;
}

// Stop words for keyword matching
const STOP_WORDS = new Set([
  'the', 'is', 'in', 'at', 'of', 'on', 'and', 'a', 'to', 'for', 'with', 'from',
  'by', 'about', 'as', 'into', 'like', 'through', 'after', 'over', 'between',
  'out', 'against', 'during', 'without', 'before', 'under', 'around', 'among'
]);

function extractKeywords(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));
  return new Set(words);
}

function calculateJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersectionCount = 0;
  for (const item of setA) {
    if (setB.has(item)) intersectionCount++;
  }
  const unionCount = setA.size + setB.size - intersectionCount;
  return unionCount === 0 ? 0 : intersectionCount / unionCount;
}

// Related category matrix
const RELATED_CATEGORIES: Record<string, string[]> = {
  'Fee Irregularity': ['Admission', 'Affiliation/Approval', 'Other'],
  'Infrastructure': ['Affiliation/Approval', 'Harassment', 'Other'],
  'Faculty & Staff': ['Affiliation/Approval', 'Academic & Curriculum', 'Harassment'],
  'Admission': ['Fee Irregularity', 'Affiliation/Approval', 'Academic & Curriculum'],
  'Affiliation/Approval': ['Infrastructure', 'Faculty & Staff', 'Admission'],
  'Harassment': ['Faculty & Staff', 'Infrastructure', 'Other'],
  'Academic & Curriculum': ['Faculty & Staff', 'Admission', 'Other'],
  'Other': ['Fee Irregularity', 'Infrastructure'],
};

export function checkOverlapForCase(targetCase: Complaint): OverlapMatch[] {
  const allComplaints = db.getComplaints();
  const existingRelationships = db.getRelationships();

  const matches: OverlapMatch[] = [];

  const targetKeywords = extractKeywords(`${targetCase.title} ${targetCase.description}`);
  const targetDate = new Date(targetCase.dateReceived).getTime();

  for (const c of allComplaints) {
    // Skip comparing case to itself
    if (c.id === targetCase.id || c.caseNumber === targetCase.caseNumber) continue;

    // Institution must match for complaint overlap
    const isSameInstitution =
      (c.institutionId && c.institutionId === targetCase.institutionId) ||
      (c.institutionPermanentId && c.institutionPermanentId === targetCase.institutionPermanentId) ||
      (c.institutionName.toLowerCase() === targetCase.institutionName.toLowerCase());

    if (!isSameInstitution) continue;

    const reasons: string[] = [];
    let score = 0;

    // 1. Institution Match
    score += 40;
    reasons.push(`Same AICTE Permanent ID (${c.institutionPermanentId || 'Verified'})`);

    // 2. Cross Bureau Match
    const isCrossBureau = c.bureauCode !== targetCase.bureauCode;
    if (isCrossBureau) {
      score += 20;
      reasons.push(`Handled across separate bureaus: ${targetCase.bureauCode} and ${c.bureauCode}`);
    } else {
      reasons.push(`Both dockets within ${c.bureauCode}`);
    }

    // 3. Category Match
    if (c.category === targetCase.category) {
      score += 20;
      reasons.push(`Identical grievance category: ${c.category}`);
    } else if (RELATED_CATEGORIES[targetCase.category]?.includes(c.category)) {
      score += 12;
      reasons.push(`Correlated grievance categories: ${targetCase.category} ↔ ${c.category}`);
    }

    // 4. Time Proximity
    const otherDate = new Date(c.dateReceived).getTime();
    const diffDays = Math.abs(targetDate - otherDate) / (1000 * 3600 * 24);
    if (diffDays <= 30) {
      score += 15;
      reasons.push(`Filing proximity: Lodged within ${Math.round(diffDays)} days of each other`);
    } else if (diffDays <= 90) {
      score += 8;
      reasons.push(`Filing proximity: Lodged within ${Math.round(diffDays)} days (same academic quarter)`);
    }

    // 5. Text & Keyword Similarity
    const otherKeywords = extractKeywords(`${c.title} ${c.description}`);
    const similarity = calculateJaccardSimilarity(targetKeywords, otherKeywords);
    if (similarity > 0.15) {
      score += 10;
      const commonWords: string[] = [];
      targetKeywords.forEach((w) => {
        if (otherKeywords.has(w) && commonWords.length < 3) commonWords.push(w);
      });
      if (commonWords.length > 0) {
        reasons.push(`Text similarity: Shared key terms ("${commonWords.join('", "')}")`);
      }
    }

    // Find any existing relationship in DB
    const existing = existingRelationships.find(
      (r) =>
        (r.sourceCaseId === targetCase.id && r.targetCaseId === c.id) ||
        (r.sourceCaseId === c.id && r.targetCaseId === targetCase.id) ||
        (r.sourceCaseNumber === targetCase.caseNumber && r.targetCaseNumber === c.caseNumber) ||
        (r.sourceCaseNumber === c.caseNumber && r.targetCaseNumber === targetCase.caseNumber)
    );

    // Only qualify if score >= 60
    if (score >= 60) {
      matches.push({
        candidateCase: c,
        score: Math.min(score, 99),
        reasons,
        crossBureau: isCrossBureau,
        needsCoordination: isCrossBureau && (c.status !== 'Resolved' && c.status !== 'Closed'),
        existingRelationship: existing,
      });
    }
  }

  // Sort descending by score
  return matches.sort((a, b) => b.score - a.score);
}
