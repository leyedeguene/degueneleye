
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { Agent, Task, TaskStatus, Campaign, Zone, Reward, EcoPointsRules, CampaignParticipant, User, Message, Guide } from '../types';
import Modal from './Modal';

interface ManagerDashboardProps {
    allTasks: Task[];
    allAgents: Agent[];
    allCampaigns: Campaign[];
    setAllTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    setAllAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
    setAllCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
    participants: CampaignParticipant[];
    setParticipants: React.Dispatch<React.SetStateAction<CampaignParticipant[]>>;
    citizens: User[];
    rewards: Reward[];
    ecoPointsRules: EcoPointsRules;
    setRewards: React.Dispatch<React.SetStateAction<Reward[]>>;
    setEcoPointsRules: React.Dispatch<React.SetStateAction<EcoPointsRules>>;
    users: User[];
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    handleSendMessage: (receiverId: string, text: string) => void;
    allZones: Zone[];
    setAllZones: React.Dispatch<React.SetStateAction<Zone[]>>;
    guides: Guide[];
    setGuides: React.Dispatch<React.SetStateAction<Guide[]>>;
}

const StatCard: React.FC<{title: string, value: string | number, icon: React.ReactNode}> = ({title, value, icon}) => (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
        <div className="bg-purple-100 p-3 rounded-full text-purple-600">
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

// Icons
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" /></svg>;
const FlagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const ChartBarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 3l6-3m0 0l-6-3m6 3v10" /></svg>;
const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" /></svg>;
const CogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0 3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ChatBubbleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;

const getStatusChipClass = (status: TaskStatus | Agent['status']) => {
    switch (status) {
        case 'en attente': return 'bg-yellow-100 text-yellow-800';
        case 'en cours': return 'bg-blue-100 text-blue-800';
        case 'terminé': return 'bg-green-100 text-green-800';
        case 'disponible': return 'bg-green-100 text-green-800';
        case 'en mission': return 'bg-blue-100 text-blue-800';
        case 'hors service': return 'bg-red-100 text-red-800';
    }
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ allTasks, allAgents, allCampaigns, setAllTasks, setAllAgents, setAllCampaigns, participants, setParticipants, citizens, rewards, ecoPointsRules, setRewards, setEcoPointsRules, users, messages, setMessages, handleSendMessage, allZones, setAllZones, guides, setGuides }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('stats');
    const [showNotifications, setShowNotifications] = useState(false);
    
    // Modal states
    const [agentModal, setAgentModal] = useState<{isOpen: boolean, agent: Agent | null}>({isOpen: false, agent: null});
    const [campaignModal, setCampaignModal] = useState(false);
    const [reportModal, setReportModal] = useState<{isOpen: boolean, task: Task | null}>({isOpen: false, task: null});
    const [zoneModal, setZoneModal] = useState<{isOpen: boolean, zone: Zone | null}>({isOpen: false, zone: null});
    const [guideModal, setGuideModal] = useState<{isOpen: boolean, guide: Guide | null}>({isOpen: false, guide: null});
    
    // Filters for reports tab
    const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
    const [agentFilter, setAgentFilter] = useState<string | 'all'>('all');

    const filteredReports = useMemo(() => {
        return allTasks
            .filter(task => statusFilter === 'all' || task.status === statusFilter)
            .filter(task => agentFilter === 'all' || task.assignedAgentId === agentFilter);
    }, [allTasks, statusFilter, agentFilter]);
    
    const handleSaveAgent = (agent: Agent) => {
        if (agent.id) { // Editing existing agent
            setAllAgents(allAgents.map(a => a.id === agent.id ? agent : a));
        } else { // Adding new agent
            setAllAgents([...allAgents, {...agent, id: `AG-${Date.now()}`}]);
        }
        setAgentModal({isOpen: false, agent: null});
    };
    
    const handleDeleteAgent = (agentId: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet agent ?")) {
            setAllAgents(allAgents.filter(a => a.id !== agentId));
        }
    };
    
    const handleSaveCampaign = (campaignData: Omit<Campaign, 'id' | 'participants'>) => {
        const newCampaign: Campaign = {
            ...campaignData,
            id: `C-${Date.now()}`,
            participants: 0,
        };
        setAllCampaigns(prev => [...prev, newCampaign]);
        setCampaignModal(false);
    };
    
    const handleAssignAgentToTask = (taskId: string, agentId: string) => {
        setAllTasks(allTasks.map(t => t.id === taskId ? {...t, assignedAgentId: agentId, status: 'en cours'} : t));
        setReportModal({isOpen: false, task: null});
    }

    const handleSaveZone = (zone: Omit<Zone, 'id'>) => {
        const newZone: Zone = {
            ...zone,
            id: `Z-${Date.now()}`,
        };
        setAllZones(prev => [...prev, newZone]);
        setZoneModal({isOpen: false, zone: null});
    };

    const handleSaveGuide = (guide: Guide) => {
        if (guide.id) { // Editing existing guide
            setGuides(prev => prev.map(g => g.id === guide.id ? guide : g));
        } else { // Adding new guide
            setGuides(prev => [{...guide, id: `G-${Date.now()}`}, ...prev]);
        }
        setGuideModal({isOpen: false, guide: null});
    };
    
    const handleDeleteGuide = (guideId: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce guide ?")) {
            setGuides(prev => prev.filter(g => g.id !== guideId));
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'stats': return <StatsView tasks={allTasks} agents={allAgents} />;
            case 'reports': return <ReportsView reports={filteredReports} agents={allAgents} statusFilter={statusFilter} setStatusFilter={setStatusFilter} agentFilter={agentFilter} setAgentFilter={setAgentFilter} onOpenReportModal={(task) => setReportModal({isOpen: true, task})} />;
            case 'agents': return <AgentsView agents={allAgents} onAddAgent={() => setAgentModal({isOpen: true, agent: null})} onEditAgent={(agent) => setAgentModal({isOpen: true, agent})} onDeleteAgent={handleDeleteAgent} />;
            case 'campaigns': return <CampaignsView campaigns={allCampaigns} onCreateCampaign={() => setCampaignModal(true)} participants={participants} setParticipants={setParticipants} />;
            case 'zones': return <ZonesView zones={allZones} agents={allAgents} setAgents={setAllAgents} onAddZone={() => setZoneModal({isOpen: true, zone: null})} />;
            case 'community': return <CommunityView citizens={citizens} rewards={rewards} setRewards={setRewards} ecoPointsRules={ecoPointsRules} setEcoPointsRules={setEcoPointsRules} />;
            case 'guides': return <GuidesView guides={guides} onAddGuide={() => setGuideModal({isOpen: true, guide: null})} onEditGuide={(guide) => setGuideModal({isOpen: true, guide})} onDeleteGuide={handleDeleteGuide} />;
            case 'chat': return <ChatView currentUser={user} users={users} messages={messages} setMessages={setMessages} onSendMessage={handleSendMessage} />;
            default: return null;
        }
    }
  
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Espace Manager</h1>
                    <p className="text-lg text-gray-600 mt-1">Bienvenue, {user?.name}.</p>
                </div>
                <div className="relative">
                    <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 rounded-full text-gray-500 hover:bg-purple-100 hover:text-purple-600 relative">
                        <BellIcon />
                        <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-10">
                           <div className="p-3 font-bold text-gray-800 border-b">Notifications</div>
                           <ul className="divide-y">
                               <li className="p-3 hover:bg-gray-50 text-sm">Nouveau signalement à <span className="font-semibold">Médina</span></li>
                               <li className="p-3 hover:bg-gray-50 text-sm">Agent <span className="font-semibold">Ousmane Fall</span> est maintenant <span className="text-red-600">hors service</span>.</li>
                               <li className="p-3 hover:bg-gray-50 text-sm">5 nouvelles inscriptions à la campagne <span className="font-semibold">Nettoyage de Yoff</span>.</li>
                           </ul>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="mt-8">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                        <TabButton id="stats" activeTab={activeTab} setActiveTab={setActiveTab} icon={<ChartBarIcon/>}>Statistiques</TabButton>
                        <TabButton id="reports" activeTab={activeTab} setActiveTab={setActiveTab} icon={<FlagIcon/>}>Signalements</TabButton>
                        <TabButton id="agents" activeTab={activeTab} setActiveTab={setActiveTab} icon={<UsersIcon/>}>Agents</TabButton>
                        <TabButton id="campaigns" activeTab={activeTab} setActiveTab={setActiveTab} icon={<TrophyIcon/>}>Campagnes</TabButton>
                        <TabButton id="zones" activeTab={activeTab} setActiveTab={setActiveTab} icon={<MapIcon/>}>Zones</TabButton>
                        <TabButton id="community" activeTab={activeTab} setActiveTab={setActiveTab} icon={<CogIcon/>}>Communauté</TabButton>
                        <TabButton id="guides" activeTab={activeTab} setActiveTab={setActiveTab} icon={<BookOpenIcon/>}>Guides</TabButton>
                        <TabButton id="chat" activeTab={activeTab} setActiveTab={setActiveTab} icon={<ChatBubbleIcon/>}>Messagerie</TabButton>
                    </nav>
                </div>
                
                <div className="mt-8">
                    {renderContent()}
                </div>
            </div>
            {agentModal.isOpen && <AgentModal agent={agentModal.agent} onSave={handleSaveAgent} onClose={() => setAgentModal({isOpen: false, agent: null})} />}
            {campaignModal && <CampaignModal onSave={handleSaveCampaign} onClose={() => setCampaignModal(false)} />}
            {reportModal.isOpen && reportModal.task && <ReportModal task={reportModal.task} agents={allAgents} onAssign={handleAssignAgentToTask} onClose={() => setReportModal({isOpen: false, task: null})} />}
            {zoneModal.isOpen && <ZoneModal zone={zoneModal.zone} onSave={handleSaveZone} onClose={() => setZoneModal({isOpen: false, zone: null})} />}
            {guideModal.isOpen && <GuideModal guide={guideModal.guide} onSave={handleSaveGuide} onClose={() => setGuideModal({isOpen: false, guide: null})} />}
        </div>
    );
};


