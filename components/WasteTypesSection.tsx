
import React, { useState } from 'react';
import { WASTE_TYPES } from '../constants';
import type { WasteType, Zone } from '../types';
import ScheduleModal from './ScheduleModal';

const WasteTypeCard: React.FC<{ wasteType: WasteType }> = ({ wasteType }) => {
  const { name, icon: Icon, color, bgColor } = wasteType;
  return (
    <div className={`group flex flex-col items-center justify-center p-6 rounded-2xl ${bgColor} text-center cursor-pointer transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg`}>
      <div className={`p-4 rounded-xl ${color} bg-white mb-4`}>
        <Icon className="h-12 w-12" />
      </div>
      <p className="font-semibold text-gray-700">{name}</p>
    </div>
  );
};

interface WasteTypesSectionProps {
  zones: Zone[];
}

const WasteTypesSection: React.FC<WasteTypesSectionProps> = ({ zones }) => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  return (
    <>
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Faites le bon geste !</h2>
            <p className="mt-2 text-lg text-gray-600">Triez vos déchets selon leur type :</p>
          </div>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {WASTE_TYPES.map((wasteType) => (
              <WasteTypeCard key={wasteType.name} wasteType={wasteType} />
            ))}
          </div>
          <div className="mt-12 text-center">
              <button 
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-green-700 transition duration-300 shadow-md hover:shadow-lg">
                  Voir les horaires de collecte
              </button>
          </div>
        </div>
      </section>
      {isScheduleModalOpen && <ScheduleModal onClose={() => setIsScheduleModalOpen(false)} zones={zones} />}
    </>
  );
};

export default WasteTypesSection;
