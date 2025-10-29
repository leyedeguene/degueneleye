
import React from 'react';
import type { WasteType, FeedItem, User, Reward, EcoPointsRules, Message, Zone, Guide } from './types';

const PaperIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15 4H5v16h14V8h-4V4zM5 2h10l4 4v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm5 14H7v-2h3v2zm5-4H7v-2h8v2zm0-4H7V8h8v2z"></path></svg>
);

const GlassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11 2v3.31A6.99 6.99 0 0 0 5.31 11H2v2h3.31A6.99 6.99 0 0 0 11 18.69V22h2v-3.31A6.99 6.99 0 0 0 18.69 13H22v-2h-3.31A6.99 6.99 0 0 0 13 5.31V2h-2zm-1.04 5A5 5 0 0 1 15 12a5 5 0 0 1-5.04 5A5 5 0 0 1 5 12a5 5 0 0 1 4.96-5z"></path></svg>
);

const PlasticIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.868 14.39A2.5 2.5 0 0 0 17.5 10h-11a2.5 2.5 0 0 0-1.368 4.39L6.5 16h11l1.368-1.61zM14 6l-1-3H7L6 6h8z"></path></svg>
);

const OrganicIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c0-2.3-1.6-4.2-3.8-4.8l.5-1.6c.1-.5-.3-1-.8-1s-1 .3-1 .8l-.5 1.6C8.2 6.8 6.6 8.7 6.6 11v7.4c0 .9.7 1.6 1.6 1.6h7.6c.9 0 1.6-.7 1.6-1.6V11zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"></path></svg>
);

const ElectronicIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10v2H7zM7 20h10v2H7zM4 6h16v12H4zM12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path></svg>
);

const MetallicIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 3h12v2H6zm12 4H6v12h12V7zm-2 10H8v-8h8v8z"></path></svg>
);


