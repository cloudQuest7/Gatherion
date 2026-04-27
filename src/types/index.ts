export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: string;
  coverImage: string | null;
  eventType: string;
  attendees: number;
  createdAt: Date;
  requireApproval?: boolean;
  ticketType?: string;
  theme?: string;
}

export interface Notification {
  id: string;
  eventId: string;
  message: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  email: string;
}

export interface RandomUserResponse {
  name: {
    first: string;
    last: string;
  };
  picture: {
    medium: string;
  };
  email: string;
}

export interface Theme {
  name: string;
  color: string;
  bgColor: string;
}

export interface MockEventData {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  isPublic: boolean;
  theme: string;
  coverImage: string | null;
  capacity: string;
  requireApproval: boolean;
  ticketType: string;
}

export interface StandardEventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: string;
  coverImage: string | null;
  eventType: string;
}
