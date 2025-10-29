
import React, { useState } from 'react';
import Header from './components/Header';
import MapSection from './components/MapSection';
import WasteTypesSection from './components/WasteTypesSection';
import GuidesSection from './components/GuidesSection';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import AgentDashboard from './components/AgentDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import AuthModal from './components/AuthModal';
import { useAuth } from './contexts/AuthContext';
import CommunityFeed from './components/CommunityFeed';
import { CITIZENS_DATA, INITIAL_REWARDS, INITIAL_ECO_POINTS_RULES, USERS_DATA, MESSAGES_DATA, INITIAL_ZONES, INITIAL_GUIDES } from './constants';
import type { Task, Agent, Campaign, CampaignParticipant, User, Reward, EcoPointsRules, Message, Zone, Guide } from './types';

// Initial data moved here to be managed as global state
const initialTasks: Task[] = [
    { id: 'T01', type: 'Signalement', address: 'Rue 10, Point E', status: 'en attente', date: '2024-07-29', assignedAgentId: 'AG-104', location: { lat: 14.711, lon: -17.472 } },
    { id: 'T02', type: 'Ramassage', address: 'Avenue Cheikh Anta Diop', wasteType: 'Électroniques', status: 'en attente', date: '2024-07-29', location: { lat: 14.693, lon: -17.463 }, quantity: '1 TV, 2 ordinateurs' },
    { id: 'T03', type: 'Ramassage', address: 'Liberté 6', wasteType: 'Verres', status: 'en cours', date: '2024-07-29', assignedAgentId: 'AG-102', location: { lat: 14.723, lon: -17.478 }, quantity: '3 caisses' },
    { id: 'T04', type: 'Signalement', address: 'Plage de Yoff', status: 'terminé', date: '2024-07-28', assignedAgentId: 'AG-103', location: { lat: 14.757, lon: -17.492 } },
    { id: 'R01', type: 'Signalement', address: 'Canal IV, Grand Yoff', status: 'en attente', date: '2024-07-29', location: { lat: 14.722, lon: -17.471 } },
    { id: 'R02', type: 'Signalement', address: 'Près du marché Sandaga', status: 'en attente', date: '2024-07-29', assignedAgentId: 'AG-102', location: { lat: 14.673, lon: -17.436 }, quantity: 'Plusieurs sacs' },
    { id: 'R03', type: 'Signalement', address: 'Cité Keur Gorgui', status: 'en cours', assignedAgentId: 'AG-101', date: '2024-07-28', location: { lat: 14.71, lon: -17.46 } },
];

const initialAgents: Agent[] = [
    { id: 'AG-101', name: 'Fatou Ndiaye', zone: 'Parcelles Assainies', status: 'en mission', vehicle: 'T-01A', email: 'fatou.ndiaye@agent.com' },
    { id: 'AG-102', name: 'Moussa Diop', zone: 'Médina', status: 'disponible', vehicle: 'T-02B', email: 'moussa.diop@agent.com' },
    { id: 'AG-103', name: 'Ousmane Fall', zone: 'Yoff', status: 'hors service', vehicle: 'T-03C', email: 'ousmane.fall@agent.com' },
    { id: 'AG-104', name: 'Khadija Gueye', zone: 'Point E', status: 'disponible', vehicle: 'T-04D', email: 'khadija.gueye.agent@example.com' },
];

const initialCampaigns: Campaign[] = [
    {
        id: 'C01',
        title: 'Nettoyage de la plage de Yoff',
        description: 'Rejoignez-nous pour une journée de nettoyage communautaire pour préserver la beauté de notre littoral. Gants et sacs fournis.',
        date: 'Samedi 10 Août 2024 - 9h00',
        location: 'Plage de Yoff',
        participants: 78,
        imageUrl: 'https://picsum.photos/seed/beachcleanup/800/400',
        ecoPointsReward: 150
    },
    {
        id: 'C02',
        title: 'Atelier de compostage à Grand-Dakar',
        description: 'Apprenez à transformer vos déchets organiques en ressource pour votre jardin. Un atelier pratique ouvert à tous.',
        date: 'Dimanche 18 Août 2024 - 10h30',
        location: 'Maison de la communauté, Grand-Dakar',
        participants: 35,
        imageUrl: 'https://picsum.photos/seed/compost/800/400',
        ecoPointsReward: 100
    }
];

