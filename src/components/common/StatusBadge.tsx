import React from 'react';
import { ComplaintStatus, PriorityLevel } from '../../types';

export const StatusBadge: React.FC<{ status: ComplaintStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  const getStyle = () => {
    switch (status) {
      case 'Received':
        return 'bg-[#4C6FA5]/10 text-[#4C6FA5] border-[#4C6FA5]/30';
      case 'Under Review':
        return 'bg-[#655A86]/10 text-[#655A86] border-[#655A86]/30';
      case 'Assigned':
        return 'bg-[#C9953A]/10 text-[#C9953A] border-[#C9953A]/30';
      case 'Investigation':
        return 'bg-[#B39358]/10 text-[#9E7A32] border-[#B39358]/30';
      case 'Coordination Required':
        return 'bg-[#C9AE7C]/20 text-[#8C6D2E] border-[#C9AE7C]/40 font-semibold';
      case 'Resolved':
        return 'bg-[#4F8A6B]/10 text-[#4F8A6B] border-[#4F8A6B]/30';
      case 'Closed':
        return 'bg-[#3A3A40]/10 text-[#3A3A40] border-[#3A3A40]/20';
      case 'Transferred':
        return 'bg-[#655A86]/15 text-[#655A86] border-[#655A86]/30';
      case 'Escalated':
        return 'bg-[#B5524A]/10 text-[#B5524A] border-[#B5524A]/30 font-semibold';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const px = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[2px] border font-medium tracking-wide uppercase ${px} ${getStyle()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: PriorityLevel }> = ({ priority }) => {
  const getStyle = () => {
    switch (priority) {
      case 'Urgent':
        return 'bg-[#B5524A] text-white';
      case 'High':
        return 'bg-[#C9953A] text-white';
      case 'Medium':
        return 'bg-[#C9AE7C] text-[#1F1F24]';
      case 'Low':
        return 'bg-[#E3E3E6] text-[#3A3A40]';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded-[2px] ${getStyle()}`}
    >
      {priority}
    </span>
  );
};

export const BureauBadge: React.FC<{ bureauCode: string }> = ({ bureauCode }) => {
  const getBg = () => {
    switch (bureauCode) {
      case 'PGRC':
        return 'border-[#655A86] text-[#655A86] bg-[#655A86]/5';
      case 'RB':
        return 'border-[#C9953A] text-[#9E7A32] bg-[#C9953A]/5';
      case 'AB':
        return 'border-[#4C6FA5] text-[#4C6FA5] bg-[#4C6FA5]/5';
      case 'ACAD':
        return 'border-[#4F8A6B] text-[#4F8A6B] bg-[#4F8A6B]/5';
      case 'RO':
        return 'border-[#3A3A40] text-[#3A3A40] bg-[#3A3A40]/5';
      default:
        return 'border-gray-400 text-gray-700 bg-gray-50';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-mono font-medium rounded-[2px] border ${getBg()}`}
    >
      {bureauCode}
    </span>
  );
};
