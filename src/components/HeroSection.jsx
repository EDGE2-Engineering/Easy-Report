
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { usePageImages } from '@/lib/usePageImages';
import { useSiteContent } from '@/lib/useSiteContent';

const HeroSection = () => {
  const { images } = usePageImages();
  const { content } = useSiteContent();
  const bgImage = images.home?.heroBackground;

  return (
    <div className="relative bg-white text-white py-10 overflow-hidden min-h-[50px] flex items-center">
      {bgImage ? (
        <>
          <div className="absolute inset-0 z-0">
            <img src={bgImage} alt="Hero Background" className="w-full h-full object-cover" />
            {/* Enhanced gradient overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50 mix-blend-multiply" />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        </>
      ) : (
        <div className="absolute inset-0 opacity-1">
          <div className="absolute inset-0" style={{
            display: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Crect width='80' height='80' fill='%23e8f5e9'/%3E%3Cg fill='%234caf50' fill-opacity='0.35'%3E%3Cpath d='M20 40c10-20 30-20 40 0-10 5-30 5-40 0z'/%3E%3Cpath d='M10 15c6-12 18-12 24 0-6 3-18 3-24 0z'/%3E%3Cpath d='M46 58c6-12 18-12 24 0-6 3-18 3-24 0z'/%3E%3C/g%3E%3Cg fill='%238bc34a' fill-opacity='0.4'%3E%3Ccircle cx='15' cy='60' r='3'/%3E%3Ccircle cx='60' cy='20' r='3'/%3E%3Ccircle cx='70' cy='45' r='2'/%3E%3Ccircle cx='25' cy='25' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h1
            className="text-2xl md:text-5xl font-bold mb-6 drop-shadow-lg tracking-tight text-black"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            {content.home?.heroTitle || "EDGE2 MTR"}
          </motion.h1>
          <p className="text-xl md:text-2xl mb-8 text-black/95 font-light drop-shadow-md">
            {content.home?.heroSubtitle}
          </p>
          <div style={{ display: 'none' }} className="inline-flex items-center justify-center space-x-2 text-lg drop-shadow-md bg-gray-50/10 backdrop-blur-xl px-6 py-2 rounded-full border border-gray-500/20">
            <MapPin className="w-5 h-5 text-gray-500" />
            <span className="text-gray-500">Karnataka</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