const App: React.FC = () => {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Centralized state
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [campaignParticipants, setCampaignParticipants] = useState<CampaignParticipant[]>([]);
  const [citizens, setCitizens] = useState<User[]>(CITIZENS_DATA);
  const [rewards, setRewards] = useState<Reward[]>(INITIAL_REWARDS);
  const [ecoPointsRules, setEcoPointsRules] = useState<EcoPointsRules>(INITIAL_ECO_POINTS_RULES);
  const [users, setUsers] = useState<User[]>(USERS_DATA);
  const [messages, setMessages] = useState<Message[]>(MESSAGES_DATA);
  const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);
  const [guides, setGuides] = useState<Guide[]>(INITIAL_GUIDES);


  const handleRequestPickup = (newTask: Omit<Task, 'id' | 'status' | 'date'>) => {
      const citizenZone = user?.zone;
      const agentInZone = agents.find(agent => agent.zone === citizenZone && agent.status === 'disponible');

      const fullTask: Task = {
          ...newTask,
          id: `T${Date.now()}`,
          status: 'en attente',
          date: new Date().toISOString().split('T')[0],
          assignedAgentId: agentInZone?.id, // Auto-assign if available
      };
      setTasks(prev => [...prev, fullTask]);
      return !!agentInZone;
  };

  const handleCampaignRegistration = (participant: Omit<CampaignParticipant, 'id' | 'status'>) => {
      const newParticipant: CampaignParticipant = {
          ...participant,
          id: `P${Date.now()}`,
          status: 'en attente',
      };
      setCampaignParticipants(prev => [...prev, newParticipant]);
  };

  const handleSendMessage = (receiverId: string, text: string) => {
    if (!user) return;

    const newMessage: Message = {
      id: `MSG-${Date.now()}`,
      senderId: user.id,
      receiverId,
      text,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    
    setMessages(prev => [...prev, newMessage]);
  };


  const renderDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case 'citizen':
        return <Dashboard 
                    onRequestPickup={handleRequestPickup} 
                    onCampaignRegister={handleCampaignRegistration} 
                    campaigns={campaigns} 
                    users={users}
                    messages={messages}
                    setMessages={setMessages}
                    handleSendMessage={handleSendMessage}
                />;
      case 'agent':
        // Pass only tasks relevant to the agent
        const agentTasks = tasks.filter(task => task.assignedAgentId === user.agentId);
        return <AgentDashboard 
                    agentTasks={agentTasks} 
                    setTasks={setTasks} 
                    users={users}
                    messages={messages}
                    setMessages={setMessages}
                    handleSendMessage={handleSendMessage}
                />;
      case 'manager':
        return <ManagerDashboard 
                    allTasks={tasks} 
                    allAgents={agents} 
                    allCampaigns={campaigns}
                    setAllTasks={setTasks} 
                    setAllAgents={setAgents}
                    setAllCampaigns={setCampaigns}
                    participants={campaignParticipants}
                    setParticipants={setCampaignParticipants}
                    citizens={citizens}
                    rewards={rewards}
                    ecoPointsRules={ecoPointsRules}
                    setRewards={setRewards}
                    setEcoPointsRules={setEcoPointsRules}
                    users={users}
                    setUsers={setUsers}
                    messages={messages}
                    setMessages={setMessages}
                    handleSendMessage={handleSendMessage}
                    allZones={zones}
                    setAllZones={setZones}
                    guides={guides}
                    setGuides={setGuides}
                />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans text-gray-800">
      <Header onLoginClick={() => setIsAuthModalOpen(true)} />
      <main className="flex-grow">
        {user ? (
          renderDashboard()
        ) : (
          <>
            <MapSection />
            <WasteTypesSection zones={zones} />
            <CommunityFeed />
            <GuidesSection guides={guides} />
          </>
        )}
      </main>
      <Footer />
      {isAuthModalOpen && !user && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </div>
  );
};

export default App;