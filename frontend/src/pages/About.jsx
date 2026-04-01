import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api';
import SEO from '../components/SEO';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const About = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        setSettings(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSettings();
  }, []);

  const aboutTitle    = settings?.aboutTitle    || settings?.shopName || 'Our Story';
  const aboutSubtitle = settings?.aboutSubtitle || 'The Brand';
  const aboutText1    = settings?.aboutText     || "We believe in creating high-quality, premium apparel that challenges the status quo. Every drop is crafted with relentless attention to detail, utilizing the finest materials and boldest designs.";
  const aboutText2    = settings?.aboutText2    || "Our style is born from the intersection of modern street culture and luxury aesthetics. We are more than a brand; we are a movement dedicated to authentic expression above all else.";
  const aboutImage    = settings?.aboutImage    || settings?.homeBanners?.[0] || 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80';
  
  const stat1V = settings?.aboutStat1Value || '100%';
  const stat1L = settings?.aboutStat1Label || 'Premium Quality';
  const stat2V = settings?.aboutStat2Value || '24/7';
  const stat2L = settings?.aboutStat2Label || 'Personal Service';

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-16 md:py-32 bg-white">
      <SEO title={`${aboutTitle} | About Us`} description="Learn more about our brand journey and values." />
      
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={staggerContainer}
        className="flex flex-col lg:flex-row gap-16 items-center"
      >
        <motion.div variants={fadeIn} className="flex-1 w-full relative">
            <img 
              src={aboutImage} 
              className="w-full aspect-square object-cover shadow-[8px_8px_0px_#111]" 
              alt={aboutTitle} 
            />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-theme-yellow -z-10"></div>
        </motion.div>
        
        <motion.div variants={fadeIn} className="flex-1 lg:pl-12">
            <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-4 flex items-center gap-3">
               <span className="w-4 h-[2px] bg-theme-yellow"></span> {aboutSubtitle}
            </h3>
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-theme-black uppercase max-w-xl leading-[1.1] mb-8">
               {aboutTitle}
            </h1>
            
            <div className="space-y-6 text-gray-500 font-medium text-lg leading-relaxed">
               <p>{aboutText1}</p>
               <p>{aboutText2}</p>
            </div>
            
            <div className="mt-12 pt-12 border-t border-gray-100 grid grid-cols-2 gap-8">
               <div>
                  <h4 className="text-3xl font-display font-black text-theme-black">{stat1V}</h4>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-2">{stat1L}</p>
               </div>
               <div>
                  <h4 className="text-3xl font-display font-black text-theme-black">{stat2V}</h4>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-2">{stat2L}</p>
               </div>
            </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;
