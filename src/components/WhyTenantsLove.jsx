
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Users, Home, Car, CheckCircle2 } from 'lucide-react'; // Removed Phone, Mail
import { useSiteContent } from '@/lib/useSiteContent';

const WhyTenantsLove = () => {
  const { content } = useSiteContent();

  const features = [
    {
      icon: Shield,
      title: '100% Pure & Organic',
      description: 'Every product is sourced from certified organic farms, ensuring zero synthetic pesticides or harmful chemicals.'
    },
    {
      icon: Zap,
      title: 'Natural Vitality',
      description: 'Our minimally processed products retain their natural enzymes, vitamins, and minerals for maximum health benefits.'
    },
    {
      icon: Users,
      title: 'Community Focused',
      description: 'We work directly with local farming communities, ensuring fair trade practices and sustainable livelihoods.'
    },
    {
      icon: CheckCircle2,
      title: 'Rigorous Testing',
      description: 'Each batch is independently lab-tested for purity, authenticity, and the absence of any adulterants.'
    },
    {
      icon: Home,
      title: 'Eco-Friendly Sourcing',
      description: 'We prioritize biodiversity and sustainable harvesting methods to protect the natural ecosystems we depend on.'
    },
    {
      icon: Car,
      title: 'Direct Delivery',
      description: 'From the farm to your doorstep, we maintain a transparent supply chain for the freshest organic experience.'
    }
  ];

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">{content.home?.whyChooseTitle}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {content.home?.whyChooseSubtitle}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 rounded-xl p-8 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-gray-100">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Removed contact details section as requested */}
        {/*
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-gray-700">
            {content.global?.contactPhone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-lg font-medium tracking-wide">{content.global.contactPhone}</span>
              </div>
            )}
            {content.global?.contactEmail && (
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-lg font-medium tracking-wide">{content.global.contactEmail}</span>
              </div>
            )}
          </div>
        </motion.div>
        */}
      </div>
    </div>
  );
};

export default WhyTenantsLove;
