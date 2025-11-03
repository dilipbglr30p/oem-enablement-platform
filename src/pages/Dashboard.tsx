import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Package, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const stats = [
    { label: 'Active Orders', value: '24', icon: Package, color: 'text-primary' },
    { label: 'In Production', value: '18', icon: TrendingUp, color: 'text-accent' },
    { label: 'Pending Review', value: '3', icon: AlertCircle, color: 'text-orange-500' },
    { label: 'Completed', value: '142', icon: CheckCircle, color: 'text-green-500' },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard | Textile OEM Platform</title>
        <meta name="description" content="Operations dashboard for managing orders, production, and compliance." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-background flex">
        <DashboardSidebar />

        <main className="flex-1">
          {/* Header */}
          <header className="border-b border-border bg-card">
            <div className="px-8 py-6">
              <h1 className="text-3xl font-bold">Operations Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back, {user?.name || user?.email}</p>
            </div>
          </header>

          <div className="p-8">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Content Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card border border-border rounded-lg p-8"
            >
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <p className="text-muted-foreground">
                Your operations portal is ready. Connect additional features like order management, 
                compliance tracking, and analytics through the navigation menu.
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
