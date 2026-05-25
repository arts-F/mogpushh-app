import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PrayerBurden {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  answered: boolean;
  timeSpent: number; // in seconds
}

export interface UserProfile {
  name: string;
  email: string;
  streak: number;
  totalPrayers: number;
  answeredPrayers: number;
}

interface AppContextType {
  // User
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  updateUser: (updates: Partial<UserProfile>) => void;

  // Prayer Burdens
  burdens: PrayerBurden[];
  addBurden: (burden: Omit<PrayerBurden, 'id'>) => void;
  removeBurden: (id: string) => void;
  updateBurden: (id: string, updates: Partial<PrayerBurden>) => void;
  getCurrentBurden: () => PrayerBurden | null;
  setCurrentBurdenId: (id: string | null) => void;

  // Stats
  todayPrayerTime: number;
  setTodayPrayerTime: (time: number) => void;
  incrementTodayPrayerTime: (seconds: number) => void;

  // Loading state
  isLoading: boolean;
}

const defaultUser: UserProfile = {
  name: 'Your Name',
  email: 'user@example.com',
  streak: 7,
  totalPrayers: 142,
  answeredPrayers: 23,
};

const defaultBurdens: PrayerBurden[] = [
  {
    id: '1',
    title: 'Family Healing',
    description: 'Pray for wisdom and restoration',
    createdAt: new Date().toISOString(),
    answered: false,
    timeSpent: 0,
  },
  {
    id: '2',
    title: 'Work Breakthrough',
    description: 'Seeking God\'s favor at work',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    answered: false,
    timeSpent: 1800,
  },
];

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<UserProfile>(defaultUser);
  const [burdens, setBurdens] = useState<PrayerBurden[]>(defaultBurdens);
  const [currentBurdenId, setCurrentBurdenId] = useState<string | null>(null);
  const [todayPrayerTime, setTodayPrayerTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('mogpushh_user');
      const savedBurdens = await AsyncStorage.getItem('mogpushh_burdens');
      const savedCurrentBurden = await AsyncStorage.getItem(
        'mogpushh_currentBurden'
      );
      const savedTodayTime = await AsyncStorage.getItem(
        'mogpushh_todayTime'
      );

      if (savedUser) setUserState(JSON.parse(savedUser));
      if (savedBurdens) setBurdens(JSON.parse(savedBurdens));
      if (savedCurrentBurden) setCurrentBurdenId(savedCurrentBurden);
      if (savedTodayTime) setTodayPrayerTime(parseInt(savedTodayTime, 10));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setUser = (newUser: UserProfile) => {
    setUserState(newUser);
    AsyncStorage.setItem('mogpushh_user', JSON.stringify(newUser));
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    const updated = { ...user, ...updates };
    setUser(updated);
  };

  const addBurden = (burden: Omit<PrayerBurden, 'id'>) => {
    const newBurden: PrayerBurden = {
      ...burden,
      id: Date.now().toString(),
    };
    const updated = [...burdens, newBurden];
    setBurdens(updated);
    AsyncStorage.setItem('mogpushh_burdens', JSON.stringify(updated));
  };

  const removeBurden = (id: string) => {
    const updated = burdens.filter((b) => b.id !== id);
    setBurdens(updated);
    AsyncStorage.setItem('mogpushh_burdens', JSON.stringify(updated));
  };

  const updateBurden = (id: string, updates: Partial<PrayerBurden>) => {
    const updated = burdens.map((b) =>
      b.id === id ? { ...b, ...updates } : b
    );
    setBurdens(updated);
    AsyncStorage.setItem('mogpushh_burdens', JSON.stringify(updated));
  };

  const getCurrentBurden = () => {
    return currentBurdenId
      ? burdens.find((b) => b.id === currentBurdenId) || null
      : burdens[0] || null;
  };

  const incrementTodayPrayerTime = (seconds: number) => {
    const newTime = todayPrayerTime + seconds;
    setTodayPrayerTime(newTime);
    AsyncStorage.setItem('mogpushh_todayTime', newTime.toString());
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        burdens,
        addBurden,
        removeBurden,
        updateBurden,
        getCurrentBurden,
        setCurrentBurdenId,
        todayPrayerTime,
        setTodayPrayerTime,
        incrementTodayPrayerTime,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
