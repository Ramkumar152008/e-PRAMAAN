import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DisclaimerBanner } from './components/layout/DisclaimerBanner';
import { StepProgressBar } from './components/layout/StepProgressBar';
import { LoginPage } from './components/auth/LoginPage';
import { ProcurementFlowchart } from './components/flowchart/ProcurementFlowchart';
import { getActiveAuthSession, clearAuthSession } from './services/authService';

// 16 Sequential Flow Pages (ONE STEP = ONE SIMPLE PAGE)
import { DashboardView } from './components/views/DashboardView';                     // Page 1: Dashboard
import { ActiveTendersView } from './components/views/ActiveTendersView';               // Page 2: Active Tenders
import { TenderRequirementAnalysisView } from './components/views/TenderRequirementAnalysisView'; // Page 2.5: Tender AI Analysis
import { ComplianceRulesView } from './components/views/ComplianceRulesView';           // Page 2.6: Structured Rules
import { TenderDetailsView } from './components/views/TenderDetailsView';               // Page 3: Tender Details
import { BidsReceivedView } from './components/views/BidsReceivedView';                 // Page 4: Bids Received
import { BidOverviewView } from './components/views/BidOverviewView';                   // Page 5: Bid Overview
import { DocumentReviewView } from './components/views/DocumentReviewView';             // Page 6: Document Review
import { EvidencePassportView } from './components/views/EvidencePassportView';         // Page 6.5: Bidder Evidence Passport
import { AiVerificationView } from './components/views/AiVerificationView';             // Page 7: AI Verification
import { GovernmentVerificationView } from './components/views/GovernmentVerificationView'; // Page 7.2: Government Verification
import { BidComplianceMatrixView } from './components/views/BidComplianceMatrixView';   // Page 7.5: Bid Compliance Matrix
import { TemporalComplianceView } from './components/views/TemporalComplianceView';     // Page 7.3: Temporal Compliance
import { TruthGraphView } from './components/views/TruthGraphView';                     // Page 7.4: Evidence Graph
import { RiskIntelligenceView } from './components/views/RiskIntelligenceView';         // Page 7.6: Risk Intelligence Radar
import { InvestigationPriorityView } from './components/views/InvestigationPriorityView'; // Page 8: Ranked Investigation Queue
import { FindingsListView } from './components/views/FindingsListView';                 // Page 8.5: Verification Findings
import { FindingDetailsView } from './components/views/FindingDetailsView';             // Page 9: Finding Details
import { EvidenceReviewView } from './components/views/EvidenceReviewView';             // Page 10: Evidence Review
import { EvidenceExplorerView } from './components/views/EvidenceExplorerView';         // Page 10.5: Evidence Explorer (9-Step XAI)
import { InvestigationView } from './components/views/InvestigationView';               // Page 11: Investigation Required
import { ClarificationCentreView } from './components/views/ClarificationCentreView'; // Page 11.5: Clarification Centre
import { DecisionView } from './components/views/DecisionView';                         // Page 12 & 13: Decision & Confirmation
import { ReportView } from './components/views/ReportView';                             // Page 14: Verification Report
import { AuditTrailView } from './components/views/AuditTrailView';                     // Page 15: Audit Trail
import { CompletedView } from './components/views/CompletedView';                       // Page 16: Verification Completed

// Secondary & Administrative Views
import { AdminConsoleView } from './components/views/AdminConsoleView';
import { VendorPortalView } from './components/views/VendorPortalView';
import { BidVerificationView } from './components/views/BidVerificationView';
import { EvidenceAnalysisView } from './components/views/EvidenceAnalysisView';
import { DecisionReviewView } from './components/views/DecisionReviewView';
import { ReportExportView } from './components/views/ReportExportView';

