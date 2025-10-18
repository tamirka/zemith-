import React from 'react';
import { View } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
  viewName: View;
  currentView: View;
  onClick: (view: View) => void;
  children: React.ReactNode;
}> = ({ viewName, currentView, onClick, children }) => {
  const isActive = currentView === viewName;
  return (
    <li
      onClick={() => onClick(viewName)}
      className={`
        flex items-center space-x-3 p-3 rounded-lg cursor-pointer
        transition-all duration-200 ease-in-out
        ${isActive
          ? 'bg-secondary text-white shadow-lg'
          : 'text-neutral-200 hover:bg-primary hover:text-white'
        }
      `}
    >
      {children}
      <span className="font-medium">{viewName}</span>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen, setIsOpen }) => {
  const navItems: View[] = ['Dashboard', 'Transactions', 'Invoices', 'Bills', 'Reports'];

  const sidebarClasses = `
    bg-neutral-900 text-white flex flex-col p-4
    transform transition-transform duration-300 ease-in-out
    md:translate-x-0 md:static md:w-64
    fixed inset-y-0 left-0 z-40 w-64
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-30 md:hidden" onClick={() => setIsOpen(false)}></div>}
      <div className={sidebarClasses}>
        <div className="flex items-center justify-between p-3 mb-8">
          <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <h1 className="text-2xl font-bold">Zenith Books</h1>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-neutral-300 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <nav>
          <ul className="space-y-2">
            {navItems.map(view => (
              <NavItem key={view} viewName={view} currentView={currentView} onClick={setCurrentView}>
                {ICONS[view]}
              </NavItem>
            ))}
          </ul>
        </nav>
        <div className="mt-auto p-3 bg-neutral-800 rounded-lg">
            <p className="text-sm text-neutral-300">© 2024 Zenith Books</p>
            <p className="text-xs text-neutral-400">All rights reserved.</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
