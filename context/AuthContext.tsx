
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface UserProfile {
  name: string;
  email: string;
  role: 'admin' | 'customer';
  createdAt: number;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // SUPER ADMIN OVERRIDE: Automatically grant admin access to the specific owner email
        // This ensures access even if the database document is missing or incorrect
        if (currentUser.email === 'parthisoft7@gmail.com') {
          setUserProfile({
            name: currentUser.displayName || 'Super Admin',
            email: currentUser.email,
            role: 'admin',
            createdAt: Date.now()
          });
          setLoading(false);
          return;
        }

        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
          } else {
            // Document doesn't exist (possibly due to signup write failure or legacy user)
            // Fallback to basic auth info
            setUserProfile({
              name: currentUser.displayName || 'User',
              email: currentUser.email || '',
              role: 'customer',
              createdAt: Date.now()
            });
          }
        } catch (error: any) {
          // Handle permission errors gracefully (e.g. if Firestore rules block reads)
          // We check for both the code and the message content to be robust against SDK variations
          if (error.code === 'permission-denied' || (error.message && error.message.includes('insufficient permissions'))) {
            console.warn("Firestore permission denied. Defaulting to customer role. Check Firestore Rules.");
            setUserProfile({
              name: currentUser.displayName || 'User',
              email: currentUser.email || '',
              role: 'customer',
              createdAt: Date.now()
            });
          } else {
            console.error("Error fetching user profile:", error);
            setUserProfile(null);
          }
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const isAdmin = userProfile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
