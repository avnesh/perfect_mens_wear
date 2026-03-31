import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MessageCircle, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import SEO from '../components/SEO';
import api from '../api';
import { ENABLE_ECOMMERCE } from '../config';

const ProductDetail = () => {
  const { id } = useParams();
  const { cart, addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [settings, setSettings] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, settingsRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get('/settings')
        ]);
        setProduct(productRes.data);
        setMainImage(productRes.data.images[0]);
        if(productRes.data.sizes?.length > 0) {
          setSelectedSize(productRes.data.sizes[0]);
        }
        setSettings(settingsRes.data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-theme-yellow border-t-theme-black rounded-full animate-spin"></div>
    </div>
  );
  
  if (!product) return <div className="text-center py-32 text-2xl font-display font-black uppercase text-gray-500">Product not found</div>;

  const wpNumber = settings?.whatsappNumber?.replace(/\D/g, '') || '';
  // Different message if eCommerce is Enabled vs Disabled
  const wpText = ENABLE_ECOMMERCE 
    ? encodeURIComponent(`Hi, I'm interested in ${product.name} (Size: ${selectedSize}) for ₹${product.price}`)
    : encodeURIComponent(`Hi, I am interested in ${product.name}. Please share more details.`);
  const wpLink = `https://wa.me/${wpNumber}?text=${wpText}`;

  return (
    <div className="max-w-[1500px] mx-auto px-4 lg:px-8 py-12 lg:py-20 bg-white min-h-[80vh]">
      <SEO 
        title={`${product.name} | Premium Fashion`} 
        description={product.description?.substring(0, 150)} 
        name={settings?.shopName || 'Shop'}
      />
      <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-start">
        
        {/* Images Column */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 lg:sticky lg:top-32">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-28 hide-scrollbar shrink-0">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                className={`flex-shrink-0 w-24 h-32 overflow-hidden border-2 transition-all ${mainImage === img ? 'border-theme-black opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                onClick={() => setMainImage(img)}
              >
                <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          {/* Main Photo */}
          <div className="flex-1 bg-gray-50 aspect-[3/4] overflow-hidden cursor-crosshair">
            <img 
              src={mainImage} 
              alt={product.name} 
              className="w-full h-full object-cover animate-fade-in hover:scale-150 transition-transform duration-[400ms] origin-center" 
            />
          </div>
        </div>

        {/* Details Column */}
        <div className="lg:col-span-5 mt-10 lg:mt-0 pt-4 lg:pr-8">
          <div className="mb-8 border-b border-gray-100 pb-8">
            <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-4">{product.category?.name || 'Essential'}</h3>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-theme-black uppercase leading-none">{product.name}</h1>
            {ENABLE_ECOMMERCE && (
                <p className="text-3xl font-display text-theme-black font-black mt-6 tracking-tighter">₹{product.price}</p>
            )}
          </div>

          <div className="py-8">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm tracking-widest font-bold uppercase text-gray-500">Available Sizes</h3>
                {ENABLE_ECOMMERCE && <span className="text-xs font-bold underline cursor-pointer text-gray-400 hover:text-theme-black">Size Guide</span>}
             </div>
             <div className="flex flex-wrap gap-3">
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  onClick={() => ENABLE_ECOMMERCE && setSelectedSize(size)}
                  className={`border-2 py-3 px-6 text-sm font-black uppercase tracking-wider transition-colors ${
                    !ENABLE_ECOMMERCE 
                      ? 'border-gray-200 text-gray-500 cursor-default bg-gray-50' 
                      : selectedSize === size
                        ? 'border-theme-black bg-theme-black text-theme-yellow'
                        : 'border-gray-200 text-gray-500 hover:border-theme-black hover:text-theme-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {ENABLE_ECOMMERCE && (
              <div className="pb-8">
                <h3 className="text-sm tracking-widest font-bold uppercase text-gray-500 mb-4">Quantity</h3>
                <div className="relative w-32">
                  <select 
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="w-full border-2 border-gray-200 appearance-none py-4 px-6 font-bold text-center bg-transparent focus:border-theme-black outline-none rounded-none cursor-pointer"
                    >
                    {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-theme-black">
                    <svg className="fill-current h-4 w-4 border-l pl-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
          )}

          <div className="flex flex-col gap-4 mt-2 pb-12 border-b border-gray-100">
            {ENABLE_ECOMMERCE && (
                <button
                  onClick={() => {
                    addToCart(product, qty, selectedSize);
                    toast.success(`${product.name} added to cart!`, {
                      icon: <CheckCircle2 className="text-theme-yellow fill-theme-black" />,
                      style: { background: '#111', color: '#fff', fontWeight: 'bold' }
                    });
                  }}
                  className="flex items-center justify-center gap-3 w-full bg-theme-black text-white px-8 py-5 border-2 border-theme-black font-bold uppercase tracking-widest hover:bg-theme-yellow hover:text-theme-black transition-all group"
                >
                  <ShoppingCart size={20} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
                  Add to Cart
                </button>
            )}
            
            <a
              href={wpLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-3 w-full px-8 py-5 font-bold uppercase tracking-widest transition-all border-2 ${
                  ENABLE_ECOMMERCE 
                  ? 'bg-[#25D366] text-white border-[#25D366] hover:bg-opacity-90'
                  : 'bg-theme-black text-theme-yellow border-theme-black hover:bg-theme-yellow hover:text-theme-black'
              }`}
            >
              <MessageCircle size={20} fill="currentColor" />
              {ENABLE_ECOMMERCE ? 'Buy via WhatsApp' : 'Enquire on WhatsApp'}
            </a>
          </div>

          <div className="mt-12 space-y-8">
            <div>
               <h3 className="text-sm tracking-widest font-bold uppercase text-theme-black mb-4 flex items-center gap-2">
                 <span className="w-4 h-[2px] bg-theme-yellow"></span> Details
               </h3>
               <p className="text-base text-gray-500 font-medium leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </div>
            
            {/* Value Props */}
            {ENABLE_ECOMMERCE && (
                <div className="pt-8 border-t border-gray-100 grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 flex flex-col items-center justify-center text-center">
                      <span className="text-2xl mb-2">🚚</span>
                      <p className="text-xs font-bold uppercase tracking-widest text-theme-black">Fast Delivery</p>
                  </div>
                  <div className="bg-gray-50 p-6 flex flex-col items-center justify-center text-center">
                      <span className="text-2xl mb-2">🔄</span>
                      <p className="text-xs font-bold uppercase tracking-widest text-theme-black">Easy Returns</p>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