// ─── MAIN PROTECTED LAYOUT ───────────────────────────────────────────────────
interface MainLayoutProps {
  onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ onLogout }) => {
  const { activeView, role } = useApp();
  const [showFlowchart, setShowFlowchart] = useState(false);

  const renderActiveView = () => {
    // ── STRICT ROLE-BASED ACCESS CONTROL ─────────────────────────────
    if (role === 'VENDOR') {
      // Vendor can strictly only access the Vendor Compliance & Clarification workspace
      return <VendorPortalView />;
    }

    if (role === 'ADMIN') {
      // Admin can strictly access the Admin Console
      return <AdminConsoleView />;
    }

    // Officer Access Rules: Officer cannot enter the Vendor Portal
    if (activeView === 'vendor-portal') {
      return <DashboardView />;
    }

    switch (activeView) {
      // 5 Core Officer Navigation Sections + Deep Links
      case 'dashboard':                   return <DashboardView />;
      case 'active-tenders':        
      case 'tenders':                     return <ActiveTendersView />;
      case 'tender-details':              return <TenderDetailsView />;
      case 'bids-received':               return <BidsReceivedView />;
      case 'bid-verification':            return <BidVerificationView />;
      case 'clarifications':
      case 'clarification-center':        return <ClarificationCentreView />;
      case 'decisions-reports':
      case 'decision-review':
      case 'decision':                    return <DecisionReviewView />;
      case 'report':                      
      case 'reports':
      case 'report-export':               return <ReportView />;
      case 'audit-trail':                 return <AuditTrailView />;
      case 'completed':                   return <CompletedView />;

      // Progressive disclosure & specialized sub-views
      case 'tender-requirement-analysis':
      case 'create-evaluation':           return <TenderRequirementAnalysisView />;
      case 'compliance-rules':            
      case 'tender-register':             return <ComplianceRulesView />;
      case 'bid-overview':                return <BidOverviewView />;
      case 'document-review':             return <DocumentReviewView />;
      case 'evidence-passport':           return <EvidencePassportView />;
      case 'ai-verification':             return <AiVerificationView />;
      case 'government-verification':
      case 'cross-verification':          return <GovernmentVerificationView />;
      case 'temporal-compliance':         return <TemporalComplianceView />;
      case 'truth-graph':                 return <TruthGraphView />;
      case 'compliance-matrix':           return <BidComplianceMatrixView />;
      case 'risk-intelligence':           return <RiskIntelligenceView />;
      case 'investigation-priority':
      case 'investigation-queue':         return <InvestigationPriorityView />;
      case 'findings-list':               return <FindingsListView />;
      case 'finding-details':             return <FindingDetailsView />;
      case 'evidence-review':             return <EvidenceReviewView />;
      case 'evidence-explorer':           return <EvidenceExplorerView />;
      case 'investigation':               return <InvestigationView />;
      case 'evidence-analysis':           return <EvidenceReviewView />;
      case 'admin-console':               return <AdminConsoleView />;
      default:                            return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-blue-100 selection:text-blue-900 font-sans antialiased">
      {/* 1. Official Government Header */}
      <Header onLogout={onLogout} />

      {/* 2. Statutory Governance Notice Banner */}
      <DisclaimerBanner />

      {/* 3. Simple Step Progress Indicator & Small Context Bar (Officer Only) */}
      {role === 'OFFICER' && <StepProgressBar />}

      {/* 4. Main Body: Clean Sidebar + Single Active Step Page */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto bg-slate-100/90 pb-16">
          {renderActiveView()}
        </main>
      </div>

      {/* Optional Procurement Workflow Modal */}
      {showFlowchart && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <ProcurementFlowchart onClose={() => setShowFlowchart(false)} />
        </div>
      )}
    </div>
  );
};

// ─── AUTH CONTENT SWITCHER ───────────────────────────────────────────────────
function AuthContent() {
  const { syncAuthSession } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!getActiveAuthSession();
  });

  const handleLogin = () => {
    syncAuthSession();
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    clearAuthSession();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <MainLayout onLogout={handleLogout} />;
}

// ─── ROOT APP ────────────────────────────────────────────────────────────────
export function App() {
  return (
    <AppProvider>
      <AuthContent />
    </AppProvider>
  );
}

export default App;
