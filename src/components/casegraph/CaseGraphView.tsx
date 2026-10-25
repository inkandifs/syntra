import React, { useState, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { db } from '../../services/db';
import { Complaint, Institution, CaseRelationship } from '../../types';
import { Building2, FileText, Shield, User, Info, X, ExternalLink } from 'lucide-react';
import { BureauBadge, StatusBadge, PriorityBadge } from '../common/StatusBadge';

interface CaseGraphViewProps {
  initialInstitutionId?: string;
  onOpenCase?: (caseNumber: string) => void;
}

export const CaseGraphView: React.FC<CaseGraphViewProps> = ({
  initialInstitutionId = 'inst-1',
  onOpenCase,
}) => {
  const [selectedInstId, setSelectedInstId] = useState(initialInstitutionId);
  const [filterType, setFilterType] = useState<'all' | 'overlaps' | 'bureaus' | 'officers'>('all');
  const [inspectedNode, setInspectedNode] = useState<any>(null);

  const institutions = db.getInstitutions();
  const allComplaints = db.getComplaints();
  const allRelationships = db.getRelationships();

  const currentInst = institutions.find((i) => i.id === selectedInstId) || institutions[0];

  // Filter complaints linked to this institution
  const instComplaints = useMemo(() => {
    return allComplaints.filter(
      (c) =>
        c.institutionId === currentInst.id ||
        c.institutionPermanentId === currentInst.permanentId ||
        c.institutionName.toLowerCase() === currentInst.name.toLowerCase()
    );
  }, [allComplaints, currentInst]);

  // Construct nodes and edges dynamically based on DB data
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // 1. Center Node: Institution
    nodes.push({
      id: `inst-${currentInst.id}`,
      type: 'default',
      position: { x: 380, y: 220 },
      data: {
        label: (
          <div className="p-3 text-center bg-[#FAF6EE] border-2 border-[#C9AE7C] rounded-[4px] shadow-md min-w-[200px]">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#8C6D2E] font-bold flex items-center justify-center gap-1">
              <Building2 size={12} />
              AICTE ID: {currentInst.permanentId}
            </div>
            <div className="font-serif font-bold text-xs text-[#1F1F24] mt-1 line-clamp-1">
              {currentInst.name}
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5">
              {currentInst.city}, {currentInst.state}
            </div>
          </div>
        ),
        raw: currentInst,
        nodeType: 'institution',
      },
    });

    // 2. Complaint Nodes (arranged radially around institution)
    const angleStep = (2 * Math.PI) / Math.max(instComplaints.length, 1);
    const radius = 220;

    instComplaints.forEach((comp, idx) => {
      const angle = idx * angleStep;
      const compX = 380 + radius * Math.cos(angle);
      const compY = 220 + radius * Math.sin(angle);

      const isFlagship = comp.caseNumber === 'SYN-1042' || comp.caseNumber === 'SYN-1088';

      nodes.push({
        id: `case-${comp.caseNumber}`,
        position: { x: compX, y: compY },
        data: {
          label: (
            <div
              className={`p-2.5 rounded-[4px] shadow-sm text-left max-w-[210px] cursor-pointer transition-all border ${
                isFlagship
                  ? 'bg-white border-[#C9AE7C] ring-2 ring-[#C9AE7C]/40'
                  : 'bg-white border-[#E3E3E6] hover:border-[#655A86]'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-mono font-bold text-xs text-[#1F1F24]">
                  {comp.caseNumber}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 bg-gray-100 rounded text-gray-700">
                  {comp.bureauCode}
                </span>
              </div>
              <div className="text-[11px] font-medium text-[#1F1F24] line-clamp-1">{comp.title}</div>
              <div className="flex items-center justify-between text-[9px] mt-1 pt-1 border-t border-gray-100 text-gray-500">
                <span>{comp.category}</span>
                <span className="font-semibold text-[#8C6D2E]">{comp.status}</span>
              </div>
            </div>
          ),
          raw: comp,
          nodeType: 'complaint',
        },
      });

      // Edge from Institution to Complaint
      edges.push({
        id: `edge-inst-${comp.caseNumber}`,
        source: `inst-${currentInst.id}`,
        target: `case-${comp.caseNumber}`,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#C9AE7C', strokeWidth: 1.5 },
        label: 'Docketed',
        labelStyle: { fill: '#8C6D2E', fontSize: 10, fontWeight: 500 },
      });

      // 3. Officer Nodes (if filter allows)
      if (filterType === 'all' || filterType === 'officers') {
        const offX = compX + 130 * Math.cos(angle);
        const offY = compY + 80 * Math.sin(angle);

        nodes.push({
          id: `officer-${comp.caseNumber}`,
          position: { x: offX, y: offY },
          data: {
            label: (
              <div className="p-1.5 bg-[#FAF9F7] border border-[#E3E3E6] rounded text-[10px] flex items-center gap-1.5 text-gray-700 shadow-xs">
                <User size={11} className="text-[#655A86]" />
                <span className="font-medium truncate max-w-[100px]">{comp.assignedOfficerName}</span>
              </div>
            ),
            raw: { name: comp.assignedOfficerName, role: 'Assigned Officer', caseNumber: comp.caseNumber },
            nodeType: 'officer',
          },
        });

        edges.push({
          id: `edge-off-${comp.caseNumber}`,
          source: `case-${comp.caseNumber}`,
          target: `officer-${comp.caseNumber}`,
          style: { stroke: '#4C6FA5', strokeWidth: 1, strokeDasharray: '3,3' },
        });
      }
    });

    // 4. Overlap & Coordination Edges between Complaints
    allRelationships.forEach((rel) => {
      const sourceExists = nodes.some((n) => n.id === `case-${rel.sourceCaseNumber}`);
      const targetExists = nodes.some((n) => n.id === `case-${rel.targetCaseNumber}`);

      if (sourceExists && targetExists) {
        const isConfirmed = rel.status === 'confirmed';
        edges.push({
          id: `rel-${rel.id}`,
          source: `case-${rel.sourceCaseNumber}`,
          target: `case-${rel.targetCaseNumber}`,
          type: 'straight',
          animated: true,
          style: {
            stroke: isConfirmed ? '#4F8A6B' : '#655A86',
            strokeWidth: 2.5,
            strokeDasharray: isConfirmed ? undefined : '5,5',
          },
          label: isConfirmed ? 'Confirmed Coordination' : `Overlap Match (${rel.matchScore}%)`,
          labelStyle: {
            fill: isConfirmed ? '#4F8A6B' : '#655A86',
            fontSize: 10,
            fontWeight: 700,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isConfirmed ? '#4F8A6B' : '#655A86',
          },
        });
      }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [currentInst, instComplaints, allRelationships, filterType]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Keep graph updated when institution or filters change
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const handleNodeClick = useCallback((_: any, node: Node) => {
    setInspectedNode(node.data);
  }, []);

  return (
    <div className="relative w-full h-[620px] bg-[#F7F7F8] border border-[#E3E3E6] rounded-[4px] overflow-hidden flex flex-col">
      {/* Top Toolbar */}
      <div className="p-3 bg-white border-b border-[#E3E3E6] flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-[#1F1F24] uppercase tracking-wider">
            Focus Institution:
          </label>
          <select
            value={selectedInstId}
            onChange={(e) => setSelectedInstId(e.target.value)}
            className="text-xs bg-[#F2F2F3] border border-[#E3E3E6] rounded-[2px] px-2.5 py-1 text-[#1F1F24] focus:outline-none focus:border-[#C9AE7C] max-w-xs"
          >
            {institutions.slice(0, 15).map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.name} ({inst.linkedCasesCount} cases)
              </option>
            ))}
          </select>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[11px] text-gray-500 uppercase tracking-wide mr-1 font-semibold">
            View:
          </span>
          {[
            { id: 'all', label: 'All Entities' },
            { id: 'overlaps', label: 'Overlaps Only' },
            { id: 'officers', label: 'Include Officers' },
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => setFilterType(chip.id as any)}
              className={`px-2.5 py-1 rounded-[2px] text-xs font-medium transition-colors border ${
                filterType === chip.id
                  ? 'bg-[#1F1F24] text-[#C9AE7C] border-[#1F1F24]'
                  : 'bg-white text-gray-700 border-[#E3E3E6] hover:bg-gray-100'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Flow Canvas */}
      <div className="flex-1 w-full h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          fitView
          attributionPosition="bottom-left"
        >
          <Background color="#D3D3D8" gap={16} size={1} />
          <Controls className="bg-white border border-[#E3E3E6] rounded shadow-sm" />
          <MiniMap
            nodeColor={(n: any) => {
              if (n.data?.nodeType === 'institution') return '#C9AE7C';
              if (n.data?.nodeType === 'complaint') return '#655A86';
              return '#4C6FA5';
            }}
            className="border border-[#E3E3E6] rounded"
          />
        </ReactFlow>

        {/* Edge Legend */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs border border-[#E3E3E6] rounded-[2px] p-2.5 text-[10px] space-y-1.5 shadow-sm z-10 pointer-events-none">
          <div className="font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Edge Legend
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-0.5 bg-[#C9AE7C]" />
            <span>Institution Docket Link</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-0.5 bg-[#655A86] border-b border-dashed border-[#655A86]" />
            <span>Algorithmic Overlap (AI Suggestion)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-0.5 bg-[#4F8A6B]" />
            <span>Confirmed Coordination Edge</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-0.5 bg-[#4C6FA5] border-b border-dotted border-[#4C6FA5]" />
            <span>Assigned Officer Link</span>
          </div>
        </div>

        {/* Node Inspector Side Panel */}
        {inspectedNode && (
          <div className="absolute top-3 right-3 w-80 bg-white border border-[#E3E3E6] rounded-[4px] shadow-lg p-3.5 z-20 space-y-2.5 animate-in fade-in slide-in-from-right-3">
            <div className="flex items-center justify-between border-b border-[#E3E3E6] pb-2">
              <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#1F1F24]">
                Entity Inspector
              </span>
              <button
                type="button"
                onClick={() => setInspectedNode(null)}
                className="text-gray-400 hover:text-black"
              >
                <X size={15} />
              </button>
            </div>

            {inspectedNode.nodeType === 'institution' && (
              <div className="space-y-2 text-xs">
                <div className="font-bold text-sm text-[#1F1F24]">{inspectedNode.raw.name}</div>
                <div>Permanent ID: <span className="font-mono font-medium">{inspectedNode.raw.permanentId}</span></div>
                <div>Address: <span className="text-gray-600">{inspectedNode.raw.address}</span></div>
                <div>Status: <span className="font-medium text-[#8C6D2E]">{inspectedNode.raw.status}</span></div>
                <div>Active Complaints: <span className="font-bold">{inspectedNode.raw.linkedCasesCount}</span></div>
              </div>
            )}

            {inspectedNode.nodeType === 'complaint' && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-[#1F1F24]">
                    {inspectedNode.raw.caseNumber}
                  </span>
                  <BureauBadge bureauCode={inspectedNode.raw.bureauCode} />
                </div>
                <div className="font-medium text-[#1F1F24]">{inspectedNode.raw.title}</div>
                <p className="text-gray-600 text-[11px] line-clamp-3">{inspectedNode.raw.description}</p>
                <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                  <StatusBadge status={inspectedNode.raw.status} size="sm" />
                  <PriorityBadge priority={inspectedNode.raw.priority} />
                </div>
                {onOpenCase && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenCase(inspectedNode.raw.caseNumber);
                      setInspectedNode(null);
                    }}
                    className="w-full mt-2 py-1.5 bg-[#1F1F24] text-[#C9AE7C] text-xs font-semibold uppercase tracking-wider rounded-[2px] flex items-center justify-center gap-1.5 hover:bg-black transition-colors"
                  >
                    <span>Open Case Docket</span>
                    <ExternalLink size={12} />
                  </button>
                )}
              </div>
            )}

            {inspectedNode.nodeType === 'officer' && (
              <div className="space-y-1.5 text-xs">
                <div className="font-bold text-sm text-[#1F1F24]">{inspectedNode.raw.name}</div>
                <div className="text-gray-600">{inspectedNode.raw.role}</div>
                <div className="text-[11px] text-gray-500 font-mono">
                  Handling Case: {inspectedNode.raw.caseNumber}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
