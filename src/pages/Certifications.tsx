import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Shield, Award, CheckCircle, FileCheck } from 'lucide-react';

const certifications = [
  {
    name: 'ISO 9001:2015',
    category: 'Quality Management',
    description: 'International standard for quality management systems ensuring consistent quality output.',
    year: '2020',
  },
  {
    name: 'GOTS',
    category: 'Organic Textile',
    description: 'Global Organic Textile Standard certification for organic fiber processing.',
    year: '2021',
  },
  {
    name: 'OEKO-TEX Standard 100',
    category: 'Product Safety',
    description: 'Independent certification for harmful substances in textile products.',
    year: '2019',
  },
  {
    name: 'SA8000',
    category: 'Social Accountability',
    description: 'International standard for social accountability and ethical working conditions.',
    year: '2022',
  },
  {
    name: 'WRAP',
    category: 'Workplace Standards',
    description: 'Worldwide Responsible Accredited Production certification for safe manufacturing.',
    year: '2020',
  },
  {
    name: 'GRS',
    category: 'Recycled Content',
    description: 'Global Recycled Standard for recycled content verification and chain of custody.',
    year: '2023',
  },
];

const Certifications = () => {
  return (
    <>
      <Helmet>
        <title>Certifications & Compliance | Textile OEM Platform</title>
        <meta name="description" content="View our comprehensive certifications including ISO 9001, GOTS, OEKO-TEX, and more ensuring quality and compliance." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          {/* Hero */}
          <section className="py-20 bg-gradient-to-br from-primary/5 to-background">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto text-center"
              >
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Certifications & Compliance</h1>
                <p className="text-lg text-muted-foreground">
                  Our commitment to excellence is validated by internationally recognized certifications 
                  and compliance standards.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Certifications Grid */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={cert.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        Since {cert.year}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{cert.name}</h3>
                    <div className="text-sm font-medium text-primary mb-3">{cert.category}</div>
                    <p className="text-sm text-muted-foreground">{cert.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Compliance Features */}
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto"
              >
                <h2 className="text-3xl font-bold mb-12 text-center">Compliance Management</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {[
                    {
                      icon: FileCheck,
                      title: 'Documentation',
                      description: 'Complete traceability with comprehensive documentation for every order and process.',
                    },
                    {
                      icon: CheckCircle,
                      title: 'Regular Audits',
                      description: 'Quarterly third-party audits ensuring ongoing compliance with all standards.',
                    },
                    {
                      icon: Shield,
                      title: 'ESG Reporting',
                      description: 'Detailed environmental, social, and governance reports for stakeholder transparency.',
                    },
                    {
                      icon: Award,
                      title: 'Continuous Improvement',
                      description: 'Ongoing training and process optimization to exceed certification requirements.',
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Certifications;
