import React, { useState, useEffect } from 'react';
import api from '../api';
import SEO from '../components/SEO';

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

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-16 md:py-32 bg-white">
      <SEO title="About Us | Premium Fashion" description="Learn more about our brand." />
      
      <div className="flex flex-col lg:flex-row gap-16 items-center">
        <div className="flex-1 w-full relative">
            {settings?.homeBanners?.[0] ? (
                 <img src={settings.homeBanners[0]} className="w-full aspect-square object-cover shadow-[8px_8px_0px_#111] animate-fade-in" alt="About our brand" />
            ) : (
                <div className="w-full aspect-square bg-gray-100 shadow-[8px_8px_0px_#111] animate-fade-in flex items-center justify-center">
                   <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">About Visual</span>
                </div>
            )}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-theme-yellow -z-10"></div>
        </div>
        
        <div className="flex-1 lg:pl-12">
            <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-4 flex items-center gap-3">
               <span className="w-4 h-[2px] bg-theme-yellow"></span> The Brand
            </h3>
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-theme-black uppercase max-w-xl leading-[1.1] mb-8">
               {settings?.shopName || 'Our Story'}
            </h1>
            
            <div className="space-y-6 text-gray-500 font-medium text-lg leading-relaxed">
               <p>
                  {settings?.aboutText || "We believe in creating high-quality, premium apparel that challenges the status quo. Every drop is crafted with relentless attention to detail, utilizing the finest materials and boldest designs."}
               </p>
               <p>
                  Our style is born from the intersection of modern street culture and luxury aesthetics. We are more than a brand; we are a movement dedicated to authentic expression above all else.
               </p>
            </div>
            
            <div className="mt-12 pt-12 border-t border-gray-100 grid grid-cols-2 gap-8">
               <div>
                  <h4 className="text-3xl font-display font-black text-theme-black">100%</h4>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-2">Premium Quality</p>
               </div>
               <div>
                  <h4 className="text-3xl font-display font-black text-theme-black">24/7</h4>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-2">Personal Service</p>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default About;
