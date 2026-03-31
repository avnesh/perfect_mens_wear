const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema({
  imageUrl:    { type: String, default: '' },
  heading:     { type: String, default: '' },
  subheading:  { type: String, default: '' },
  ctaText:     { type: String, default: 'Explore Gallery' },
}, { _id: false });

const promoSectionSchema = new mongoose.Schema({
  imageUrl: { type: String, default: '' },
  label:    { type: String, default: '' },
}, { _id: false });

const settingSchema = mongoose.Schema(
  {
    shopName:       { type: String, default: 'MyApp' },
    logo:           { type: String, default: '' },
    address:        { type: String, default: '' },
    contactEmail:   { type: String, default: '' },
    contactNumber:  { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    aboutText:      { type: String, default: 'About us text here' },
    footerTagline: { type: String, default: 'Premium quality. Delivered with care.' },

    // Legacy single banner (kept for backward compat)
    homeBanners: { type: [String], default: [] },

    // New: Multi-slide hero carousel (up to 5 slides)
    heroSlides: { type: [heroSlideSchema], default: [] },

    // Scrolling announcement bar text
    marqueeText: {
      type: String,
      default: '✦ Premium Quality · Fast Enquiry · 100+ Brands · WhatsApp Us Now ✦'
    },

    // Mid-page promo banners (up to 3)
    promoSections: { type: [promoSectionSchema], default: [] },
  },
  { timestamps: true }
);

const Setting = mongoose.model('Setting', settingSchema);
module.exports = Setting;
