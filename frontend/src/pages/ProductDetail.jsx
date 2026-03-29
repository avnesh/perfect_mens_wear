import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MessageCircle, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import SEO from '../components/SEO';
import api from '../api';

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

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  const wpNumber = settings?.whatsappNumber?.replace(/\D/g, '') || '';
  const wpText = encodeURIComponent(`Hi, I want to order ${product.name} (Size: ${selectedSize}) for $${product.price}`);
  const wpLink = `https://wa.me/${wpNumber}?text=${wpText}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <SEO 
        title={product.name} 
        description={product.description?.substring(0, 150)} 
        name={settings?.shopName || 'Perfect Mens Wear'}
      />
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
        {/* Images */}
        <div className="flex flex-col-reverse lg:flex-row gap-4">
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:w-24">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                className={`flex-shrink-0 w-20 h-24 lg:w-24 lg:h-32 rounded-lg overflow-hidden border-2 ${mainImage === img ? 'border-purple-600' : 'border-transparent'}`}
                onClick={() => setMainImage(img)}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="w-full aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden">
            <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Details */}
        <div className="mt-10 px-4 sm:px-0 lg:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
          <div className="mt-3">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl text-purple-600 font-bold">${product.price}</p>
          </div>

          <div className="mt-6 border-y border-gray-200 py-6">
            <h3 className="sr-only">Description</h3>
            <p className="text-base text-gray-700 whitespace-pre-wrap">{product.description}</p>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-gray-900 font-medium">Quantity</h3>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <select 
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div className="flex items-center justify-between mt-8">
              <h3 className="text-sm text-gray-900 font-medium">Size</h3>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4">
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`border rounded-xl py-3 text-sm font-medium uppercase transition ${
                    selectedSize === size
                      ? 'border-purple-600 bg-purple-50 text-purple-600'
                      : 'border-gray-200 text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4">
            <button
              onClick={() => {
                addToCart(product, selectedSize, qty);
                toast.success(`${product.name} added to cart!`);
              }}
              className="flex items-center justify-center gap-2 w-full bg-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/30 transform hover:-translate-y-1"
            >
              <ShoppingCart size={24} />
              Add to Cart
            </button>
            <a
              href={wpLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#1ebd5a] transition-colors shadow-lg shadow-[#25D366]/30 transform hover:-translate-y-1"
            >
              <MessageCircle size={24} />
              Order via WhatsApp
            </a>
            <p className="text-sm text-gray-500 text-center">Safe and secure direct ordering</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
