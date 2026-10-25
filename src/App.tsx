import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TopBar } from './components/common/TopBar';
import { Sidebar } from './components/common/Sidebar';
import { SyraDrawer } from './components/syra/SyraDrawer';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { OverviewPage } from './pages/OverviewPage';
import { ComplaintsRegistryPage } from './pages/ComplaintsRegistryPage';
import { ComplaintRegistrationPage } from './pages/ComplaintRegistrationPage';
import { CaseDetailPage } from './pages/CaseDetailPage';
import { InstitutionDirectoryPage } from './pages/InstitutionDirectoryPage';
import { OverlapAlertsPage } from './pages/OverlapAlertsPage';
import { CaseGraphView } from './components/casegraph/CaseGraphView';
import { CoordinationRoomsPage } from './pages/CoordinationRoomsPage';
import { DelayRadarPage } from './pages/DelayRadarPage';
import { DecisionTrailPage } from './pages/DecisionTrailPage';
import { ReportsPage } from './pages/ReportsPage';
import { SystemAdminPage } from './pages/SystemAdminPage';

function AppContent() {
  const { currentUser } = useAuth();

  // Navigation route state
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [routeState, setRouteState] = useState<any>(null);

  // Layout UI states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [syraOpen, setSyraOpen] = useState(false);

  // Active Case Detail Inspector Modal
  const [inspectedCaseNumber, setInspectedCaseNumber] = useState<string | null>(null);

  // Active Institution for CaseGraph
  const [graphInstitutionId, setGraphInstitutionId] = useState<string>('inst-1');

  // Active Coordination Room
  const [activeRoomId, setActiveRoomId] = useState<string>('');

  const navigate = (path: string, state?: any) => {
    setCurrentPath(path);
    setRouteState(state || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCase = (caseNumber: string) => {
    setInspectedCaseNumber(caseNumber);
  };

  const handleOpenCoordinationRoom = (roomId: string) => {
    setActiveRoomId(roomId);
    navigate('/coordination-rooms');
  };

  const handleOpenCaseGraph = (instId?: string) => {
    if (instId) setGraphInstitutionId(instId);
    navigate('/casegraph');
  };

  // Breadcrumbs builder
  const getBreadcrumbs = () => {
    switch (currentPath) {
      case '/dashboard':
        return [{ label: 'Executive Dashboard' }];
      case '/complaints':
        return [{ label: 'Complaints', href: '/complaints' }, { label: 'Docket Registry' }];
      case '/register-complaint':
        return [{ label: 'Complaints', href: '/complaints' }, { label: 'Register New Docket' }];
      case '/institutions':
        return [{ label: 'Institution Registry' }];
      case '/overlap-alerts':
        return [{ label: 'Intelligence', href: '/dashboard' }, { label: 'Overlap Alerts' }];
      case '/casegraph':
        return [{ label: 'Intelligence', href: '/dashboard' }, { label: 'CaseGraph Network' }];
      case '/coordination-rooms':
        return [{ label: 'Coordination Rooms' }];
      case '/delay-radar':
        return [{ label: 'DelayRadar Monitor' }];
      case '/decision-trail':
        return [{ label: 'Governance', href: '/dashboard' }, { label: 'Decision Trail (Audit)' }];
      case '/reports':
        return [{ label: 'Reports & Analytics' }];
      case '/admin-settings':
        return [{ label: 'Administration', href: '/dashboard' }, { label: 'System Settings' }];
      default:
        return [{ label: 'Workspace' }];
    }
  };

  // 1. Landing Page
  if (currentPath === '/') {
    return (
      <LandingPage
        onNavigateLogin={() => navigate('/login')}
        onExploreFeatures={() => navigate('/login')}
      />
    );
  }

  // 2. Login Page
  if (currentPath === '/login') {
    return (
      <LoginPage
        onSuccessLogin={() => navigate('/dashboard')}
        onBackToHome={() => navigate('/')}
      />
    );
  }

  // 3. Authenticated Windowed Workspace Shell
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F2F2F3] text-[#3A3A40]">
      {/* Left Sidebar */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={navigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Bar */}
        <TopBar
          onToggleSyra={() => setSyraOpen(!syraOpen)}
          breadcrumbs={getBreadcrumbs()}
          onNavigate={navigate}
        />

        {/* Scrollable Work Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#F2F2F3]">
          {/* Active Page View */}
          {currentPath === '/dashboard' && (
            <OverviewPage
              onNavigate={navigate}
              onOpenCase={handleOpenCase}
              onOpenCoordinationRoom={handleOpenCoordinationRoom}
            />
          )}

          {currentPath === '/complaints' && (
            <ComplaintsRegistryPage
              onOpenCase={handleOpenCase}
              initialFilters={routeState?.filters}
            />
          )}

          {currentPath === '/register-complaint' && (
            <ComplaintRegistrationPage
              onSuccessRegistered={(caseNum) => handleOpenCase(caseNum)}
              prefillData={routeState?.prefill}
              onOpenCase={handleOpenCase}
              onOpenCoordinationRoom={handleOpenCoordinationRoom}
            />
          )}

          {currentPath === '/institutions' && (
            <InstitutionDirectoryPage
              onOpenCase={handleOpenCase}
              onOpenCaseGraph={handleOpenCaseGraph}
              selectedInstIdFromOutside={routeState?.institutionId}
            />
          )}

          {currentPath === '/overlap-alerts' && (
            <OverlapAlertsPage
              onOpenCase={handleOpenCase}
              onOpenCoordinationRoom={handleOpenCoordinationRoom}
              onOpenCaseGraph={handleOpenCaseGraph}
            />
          )}

          {currentPath === '/casegraph' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E3E3E6]">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-[#1F1F24]">
                    Interactive CaseGraph Visualizer
                  </h1>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Relational graph mapping institutions, dockets, bureaus, officers, and confirmed coordination edges.
                  </p>
                </div>
              </div>
              <CaseGraphView
                initialInstitutionId={graphInstitutionId}
                onOpenCase={handleOpenCase}
              />
            </div>
          )}

          {currentPath === '/coordination-rooms' && (
            <CoordinationRoomsPage
              onOpenCase={handleOpenCase}
              selectedRoomId={activeRoomId}
            />
          )}

          {currentPath === '/delay-radar' && (
            <DelayRadarPage onOpenCase={handleOpenCase} />
          )}

          {currentPath === '/decision-trail' && (
            <DecisionTrailPage onOpenCase={handleOpenCase} />
          )}

          {currentPath === '/reports' && (
            <ReportsPage initialReportType={routeState?.reportType} />
          )}

          {currentPath === '/admin-settings' && (
            <SystemAdminPage />
          )}
        </main>
      </div>

      {/* Case Detail Modal / Inspector Drawer */}
      {inspectedCaseNumber && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#F2F2F3] rounded-[4px] border border-[#E3E3E6] max-w-4xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 shadow-2xl relative">
            <CaseDetailPage
              caseNumber={inspectedCaseNumber}
              onClose={() => setInspectedCaseNumber(null)}
              onOpenRelatedCase={(cNum) => setInspectedCaseNumber(cNum)}
              onOpenCoordinationRoom={(rId) => {
                setInspectedCaseNumber(null);
                handleOpenCoordinationRoom(rId);
              }}
              onOpenCaseGraph={() => {
                setInspectedCaseNumber(null);
                navigate('/casegraph');
              }}
            />
          </div>
        </div>
      )}

      {/* SYRA Agentic AI Assistant Drawer */}
      <SyraDrawer
        isOpen={syraOpen}
        onClose={() => setSyraOpen(false)}
        onNavigate={navigate}
        onOpenCase={handleOpenCase}
        onOpenInstitution={(instId) => {
          navigate('/institutions', { institutionId: instId });
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
