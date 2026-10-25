import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Users,
  Building2,
  Sliders,
  RotateCcw,
  CheckCircle2,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import { db, WORKFLOW_STAGES } from '../services/db';
import { AppSettings, WorkflowStage } from '../types';
import { WindowPanel } from '../components/common/WindowPanel';

export const SystemAdminPage: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(db.getSettings());
  const [stages, setStages] = useState<WorkflowStage[]>(db.getWorkflowStages());
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateSettings(settings);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const handleResetDB = () => {
    if (window.confirm('Reset all repository records to default SIH 2026 seed state?')) {
      db.resetDatabase();
      setSettings(db.getSettings());
      setStages(db.getWorkflowStages());
      alert('Database successfully restored to clean demonstration seed state.');
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E3E3E6]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1F1F24]">
              System Administration & Governance
            </h1>
            <span className="px-2 py-0.5 bg-[#1F1F24] text-[#C9AE7C] text-xs font-mono font-bold rounded">
              e-Governance Cell
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure global regulatory parameters, workflow stages, and repository persistence.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDB}
          className="px-3 py-1.5 bg-red-50 border border-red-300 text-red-700 hover:bg-red-100 text-xs font-semibold rounded flex items-center gap-1.5 uppercase tracking-wider"
        >
          <RotateCcw size={13} />
          <span>Reset Demo Database</span>
        </button>
      </div>

      {savedMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded flex items-center gap-2">
          <CheckCircle2 size={15} />
          <span>Configuration changes successfully applied to SYNTRA system core.</span>
        </div>
      )}

      {/* Thresholds Form */}
      <form onSubmit={handleSaveSettings}>
        <WindowPanel
          title="DelayRadar & Operational Thresholds"
          subtitle="Configure rule-based warning parameters for case inactivity"
          icon={<Sliders size={15} />}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#1F1F24] mb-1">
                  Delay Inactivity Threshold (Days)
                </label>
                <input
                  type="number"
                  min={3}
                  max={60}
                  value={settings.delayThresholdDays}
                  onChange={(e) =>
                    setSettings({ ...settings, delayThresholdDays: parseInt(e.target.value) || 14 })
                  }
                  className="w-full bg-[#FAF9F7] border border-[#E3E3E6] rounded p-2 text-xs font-mono"
                />
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Flags cases on DelayRadar if no official action is logged within this window.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-[#1F1F24] mb-1">
                  Warning Notice Window (Days Before Deadline)
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={settings.warningThresholdDays}
                  onChange={(e) =>
                    setSettings({ ...settings, warningThresholdDays: parseInt(e.target.value) || 7 })
                  }
                  className="w-full bg-[#FAF9F7] border border-[#E3E3E6] rounded p-2 text-xs font-mono"
                />
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Dispatches approaching deadline warnings to assigned bureau officers.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E3E3E6] space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoCheckOverlap}
                  onChange={(e) =>
                    setSettings({ ...settings, autoCheckOverlap: e.target.checked })
                  }
                  className="rounded text-[#C9AE7C] focus:ring-0"
                />
                <span className="font-semibold text-gray-800">
                  Enable automated real-time overlap check upon complaint registration
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.strictRoleAccess}
                  onChange={(e) =>
                    setSettings({ ...settings, strictRoleAccess: e.target.checked })
                  }
                  className="rounded text-[#C9AE7C] focus:ring-0"
                />
                <span className="font-semibold text-gray-800">
                  Enforce data-layer access governance (conceal confidential notes from complainants)
                </span>
              </label>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E3E3E6]">
              <button
                type="submit"
                className="px-4 py-2 bg-[#C9AE7C] hover:bg-[#B39358] text-[#1F1F24] font-bold text-xs uppercase tracking-wider rounded"
              >
                Save Settings
              </button>
            </div>
          </div>
        </WindowPanel>
      </form>

      {/* Workflow Stages Matrix */}
      <WindowPanel
        title="AICTE Regulatory Workflow Stages"
        subtitle="Ordered docket lifecycle stages and transition permissions"
        icon={<Layers size={15} />}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF9F7] text-[10px] uppercase font-bold text-gray-600 border-b border-[#E3E3E6]">
              <tr>
                <th className="py-2 px-3">Order</th>
                <th className="py-2 px-3">Stage Key</th>
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-3">Allowed Transitions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E3E6]">
              {stages.map((st) => (
                <tr key={st.id} className="hover:bg-[#FAF9F7]">
                  <td className="py-2 px-3 font-mono font-bold text-gray-500">{st.order}</td>
                  <td className="py-2 px-3 font-semibold text-[#1F1F24]">{st.label}</td>
                  <td className="py-2 px-3 text-gray-600">{st.description}</td>
                  <td className="py-2 px-3 font-mono text-[11px] text-[#655A86]">
                    {st.allowedTransitions.join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WindowPanel>
    </div>
  );
};
