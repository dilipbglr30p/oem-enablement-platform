import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import DashboardSidebar from '@/components/DashboardSidebar';
import { User, Bell, Lock, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const Settings = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [complianceAlerts, setComplianceAlerts] = useState(true);

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

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <>
      <Helmet>
        <title>Settings | Textile OEM Platform</title>
        <meta name="description" content="Manage your account settings and preferences." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-background flex">
        <DashboardSidebar />

        <main className="flex-1">
          {/* Header */}
          <header className="border-b border-border bg-card">
            <div className="px-8 py-6">
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
            </div>
          </header>

          {/* Content */}
          <div className="p-8 max-w-4xl">
            {/* Profile Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg p-6 mb-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Profile Information</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input defaultValue={user?.name || 'John Doe'} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <Input type="email" defaultValue={user?.email} disabled className="bg-muted" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <Input defaultValue="TextileOEM Manufacturing" />
                </div>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-lg p-6 mb-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Notifications</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive updates via email</div>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <div className="font-medium">Order Updates</div>
                    <div className="text-sm text-muted-foreground">Notifications for order status changes</div>
                  </div>
                  <Switch checked={orderUpdates} onCheckedChange={setOrderUpdates} />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium">Compliance Alerts</div>
                    <div className="text-sm text-muted-foreground">Important compliance deadline reminders</div>
                  </div>
                  <Switch checked={complianceAlerts} onCheckedChange={setComplianceAlerts} />
                </div>
              </div>
            </motion.div>

            {/* Security */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-lg p-6 mb-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Security</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Password</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <Button onClick={() => toast.success('Password updated successfully')}>
                  Update Password
                </Button>
              </div>
            </motion.div>

            {/* Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Preferences</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-md">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Timezone</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-md">
                    <option>UTC-5 (Eastern Time)</option>
                    <option>UTC-8 (Pacific Time)</option>
                    <option>UTC+0 (London)</option>
                    <option>UTC+1 (Central Europe)</option>
                  </select>
                </div>
                <Button onClick={handleSave}>Save Preferences</Button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Settings;
