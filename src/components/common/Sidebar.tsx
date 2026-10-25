import React from 'react';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  ShieldAlert,
  Share2,
  Users,
  Building2,
  Clock,
  History,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/db';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  collapsed,
  onToggleCollapse,
}) => {
  const { currentUser } = useAuth();
  const role = currentUser?.role || 'bureau_officer';

  // Calculate live overlap count for badge
  const overlapCount = db.getRelationships().filter((r) => r.status === 'suggested').length;
  // Calculate live overdue count for DelayRadar
  const overdueCount = db.getComplaints().filter((c) => c.isOverdue).length;

  interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
  }

  const getNavItems = (): NavItem[] => {
    if (role === 'complainant') {
      return [
        { label: 'My Dashboard', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
        { label: 'File Complaint', path: '/register-complaint', icon: <PlusCircle size={16} /> },
        { label: 'My Grievances', path: '/complaints', icon: <FileText size={16} /> },
        { label: 'Institution Search', path: '/institutions', icon: <Building2 size={16} /> },
      ];
    }

    if (role === 'regional_officer') {
      return [
        { label: 'Regional Overview', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
        { label: 'Regional Cases', path: '/complaints', icon: <FileText size={16} /> },
        { label: 'Institutions in Region', path: '/institutions', icon: <Building2 size={16} /> },
        { label: 'DelayRadar', path: '/delay-radar', icon: <Clock size={16} />, badge: overdueCount, badgeColor: 'bg-[#B5524A]' },
        { label: 'Overlap Alerts', path: '/overlap-alerts', icon: <ShieldAlert size={16} />, badge: overlapCount, badgeColor: 'bg-[#C9953A]' },
        { label: 'CaseGraph Network', path: '/casegraph', icon: <Share2 size={16} /> },
        { label: 'Coordination Rooms', path: '/coordination-rooms', icon: <Users size={16} /> },
        { label: 'Regional Reports', path: '/reports', icon: <BarChart3 size={16} /> },
      ];
    }

    if (role === 'senior_management') {
      return [
        { label: 'Executive Overview', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
        { label: 'Cross-Bureau Registry', path: '/complaints', icon: <FileText size={16} /> },
        { label: 'Overlap Intelligence', path: '/overlap-alerts', icon: <ShieldAlert size={16} />, badge: overlapCount, badgeColor: 'bg-[#C9953A]' },
        { label: 'CaseGraph Explorer', path: '/casegraph', icon: <Share2 size={16} /> },
        { label: 'Coordination Rooms', path: '/coordination-rooms', icon: <Users size={16} /> },
        { label: 'DelayRadar Monitor', path: '/delay-radar', icon: <Clock size={16} />, badge: overdueCount, badgeColor: 'bg-[#B5524A]' },
        { label: 'Decision Trail (Audit)', path: '/decision-trail', icon: <History size={16} /> },
        { label: 'Analytical Reports', path: '/reports', icon: <BarChart3 size={16} /> },
      ];
    }

    if (role === 'admin') {
      return [
        { label: 'System Overview', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
        { label: 'All Dockets', path: '/complaints', icon: <FileText size={16} /> },
        { label: 'Institution Master', path: '/institutions', icon: <Building2 size={16} /> },
        { label: 'Overlap Alerts', path: '/overlap-alerts', icon: <ShieldAlert size={16} />, badge: overlapCount, badgeColor: 'bg-[#C9953A]' },
        { label: 'Workflow Stages', path: '/admin-settings', icon: <Settings size={16} /> },
        { label: 'Audit Trail Access', path: '/decision-trail', icon: <History size={16} /> },
        { label: 'System Settings', path: '/admin-settings', icon: <Settings size={16} /> },
      ];
    }

    // Default Bureau Officer (PGRC / Regulation Bureau)
    return [
      { label: 'Bureau Overview', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
      { label: 'Complaint Registry', path: '/complaints', icon: <FileText size={16} /> },
      { label: 'Register Complaint', path: '/register-complaint', icon: <PlusCircle size={16} /> },
      { label: 'Overlap Alerts', path: '/overlap-alerts', icon: <ShieldAlert size={16} />, badge: overlapCount, badgeColor: 'bg-[#C9953A]' },
      { label: 'CaseGraph Explorer', path: '/casegraph', icon: <Share2 size={16} /> },
      { label: 'Coordination Rooms', path: '/coordination-rooms', icon: <Users size={16} /> },
      { label: 'Institution Registry', path: '/institutions', icon: <Building2 size={16} /> },
      { label: 'DelayRadar', path: '/delay-radar', icon: <Clock size={16} />, badge: overdueCount, badgeColor: 'bg-[#B5524A]' },
      { label: 'Decision Trail', path: '/decision-trail', icon: <History size={16} /> },
      { label: 'Reports & Analytics', path: '/reports', icon: <BarChart3 size={16} /> },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside
      className={`bg-[#1F1F24] text-white flex flex-col border-r border-[#2D2D35] transition-all duration-200 select-none z-40 ${
        collapsed ? 'w-16' : 'w-64'
      } shrink-0`}
    >
      {/* Brand Header */}
      <div className="h-14 border-b border-[#2D2D35] flex items-center justify-between px-3.5">
        <div
          onClick={() => onNavigate('/dashboard')}
          className="flex items-center gap-2.5 cursor-pointer truncate"
        >
          <div className="w-8 h-8 rounded-[2px] bg-[#C9AE7C] text-[#1F1F24] flex items-center justify-center font-bold shrink-0 shadow-sm">
            <Shield size={18} />
          </div>
          {!collapsed && (
            <div className="truncate">
              <div className="font-serif font-bold text-base tracking-wider text-[#C9AE7C] flex items-center gap-1.5">
                SYNTRA
                <span className="text-[9px] font-sans font-normal px-1 py-0.2 bg-[#2D2D35] text-white rounded">
                  SIH26264
                </span>
              </div>
              <div className="text-[9px] uppercase tracking-wider text-gray-400 truncate">
                AICTE Intelligence
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="p-1 rounded text-gray-400 hover:text-white hover:bg-[#2D2D35] transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Role Tag Banner */}
      {!collapsed && (
        <div className="px-3.5 py-2 bg-[#18181C] border-b border-[#2D2D35] text-[11px] flex items-center justify-between">
          <span className="text-gray-400 uppercase tracking-wider text-[10px] font-semibold">
            Active Role:
          </span>
          <span className="text-[#C9AE7C] font-medium truncate max-w-[140px]">
            {currentUser?.designation || role.replace('_', ' ')}
          </span>
        </div>
      )}

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-[2px] text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#2D2D35] text-[#C9AE7C] border-l-2 border-[#C9AE7C] font-semibold'
                  : 'text-gray-300 hover:text-white hover:bg-[#2A2A30]'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <span className={`shrink-0 ${isActive ? 'text-[#C9AE7C]' : 'text-gray-400'}`}>
                {item.icon}
              </span>
              {!collapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}
              {!collapsed && item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold text-white ${
                    item.badgeColor || 'bg-[#655A86]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Info */}
      <div className="p-3 border-t border-[#2D2D35] bg-[#18181C] text-[10px] text-gray-400">
        {!collapsed ? (
          <div>
            <div className="flex items-center gap-1.5 text-[#C9AE7C] font-semibold">
              <span>SIH 2026 Prototype</span>
            </div>
            <p className="text-[9px] text-gray-500 mt-0.5 leading-snug">
              Synthetic demonstration data. Not connected to real AICTE production systems.
            </p>
          </div>
        ) : (
          <div className="text-center font-bold text-[#C9AE7C]">SIH</div>
        )}
      </div>
    </aside>
  );
};
