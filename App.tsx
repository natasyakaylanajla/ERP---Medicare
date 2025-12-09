import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Finance from './components/Finance';
import Inventory from './components/Inventory';
import Staffing from './components/Staffing';
import Clinical from './components/Clinical';
import { ViewState } from './types';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD: return <Dashboard />;
      case ViewState.FINANCE: return <Finance />;
      case ViewState.INVENTORY: return <Inventory />;
      case ViewState.STAFFING: return <Staffing />;
      case ViewState.CLINICAL: return <Clinical />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar currentView={currentView} setView={setView} />
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-slate-900 text-white z-20 flex items-center justify-between p-4 shadow-md">
         <span className="font-bold text-lg">MediCore ERP</span>
         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-6 h-6" />
         </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full bg-slate-800 z-10 shadow-xl border-t border-slate-700">
           <div className="flex flex-col p-4">
               {Object.keys(ViewState).map((key) => (
                   <button 
                     key={key}
                     className="py-3 text-left text-slate-300 hover:text-white border-b border-slate-700 last:border-0"
                     onClick={() => {
                        setView(ViewState[key as keyof typeof ViewState]);
                        setMobileMenuOpen(false);
                     }}
                   >
                     {key}
                   </button>
               ))}
           </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto md:ml-64 pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;