const TabButton: React.FC<{id: string, activeTab: string, setActiveTab: (id: string) => void, children: React.ReactNode, icon: React.ReactNode}> = ({id, activeTab, setActiveTab, children, icon}) => (
    <button onClick={() => setActiveTab(id)} className={`flex items-center space-x-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === id ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
        {icon}
        <span>{children}</span>
    </button>
);

// Sub-components for each tab
const StatsView: React.FC<{tasks: Task[], agents: Agent[]}> = ({tasks, agents}) => (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Signalements en attente" value={tasks.filter(t => t.status === 'en attente').length} icon={<FlagIcon />} />
            <StatCard title="Agents disponibles" value={agents.filter(a => a.status === 'disponible').length} icon={<UsersIcon />} />
            <StatCard title="Total tonnes collectées (Mois)" value={"1,204"} icon={<TrashIcon />} />
        </div>
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Statistiques Globales</h3>
             {/* Fake Chart */}
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Graphique des collectes par zone</p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
                 <button onClick={() => alert("Exportation PDF simulée.")} className="px-4 py-2 text-sm font-semibold bg-gray-600 text-white rounded-md hover:bg-gray-700">Exporter (PDF)</button>
                 <button onClick={() => alert("Exportation Excel simulée.")} className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-md hover:bg-green-700">Exporter (Excel)</button>
            </div>
        </div>
    </div>
);

const ReportsView: React.FC<{
    reports: Task[],
    agents: Agent[],
    statusFilter: string,
    setStatusFilter: (s: TaskStatus | 'all') => void,
    agentFilter: string,
    setAgentFilter: (s: string | 'all') => void,
    onOpenReportModal: (task: Task) => void,
}> = ({ reports, agents, statusFilter, setStatusFilter, agentFilter, setAgentFilter, onOpenReportModal }) => {
    
    const getAgentName = (agentId?: string) => agents.find(a => a.id === agentId)?.name || 'Non assigné';
    
    return (
    <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-wrap gap-4 mb-4">
            <div>
                <label className="text-sm font-medium text-gray-700">Filtrer par statut:</label>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as TaskStatus | 'all')} className="ml-2 rounded-md border-gray-300 shadow-sm">
                    <option value="all">Tous</option>
                    <option value="en attente">En attente</option>
                    <option value="en cours">En cours</option>
                    <option value="terminé">Terminé</option>
                </select>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-700">Filtrer par agent:</label>
                <select value={agentFilter} onChange={e => setAgentFilter(e.target.value)} className="ml-2 rounded-md border-gray-300 shadow-sm">
                    <option value="all">Tous</option>
                    {agents.map(agent => <option key={agent.id} value={agent.id}>{agent.name}</option>)}
                </select>
            </div>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
           <thead className="bg-gray-50">
               <tr>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adresse</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent Assigné</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
               </tr>
           </thead>
           <tbody>
               {reports.map((report, idx) => (
                   <tr key={report.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.address}</td>
                       <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusChipClass(report.status)}`}>{report.status}</span></td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getAgentName(report.assignedAgentId)}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                           <button onClick={() => onOpenReportModal(report)} className="text-indigo-600 hover:text-indigo-900">Détails</button>
                       </td>
                   </tr>
               ))}
           </tbody>
       </table>
    </div>
    )
};

