import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { Task, TaskStatus, Message, User } from '../types';

interface AgentDashboardProps {
    agentTasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    users: User[];
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    handleSendMessage: (receiverId: string, text: string) => void;
}

// ICONS
const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h2a1 1 0 001-1V7a1 1 0 00-1-1h-2" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 3l6-3m0 0l-6-3m6 3v10" /></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>;
const ChartBarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const ChatBubbleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;

const getStatusChipClass = (status: TaskStatus) => {
    switch (status) {
        case 'en attente': return 'bg-yellow-100 text-yellow-800';
        case 'en cours': return 'bg-blue-100 text-blue-800';
        case 'terminé': return 'bg-green-100 text-green-800';
    }
}

const TabButton: React.FC<{id: string, activeTab: string, setActiveTab: (id: string) => void, children: React.ReactNode, icon: React.ReactNode}> = ({id, activeTab, setActiveTab, children, icon}) => (
    <button onClick={() => setActiveTab(id)} className={`flex items-center space-x-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
        {icon}
        <span>{children}</span>
    </button>
);

const AgentDashboard: React.FC<AgentDashboardProps> = ({ agentTasks, setTasks, users, messages, setMessages, handleSendMessage }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('missions');
  const [showNotifications, setShowNotifications] = useState(false);

  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
      setTasks(prevTasks => prevTasks.map(task => task.id === taskId ? {...task, status: newStatus} : task));
  };
  
  const activeTasks = agentTasks.filter(t => t.status !== 'terminé');

  const renderContent = () => {
    switch (activeTab) {
        case 'missions': return <MissionsView tasks={activeTasks} updateTaskStatus={updateTaskStatus} />;
        case 'map': return <TourMapView tasks={activeTasks} />;
        case 'stats': return <StatsView allTasks={agentTasks} />;
        case 'chat': return <ChatView currentUser={user} users={users} messages={messages} setMessages={setMessages} onSendMessage={handleSendMessage} />;
        default: return null;
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Tableau de bord Agent</h1>
          <p className="text-lg text-gray-600 mt-1">Bonjour {user?.name}, voici vos missions du jour. Zone: <span className="font-semibold text-blue-600">{user?.zone}</span>.</p>
        </div>
        <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-600 relative">
                <BellIcon />
                <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-10">
                    <div className="p-3 font-bold text-gray-800 border-b">Notifications</div>
                    <ul className="divide-y">
                        <li className="p-3 hover:bg-gray-50 text-sm">Nouvelle mission urgente à <span className="font-semibold">Cité Keur Gorgui</span>.</li>
                        <li className="p-3 hover:bg-gray-50 text-sm">Alerte météo : Fortes pluies prévues cet après-midi.</li>
                    </ul>
                </div>
            )}
        </div>
      </div>
      
      <div className="mt-8">
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                <TabButton id="missions" activeTab={activeTab} setActiveTab={setActiveTab} icon={<ListIcon/>}>Missions du jour</TabButton>
                <TabButton id="map" activeTab={activeTab} setActiveTab={setActiveTab} icon={<MapIcon/>}>Carte de la tournée</TabButton>
                <TabButton id="stats" activeTab={activeTab} setActiveTab={setActiveTab} icon={<ChartBarIcon/>}>Statistiques</TabButton>
                <TabButton id="chat" activeTab={activeTab} setActiveTab={setActiveTab} icon={<ChatBubbleIcon/>}>Messagerie</TabButton>
            </nav>
        </div>
        
        <div className="mt-8">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

const MissionsView: React.FC<{tasks: Task[], updateTaskStatus: (id: string, status: TaskStatus) => void}> = ({ tasks, updateTaskStatus }) => (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type / Quantité</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {tasks.length > 0 ? tasks.map((task) => (
                    <tr key={task.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{task.type} {task.wasteType ? `(${task.wasteType})` : ''}</div>
                            {task.quantity && <div className="text-sm text-gray-500">{task.quantity}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.address}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusChipClass(task.status)}`}>
                                {task.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            {task.status === 'en attente' && (
                                <button onClick={() => updateTaskStatus(task.id, 'en cours')} className="text-indigo-600 hover:text-indigo-900">Commencer</button>
                            )}
                            {task.status === 'en cours' && (
                                <button onClick={() => updateTaskStatus(task.id, 'terminé')} className="text-green-600 hover:text-green-900">Terminer</button>
                            )}
                        </td>
                    </tr>
                    )) : (
                        <tr>
                            <td colSpan={5} className="text-center py-10 text-gray-500">Aucune mission active pour le moment. Reposez-vous !</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

const TourMapView: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Map coordinates (lat, lon) to SVG coordinates (x, y)
    const mapCoordsToSVG = (lat: number, lon: number) => {
        // Rough mapping for Dakar peninsula area
        const latMin = 14.65, latMax = 14.78;
        const lonMin = -17.52, lonMax = -17.42;

        const x = ((lon - lonMin) / (lonMax - lonMin)) * 80 + 10;
        const y = ((latMax - lat) / (latMax - latMin)) * 80 + 10;
        
        return { x, y };
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Carte de la Tournée</h2>
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path d="M42.4,98.6c-5.3-2.6-10.3-6-15-10.1c-9.1-7.8-15.8-18.1-19.1-29.8C4.8,49.2,8.4,39,14.6,30.7c4-5.3,8.7-10,14-14.1 c13.1-10.1,30-11,44.2-3.2c9.5,5.2,16.8,13.4,20.8,23.1c3.1,7.5,3.3,15.6,1,23.3c-3.1,10.6-9.9,19.6-19,26.2 C67.9,92.5,59.3,96.3,50,97.9C47.5,98.3,45,98.5,42.4,98.6z" fill="#d1e7dd" stroke="#a7a094" strokeWidth="0.5" />
                    <path d="M47.9,98.2c-5-2.2-9.5-5.3-13.8-8.9c-8.2-6.9-14.1-15.9-16.9-26.2c-2-7.5-1.5-15.3,1.3-22.5 C22.4,32,27.1,24.5,34.2,18.8c10.4-8.3,24.1-8.1,34.3,0.5c7.3,6.2,12.3,14.8,14.2,24.3c1.4,7.2,0.4,14.5-2.5,21.2 c-4.2,9.6-11.3,17.4-20.2,22.7C53.3,92.7,47.9,94.2,42.4,95C44.4,96.5,46.1,97.4,47.9,98.2z" fill="#f0e9e1" />
                    
                    {tasks.map(task => {
                        if (!task.location) return null;
                        const { x, y } = mapCoordsToSVG(task.location.lat, task.location.lon);
                        const isSelected = selectedTask?.id === task.id;
                        return (
                             <g key={task.id} transform={`translate(${x}, ${y})`} onClick={() => setSelectedTask(task)} className="cursor-pointer">
                                <path 
                                    d="M0-10c-3.3,0-6,2.7-6,6c0,3.3,6,10,6,10s6-6.7,6-10C6-7.3,3.3-10,0-10z" 
                                    className={`transition-all ${task.status === 'en cours' ? 'fill-blue-500' : 'fill-yellow-500'} ${isSelected ? 'scale-150' : 'scale-100'} hover:scale-125`}
                                    stroke="#fff" strokeWidth="0.5"
                                />
                                <circle cx="0" cy="-4" r="2" fill="#fff" />
                            </g>
                        )
                    })}
                </svg>

                {selectedTask && (
                     <div className="absolute top-2 left-2 bg-white p-3 rounded-lg shadow-lg text-sm max-w-xs animate-fade-in-up">
                        <p className="font-bold">{selectedTask.type} - {selectedTask.wasteType || 'N/A'}</p>
                        <p className="text-gray-600">{selectedTask.address}</p>
                        <p className="text-gray-600">Quantité: {selectedTask.quantity || 'Non spécifiée'}</p>
                        <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusChipClass(selectedTask.status)}`}>{selectedTask.status}</span>
                        <button onClick={() => setSelectedTask(null)} className="absolute top-1 right-1 text-gray-400 hover:text-gray-600">&times;</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard: React.FC<{title: string, value: string | number, icon: React.ReactNode}> = ({title, value, icon}) => (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);


const StatsView: React.FC<{ allTasks: Task[] }> = ({ allTasks }) => (
     <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Missions terminées (jour)" value={allTasks.filter(t => t.status === 'terminé' && t.date === new Date().toISOString().split('T')[0]).length} icon={<CheckCircleIcon />} />
            <StatCard title="Missions en attente" value={allTasks.filter(t => t.status === 'en attente').length} icon={<ClockIcon />} />
            <StatCard title="Total Missions (jour)" value={allTasks.length} icon={<TruckIcon />} />
        </div>
         <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Performance Hebdomadaire</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Graphique des missions accomplies</p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
                 <button onClick={() => alert("Exportation PDF de votre rapport personnel simulée.")} className="px-4 py-2 text-sm font-semibold bg-gray-600 text-white rounded-md hover:bg-gray-700">Exporter (PDF)</button>
                 <button onClick={() => alert("Exportation Excel de votre rapport personnel simulée.")} className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-md hover:bg-green-700">Exporter (Excel)</button>
            </div>
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
                            className={`p-3 flex items-center space-x-3 cursor-pointer border-l-4 ${selectedConversationId === user.id ? 'bg-blue-50 border-blue-500' : 'border-transparent hover:bg-gray-50'}`}>
                            <img src={user.avatarUrl} alt={user.name} className="h-12 w-12 rounded-full" />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                                    <p className="text-xs text-gray-400">{lastMessage.timestamp}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                   <p className="text-sm text-gray-500 truncate">{lastMessage.text}</p>
                                   {unreadCount > 0 && <span className="ml-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{unreadCount}</span>}
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
                                    <div className={`px-4 py-2 rounded-2xl max-w-sm ${msg.senderId === currentUser.id ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                       <p className="text-sm">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
                            <div className="flex items-center space-x-3">
                                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Écrire un message..." className="w-full p-2 border border-gray-300 rounded-full focus:ring-blue-500 focus:border-blue-500" />
                                <button type="submit" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:bg-gray-400" disabled={!newMessage.trim()}>
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

export default AgentDashboard;