import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { DEMO_USERS } from '../services/db';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, role?: UserRole) => boolean;
  loginAsDemoUser: (role: UserRole) => void;
  logout: () => void;
  hasPermission: (permission: AppPermission) => boolean;
  canAccessCase: (complaint: { complainantEmail?: string; bureauCode?: string; region?: string }) => boolean;
}

export type AppPermission =
  | 'view_all_complaints'
  | 'view_own_complaints'
  | 'register_complaint'
  | 'update_case_status'
  | 'view_internal_notes'
  | 'manage_coordination_rooms'
  | 'view_casegraph'
  | 'view_overlap_alerts'
  | 'view_executive_analytics'
  | 'view_regional_cases'
  | 'view_audit_trail'
  | 'manage_system_settings'
  | 'manage_workflow_stages';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'syntra_current_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load saved user session:', e);
    }
    // Default to Bureau Officer (PGRC - Anita Sharma) for seamless SIH demo flow
    return DEMO_USERS[1];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  const login = (email: string, role?: UserRole): boolean => {
    const found = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() || (role && u.role === role)
    );
    if (found) {
      setCurrentUser(found);
      return true;
    }
    // Create guest profile if email not in demo list
    const guest: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: role || 'complainant',
      designation: role === 'complainant' ? 'Citizen' : 'Officer',
    };
    setCurrentUser(guest);
    return true;
  };

  const loginAsDemoUser = (role: UserRole) => {
    const demo = DEMO_USERS.find((u) => u.role === role);
    if (demo) {
      setCurrentUser(demo);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const hasPermission = (permission: AppPermission): boolean => {
    if (!currentUser) return false;
    const { role } = currentUser;

    switch (permission) {
      case 'view_all_complaints':
        return ['bureau_officer', 'regional_officer', 'senior_management'].includes(role);
      case 'view_own_complaints':
        return true;
      case 'register_complaint':
        return ['complainant', 'bureau_officer', 'regional_officer', 'admin'].includes(role);
      case 'update_case_status':
        return ['bureau_officer', 'senior_management', 'admin'].includes(role);
      case 'view_internal_notes':
        return ['bureau_officer', 'regional_officer', 'senior_management'].includes(role);
      case 'manage_coordination_rooms':
        return ['bureau_officer', 'regional_officer', 'senior_management'].includes(role);
      case 'view_casegraph':
        return ['bureau_officer', 'regional_officer', 'senior_management'].includes(role);
      case 'view_overlap_alerts':
        return ['bureau_officer', 'regional_officer', 'senior_management'].includes(role);
      case 'view_executive_analytics':
        return ['senior_management', 'admin', 'bureau_officer', 'regional_officer'].includes(role);
      case 'view_regional_cases':
        return ['regional_officer', 'senior_management', 'bureau_officer'].includes(role);
      case 'view_audit_trail':
        return ['senior_management', 'admin', 'bureau_officer'].includes(role);
      case 'manage_system_settings':
      case 'manage_workflow_stages':
        return role === 'admin';
      default:
        return false;
    }
  };

  const canAccessCase = (complaint: { complainantEmail?: string; bureauCode?: string; region?: string }): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'senior_management') return true;

    if (currentUser.role === 'complainant') {
      // Complainant can only view cases they registered
      return complaint.complainantEmail?.toLowerCase() === currentUser.email.toLowerCase();
    }

    if (currentUser.role === 'regional_officer') {
      // Regional officer sees cases in their region or assigned to RO
      if (currentUser.region && complaint.region) {
        return complaint.region.toLowerCase().includes(currentUser.region.toLowerCase());
      }
      return true;
    }

    if (currentUser.role === 'bureau_officer') {
      // Bureau officer sees all or bureau cases
      return true;
    }

    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        loginAsDemoUser,
        logout,
        hasPermission,
        canAccessCase,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
