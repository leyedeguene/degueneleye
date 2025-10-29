
import React from 'react';
import type { Guide } from '../types';
import Modal from './Modal';

interface GuidesModalProps {
    guides: Guide[];
    onClose: () => void;
}

const LinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
);

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);


const GuidesModal: React.FC<GuidesModalProps> = ({ guides, onClose }) => {
    return (
        <Modal title="Tous les guides et tutoriels" onClose={onClose}>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1 -mr-2 pr-2">
                {guides.length > 0 ? guides.map(guide => (
                    <div key={guide.id} className="flex items-start space-x-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <img src={guide.thumbnailUrl} alt={guide.title} className="w-32 h-20 object-cover rounded-md flex-shrink-0 bg-gray-100"/>
                        <div className="flex-grow">
                            <h4 className="font-bold text-gray-800">{guide.title}</h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{guide.description}</p>
                            {guide.type === 'link' && guide.url ? (
                                <a href={guide.url} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:text-green-800 font-semibold mt-2 inline-flex items-center space-x-1">
                                    <LinkIcon className="w-4 h-4" />
                                    <span>Voir le guide</span>
                                </a>
                            ) : guide.fileName ? (
                                <button onClick={() => alert(`Téléchargement de ${guide.fileName} simulé.`)} className="text-sm text-green-600 hover:text-green-800 font-semibold mt-2 inline-flex items-center space-x-1">
                                    <DownloadIcon className="w-4 h-4" />
                                    <span>Télécharger le fichier</span>
                                </button>
                            ) : null}
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-10 text-gray-500">
                        <p>Aucun guide n'est disponible pour le moment.</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default GuidesModal;
