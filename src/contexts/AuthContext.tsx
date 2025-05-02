
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('motoUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse saved user', error);
        localStorage.removeItem('motoUser');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login with:', username);
      
      // Query the users table for the given username and password
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
        return false;
      }

      if (data) {
        console.log('Login successful, user data:', data);
        
        // Omit the password from the user object for security
        const { password: _, ...userWithoutPassword } = data;
        
        // Set user in state and localStorage
        setUser(userWithoutPassword as User);
        localStorage.setItem('motoUser', JSON.stringify(userWithoutPassword));
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${data.name}!`,
        });
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Unexpected error during login:', err);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('motoUser');
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
