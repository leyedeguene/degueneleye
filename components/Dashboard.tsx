import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { WASTE_TYPES } from '../constants';
import type { Campaign, Task, CampaignParticipant, User, Message } from '../types';

interface DashboardProps {
    onRequestPickup: (task: Omit<Task, 'id' | 'status' | 'date'>) => boolean;
    onCampaignRegister: (participant: Omit<CampaignParticipant, 'id' | 'status'>) => void;
    campaigns: Campaign[];
    users: User[];
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    handleSendMessage: (receiverId: string, text: string) => void;
}

const RequestPickup: React.FC<{ onRequestPickup: DashboardProps['onRequestPickup'] }> = ({ onRequestPickup }) => {
  const [selectedWaste, setSelectedWaste] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [agentFound, setAgentFound] = useState(false);
  const [location, setLocation] = useState<{ lat: number, lon: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addressDetails, setAddressDetails] = useState('');

  const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
                setError(null);
            },
            () => {
                setError('Impossible d\'accéder à la géolocalisation. Veuillez l\'activer.');
            }
        );
    } else {
        setError('La géolocalisation n\'est pas supportée par votre navigateur.');
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedWaste && location) {
        const found = onRequestPickup({
            type: 'Ramassage',
            address: addressDetails || `Lat: ${location.lat.toFixed(4)}, Lon: ${location.lon.toFixed(4)}`,
            wasteType: selectedWaste,
            location: location,
        });
        setAgentFound(found);
        setIsSubmitted(true);
    } else if (!location) {
        setError("Les coordonnées GPS sont requises pour la demande.");
    }
  };
  
  if (isSubmitted) {
    return (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
            <p className="font-bold">Demande envoyée !</p>
            <p>Votre demande de ramassage pour les déchets de type "{selectedWaste}" a bien été enregistrée. {agentFound ? "Un agent a été notifié." : "Vous serez contacté prochainement."}</p>
            <button onClick={() => {setIsSubmitted(false); getLocation();}} className="mt-2 text-sm font-semibold hover:underline">Faire une autre demande</button>
        </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Demande de ramassage spécifique</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Sélectionnez le type de déchet :</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {WASTE_TYPES.map((type) => (
              <button
                key={type.name}
                type="button"
                onClick={() => setSelectedWaste(type.name)}
                className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all duration-200 ${selectedWaste === type.name ? 'border-green-500 ring-2 ring-green-500' : 'border-gray-200 hover:border-gray-400'}`}
              >
                <type.icon className={`h-8 w-8 mb-2 ${type.color}`} />
                <span className="text-sm font-medium text-gray-700">{type.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
           <label className="block text-gray-700 font-semibold mb-2">Adresse de ramassage</label>
           {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
           <div className="flex items-center space-x-4 p-3 bg-gray-100 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {location ? (
                    <p className="text-gray-800 text-sm">{`Lat: ${location.lat.toFixed(4)}, Lon: ${location.lon.toFixed(4)}`}</p>
                ) : (
                        <p className="text-gray-500 text-sm">Acquisition des coordonnées...</p>
                )}
                <button type="button" onClick={getLocation} className="ml-auto text-sm text-green-600 hover:underline">Actualiser</button>
            </div>
           <input 
              type="text" 
              value={addressDetails}
              onChange={(e) => setAddressDetails(e.target.value)}
              className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" placeholder="Ajouter des détails (étage, numéro d'appartement...)" />
        </div>
        <button 
            type="submit" 
            disabled={!selectedWaste || !location}
            className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
          Envoyer la demande
        </button>
      </form>
    </div>
  );
};

const ReportDumping: React.FC = () => {
    const [location, setLocation] = useState<{ lat: number, lon: number} | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [photoName, setPhotoName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                    setError(null);
                },
                () => {
                    setError('Impossible d\'accéder à la géolocalisation. Veuillez l\'activer dans votre navigateur.');
                }
            );
        } else {
            setError('La géolocalisation n\'est pas supportée par votre navigateur.');
        }
    };

    useEffect(() => {
        getLocation();
    }, []);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setPhotoName(event.target.files[0].name);
        } else {
            setPhotoName(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(location && photoName) {
            // Here you would typically pass the data up to a context or parent component
            setIsSubmitted(true);
        } else if (!location) {
            setError("Les coordonnées GPS sont requises pour le signalement.");
        } else {
             alert("Veuillez ajouter une photo pour le signalement.");
        }
    };

    if (isSubmitted) {
        return (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
                <p className="font-bold">Signalement envoyé !</p>
                <p>Merci pour votre contribution ! Votre signalement a été transmis à nos équipes. Ensemble, gardons notre communauté propre.</p>
                <button onClick={() => {setIsSubmitted(false); setPhotoName(null);}} className="mt-2 text-sm font-semibold hover:underline">Faire un autre signalement</button>
            </div>
        )
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Signaler un dépôt sauvage</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Coordonnées GPS</label>
                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                    <div className="flex items-center space-x-4 p-3 bg-gray-100 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {location ? (
                            <p className="text-gray-800">{`Lat: ${location.lat.toFixed(4)}, Lon: ${location.lon.toFixed(4)}`}</p>
                        ) : (
                             <p className="text-gray-500">Acquisition des coordonnées...</p>
                        )}
                        <button type="button" onClick={getLocation} className="ml-auto text-sm text-green-600 hover:underline">Actualiser</button>
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Ajouter une photo</label>
                     <div 
                        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            <div className="flex text-sm text-gray-600">
                                <p className="pl-1">{photoName ? photoName : 'Cliquez pour choisir un fichier'}</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                            <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                        </div>
                    </div>
                </div>
                <button 
                    type="submit" 
                    disabled={!location || !photoName}
                    className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
                  Envoyer le signalement
                </button>
            </form>
        </div>
    );
};

const CampaignCard: React.FC<{ campaign: Campaign, onRegister: () => void }> = ({ campaign, onRegister }) => {
    const [isRegistered, setIsRegistered] = useState(false);

    const handleRegister = () => {
        onRegister();
        setIsRegistered(true);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
            <img src={campaign.imageUrl} alt={campaign.title} className="h-48 w-full md:w-1/3 object-cover" />
            <div className="p-6 flex flex-col justify-between">
                <div>
                    <h4 className="text-xl font-bold text-gray-800">{campaign.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{campaign.date} - {campaign.location}</p>
                    <p className="text-gray-600 mt-2">{campaign.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                     <div className="text-sm text-gray-700 font-semibold">{campaign.participants} participants</div>
                     <button 
                        onClick={handleRegister}
                        disabled={isRegistered}
                        // FIX: Corrected the malformed ternary operator which caused a syntax error.
                        className={`px-6 py-2 rounded-full font-bold text-white transition-colors duration-300 ${isRegistered ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                       {isRegistered ? 'Participation envoyée ✔' : 'Participer'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const CampaignsView: React.FC<{ onCampaignRegister: DashboardProps['onCampaignRegister'], campaigns: Campaign[] }> = ({ onCampaignRegister, campaigns }) => {
    const { user } = useAuth();
    if (!user) return null;

    const handleRegister = (campaign: Campaign) => {
        onCampaignRegister({
            campaignId: campaign.id,
            campaignTitle: campaign.title,
            userName: user.name,
            userAvatar: user.avatarUrl || `https://i.pravatar.cc/48?u=${user.email}`,
        });
    }

    return (
        <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Campagnes et Événements à venir</h3>
            <div className="space-y-6">
                {campaigns.map(campaign => (
                    <CampaignCard key={campaign.id} campaign={campaign} onRegister={() => handleRegister(campaign)} />
                ))}
            </div>
        </div>
    )
};


const StatCard: React.FC<{title: string, value: string | number, icon: React.ReactNode}> = ({title, value, icon}) => (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
        <div className="bg-green-100 p-3 rounded-full text-green-600">
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const ChatView: React.FC<{
    currentUser: User | null;
    users: User[];
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    onSendMessage: (receiverId: string, text: string) => void;
}> = ({ currentUser, users, messages, setMessages, onSendMessage }) => {
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const conversations = useMemo(() => {
        if (!currentUser) return [];

        const conversationsMap = new Map<string, { user: User; lastMessage: Message; unreadCount: number }>();
        
        messages.forEach(msg => {
            const otherUserId = msg.senderId === currentUser.id ? msg.receiverId : msg.senderId;
            const otherUser = users.find(u => u.id === otherUserId);

            if (otherUser) {
                let conversation = conversationsMap.get(otherUserId);
                if (!conversation || new Date(msg.id.split('-')[1]) > new Date(conversation.lastMessage.id.split('-')[1])) {
                    conversation = { user: otherUser, lastMessage: msg, unreadCount: 0 };
                    conversationsMap.set(otherUserId, conversation);
                }
            }
        });

        messages.forEach(msg => {
            if (msg.receiverId === currentUser.id && !msg.read) {
                let conversation = conversationsMap.get(msg.senderId);
                if(conversation) {
                    conversation.unreadCount = (conversation.unreadCount || 0) + 1;
                }
            }
        });

        return Array.from(conversationsMap.values()).sort((a,b) => new Date(b.lastMessage.id.split('-')[1]).getTime() - new Date(a.lastMessage.id.split('-')[1]).getTime());
    }, [messages, currentUser, users]);
    
    useEffect(() => {
        if (!selectedConversationId && conversations.length > 0) {
            setSelectedConversationId(conversations[0].user.id);
        }
    }, [conversations, selectedConversationId]);

    useEffect(() => {
        if (selectedConversationId && currentUser) {
            const hasUnread = messages.some(msg => msg.receiverId === currentUser.id && msg.senderId === selectedConversationId && !msg.read);
            if(hasUnread) {
                setMessages(prevMessages => 
                    prevMessages.map(msg => 
                        (msg.receiverId === currentUser.id && msg.senderId === selectedConversationId)
                            ? { ...msg, read: true }
                            : msg
                    )
                );
            }
        }
    }, [selectedConversationId, currentUser, messages, setMessages]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, selectedConversationId]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && selectedConversationId) {
            onSendMessage(selectedConversationId, newMessage);
            setNewMessage('');
        }
    };

    const selectedConversationMessages = messages.filter(
        msg => (msg.senderId === currentUser?.id && msg.receiverId === selectedConversationId) ||
               (msg.senderId === selectedConversationId && msg.receiverId === currentUser?.id)
    );
    
    const selectedUser = users.find(u => u.id === selectedConversationId);

    if (!currentUser) return <div>Chargement...</div>

    return (
        <div className="bg-white shadow-md rounded-lg h-[32rem] flex overflow-hidden">
            <div className="w-1/3 border-r flex flex-col">
                <div className="p-4 border-b"><h4 className="font-bold text-lg">Conversations</h4></div>
                <ul className="overflow-y-auto">
                    {conversations.map(({ user, lastMessage, unreadCount }) => (
                        <li key={user.id} onClick={() => setSelectedConversationId(user.id)}
                            className={`p-3 flex items-center space-x-3 cursor-pointer border-l-4 ${selectedConversationId === user.id ? 'bg-green-50 border-green-500' : 'border-transparent hover:bg-gray-50'}`}>
                            <img src={user.avatarUrl} alt={user.name} className="h-12 w-12 rounded-full" />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                                    <p className="text-xs text-gray-400">{lastMessage.timestamp}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                   <p className="text-sm text-gray-500 truncate">{lastMessage.text}</p>
                                   {unreadCount > 0 && <span className="ml-2 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{unreadCount}</span>}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="w-2/3 flex flex-col">
                {selectedConversationId && selectedUser ? (
                    <>
                        <div className="p-4 border-b flex items-center space-x-3">
                            <img src={selectedUser.avatarUrl} alt={selectedUser.name} className="h-10 w-10 rounded-full" />
                            <div>
                                <h5 className="font-bold text-gray-800">{selectedUser.name}</h5>
                                <p className="text-xs text-gray-500 capitalize">{selectedUser.role}</p>
                            </div>
                        </div>
                        <div className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-4">
                            {selectedConversationMessages.map(msg => (
                                <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                                    {msg.senderId !== currentUser.id && <img src={selectedUser.avatarUrl} className="h-6 w-6 rounded-full" />}
                                    <div className={`px-4 py-2 rounded-2xl max-w-sm ${msg.senderId === currentUser.id ? 'bg-green-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                       <p className="text-sm">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
                            <div className="flex items-center space-x-3">
                                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Écrire un message..." className="w-full p-2 border border-gray-300 rounded-full focus:ring-green-500 focus:border-green-500" />
                                <button type="submit" className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 disabled:bg-gray-400" disabled={!newMessage.trim()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-grow flex items-center justify-center text-gray-500">
                        <p>Sélectionnez une conversation pour commencer à discuter.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ onRequestPickup, onCampaignRegister, campaigns, users, messages, setMessages, handleSendMessage }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');

  const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" /></svg>;
  const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 12l4.293 4.293a1 1 0 010 1.414L12 20m0 0l-2.293-2.293a1 1 0 010-1.414L12 14l-4.293-4.293a1 1 0 010-1.414L10 6m0 0l2.293-2.293a1 1 0 011.414 0L16 6m-2 14l2-2m-2-12l2-2" /></svg>;
  const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Bonjour, {user?.name} !</h1>
        <p className="text-lg text-gray-600 mt-1">Bienvenue sur votre espace citoyen. Zone : <span className="font-semibold text-green-700">{user?.zone}</span></p>
        
        <div className="mt-8">
             <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('stats')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'stats' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Mes Statistiques
                    </button>
                    <button onClick={() => setActiveTab('report')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'report' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Signaler un dépôt
                    </button>
                    <button onClick={() => setActiveTab('request')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'request' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Demander un ramassage
                    </button>
                     <button onClick={() => setActiveTab('campaigns')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'campaigns' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Campagnes
                    </button>
                    <button onClick={() => setActiveTab('chat')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'chat' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Messagerie
                    </button>
                </nav>
            </div>
            
            <div className="mt-8">
                {activeTab === 'stats' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard title="Éco-points" value={user?.ecoPoints || 0} icon={<StarIcon />} />
                        <StatCard title="Classement" value={`#${user?.rank || 'N/A'}`} icon={<TrophyIcon />} />
                        <StatCard title="Signalements" value={14} icon={<ChartIcon />} />
                    </div>
                )}
                {activeTab === 'report' && <ReportDumping />}
                {activeTab === 'request' && <RequestPickup onRequestPickup={onRequestPickup} />}
                {activeTab === 'campaigns' && <CampaignsView onCampaignRegister={onCampaignRegister} campaigns={campaigns} />}
                {activeTab === 'chat' && <ChatView currentUser={user} users={users} messages={messages} setMessages={setMessages} onSendMessage={handleSendMessage} />}
            </div>
        </div>
    </div>
  );
};

export default Dashboard;