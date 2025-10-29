import React from 'react';
import Modal from './Modal';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../types';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate a successful login for a citizen
    const mockUser: User = {
      id: 'CIT-001',
      name: 'Amadou Sow',
      email: 'amadou.sow@example.com',
      role: 'citizen',
      ecoPoints: 1250,
      rank: 42,
      avatarUrl: 'https://i.pravatar.cc/48?u=amadou',
      zone: 'Médina', // Add zone for auto-assignment
    };
    login(mockUser);
    onClose();
  };

  return (
    <Modal title="S’authentifier / S’inscrire" onClose={onClose}>
      <form onSubmit={handleLogin}>
        <p className="text-gray-600 mb-4">
          Connectez-vous pour accéder à votre espace personnel, signaler des dépôts, et bien plus.
        </p>
        <div className="space-y-4">
           <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
              <input type="email" id="email" defaultValue="amadou.sow@example.com" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" required />
           </div>
           <div>
              <label htmlFor="password"className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <input type="password" id="password" defaultValue="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" required />
           </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button type="button" onClick={onClose} className="mr-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Annuler
          </button>
          <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Se connecter
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AuthModal;