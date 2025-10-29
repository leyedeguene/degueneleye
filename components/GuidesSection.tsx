
import React, { useState } from 'react';
import type { Guide } from '../types';
import GuidesModal from './GuidesModal';

interface GuidesSectionProps {
    guides: Guide[];
}

const GuidesSection: React.FC<GuidesSectionProps> = ({ guides }) => {
    const featuredGuide = guides.length > 0 ? guides[0] : null;
    const [isGuidesModalOpen, setIsGuidesModalOpen] = useState(false);

    return (
        <>
            <section className="bg-white py-12 md:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-left mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold">Guides et Tutoriels</h2>
                    </div>
                    {featuredGuide ? (
                        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                            <div className="rounded-lg shadow-lg overflow-hidden aspect-video relative flex items-center justify-center group cursor-pointer" onClick={() => setIsGuidesModalOpen(true)}>
                                <img 
                                    src={featuredGuide.thumbnailUrl} 
                                    alt="Aperçu du guide" 
                                    className="w-full h-full object-cover" 
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-colors"></div>
                                
                                {/* YouTube-like Play Button */}
                                <div className="absolute w-20 h-20 text-white opacity-90 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-300">
                                    <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                                    Consulter les guides et tutoriels sur le recyclage
                                </h3>
                                <p className="mt-4 text-lg text-gray-600">
                                    Apprenez à trier efficacement vos déchets grâce à nos guides pratiques et tutoriels dédiés au recyclage responsable.
                                </p>
                                <div className="mt-8">
                                    <button 
                                        onClick={() => setIsGuidesModalOpen(true)}
                                        className="bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-green-700 transition duration-300 shadow-md hover:shadow-lg">
                                        Voir tous les guides
                                    </button>
                                </div>
                            </div>
                        </div>
                     ) : (
                        <div className="text-center py-10 text-gray-500">
                            <p>Aucun guide ou tutoriel n'est disponible pour le moment.</p>
                        </div>
                    )}
                </div>
            </section>
            {isGuidesModalOpen && <GuidesModal guides={guides} onClose={() => setIsGuidesModalOpen(false)} />}
        </>
    );
};

export default GuidesSection;