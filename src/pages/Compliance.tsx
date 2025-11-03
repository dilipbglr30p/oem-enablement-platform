import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Shield, CheckCircle, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Compliance = () => {
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

  const certifications = [
    { name: 'ISO 9001:2015', status: 'Active', expiry: 'Dec 2025', file: 'ISO-9001-Certificate.pdf' },
    { name: 'GOTS Certified', status: 'Active', expiry: 'Jun 2026', file: 'GOTS-Certificate.pdf' },
    { name: 'OEKO-TEX Standard 100', status: 'Active', expiry: 'Mar 2025', file: 'OEKO-TEX-Certificate.pdf' },
    { name: 'WRAP Certification', status: 'Active', expiry: 'Sep 2025', file: 'WRAP-Certificate.pdf' },
  ];

  const esgReports = [
    { title: 'Q4 2024 ESG Report', date: 'Jan 15, 2025', category: 'Quarterly' },
    { title: 'Carbon Footprint Analysis', date: 'Dec 20, 2024', category: 'Environmental' },
    { title: 'Labor Compliance Audit', date: 'Nov 30, 2024', category: 'Social' },
    { title: 'Supply Chain Transparency', date: 'Oct 15, 2024', category: 'Governance' },
  ];

  return (
    <>
      <Helmet>
        <title>Compliance | Textile OEM Platform</title>
        <meta name="description" content="Access certifications, compliance documentation, and ESG reports." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-background flex">
        <DashboardSidebar />

        <main className="flex-1">
          {/* Header */}
          <header className="border-b border-border bg-card">
            <div className="px-8 py-6">
              <h1 className="text-3xl font-bold">Compliance & Certifications</h1>
              <p className="text-muted-foreground mt-1">Documentation, certifications, and ESG reporting</p>
            </div>
          </header>

          {/* Content */}
          <div className="p-8">
            {/* Overview Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { label: 'Active Certifications', value: '12', icon: Shield },
                { label: 'Compliance Score', value: '98%', icon: CheckCircle },
                { label: 'Documents Available', value: '47', icon: FileText },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Certifications */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card border border-border rounded-lg overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="text-xl font-semibold">Active Certifications</h2>
                </div>
                <div className="p-6 space-y-4">
                  {certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{cert.name}</div>
                          <div className="text-sm text-muted-foreground">Expires: {cert.expiry}</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ESG Reports */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card border border-border rounded-lg overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="text-xl font-semibold">ESG Reports</h2>
                </div>
                <div className="p-6 space-y-4">
                  {esgReports.map((report, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <div className="font-medium">{report.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {report.category} • {report.date}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Compliance;
