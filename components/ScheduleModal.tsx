
import React, { useState } from 'react';
import Modal from './Modal';
import type { Zone } from '../types';

interface ScheduleModalProps {
  onClose: () => void;
  zones: Zone[];
}

const collectionSchedules: { [key: string]: { [key: string]: string } } = {
  'Médina': {
    'Déchets organiques': 'Lundi, Mercredi, Vendredi (6h - 8h)',
    'Papiers et Plastiques': 'Mardi, Jeudi (7h - 9h)',
    'Verres et Métaux': 'Samedi (8h - 10h)',
    'Déchets électroniques': 'Sur demande'
  },
  'Yoff': {
    'Déchets organiques': 'Lundi, Mercredi, Vendredi (7h - 9h)',
    'Papiers et Plastiques': 'Mardi (8h - 10h)',
    'Verres et Métaux': 'Jeudi (9h - 11h)',
    'Déchets électroniques': 'Sur demande'
  },
  'Liberté 6': {
    'Déchets organiques': 'Lundi, Mercredi, Vendredi (7h - 9h)',
    'Papiers et Plastiques': 'Mardi, Jeudi (8h - 10h)',
    'Verres et Métaux': 'Samedi (9h - 11h)',
    'Déchets électroniques': 'Sur demande'
  },
  'Point E': {
    'Déchets organiques': 'Mardi, Jeudi, Samedi (8h - 10h)',
    'Papiers et Plastiques': 'Lundi, Mercredi (9h - 11h)',
    'Verres et Métaux': 'Vendredi (10h - 12h)',
    'Déchets électroniques': 'Sur demande'
  },
  'Parcelles Assainies': {
    'Déchets organiques': 'Lundi, Mercredi, Vendredi (5h - 7h)',
    'Papiers et Plastiques': 'Mardi, Samedi (6h - 8h)',
    'Verres et Métaux': 'Jeudi (7h - 9h)',
    'Déchets électroniques': 'Sur demande'
  },
  'Grand Yoff': {
    'Déchets organiques': 'Mardi, Jeudi, Samedi (6h - 8h)',
    'Papiers et Plastiques': 'Lundi, Vendredi (7h - 9h)',
    'Verres et Métaux': 'Mercredi (8h - 10h)',
    'Déchets électroniques': 'Sur demande'
  },
};

const ScheduleModal: React.FC<ScheduleModalProps> = ({ onClose, zones }) => {
  const [selectedZone, setSelectedZone] = useState<string>('');

  const currentSchedule = selectedZone ? collectionSchedules[selectedZone] : null;

  return (
    <Modal title={`Horaires de collecte ${selectedZone ? `pour ${selectedZone}` : ''}`} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label htmlFor="zone-select" className="block text-sm font-medium text-gray-700">
            Choisissez votre zone pour voir les horaires :
          </label>
          <select
            id="zone-select"
            name="zone"
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
          >
            <option value="" disabled>-- Sélectionner une zone --</option>
            {zones.map(zone => (
              <option key={zone.id} value={zone.name}>{zone.name}</option>
            ))}
          </select>
        </div>

        {currentSchedule ? (
          <>
            <p className="text-gray-600 text-sm">Les horaires sont susceptibles de changer. Activez les notifications pour rester informé.</p>
            <ul className="divide-y divide-gray-200">
              {Object.entries(currentSchedule).map(([wasteType, schedule], index) => {
                const colors: { [key: string]: string } = {
                  'Déchets organiques': 'text-orange-600',
                  'Papiers et Plastiques': 'text-blue-600',
                  'Verres et Métaux': 'text-gray-600',
                  'Déchets électroniques': 'text-red-600'
                };
                return (
                  <li key={index} className="py-3 flex justify-between items-center">
                    <span className="font-medium">{wasteType}</span>
                    <span className={`${colors[wasteType] || 'text-gray-800'} font-semibold text-right`}>{schedule}</span>
                  </li>
                );
              })}
            </ul>
          </>
        ) : selectedZone ? (
           <div className="text-center py-8">
             <p className="text-gray-500">Aucun horaire de collecte n'est encore défini pour la zone "{selectedZone}".</p>
           </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Veuillez sélectionner une zone pour afficher les horaires de collecte.</p>
          </div>
        )}

        <div className="mt-4 text-center">
          <button 
            className="bg-green-600 text-white font-bold py-2 px-6 rounded-full hover:bg-green-700 transition duration-300"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ScheduleModal;
