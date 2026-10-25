import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Maximize2, Minimize2 } from 'lucide-react';

interface WindowPanelProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  defaultCollapsed?: boolean;
  collapsible?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

export const WindowPanel: React.FC<WindowPanelProps> = ({
  title,
  subtitle,
  icon,
  badge,
  actions,
  children,
  defaultCollapsed = false,
  collapsible = true,
  className = '',
  headerClassName = '',
  bodyClassName = '',
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div
      className={`bg-white border border-[#E3E3E6] rounded-[4px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-200 ${
        isFullscreen ? 'fixed inset-4 z-50 overflow-auto flex flex-col' : ''
      } ${className}`}
    >
      {/* Institutional Window Title Bar */}
      <div
        className={`flex items-center justify-between px-4 py-2.5 bg-[#FAF9F7] border-b border-[#E3E3E6] select-none ${headerClassName}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && <span className="text-[#655A86] shrink-0">{icon}</span>}
          <div className="truncate">
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-semibold text-sm text-[#1F1F24] tracking-wide truncate">
                {title}
              </h3>
              {badge}
            </div>
            {subtitle && (
              <p className="text-[11px] text-[#3A3A40]/70 truncate">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-3">
          {actions}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Restore' : 'Maximize window'}
            className="p-1 text-[#3A3A40]/60 hover:text-[#1F1F24] hover:bg-[#EBEBEF] rounded-[2px] transition-colors"
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
          {collapsible && (
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? 'Expand' : 'Collapse'}
              className="p-1 text-[#3A3A40]/60 hover:text-[#1F1F24] hover:bg-[#EBEBEF] rounded-[2px] transition-colors"
            >
              {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* Window Body */}
      {!collapsed && (
        <div className={`p-4 ${isFullscreen ? 'flex-1 overflow-auto' : ''} ${bodyClassName}`}>
          {children}
        </div>
      )}
    </div>
  );
};