export const WASTE_TYPES: WasteType[] = [
  { name: 'Papiers', icon: PaperIcon, color: 'text-blue-500', bgColor: 'bg-blue-100' },
  { name: 'Verres', icon: GlassIcon, color: 'text-green-500', bgColor: 'bg-green-100' },
  { name: 'Plastiques', icon: PlasticIcon, color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
  { name: 'Organiques', icon: OrganicIcon, color: 'text-orange-500', bgColor: 'bg-orange-100' },
  { name: 'Électroniques', icon: ElectronicIcon, color: 'text-red-500', bgColor: 'bg-red-100' },
  { name: 'Métalliques', icon: MetallicIcon, color: 'text-gray-500', bgColor: 'bg-gray-200' },
];

export const FEED_ITEMS: FeedItem[] = [
    {
        id: 'F01',
        type: 'report',
        author: { name: 'Mariama Diallo', avatarUrl: 'https://i.pravatar.cc/48?u=mariama' },
        timestamp: 'il y a 2 heures',
        imageUrl: 'https://picsum.photos/seed/dumping1/600/400',
        location: 'Rue 12, Médina',
        description: 'Dépôt sauvage signalé près de l\'école. Principalement des sacs plastiques et des cartons.',
        likes: 15,
        comments: [
            { id: 'C1', author: { name: 'Moussa Diop' }, text: 'Merci pour le signalement ! Une équipe est prévenue.' }
        ]
    },
    {
        id: 'F02',
        type: 'campaign',
        author: { name: 'Aïssatou Ba', avatarUrl: 'https://i.pravatar.cc/48?u=aissatou' },
        timestamp: 'hier',
        imageUrl: 'https://picsum.photos/seed/beachcleanup/800/400',
        location: 'Plage de Yoff',
        title: 'Campagne à venir: Nettoyage de la plage de Yoff',
        description: 'Rejoignez-nous ce samedi pour rendre notre belle plage encore plus propre ! Tous les volontaires sont les bienvenus.',
        likes: 128,
        comments: [
            { id: 'C2', author: { name: 'Amadou Sow' }, text: 'Super initiative ! J\'en serai.' },
            { id: 'C3', author: { name: 'Fatou Ndiaye' }, text: 'Comptez sur moi !' }
        ]
    },
    {
        id: 'F03',
        type: 'report',
        author: { name: 'Demba Fall', avatarUrl: 'https://i.pravatar.cc/48?u=demba' },
        timestamp: 'il y a 3 jours',
        imageUrl: 'https://picsum.photos/seed/dumping2/600/400',
        location: 'Canal, Liberté 6',
        description: 'Beaucoup de gravats et de déchets de construction abandonnés ici. Attention.',
        likes: 42,
        comments: []
    }
];

export const CITIZENS_DATA: User[] = [
    { id: 'CIT-002', name: 'Mariama Diallo', email: 'mariama.diallo@example.com', role: 'citizen', ecoPoints: 2100, avatarUrl: 'https://i.pravatar.cc/48?u=mariama', zone: 'Yoff' },
    { id: 'CIT-001', name: 'Amadou Sow', email: 'amadou.sow@example.com', role: 'citizen', ecoPoints: 1250, avatarUrl: 'https://i.pravatar.cc/48?u=amadou', zone: 'Médina' },
    { id: 'CIT-003', name: 'Demba Fall', email: 'demba.fall@example.com', role: 'citizen', ecoPoints: 980, avatarUrl: 'https://i.pravatar.cc/48?u=demba', zone: 'Liberté 6' },
    { id: 'CIT-004', name: 'Khadija Gueye', email: 'khadija.gueye@example.com', role: 'citizen', ecoPoints: 750, avatarUrl: 'https://i.pravatar.cc/48?u=khadija', zone: 'Point E' },
    { id: 'CIT-005', name: 'Ousmane Fall', email: 'ousmane.fall@example.com', role: 'citizen', ecoPoints: 520, avatarUrl: 'https://i.pravatar.cc/48?u=ousmane', zone: 'Yoff' },
];

export const INITIAL_REWARDS: Reward[] = [
    { id: 'RWD01', name: 'Bon de réduction de 5€', description: 'Valable chez nos partenaires locaux.', cost: 500 },
    { id: 'RWD02', name: '1 Arbre planté', description: 'Nous plantons un arbre en votre nom au Sénégal.', cost: 1000 },
    { id: 'RWD03', name: 'Kit de recyclage', description: 'Un kit complet pour bien démarrer le tri à la maison.', cost: 1500 },
];

export const INITIAL_ECO_POINTS_RULES: EcoPointsRules = {
    report: 50,
    campaignParticipation: 150,
};

export const INITIAL_ZONES: Zone[] = [
    { id: 'Z01', name: 'Médina', recyclingCenter: 'Centre de tri de la Médina' },
    { id: 'Z02', name: 'Yoff', recyclingCenter: 'Point de collecte Yoff Océan' },
    { id: 'Z03', name: 'Liberté 6', recyclingCenter: 'Centre de tri Liberté 6' },
    { id: 'Z04', name: 'Point E', recyclingCenter: 'Recyclage Point E' },
    { id: 'Z05', name: 'Parcelles Assainies', recyclingCenter: 'Dépôt PA' },
    { id: 'Z06', name: 'Grand Yoff', recyclingCenter: 'Centre de Grand Yoff' },
];

export const INITIAL_GUIDES: Guide[] = [
    {
        id: 'G01',
        title: 'Le guide complet du compostage à domicile',
        description: 'Apprenez à transformer vos déchets organiques en un riche compost pour vos plantes. Un geste simple pour la planète et votre jardin.',
        type: 'link',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Example link
        thumbnailUrl: 'https://picsum.photos/seed/recycle/800/450',
    },
    {
        id: 'G02',
        title: 'PDF : Reconnaître les différents types de plastiques',
        description: 'Un guide visuel pour identifier les plastiques recyclables et ceux à éviter. Imprimez-le et gardez-le près de votre poubelle de tri !',
        type: 'file',
        fileName: 'guide_plastiques.pdf',
        thumbnailUrl: 'https://picsum.photos/seed/plastics/800/450',
    }
];

// New Data for Chat
export const USERS_DATA: User[] = [
    // Manager
    { id: 'USR-MAN-001', name: 'Aïssatou Ba', email: 'aissatou.ba@manager.com', role: 'manager', avatarUrl: 'https://i.pravatar.cc/48?u=aissatou' },
    // Agents
    { id: 'USR-AG-101', name: 'Fatou Ndiaye', email: 'fatou.ndiaye@agent.com', role: 'agent', agentId: 'AG-101', zone: 'Parcelles Assainies', avatarUrl: 'https://i.pravatar.cc/48?u=fatou' },
    { id: 'USR-AG-102', name: 'Moussa Diop', email: 'moussa.diop@agent.com', role: 'agent', agentId: 'AG-102', zone: 'Médina', avatarUrl: 'https://i.pravatar.cc/48?u=moussa' },
    { id: 'USR-AG-103', name: 'Ousmane Fall', email: 'ousmane.fall@agent.com', role: 'agent', agentId: 'AG-103', zone: 'Yoff', avatarUrl: 'https://i.pravatar.cc/48?u=ousmanef' },
    { id: 'USR-AG-104', name: 'Khadija Gueye', email: 'khadija.gueye.agent@example.com', role: 'agent', agentId: 'AG-104', zone: 'Point E', avatarUrl: 'https://i.pravatar.cc/48?u=khadijag' },
    // Citizens (spread from existing data)
    ...CITIZENS_DATA,
];

export const MESSAGES_DATA: Message[] = [
    { id: `MSG-${Date.now() - 500000}`, senderId: 'USR-AG-102', receiverId: 'USR-MAN-001', text: 'Bonjour Aïssatou, j\'ai terminé ma tournée à la Médina. Tout est propre.', timestamp: '10:30', read: true },
    { id: `MSG-${Date.now() - 400000}`, senderId: 'USR-MAN-001', receiverId: 'USR-AG-102', text: 'Excellent travail Moussa ! Merci pour la mise à jour.', timestamp: '10:32', read: true },
    { id: `MSG-${Date.now() - 300000}`, senderId: 'CIT-001', receiverId: 'USR-MAN-001', text: 'Bonjour, j\'ai signalé un dépôt sauvage il y a 2 jours, mais il est toujours là. Pouvez-vous vérifier ?', timestamp: '11:15', read: false },
    { id: `MSG-${Date.now() - 200000}`, senderId: 'USR-AG-101', receiverId: 'USR-MAN-001', text: 'Le camion T-01A a besoin d\'une maintenance. Le pneu arrière droit est usé.', timestamp: '12:05', read: true },
    { id: `MSG-${Date.now() - 100000}`, senderId: 'CIT-001', receiverId: 'USR-AG-102', text: 'Merci pour votre réactivité sur le ramassage de la rue 10 !', timestamp: '14:20', read: true },
];