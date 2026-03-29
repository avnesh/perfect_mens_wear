import React, { useState, useEffect } from 'react';
import api from '../api';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        setSettings(data);
      } catch (error) {}
    };
    fetchSettings();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Contact Us</h1>
        <p className="mt-4 text-gray-600 text-lg">We'd love to hear from you. Reach out to us below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4">
            <MapPin size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Address</h3>
          <p className="text-gray-600">{settings?.address || 'Your Address Here'}</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4">
            <Phone size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">WhatsApp</h3>
          <p className="text-gray-600">{settings?.whatsappNumber || 'Your Number Here'}</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center mb-4">
            <Mail size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Email</h3>
          <p className="text-gray-600">{settings?.contactEmail || 'Your Email Here'}</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
