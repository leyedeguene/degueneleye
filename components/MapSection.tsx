
import React from 'react';

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const SenegalMap: React.FC = () => (
    <svg viewBox="0 0 200 120" className="w-full h-auto max-w-md mx-auto">
        <path d="M63.5 13.9C60.9 10.1 55.4 11.2 54.3 14.6C53.7 16.3 54.7 18 55.7 19.1C57.4 20.8 59.8 21.6 62.1 21.6C64.6 21.5 66.8 20.2 68.2 18.2C68.9 17.2 68.8 15.9 68.1 15C67.4 14 65.2 13.1 63.5 13.9Z M129.5 28.5c-0.6 0-1.2 0.3-1.6 0.8l-12.8 14.5c-0.6 0.6-0.8 1.4-0.6 2.2l3.4 13.2c0.3 1.1 1.4 1.8 2.5 1.5l12.8-3.4c0.8-0.2 1.4-0.8 1.6-1.6l4.6-13.8c0.3-0.8 0-1.8-0.8-2.3l-10-8C130.9 28.8 130.2 28.5 129.5 28.5z M100.8 59.5l-8.9 2.5c-1 0.3-1.8 1-2.1 2l-4 13.3c-0.4 1.4 0.6 2.8 2 2.8h21c1.4 0 2.4-1.4 2-2.8l-4-13.3c-0.3-1-1.1-1.7-2.1-2l-8.9-2.5z M145.7 60.1l-10.3 6.9c-0.9 0.6-1.4 1.6-1.2 2.7l3.6 14.6c0.3 1.2 1.5 2 2.7 1.7l13.6-3.4c1.1-0.3 1.9-1.2 1.9-2.4l0.2-15.5c0-1.1-0.7-2.1-1.8-2.4l-8.7-2.2z M85.4 92.5l-5.6 1.4c-1.3 0.3-2.5 1.4-2.8 2.7l-1.9 8c-0.4 1.5 0.7 3 2.2 3h12c1.5 0 2.6-1.5 2.2-3l-1.9-8c-0.3-1.3-1.5-2.4-2.8-2.7l-5.4-1.4z" fill="#4CAF50" opacity="0.8"/>
        {/* Points on map */}
        <circle cx="120" cy="35" r="4" fill="#3b82f6" className="animate-pulse" />
        <circle cx="140" cy="65" r="3" fill="#3b82f6" />
        <circle cx="105" cy="75" r="4" fill="#4CAF50" />
        <circle cx="90" cy="65" r="3" fill="#4CAF50" className="animate-pulse" />
        <circle cx="60" cy="18" r="5" fill="#3b82f6" />
        <circle cx="78" cy="100" r="3" fill="#4CAF50" />
    </svg>
);


const MapSection: React.FC = () => {
    return (
        <section className="bg-white py-12 md:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                            Trouvez votre point de collecte le plus proche
                        </h1>
                        <p className="mt-4 text-lg text-gray-600">
                            Localisez facilement le point de collecte le plus proche pour déposer vos déchets recyclables en toute simplicité.
                        </p>
                        <div className="mt-8 relative max-w-lg mx-auto md:mx-0">
                             <input 
                                type="text"
                                placeholder="Rechercher une adresse, une ville..."
                                className="w-full py-4 pl-12 pr-4 text-lg border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition duration-300"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <SearchIcon className="h-6 w-6"/>
                            </div>
                        </div>
                         <div className="mt-6 flex justify-center md:justify-start items-center space-x-6">
                            <div className="flex items-center space-x-2">
                                <span className="h-4 w-4 rounded-full bg-green-500"></span>
                                <span className="text-gray-600">Points de dépôts</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="h-4 w-4 rounded-full bg-blue-500"></span>
                                <span className="text-gray-600">Centres de recyclage</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                       <SenegalMap />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MapSection;
