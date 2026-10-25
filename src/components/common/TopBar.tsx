import React, { useState, useEffect } from 'react';
import { Search, Bell, Sparkles, User as UserIcon, LogOut, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/db';
import { AppNotification, UserRole } from '../../types';

interface TopBarProps {
  onToggleSyra: () => void;
  breadcrumbs: { label: string; href?: string }[];
  onNavigate: (path: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSyra, breadcrumbs, onNavigate }) => {
  const { currentUser, logout, loginAsDemoUser } = useAuth();
  const [istTime, setIstTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    // Live IST clock
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setIstTime(new Intl.DateTimeFormat('en-IN', options).format(now) + ' IST');
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setNotifications(db.getNotifications());
    const unsub = db.subscribe((state) => {
      setNotifications(state.notifications);
    });
    return unsub;
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.trim();
    if (q.toUpperCase().startsWith('SYN-')) {
      onNavigate(`/complaints?search=${encodeURIComponent(q)}`);
    } else {
      onNavigate(`/complaints?search=${encodeURIComponent(q)}`);
    }
  };

  const handleRoleSwitch = (role: UserRole) => {
    loginAsDemoUser(role);
    setShowUserMenu(false);
    onNavigate('/dashboard');
  };

  return (
    <header className="h-14 bg-white border-b border-[#E3E3E6] flex items-center justify-between px-4 sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-[#3A3A40]/70 truncate mr-3">
        <span className="font-semibold text-[#1F1F24] uppercase tracking-wider text-[11px]">
          SYNTRA
        </span>
        <span className="text-[#E3E3E6]">/</span>
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="text-[#E3E3E6]">/</span>}
            {crumb.href ? (
              <button
                type="button"
                onClick={() => onNavigate(crumb.href!)}
                className="hover:text-[#1F1F24] hover:underline truncate"
              >
                {crumb.label}
              </button>
            ) : (
              <span className="text-[#1F1F24] font-medium truncate">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Middle: Global Search */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center max-w-md w-full mx-4">
        <div className="relative w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3A3A40]/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search institution, AICTE ID (1-XXXX), Case SYN-..., officer..."
            className="w-full bg-[#F2F2F3] border border-[#E3E3E6] rounded-[2px] pl-8 pr-3 py-1.5 text-xs text-[#1F1F24] placeholder:text-[#3A3A40]/50 focus:outline-none focus:border-[#C9AE7C] focus:bg-white transition-all"
          />
        </div>
      </form>

      {/* Right: Live Clock, SYRA Button, Notifications, User */}
      <div className="flex items-center gap-3">
        {/* Live IST Clock */}
        <div className="hidden lg:flex flex-col text-right pr-2 border-r border-[#E3E3E6]">
          <span className="text-[10px] uppercase tracking-wider text-[#3A3A40]/60 font-semibold">
            Official Clock
          </span>
          <span className="text-xs font-mono font-medium text-[#1F1F24]">{istTime}</span>
        </div>

        {/* SYRA AI Assistant Launch Button */}
        <button
          type="button"
          onClick={onToggleSyra}
          className="bg-[#1F1F24] text-[#C9AE7C] hover:bg-black border border-[#C9AE7C]/40 px-3 py-1.5 rounded-[2px] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm group"
        >
          <Sparkles size={13} className="text-[#C9AE7C] group-hover:rotate-12 transition-transform" />
          <span>SYRA AI</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="p-2 text-[#3A3A40] hover:text-[#1F1F24] hover:bg-[#F2F2F3] rounded-[2px] relative transition-colors"
            title="Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#B5524A] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white border border-[#E3E3E6] rounded-[4px] shadow-lg z-50">
              <div className="flex items-center justify-between px-3 py-2.5 bg-[#FAF9F7] border-b border-[#E3E3E6]">
                <span className="font-serif font-bold text-xs text-[#1F1F24] uppercase tracking-wider">
                  Notifications ({unreadCount} Unread)
                </span>
                <button
                  type="button"
                  onClick={() => db.markAllNotificationsAsRead()}
                  className="text-[11px] text-[#655A86] hover:underline"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-[#E3E3E6]">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-[#3A3A40]/70">No notifications</div>
                ) : (
                  notifications.slice(0, 10).map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 text-xs hover:bg-[#F8F8F9] transition-colors cursor-pointer ${
                        !n.read ? 'bg-[#FAF6EE]/50 font-medium' : ''
                      }`}
                      onClick={() => {
                        db.markNotificationAsRead(n.id);
                        if (n.caseNumber) {
                          onNavigate(`/complaints?search=${n.caseNumber}`);
                        }
                        setShowNotifications(false);
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-[#1F1F24]">{n.title}</span>
                        {!n.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B5524A] shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#3A3A40]/80 mt-1">{n.message}</p>
                      <div className="text-[10px] text-[#3A3A40]/50 mt-1 font-mono">
                        {new Date(n.timestamp).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Role Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-[2px] hover:bg-[#F2F2F3] text-left transition-colors border border-transparent hover:border-[#E3E3E6]"
          >
            <div className="w-7 h-7 rounded-[2px] bg-[#655A86] text-white flex items-center justify-center font-bold text-xs">
              {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
            </div>
            <div className="hidden sm:block text-left pr-1 leading-tight">
              <div className="text-xs font-semibold text-[#1F1F24] truncate max-w-[110px]">
                {currentUser?.name || 'Authorized User'}
              </div>
              <div className="text-[10px] text-[#3A3A40]/70 uppercase tracking-wide">
                {currentUser?.role?.replace('_', ' ')}
              </div>
            </div>
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-[#E3E3E6] rounded-[4px] shadow-lg z-50 p-2">
              <div className="p-2 border-b border-[#E3E3E6]">
                <div className="font-serif font-semibold text-sm text-[#1F1F24]">
                  {currentUser?.name}
                </div>
                <div className="text-xs text-[#3A3A40]/80">{currentUser?.email}</div>
                <div className="text-[11px] text-[#655A86] font-medium mt-0.5">
                  {currentUser?.designation}
                </div>
              </div>

              {/* Fast Role Switch for SIH Evaluator */}
              <div className="p-2">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-[#3A3A40]/60 mb-1.5">
                  Switch Active Role (Demo Mode)
                </div>
                <div className="space-y-1">
                  {(
                    [
                      { role: 'bureau_officer', label: 'Bureau Officer (PGRC - Anita Sharma)' },
                      { role: 'senior_management', label: 'Senior Management (Dr. R. K. Mehta)' },
                      { role: 'regional_officer', label: 'Regional Officer (Sunita Kulkarni)' },
                      { role: 'complainant', label: 'Complainant (Rahul Verma)' },
                      { role: 'admin', label: 'System Administrator (Admin User)' },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => handleRoleSwitch(item.role)}
                      className={`w-full text-left px-2 py-1.5 rounded-[2px] text-xs flex items-center justify-between transition-colors ${
                        currentUser?.role === item.role
                          ? 'bg-[#FAF6EE] text-[#8C6D2E] font-semibold border border-[#C9AE7C]/50'
                          : 'hover:bg-[#F2F2F3] text-[#3A3A40]'
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                      {currentUser?.role === item.role && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-1 border-t border-[#E3E3E6]">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onNavigate('/login');
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-[2px] text-xs text-[#B5524A] hover:bg-red-50 flex items-center gap-2 transition-colors font-medium"
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
