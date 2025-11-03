import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import DashboardSidebar from '@/components/DashboardSidebar';
import { TrendingUp, TrendingDown, DollarSign, Package, Users } from 'lucide-react';

const Analytics = () => {
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

  const kpis = [
    { label: 'Revenue (YTD)', value: '$12.4M', change: '+18.5%', trend: 'up', icon: DollarSign },
    { label: 'Units Produced', value: '2.1M', change: '+12.3%', trend: 'up', icon: Package },
    { label: 'Active Clients', value: '487', change: '+24', trend: 'up', icon: Users },
    { label: 'Avg Lead Time', value: '21 days', change: '-3 days', trend: 'up', icon: TrendingDown },
  ];

  const monthlyData = [
    { month: 'Jul', orders: 142, revenue: 980 },
    { month: 'Aug', orders: 158, revenue: 1120 },
    { month: 'Sep', orders: 171, revenue: 1240 },
    { month: 'Oct', orders: 189, revenue: 1380 },
    { month: 'Nov', orders: 203, revenue: 1520 },
    { month: 'Dec', orders: 218, revenue: 1690 },
  ];

  return (
    <>
      <Helmet>
        <title>Analytics | Textile OEM Platform</title>
        <meta name="description" content="View detailed analytics, reports, and performance metrics." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-background flex">
        <DashboardSidebar />

        <main className="flex-1">
          {/* Header */}
          <header className="border-b border-border bg-card">
            <div className="px-8 py-6">
              <h1 className="text-3xl font-bold">Analytics & Reports</h1>
              <p className="text-muted-foreground mt-1">Performance metrics and business insights</p>
            </div>
          </header>

          {/* Content */}
          <div className="p-8">
            {/* KPIs */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {kpis.map((kpi, index) => (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <kpi.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className={`flex items-center text-sm ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {kpi.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {kpi.change}
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">{kpi.value}</div>
                  <div className="text-sm text-muted-foreground">{kpi.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Monthly Performance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card border border-border rounded-lg p-6"
              >
                <h2 className="text-xl font-semibold mb-6">Monthly Orders</h2>
                <div className="space-y-4">
                  {monthlyData.map((data, index) => (
                    <div key={data.month} className="flex items-center gap-4">
                      <div className="w-12 text-sm text-muted-foreground">{data.month}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(data.orders / 250) * 100}%` }}
                              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                              className="h-full bg-primary"
                            />
                          </div>
                          <div className="w-16 text-sm font-medium text-right">{data.orders}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Revenue Trend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-card border border-border rounded-lg p-6"
              >
                <h2 className="text-xl font-semibold mb-6">Revenue Trend (K$)</h2>
                <div className="space-y-4">
                  {monthlyData.map((data, index) => (
                    <div key={data.month} className="flex items-center gap-4">
                      <div className="w-12 text-sm text-muted-foreground">{data.month}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(data.revenue / 2000) * 100}%` }}
                              transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                              className="h-full bg-accent"
                            />
                          </div>
                          <div className="w-16 text-sm font-medium text-right">{data.revenue}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Top Performing Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-card border border-border rounded-lg mt-8 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-xl font-semibold">Top Performing Products</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Product</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Units</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Revenue</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Growth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { name: 'Performance T-Shirts', units: '342K', revenue: '$2.1M', growth: '+24%' },
                      { name: 'Running Shorts', units: '287K', revenue: '$1.8M', growth: '+18%' },
                      { name: 'Cotton Hoodies', units: '198K', revenue: '$1.5M', growth: '+31%' },
                      { name: 'Denim Jackets', units: '156K', revenue: '$1.2M', growth: '+12%' },
                    ].map((product, index) => (
                      <tr key={index} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium">{product.name}</td>
                        <td className="px-6 py-4 text-sm">{product.units}</td>
                        <td className="px-6 py-4 text-sm">{product.revenue}</td>
                        <td className="px-6 py-4 text-sm text-green-500">{product.growth}</td>
                      </tr>
                    ))}
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

export default Analytics;
