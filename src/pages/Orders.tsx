import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Orders = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

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

  const orders = [
    { id: 'ORD-2401', client: 'Adidas EMEA', product: 'Performance T-Shirts', quantity: '5,000 units', status: 'In Production', progress: 65, statusColor: 'bg-accent' },
    { id: 'ORD-2402', client: 'Nike Asia', product: 'Running Shorts', quantity: '3,200 units', status: 'Quality Check', progress: 90, statusColor: 'bg-primary' },
    { id: 'ORD-2403', client: 'H&M Global', product: 'Cotton Hoodies', quantity: '8,500 units', status: 'Pending', progress: 15, statusColor: 'bg-orange-500' },
    { id: 'ORD-2404', client: 'Zara Europe', product: 'Denim Jackets', quantity: '2,100 units', status: 'Completed', progress: 100, statusColor: 'bg-green-500' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Production': return Clock;
      case 'Quality Check': return AlertCircle;
      case 'Completed': return CheckCircle;
      default: return Package;
    }
  };

  return (
    <>
      <Helmet>
        <title>Orders | Textile OEM Platform</title>
        <meta name="description" content="Manage and track all manufacturing orders in real-time." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-background flex">
        <DashboardSidebar />

        <main className="flex-1">
          {/* Header */}
          <header className="border-b border-border bg-card">
            <div className="px-8 py-6">
              <h1 className="text-3xl font-bold">Orders</h1>
              <p className="text-muted-foreground mt-1">Track and manage all manufacturing orders</p>
            </div>
          </header>

          {/* Content */}
          <div className="p-8">
            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Orders', value: '24', change: '+12%' },
                { label: 'In Production', value: '18', change: '+8%' },
                { label: 'Completed', value: '142', change: '+23%' },
                { label: 'On-Time Rate', value: '98.5%', change: '+2.1%' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-lg p-6"
                >
                  <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-xs text-green-500">{stat.change} from last month</div>
                </motion.div>
              ))}
            </div>

            {/* Orders Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-xl font-semibold">Active Orders</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Order ID</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Client</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Product</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Quantity</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.map((order) => {
                      const StatusIcon = getStatusIcon(order.status);
                      return (
                        <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium">{order.id}</td>
                          <td className="px-6 py-4 text-sm">{order.client}</td>
                          <td className="px-6 py-4 text-sm">{order.product}</td>
                          <td className="px-6 py-4 text-sm">{order.quantity}</td>
                          <td className="px-6 py-4">
                            <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                              <StatusIcon className="h-3 w-3" />
                              {order.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                                <div 
                                  className={`h-full ${order.statusColor} transition-all`}
                                  style={{ width: `${order.progress}%` }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground">{order.progress}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Orders;
