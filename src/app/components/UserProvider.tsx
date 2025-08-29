'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@veap/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

// Definisikan tipe profil yang sama dengan di middleware
type UserProfile = {
  role: 'super_admin' | 'admin' | 'guest';
  dashboard_access: string | null;
  // Anda bisa tambahkan properti lain jika ada, misal: email, full_name
};

type UserContextType = {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
};

// Buat context
const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      // Ambil user dari sesi
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Jika user ada, ambil profilnya dari tabel 'profiles'
        const { data } = await supabase
          .from('profiles')
          .select('role, dashboard_access')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setProfile(data as UserProfile);
        }
      }
      setIsLoading(false);
    };

    fetchUserAndProfile();

    // Listener untuk perubahan status auth (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (event === 'SIGNED_IN' && currentUser) {
        // Ambil profil lagi saat user baru login
        fetchUserAndProfile();
      }
      
      if (event === 'SIGNED_OUT') {
        setProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const value = {
    user,
    profile,
    isLoading
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Buat custom hook agar lebih mudah digunakan
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