const AgentsView: React.FC<{agents: Agent[], onAddAgent: () => void, onEditAgent: (agent: Agent) => void, onDeleteAgent: (agentId: string) => void}> = ({agents, onAddAgent, onEditAgent, onDeleteAgent}) => (
    <div className="bg-white shadow-md rounded-lg p-6">
       <div className="flex justify-end mb-4">
           <button onClick={onAddAgent} className="px-4 py-2 text-sm font-semibold bg-purple-600 text-white rounded-md hover:bg-purple-700">Ajouter un agent</button>
       </div>
       <table className="min-w-full divide-y divide-gray-200">
           <thead className="bg-gray-50">
               <tr>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Zone</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
               </tr>
           </thead>
           <tbody>
               {agents.map((agent, idx) => (
                   <tr key={agent.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{agent.name}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.zone}</td>
                       <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusChipClass(agent.status)}`}>{agent.status}</span></td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                           <button onClick={() => onEditAgent(agent)} className="text-indigo-600 hover:text-indigo-900">Modifier</button>
                           <button onClick={() => onDeleteAgent(agent.id)} className="text-red-600 hover:text-red-900">Supprimer</button>
                       </td>
                   </tr>
               ))}
           </tbody>
       </table>
    </div>
);

const CampaignsView: React.FC<{campaigns: Campaign[], onCreateCampaign: () => void, participants: CampaignParticipant[], setParticipants: React.Dispatch<React.SetStateAction<CampaignParticipant[]>>}> = ({ campaigns, onCreateCampaign, participants, setParticipants }) => {
    const [activeSubTab, setActiveSubTab] = useState('list');
    
    const approveParticipant = (id: string) => {
        setParticipants(prev => prev.map(p => p.id === id ? {...p, status: 'approuvé'} : p));
    }
    
    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <div className="border-b mb-4">
                <nav className="-mb-px flex space-x-6">
                    <button onClick={() => setActiveSubTab('list')} className={`py-2 px-1 font-medium ${activeSubTab === 'list' ? 'text-purple-600 border-b-2 border-purple-500' : 'text-gray-500'}`}>Gérer les Campagnes</button>
                    <button onClick={() => setActiveSubTab('participants')} className={`py-2 px-1 font-medium ${activeSubTab === 'participants' ? 'text-purple-600 border-b-2 border-purple-500' : 'text-gray-500'}`}>Gérer les Participations</button>
                </nav>
            </div>

            {activeSubTab === 'list' && (
            <div>
                <div className="flex justify-end mb-4">
                    <button onClick={onCreateCampaign} className="px-4 py-2 text-sm font-semibold bg-purple-600 text-white rounded-md hover:bg-purple-700">Créer une campagne</button>
                </div>
                 {campaigns.map(c => <div key={c.id} className="p-4 border rounded-md mb-2">{c.title} - <span className="text-sm text-gray-600">{c.date}</span></div>)}
            </div>
            )}
            
            {activeSubTab === 'participants' && (
            <div>
                 <h4 className="text-lg font-bold mb-2">Demandes de participation en attente</h4>
                {participants.filter(p => p.status === 'en attente').map(p => (
                    <div key={p.id} className="flex items-center justify-between p-2 border-b">
                        <div className="flex items-center space-x-2">
                           <img src={p.userAvatar} className="h-8 w-8 rounded-full" />
                           <div>
                                <p className="text-sm font-semibold">{p.userName}</p>
                                <p className="text-xs text-gray-500">{p.campaignTitle}</p>
                           </div>
                        </div>
                        <button onClick={() => approveParticipant(p.id)} className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full hover:bg-green-200">Approuver</button>
                    </div>
                ))}
                 {participants.filter(p => p.status === 'en attente').length === 0 && <p className="text-sm text-gray-500">Aucune demande en attente.</p>}
            </div>
            )}
        </div>
    )
};

const ZonesView: React.FC<{
    zones: Zone[],
    agents: Agent[],
    setAgents: React.Dispatch<React.SetStateAction<Agent[]>>,
    onAddZone: () => void,
}> = ({ zones, agents, setAgents, onAddZone }) => {
    
    const handleAssignAgent = (zoneName: string, newAgentId: string) => {
        setAgents(prevAgents => {
             if (prevAgents.find(a => a.id === newAgentId && a.zone === zoneName)) {
                return prevAgents;
            }
            return prevAgents.map(agent => {
                if (agent.id === newAgentId) {
                    return { ...agent, zone: zoneName };
                }
                if (agent.zone === zoneName) {
                    return { ...agent, zone: 'Non assigné' };
                }
                return agent;
            });
        });
    };

    return (
         <div className="bg-white shadow-md rounded-lg p-6">
           <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold">Affecter les Agents aux Zones</h3>
                    <p className="text-sm text-gray-600 mt-1">Assignez un agent à chaque zone de collecte. Un agent ne peut être assigné qu'à une seule zone.</p>
                </div>
                <button 
                    onClick={onAddZone} 
                    className="mt-4 md:mt-0 px-4 py-2 text-sm font-semibold bg-purple-600 text-white rounded-md hover:bg-purple-700 w-full md:w-auto">
                    Ajouter une zone
                </button>
            </div>
           <div className="space-y-4">
            {zones.map(zone => {
                const assignedAgent = agents.find(agent => agent.zone === zone.name);
                const availableAgents = agents.filter(a => a.status === 'disponible' || a.id === assignedAgent?.id);
                return (
                    <div key={zone.id} className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50">
                        <div>
                            <p className="font-bold text-gray-800 text-lg">{zone.name}</p>
                            <p className="text-sm text-gray-500">{zone.recyclingCenter || 'Aucun centre de recyclage'}</p>
                        </div>
                        <div className="flex items-center space-x-3 mt-3 md:mt-0">
                             <label htmlFor={`agent-select-${zone.id}`} className="text-sm font-medium text-gray-700">Agent :</label>
                             <select
                                id={`agent-select-${zone.id}`}
                                value={assignedAgent?.id || ''}
                                onChange={(e) => handleAssignAgent(zone.name, e.target.value)}
                                className="w-full md:w-auto mt-1 md:mt-0 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                             >
                                <option value="">-- Aucun --</option>
                                {availableAgents.map(agent => (
                                    <option key={agent.id} value={agent.id}>{agent.name}</option>
                                ))}
                             </select>
                        </div>
                    </div>
                )
            })}
           </div>
        </div>
    );
};
const CommunityView: React.FC<{
    citizens: User[];
    rewards: Reward[];
    ecoPointsRules: EcoPointsRules;
    setRewards: React.Dispatch<React.SetStateAction<Reward[]>>;
    setEcoPointsRules: React.Dispatch<React.SetStateAction<EcoPointsRules>>;
}> = ({ citizens, rewards, ecoPointsRules, setRewards, setEcoPointsRules }) => {
    const [activeSubTab, setActiveSubTab] = useState('leaderboard');
    const [rewardModal, setRewardModal] = useState<{isOpen: boolean, reward: Reward | null}>({isOpen: false, reward: null});

    const sortedCitizens = useMemo(() => 
        citizens.filter(c => c.role === 'citizen' && c.ecoPoints)
                .sort((a, b) => (b.ecoPoints || 0) - (a.ecoPoints || 0))
                .map((c, index) => ({...c, rank: index + 1})), 
        [citizens]
    );

    const handleSaveReward = (reward: Reward) => {
        if (reward.id) { // Update
            setRewards(prev => prev.map(r => r.id === reward.id ? reward : r));
        } else { // Create
            setRewards(prev => [...prev, { ...reward, id: `RWD${Date.now()}` }]);
        }
        setRewardModal({isOpen: false, reward: null});
    };

    const handleDeleteReward = (rewardId: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette récompense ?")) {
            setRewards(prev => prev.filter(r => r.id !== rewardId));
        }
    };
    
    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            {rewardModal.isOpen && <RewardModal reward={rewardModal.reward} onSave={handleSaveReward} onClose={() => setRewardModal({isOpen: false, reward: null})} />}
            <div className="border-b mb-4">
                <nav className="-mb-px flex space-x-6">
                    <button onClick={() => setActiveSubTab('leaderboard')} className={`py-2 px-1 font-medium ${activeSubTab === 'leaderboard' ? 'text-purple-600 border-b-2 border-purple-500' : 'text-gray-500 hover:text-gray-600'}`}>Classement et Récompenses</button>
                    <button onClick={() => setActiveSubTab('rules')} className={`py-2 px-1 font-medium ${activeSubTab === 'rules' ? 'text-purple-600 border-b-2 border-purple-500' : 'text-gray-500 hover:text-gray-600'}`}>Règles d'Attribution</button>
                </nav>
            </div>
            
            {activeSubTab === 'leaderboard' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-lg font-bold mb-2">Classement Communautaire</h4>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rang</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Citoyen</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Éco-points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedCitizens.slice(0, 10).map((c, idx) => (
                                <tr key={c.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-4 py-2 font-bold">{c.rank}</td>
                                    <td className="px-4 py-2 text-sm">{c.name}</td>
                                    <td className="px-4 py-2 text-sm font-semibold text-purple-600">{c.ecoPoints}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                           <h4 className="text-lg font-bold">Catalogue des Récompenses</h4>
                           <button onClick={() => setRewardModal({isOpen: true, reward: null})} className="px-3 py-1 text-xs font-semibold bg-purple-600 text-white rounded-md hover:bg-purple-700">Ajouter</button>
                        </div>
                         <div className="space-y-2">
                            {rewards.map(reward => (
                                <div key={reward.id} className="p-3 border rounded-md flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{reward.name} - <span className="text-purple-600">{reward.cost} pts</span></p>
                                        <p className="text-xs text-gray-500">{reward.description}</p>
                                    </div>
                                    <div className="space-x-2">
                                        <button onClick={() => setRewardModal({isOpen: true, reward})} className="text-gray-400 hover:text-indigo-600">&#9998;</button>
                                        <button onClick={() => handleDeleteReward(reward.id)} className="text-gray-400 hover:text-red-600">&times;</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeSubTab === 'rules' && <EcoPointsRulesForm rules={ecoPointsRules} setRules={setEcoPointsRules} />}
        </div>
    );
};

const GuidesView: React.FC<{
    guides: Guide[], 
    onAddGuide: () => void, 
    onEditGuide: (guide: Guide) => void, 
    onDeleteGuide: (id: string) => void
}> = ({ guides, onAddGuide, onEditGuide, onDeleteGuide }) => (
    <div className="bg-white shadow-md rounded-lg p-6">
       <div className="flex justify-end mb-4">
           <button onClick={onAddGuide} className="px-4 py-2 text-sm font-semibold bg-purple-600 text-white rounded-md hover:bg-purple-700">Ajouter un guide/tutoriel</button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {guides.map((guide) => (
               <div key={guide.id} className="border rounded-lg overflow-hidden flex flex-col">
                   <img src={guide.thumbnailUrl} alt={guide.title} className="h-40 w-full object-cover" />
                   <div className="p-4 flex-grow">
                       <span className={`text-xs font-semibold inline-block py-1 px-2.5 uppercase rounded-full ${guide.type === 'link' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                           {guide.type === 'link' ? 'Lien' : 'Fichier'}
                       </span>
                       <h4 className="font-bold text-md mt-2">{guide.title}</h4>
                       <p className="text-sm text-gray-600 mt-1">{guide.description}</p>
                   </div>
                   <div className="p-4 bg-gray-50 border-t flex justify-end space-x-2">
                       <button onClick={() => onEditGuide(guide)} className="text-sm text-indigo-600 hover:text-indigo-900">Modifier</button>
                       <button onClick={() => onDeleteGuide(guide.id)} className="text-sm text-red-600 hover:text-red-900">Supprimer</button>
                   </div>
               </div>
           ))}
       </div>
       {guides.length === 0 && <p className="text-center text-gray-500 py-8">Aucun guide n'a été publié.</p>}
    </div>
);


const EcoPointsRulesForm: React.FC<{rules: EcoPointsRules, setRules: (rules: EcoPointsRules) => void}> = ({ rules, setRules }) => {
    const [formData, setFormData] = useState(rules);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: parseInt(e.target.value) || 0 }));
    };

    const handleSave = () => {
        setRules(formData);
        alert("Règles sauvegardées !");
    };

    return (
        <div>
            <h4 className="text-lg font-bold mb-4">Définir les règles de points</h4>
            <div className="max-w-md space-y-4">
                <InputField type="number" label="Points par signalement validé" name="report" value={formData.report} onChange={handleChange} />
                <InputField type="number" label="Points par participation à une campagne" name="campaignParticipation" value={formData.campaignParticipation} onChange={handleChange} />
                <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold bg-purple-600 text-white rounded-md hover:bg-purple-700">Sauvegarder les règles</button>
            </div>
        </div>
    );
};


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

    if (!currentUser) return <div>Chargement...</div>;

    return (
        <div className="bg-white shadow-md rounded-lg h-[32rem] flex overflow-hidden">
            <div className="w-1/3 border-r flex flex-col">
                <div className="p-4 border-b"><h4 className="font-bold text-lg">Conversations</h4></div>
                <ul className="overflow-y-auto">
                    {conversations.map(({ user, lastMessage, unreadCount }) => (
                        <li key={user.id} onClick={() => setSelectedConversationId(user.id)}
                            className={`p-3 flex items-center space-x-3 cursor-pointer border-l-4 ${selectedConversationId === user.id ? 'bg-purple-50 border-purple-500' : 'border-transparent hover:bg-gray-50'}`}>
                            <img src={user.avatarUrl} alt={user.name} className="h-12 w-12 rounded-full" />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                                    <p className="text-xs text-gray-400">{lastMessage.timestamp}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                   <p className="text-sm text-gray-500 truncate">{lastMessage.text}</p>
                                   {unreadCount > 0 && <span className="ml-2 bg-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{unreadCount}</span>}
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
                                    <div className={`px-4 py-2 rounded-2xl max-w-sm ${msg.senderId === currentUser.id ? 'bg-purple-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                       <p className="text-sm">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
                            <div className="flex items-center space-x-3">
                                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Écrire un message..." className="w-full p-2 border border-gray-300 rounded-full focus:ring-purple-500 focus:border-purple-500" />
                                <button type="submit" className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 disabled:bg-gray-400" disabled={!newMessage.trim()}>
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


// MODALS
const AgentModal: React.FC<{agent: Agent | null, onSave: (agent: Agent) => void, onClose: () => void}> = ({ agent, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<Agent, 'id'>>(agent || { name: '', zone: '', status: 'disponible', vehicle: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: agent?.id || '' });
    };

    return (
        <Modal title={agent ? "Modifier l'agent" : "Ajouter un agent"} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <InputField label="Nom" name="name" value={formData.name} onChange={handleChange} />
                    <InputField label="Zone" name="zone" value={formData.zone} onChange={handleChange} />
                    <InputField label="Véhicule" name="vehicle" value={formData.vehicle} onChange={handleChange} />
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Statut</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                            <option value="disponible">Disponible</option>
                            <option value="en mission">En mission</option>
                            <option value="hors service">Hors service</option>
                        </select>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Annuler</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700">Sauvegarder</button>
                </div>
            </form>
        </Modal>
    );
};

const CampaignModal: React.FC<{onSave: (data: Omit<Campaign, 'id' | 'participants'>) => void, onClose: () => void}> = ({ onSave, onClose }) => {
    const [formData, setFormData] = useState({ 
        title: '', 
        description: '', 
        date: '', 
        location: '',
        ecoPointsReward: 50,
        imageUrl: ''
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'number' ? parseInt(value, 10) || 0 : value 
        }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setFormData(prev => ({...prev, imageUrl: result}));
                setImagePreview(result);
            };
            reader.readAsDataURL(file);
        } else {
            setFormData(prev => ({...prev, imageUrl: ''}));
            setImagePreview(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.imageUrl) {
            alert("Veuillez ajouter une image pour la campagne.");
            return;
        }
        onSave(formData);
    }
    
    return (
         <Modal title="Créer une nouvelle campagne" onClose={onClose}>
             <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-4 md:col-span-1">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image de la campagne</label>
                         <div 
                            className="aspect-video mt-1 flex justify-center items-center border-2 border-gray-300 border-dashed rounded-md cursor-pointer relative bg-gray-50"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="Aperçu" className="absolute h-full w-full object-cover rounded-md" />
                            ) : (
                                <div className="space-y-1 text-center p-4">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    <p className="text-xs text-gray-500">Cliquez pour choisir</p>
                                </div>
                            )}
                            <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                        </div>
                    </div>
                 </div>
                 <div className="space-y-4 md:col-span-1">
                     <InputField label="Titre" name="title" value={formData.title} onChange={handleChange} />
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"></textarea>
                    </div>
                     <InputField label="Date et Heure" name="date" type="datetime-local" value={formData.date} onChange={handleChange} />
                     <InputField label="Lieu" name="location" value={formData.location} onChange={handleChange} />
                     <InputField label="Éco-points à gagner" name="ecoPointsReward" type="number" min="0" value={formData.ecoPointsReward} onChange={handleChange} />
                 </div>
                 <div className="md:col-span-2 mt-2 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Annuler</button>
                    <button type="submit" disabled={!formData.imageUrl} className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 disabled:bg-gray-400">Créer</button>
                </div>
             </form>
         </Modal>
    );
}

const RewardModal: React.FC<{reward: Reward | null, onSave: (reward: Reward) => void, onClose: () => void}> = ({ reward, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<Reward, 'id'>>(reward || { name: '', description: '', cost: 100 });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({...prev, [name]: type === 'number' ? parseInt(value) || 0 : value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: reward?.id || '' });
    };
    
    return (
        <Modal title={reward ? "Modifier la récompense" : "Ajouter une récompense"} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <InputField label="Nom" name="name" value={formData.name} onChange={handleChange} />
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"></textarea>
                    </div>
                    <InputField label="Coût (éco-points)" name="cost" type="number" min="0" value={formData.cost} onChange={handleChange} />
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Annuler</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700">Sauvegarder</button>
                </div>
            </form>
        </Modal>
    );
};

const ReportModal: React.FC<{task: Task, agents: Agent[], onAssign: (taskId: string, agentId: string) => void, onClose: () => void}> = ({ task, agents, onAssign, onClose }) => {
    const [selectedAgentId, setSelectedAgentId] = useState(task.assignedAgentId || '');

    return (
        <Modal title="Détails du Signalement" onClose={onClose}>
            <div className="space-y-3 text-sm">
                <p><span className="font-semibold">ID:</span> {task.id}</p>
                <p><span className="font-semibold">Adresse:</span> {task.address}</p>
                <p><span className="font-semibold">Type:</span> {task.type} {task.wasteType && `(${task.wasteType})`}</p>
                <p><span className="font-semibold">Date:</span> {task.date}</p>
                <p><span className="font-semibold">Statut:</span> <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusChipClass(task.status)}`}>{task.status}</span></p>
            </div>
            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">Assigner / Réassigner un agent</label>
                <select value={selectedAgentId} onChange={(e) => setSelectedAgentId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                    <option value="">-- Choisir un agent --</option>
                    {agents.filter(a => a.status === 'disponible' || a.id === task.assignedAgentId).map(agent => (
                        <option key={agent.id} value={agent.id}>{agent.name} ({agent.zone})</option>
                    ))}
                </select>
            </div>
             <div className="mt-6 flex justify-end space-x-2">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Annuler</button>
                <button onClick={() => onAssign(task.id, selectedAgentId)} disabled={!selectedAgentId} className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 disabled:bg-gray-400">Assigner</button>
            </div>
        </Modal>
    )
}

const ZoneModal: React.FC<{zone: Zone | null, onSave: (zone: Omit<Zone, 'id'>) => void, onClose: () => void}> = ({ zone, onSave, onClose }) => {
    const [formData, setFormData] = useState({ name: zone?.name || '', recyclingCenter: zone?.recyclingCenter || '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal title={zone ? "Modifier la zone" : "Ajouter une nouvelle zone"} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <InputField label="Nom de la zone" name="name" value={formData.name} onChange={handleChange} />
                    <InputField label="Centre de recyclage" name="recyclingCenter" value={formData.recyclingCenter} onChange={handleChange} />
                </div>
                 <div className="mt-6 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Annuler</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700">Sauvegarder</button>
                </div>
            </form>
        </Modal>
    )
}

const GuideModal: React.FC<{
    guide: Guide | null, 
    onSave: (guide: Guide) => void, 
    onClose: () => void
}> = ({ guide, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<Guide, 'id'>>(guide || { 
        title: '', 
        description: '', 
        type: 'link', 
        url: '',
        fileName: '',
        thumbnailUrl: '',
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'file' | 'thumbnail') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                if (field === 'file') {
                    setFormData(prev => ({...prev, url: result, fileName: file.name}));
                } else {
                    setFormData(prev => ({...prev, thumbnailUrl: result}));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.thumbnailUrl) {
            alert("Veuillez ajouter une image miniature.");
            return;
        }
        if (formData.type === 'link' && !formData.url) {
            alert("Veuillez fournir une URL pour le lien.");
            return;
        }
        if (formData.type === 'file' && !formData.fileName) {
            alert("Veuillez téléverser un fichier.");
            return;
        }
        onSave({ ...formData, id: guide?.id || '' });
    };

    return (
        <Modal title={guide ? "Modifier le guide" : "Ajouter un guide"} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField label="Titre" name="title" value={formData.title} onChange={handleChange} />
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" required></textarea>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Image miniature</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'thumbnail')} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
                    {formData.thumbnailUrl && <img src={formData.thumbnailUrl} alt="Aperçu" className="mt-2 h-24 w-auto rounded" />}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Type de contenu</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                        <option value="link">Lien (ex: YouTube, article)</option>
                        <option value="file">Fichier (ex: PDF)</option>
                    </select>
                </div>

                {formData.type === 'link' ? (
                    <InputField label="URL du lien" name="url" value={formData.url || ''} onChange={handleChange} placeholder="https://..." />
                ) : (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Téléverser le fichier</label>
                         <input type="file" onChange={(e) => handleFileChange(e, 'file')} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
                         {formData.fileName && <p className="text-sm text-gray-500 mt-1">Fichier actuel: {formData.fileName}</p>}
                    </div>
                )}

                <div className="mt-6 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Annuler</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700">Sauvegarder</button>
                </div>
            </form>
        </Modal>
    )
};

const InputField: React.FC<{label: string, name: string, value: string | number, onChange: (e: any) => void, placeholder?: string, type?: string, min?: string}> = ({ label, name, value, onChange, placeholder, type = 'text', min }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} min={min} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" required />
    </div>
);


export default ManagerDashboard;