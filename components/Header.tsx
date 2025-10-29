import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../types';

const LogoIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.95 5.5h3.9c.8 0 1.45.65 1.45 1.45v0c0 .8-.65 1.45-1.45 1.45h-3.9V5.5zm5.35 11H8.6c-.8 0-1.45-.65-1.45-1.45v0c0-.8.65-1.45 1.45-1.45h7.8v2.9zm0-4.35h-7.8c-.8 0-1.45-.65-1.45-1.45v0c0-.8.65-1.45 1.45-1.45h7.8v2.9z" fill="#4CAF50"/>
    <path d="M12 12.5a2.5 2.5 0 00-2.5 2.5c0 1.05.65 1.93 1.55 2.3l-.5 1.7h3l-.5-1.7c.9-.37 1.55-1.25 1.55-2.3a2.5 2.5 0 00-2.5-2.5z" fill="#4CAF50" opacity="0.6"/>
  </svg>
);

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const LogoutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
);


interface HeaderProps {
    onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const { user, login, logout } = useAuth();

  const handleRoleLogin = (role: User['role']) => {
      let mockUser: User;
      if (role === 'agent') {
          mockUser = { id: 'USR-AG-102', name: 'Moussa Diop', email: 'moussa.diop@agent.com', role: 'agent', agentId: 'AG-102', zone: 'Médina', avatarUrl: 'https://i.pravatar.cc/48?u=moussa' };
      } else if (role === 'manager') {
          mockUser = { id: 'USR-MAN-001', name: 'Aïssatou Ba', email: 'aissatou.ba@manager.com', role: 'manager', avatarUrl: 'https://i.pravatar.cc/48?u=aissatou' };
      } else {
          mockUser = { id: 'CIT-001', name: 'Amadou Sow', email: 'amadou.sow@example.com', role: 'citizen', ecoPoints: 1250, rank: 42, avatarUrl: 'https://i.pravatar.cc/48?u=amadou', zone: 'Médina' };
      }
      login(mockUser);
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <LogoIcon />
            <span className="text-2xl font-bold text-gray-800">groupe1</span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
                <>
                    <img src={user.avatarUrl || `https://i.pravatar.cc/48?u=${user.email}`} alt={user.name} className="h-10 w-10 rounded-full" />
                    <span className="font-semibold hidden sm:block">
                        {user.name.split(' ')[0]} <span className="text-xs font-medium bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full capitalize">{user.role}</span>
                    </span>
                    <button 
                        onClick={logout} 
                        className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        title="Se déconnecter"
                    >
                      <LogoutIcon className="h-7 w-7" />
                    </button>
                </>
            ) : (
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-600 hidden md:block">Se connecter en tant que:</span>
                    <button onClick={() => handleRoleLogin('citizen')} className="px-3 py-1.5 text-sm font-semibold text-green-700 bg-green-100 rounded-full hover:bg-green-200">Citoyen</button>
                    <button onClick={() => handleRoleLogin('agent')} className="px-3 py-1.5 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200">Agent</button>
                    <button onClick={() => handleRoleLogin('manager')} className="px-3 py-1.5 text-sm font-semibold text-purple-700 bg-purple-100 rounded-full hover:bg-purple-200">Manager</button>
                    <button 
                        onClick={onLoginClick}
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        title="S'authentifier (modal)"
                    >
                      <UserIcon className="h-7 w-7" />
                    </button>
                </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;