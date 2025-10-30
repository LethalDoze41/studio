'use client';

import { createContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User, getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import type { UserProfile } from '@/lib/types';
import { doc, onSnapshot, getFirestore } from 'firebase/firestore';

export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setUserProfile(null);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      const db = getFirestore(app);
      const userDocRef = doc(db, 'users', user.uid);
      const unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      }, () => {
        setLoading(false);
      });
      return () => unsubscribeProfile();
    } else if (!user) {
      setLoading(false);
    }
  }, [user]);

  const value = { user, userProfile, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
