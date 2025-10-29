import React from 'react';

export interface WasteType {
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  color: string;
  bgColor: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'agent' | 'manager';
  avatarUrl?: string;
  // Citizen-specific
  ecoPoints?: number;
  rank?: number;
  zone?: string; // Add zone to citizen
  // Agent-specific
  // FIX: Add optional 'agentId' property to the User interface.
  agentId?: string;
}

export interface Agent {
    id: string;
    name: string;
    zone: string;
    status: 'disponible' | 'en mission' | 'hors service';
    vehicle: string;
}

export type TaskStatus = 'en attente' | 'en cours' | 'terminé';

export interface Task {
    id: string;
    type: 'Ramassage' | 'Signalement';
    address: string;
    wasteType?: string;
    status: TaskStatus;
    assignedAgentId?: string;
    date: string;
    imageUrl?: string;
    location?: { lat: number; lon: number };
    quantity?: string;
}

export interface Campaign {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    participants: number;
    imageUrl: string;
    ecoPointsReward: number;
}

export interface Comment {
    id: string;
    author: {
        name: string;
        avatarUrl?: string;
    };
    text: string;
}

export interface FeedItem {
    id: string;
    type: 'report' | 'campaign';
    author: {
        name: string;
        avatarUrl?: string;
    };
    timestamp: string;
    imageUrl?: string;
    location?: string;
    title?: string;
    description: string;
    likes: number;
    comments: Comment[];
}

// New types for Manager Dashboard
export interface Zone {
    id: string;
    name: string;
    recyclingCenter?: string;
}

export interface Reward {
    id: string;
    name: string;
    description: string;
    cost: number; // in eco-points
}

export interface EcoPointsRules {
    report: number;
    campaignParticipation: number;
}

export interface CampaignParticipant {
    id: string;
    campaignId: string;
    campaignTitle: string;
    userName: string;
    userAvatar: string;
    status: 'en attente' | 'approuvé';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read?: boolean;
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  type: 'link' | 'file';
  url?: string;
  fileName?: string;
  thumbnailUrl: string;
}
