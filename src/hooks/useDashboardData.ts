'use client';

import { useState, useEffect, useCallback } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs, Timestamp, doc, getDoc } from 'firebase/firestore';

export interface DashboardEvent {
  eventType: string;
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  isPrivate: boolean;
  maxAttendees: number | null;
  creatorId: string;
  creatorName: string;
  createdAt: Timestamp;
  attendees: string[];
  eventTimestamp: Timestamp;
  coverImage?: string;
}

export interface Guest {
  id: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  attendingEvent: string;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  type: 'rsvp' | 'comment' | 'system';
  message?: string;
}

export function useDashboardData() {
  const [events, setEvents] = useState<DashboardEvent[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const eventsRef = collection(db, 'events');
      const q = query(
        eventsRef, 
        orderBy('eventTimestamp', 'asc'),
        limit(20)
      );
      
      const querySnapshot = await getDocs(q);
      const fetchedEvents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DashboardEvent[];
      
      setEvents(fetchedEvents);

      // Fetch guests and activities for my events in parallel
      if (auth.currentUser) {
        const myHostedEvents = fetchedEvents.filter(e => e.creatorId === auth.currentUser?.uid);
        const guestList: Guest[] = [];
        const activityList: Activity[] = [];

        // Collect all attendee IDs from my events
        const allAttendeeIds = Array.from(new Set(myHostedEvents.flatMap(e => e.attendees || [])));
        
        if (allAttendeeIds.length > 0) {
          // Fetch all user docs in parallel
          const userDocs = await Promise.all(
            allAttendeeIds.map(id => getDoc(doc(db, 'users', id)))
          );

          interface UserData {
            displayName?: string;
            email?: string;
            photoURL?: string;
          }

          const usersMap: Record<string, UserData> = {};
          userDocs.forEach(userDoc => {
            if (userDoc.exists()) {
              usersMap[userDoc.id] = userDoc.data() as UserData;
            }
          });

          // Build guests and activity lists using the map
          for (const event of myHostedEvents) {
            if (event.attendees && event.attendees.length > 0) {
              for (const attendeeId of event.attendees) {
                const userData = usersMap[attendeeId];
                if (userData) {
                  guestList.push({
                    id: attendeeId,
                    displayName: userData.displayName || 'Anonymous',
                    email: userData.email,
                    photoURL: userData.photoURL,
                    attendingEvent: event.title
                  });

                  activityList.push({
                    id: `${attendeeId}-${event.id}`,
                    user: userData.displayName || 'Someone',
                    action: "rsvp'd to",
                    target: event.title,
                    time: 'Recently',
                    type: 'rsvp'
                  });
                }
              }
            }
          }
        }
        setGuests(guestList);
        setActivities(activityList);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, guests, activities, loading, refreshData: fetchEvents };
}
