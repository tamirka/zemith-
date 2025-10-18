import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Invoices from './components/Invoices';
import Bills from './components/Bills';
import Reports from './components/Reports';
import { BookkeepingProvider } from './hooks/useBookkeeping';
import { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Transactions':
        return <Transactions />;
      case 'Invoices':
        return <Invoices />;
      case 'Bills':
        return <Bills />;
      case 'Reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  const handleSetView = (view: View) => {
    setCurrentView(view);
    setIsSidebarOpen(false); // Close sidebar on navigation
  }

  return (
    <BookkeepingProvider>
      <div className="flex h-screen bg-neutral-100 font-sans">
        <Sidebar 
          currentView={currentView} 
          setCurrentView={handleSetView} 
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-100 p-4 md:p-8">
            {renderView()}
          </main>
        </div>
      </div>
    </BookkeepingProvider>
  );
};

export default App;
