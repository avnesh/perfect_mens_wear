const mongoose = require('mongoose');

const settingSchema = mongoose.Schema(
  {
    shopName: { type: String, default: "MyApp" },
    logo: { type: String, default: "" },
    address: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    whatsappNumber: { type: String, default: "" },
    aboutText: { type: String, default: "About us text here" },
    homeBanners: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model('Setting', settingSchema);
module.exports = Setting;
