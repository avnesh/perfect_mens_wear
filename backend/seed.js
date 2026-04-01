/**
 * Seed script — adds sample products + look book images to MongoDB
 * Run: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');

const Product  = require('./models/Product');
const Category = require('./models/Category');
const Gallery  = require('./models/Gallery');
const Setting  = require('./models/Setting');

/* ── Fashion image banks (Unsplash) ── */
const INNERWEAR_IMGS = [
  'https://images.unsplash.com/photo-1622519407650-3df9883f76a5?w=600&q=80',
  'https://images.unsplash.com/photo-1589465885857-44edb59bbff2?w=600&q=80',
  'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80',
  'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=600&q=80',
  'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80',
  'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80',
];

const APPAREL_IMGS = [
  'https://images.unsplash.com/photo-1602810316693-3667c854239a?w=600&q=80',
  'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&q=80',
  'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80',
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80',
  'https://images.unsplash.com/photo-1550246140-5119ae4790b8?w=600&q=80',
  'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80',
  'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&q=80',
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
];

const LOOKBOOK_IMGS = [
  { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700&q=80', caption: 'Summer Casuals' },
  { url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=700&q=80', caption: 'T-Shirt Essentials' },
  { url: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=700&q=80', caption: 'Formals' },
  { url: 'https://images.unsplash.com/photo-1602810316693-3667c854239a?w=700&q=80', caption: 'Linen Shirts' },
  { url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=700&q=80', caption: 'Premium Innerwear' },
  { url: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=700&q=80', caption: 'Jockey Collection' },
  { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=80', caption: 'Sneakers & Style' },
  { url: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=700&q=80', caption: 'Casual Friday' },
  { url: 'https://images.unsplash.com/photo-1512327428383-19e43bf3ee6e?w=700&q=80', caption: 'White Shirts' },
  { url: 'https://images.unsplash.com/photo-1550246140-5119ae4790b8?w=700&q=80', caption: 'Slim Fit Formals' },
  { url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=700&q=80', caption: 'Casual Chic' },
  { url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=700&q=80', caption: 'Boxers & Briefs' },
  { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700&q=80', caption: 'Denim Essentials' },
  { url: 'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=700&q=80', caption: 'Active Wear' },
  { url: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=700&q=80', caption: 'Office Trousers' },
  { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=700&q=80', caption: 'Polo Classics' },
  { url: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=700&q=80', caption: 'Check Shirts' },
  { url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=700&q=80', caption: 'Denim Look' },
  { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700&q=80', caption: 'Classic White Tee' },
  { url: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=700&q=80', caption: 'Graphic Tees' },
  { url: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=700&q=80', caption: 'Oxford Formals' },
  { url: 'https://images.unsplash.com/photo-1415886462-deff7a00f1ff?w=700&q=80', caption: 'Bermudas' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=80', caption: 'Street Style' },
  { url: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=700&q=80', caption: 'Trunk Pack' },
];

const PRODUCTS = [
  // INNERWEAR (will be filled with category ID later)
  { name: 'Jockey Classic Trunk Pack of 3', brand: 'Jockey', price: 599, description: 'Ultra-soft cotton trunk with moisture-wicking fabric. Ideal for all-day comfort.', sizes: ['S','M','L','XL'], images: [INNERWEAR_IMGS[0], INNERWEAR_IMGS[1]], isFeatured: true, catKey: 'Innerwear' },
  { name: 'U.S. Polo Assn. Cotton Trunk (Assorted Colors)', brand: 'U.S. Polo Assn.', price: 449, description: 'Premium cotton blend for lasting comfort.', sizes: ['S','M','L','XL','XXL'], images: [INNERWEAR_IMGS[2], INNERWEAR_IMGS[3]], isFeatured: true, catKey: 'Innerwear' },
  { name: 'XYXX R2 ACE Cloudsoft Trunk', brand: 'XYXX', price: 499, description: 'Buttery soft Cloudsoft fabric that feels like a second skin.', sizes: ['M','L','XL','XXL'], images: [INNERWEAR_IMGS[4]], isFeatured: true, catKey: 'Innerwear' },
  { name: 'Lux Venus Brief Pack of 5', brand: 'Lux', price: 299, description: 'Value pack of 5 briefs — comfortable, durable and affordable.', sizes: ['S','M','L','XL'], images: [INNERWEAR_IMGS[5], INNERWEAR_IMGS[0]], isFeatured: false, catKey: 'Innerwear' },
  { name: 'Dollar Bigboss Brief (3 Pack)', brand: 'Dollar', price: 249, description: 'Wide elastic waistband with breathable cotton.', sizes: ['S','M','L','XL','XXL'], images: [INNERWEAR_IMGS[1]], isFeatured: false, catKey: 'Innerwear' },
  { name: 'Jockey Vest Inner Sleeveless (Pack of 2)', brand: 'Jockey', price: 349, description: 'Classic round-neck vest made from soft combed cotton.', sizes: ['S','M','L','XL'], images: [INNERWEAR_IMGS[2]], isFeatured: false, catKey: 'Innerwear' },
  { name: 'Van Heusen Stretch Trunk', brand: 'Van Heusen', price: 399, description: 'Four-way stretch fabric for active wear and daily use.', sizes: ['M','L','XL','XXL'], images: [INNERWEAR_IMGS[3]], isFeatured: false, catKey: 'Innerwear' },
  { name: 'Puma Active Brief Pack of 2', brand: 'Puma', price: 549, description: 'Performance brief designed for active movement.', sizes: ['S','M','L','XL'], images: [INNERWEAR_IMGS[4]], isFeatured: false, catKey: 'Innerwear' },

  // APPAREL
  { name: 'Sevenza Premium Formal Shirt – Light Blue', brand: 'Sevenza', price: 1199, description: 'Crisp poly-cotton blend formal shirt with a slim fit silhouette.', sizes: ['S','M','L','XL','XXL'], images: [APPAREL_IMGS[0], APPAREL_IMGS[1]], isFeatured: true, catKey: 'Apparel' },
  { name: 'Exterrito Classic Fit Shirt', brand: 'Exterrito', price: 999, description: 'Versatile classic fit shirt, suitable for office and casual wear.', sizes: ['M','L','XL','XXL'], images: [APPAREL_IMGS[2], APPAREL_IMGS[3]], isFeatured: true, catKey: 'Apparel' },
  { name: 'Arrow Regular Fit Check Shirt', brand: 'Arrow', price: 1499, description: 'Premium cotton check shirt with a regular, relaxed fit.', sizes: ['S','M','L','XL'], images: [APPAREL_IMGS[4]], isFeatured: false, catKey: 'Apparel' },
  { name: 'Peter England Slim Fit Trousers', brand: 'Peter England', price: 1299, description: 'Flat-front slim fit trousers, perfect for formal occasions.', sizes: ['28','30','32','34','36'], images: [APPAREL_IMGS[5]], isFeatured: false, catKey: 'Apparel' },
  { name: 'Raymond Linen Blend Shirt', brand: 'Raymond', price: 1799, description: 'Superior linen blend for a breathable, premium look.', sizes: ['S','M','L','XL','XXL'], images: [APPAREL_IMGS[6]], isFeatured: false, catKey: 'Apparel' },
  { name: 'Allen Solly Polo T-Shirt', brand: 'Allen Solly', price: 799, description: 'Classic polo collar tee with embroidered logo.', sizes: ['XS','S','M','L','XL'], images: [APPAREL_IMGS[7]], isFeatured: false, catKey: 'Apparel' },
  { name: 'Louis Philippe Oxford Formal Shirt', brand: 'Louis Philippe', price: 1999, description: 'Structured Oxford weave for a sharp boardroom look.', sizes: ['S','M','L','XL'], images: [APPAREL_IMGS[0]], isFeatured: false, catKey: 'Apparel' },
  { name: 'Park Avenue Cotton Trouser', brand: 'Park Avenue', price: 1149, description: 'Easy-iron flat-front trousers for daily work wear.', sizes: ['30','32','34','36','38'], images: [APPAREL_IMGS[1]], isFeatured: false, catKey: 'Apparel' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // 1) Get or create categories
    let innerwearCat = await Category.findOne({ name: /innerwear/i });
    let apparelCat   = await Category.findOne({ name: /apparel/i });

    if (!innerwearCat) {
      innerwearCat = await Category.create({ name: 'Innerwear', image: INNERWEAR_IMGS[0] });
      console.log('Created Innerwear category');
    }
    if (!apparelCat) {
      apparelCat = await Category.create({ name: 'Apparel', image: APPAREL_IMGS[0] });
      console.log('Created Apparel category');
    }

    const catMap = { Innerwear: innerwearCat._id, Apparel: apparelCat._id };

    // 2) Insert products (skip existing by exact name)
    let productsAdded = 0;
    for (const p of PRODUCTS) {
      const exists = await Product.findOne({ name: p.name });
      if (!exists) {
        const { catKey, ...rest } = p;
        await Product.create({ ...rest, category: catMap[catKey] });
        productsAdded++;
      }
    }
    console.log(`✅ Products added: ${productsAdded} new (${PRODUCTS.length - productsAdded} already existed)`);

    // 3) Clear old gallery and replace with verified images
    await Gallery.deleteMany({});
    console.log('Cleared old look book images');
    let galleryAdded = 0;
    for (const img of LOOKBOOK_IMGS) {
      await Gallery.create({ imageUrl: img.url, caption: img.caption });
      galleryAdded++;
    }
    console.log(`✅ Look Book images added: ${galleryAdded} fresh images`);
    
    // 4) Seed settings (Upsert)
    await Setting.findOneAndUpdate(
      {}, 
      {
        $setOnInsert: {
          shopName: 'Perfect Mens Wear',
          aboutText: 'Premium quality innerwear, casuals & formals — curated for the modern man. We believe in creating high-quality, premium apparel that challenges the status quo. Every drop is crafted with relentless attention to detail.',
          homeBanners: ['https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80'],
          contactEmail: 'contact@perfectmenswear.com',
          contactNumber: '9988776655',
          whatsappNumber: '919988776655',
          address: 'Mumbai, Maharashtra, India',
          footerTagline: 'Premium quality. Delivered with care.',
          marqueeText: '✦ Premium Quality · Fast Enquiry · 100+ Brands · WhatsApp Us Now ✦'
        }
      },
      { upsert: true, new: true }
    );
    console.log('✅ Default settings verified/updated');

    console.log('\n🎉 Seed complete! Refresh the website to see all content with pagination.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
