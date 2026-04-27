'use client';

import { useState, useEffect, useCallback } from 'react';
import { db, auth } from '@/lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  Timestamp, 
  doc, 
  getDoc, 
  where,
  onSnapshot,
  limit
} from 'firebase/firestore';

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
  theme?: string;
}

export interface Guest {
  id: string;
  displayName: string;
  email: string;
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

interface UserData {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
}

interface CachedUser {
  data: UserData;
  timestamp: number;
}

const userCache = new Map<string, CachedUser>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useDashboardData() {
  const [events, setEvents] = useState<DashboardEvent[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);

  const processGuestsAndActivities = useCallback(async (fetchedEvents: DashboardEvent[], currentUserId: string) => {
    const myHostedEvents = fetchedEvents.filter(e => e.creatorId === currentUserId);
    const guestList: Guest[] = [];
    const activityList: Activity[] = [];
    
    // Get unique attendee IDs and limit to first 100
    const attendeeIds = Array.from(new Set(myHostedEvents.flatMap(e => e.attendees || []))).slice(0, 100);

    if (attendeeIds.length > 0) {
      // Batch fetch user data with reduced batch size for faster response
      const batchSize = 5; // Reduced from 10 to 5 for faster individual requests
      const userDataBatches = await Promise.all(
        Array.from({ length: Math.ceil(attendeeIds.length / batchSize) }, (_, i) =>
          Promise.all(
            attendeeIds.slice(i * batchSize, (i + 1) * batchSize)
              .map(id => {
                const cachedUser = userCache.get(id);
                if (cachedUser && Date.now() - cachedUser.timestamp < CACHE_TTL) {
                  return Promise.resolve(cachedUser.data);
                }
                return getDoc(doc(db, 'users', id)).then(docSnap => {
                  if (docSnap.exists()) {
                    const userData = docSnap.data() as UserData;
                    const typedData = { ...userData, id: docSnap.id };
                    userCache.set(id, { 
                      data: typedData,
                      timestamp: Date.now()
                    });
                    return typedData;
                  }
                  return null;
                }).catch(() => null); // Silently handle fetch errors
              })
          )
        )
      );

      const usersMap: Record<string, UserData> = {};
      userDataBatches.flat().forEach(userData => {
        if (userData) usersMap[userData.id] = userData;
      });

      // Process guests and activities - limit to 100 total
      let guestCount = 0;
      for (const event of myHostedEvents) {
        if (event.attendees?.length > 0 && guestCount < 100) {
          for (const attendeeId of event.attendees) {
            if (guestCount >= 100) break;
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
              guestCount++;
            }
          }
        }
      }
    }
    setGuests(guestList);
    setActivities(activityList);
  }, []);

  const setupRealtimeListener = useCallback((currentUser: { uid: string }) => {
    if (!currentUser) return;

    const eventsRef = collection(db, 'events');

    // Setup separate queries for better performance - LIMIT to 50 events max
    const myEventsQuery = query(
      eventsRef,
      where('creatorId', '==', currentUser.uid),
      orderBy('eventTimestamp', 'desc'),
      limit(50)
    );

    const attendingEventsQuery = query(
      eventsRef,
      where('attendees', 'array-contains', currentUser.uid),
      orderBy('eventTimestamp', 'desc'),
      limit(50)
    );

    let myEvents: DashboardEvent[] = [];
    let attendingEvents: DashboardEvent[] = [];
    let myEventsLoaded = false;
    let attendingEventsLoaded = false;
    let initialLoadComplete = false;

    const updateEvents = () => {
      if (myEventsLoaded && attendingEventsLoaded) {
        const allEvents = Array.from(new Map(
          [...myEvents, ...attendingEvents].map(e => [e.id, e])
        ).values()).sort((a, b) => 
          b.eventTimestamp.toDate().getTime() - a.eventTimestamp.toDate().getTime()
        );
        setEvents(allEvents);
        
        // Only load guests/activities on initial load to save bandwidth
        if (!initialLoadComplete) {
          initialLoadComplete = true;
          // Defer guest loading to next tick
          setTimeout(() => {
            processGuestsAndActivities(allEvents, currentUser.uid).then(() => {
              setLoading(false);
            });
          }, 100);
        } else {
          setLoading(false);
        }
      }
    };

    // Real-time listener for created events
    const unsubscribeMyEvents = onSnapshot(myEventsQuery, (snapshot) => {
      myEvents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DashboardEvent[];
      myEventsLoaded = true;
      updateEvents();
    }, (error) => {
      console.error('Error listening to my events:', error);
      setLoading(false);
    });

    // Real-time listener for attending events
    const unsubscribeAttendingEvents = onSnapshot(attendingEventsQuery, (snapshot) => {
      attendingEvents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DashboardEvent[];
      attendingEventsLoaded = true;
      updateEvents();
    }, (error) => {
      console.error('Error listening to attending events:', error);
      setLoading(false);
    });

    return () => {
      unsubscribeMyEvents();
      unsubscribeAttendingEvents();
    };
  }, [processGuestsAndActivities]);

  const refreshData = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    
    setLoading(true);
    await processGuestsAndActivities(events, currentUser.uid);
    setLoading(false);
  }, [processGuestsAndActivities, events]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setLoading(true);
        const unsubscribeListener = setupRealtimeListener(currentUser);
        return unsubscribeListener;
      } else {
        setEvents([]);
        setGuests([]);
        setActivities([]);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [setupRealtimeListener]);

  return { events, guests, activities, loading, user, refreshData };
}
