import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/utils/supabaseClient';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { session } = await auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
          });
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string) => {
    try {
      setLoading(true);
      const { data, error } = await auth.signInWithEmail(email);
      
      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      toast.success('Check your email for the login link!');
      return { success: true, data };
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const signInWithPassword = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await auth.signInWithPassword(email, password);
      
      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
        });
        toast.success('Welcome back!');
        navigate('/dashboard');
      }

      return { success: true, data };
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email: string, token: string) => {
    try {
      setLoading(true);
      const { data, error } = await auth.verifyOtp(email, token);
      
      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
        });
        toast.success('Welcome back!');
        navigate('/dashboard');
      }

      return { success: true, data };
    } catch (error) {
      toast.error('Invalid verification code. Please try again.');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await auth.signOut();
      
      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
      return { success: true };
    } catch (error) {
      toast.error('An error occurred during logout.');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signInWithEmail,
    signInWithPassword,
    verifyOtp,
    signOut,
  };
};
