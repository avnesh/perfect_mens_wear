import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import api from '../api';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cart, removeFromCart, updateQty, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: '',
  });

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setLoading(true);
      await api.post('/orders', {
        products: cart.map(item => ({
          product: item.product,
          name: item.name,
          price: item.price,
          qty: item.qty,
          size: item.size
        })),
        customerDetails: formData,
        paymentType: 'COD',
        totalAmount
      });
      
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/');
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return toast.error('Cart is empty');
    
    let text = `Hi, I want to place an order:%0A%0A`;
    cart.forEach(item => {
      text += `*Product:* ${item.name}%0A*Size:* ${item.size}%0A*Qty:* ${item.qty}%0A*Price:* ₹${item.price}%0A%0A`;
    });
    
    text += `*Total Amount:* ₹${totalAmount}%0A%0A`;
    if(formData.name) text += `*Name:* ${formData.name}%0A`;
    if(formData.address) text += `*Address:* ${formData.address}, ${formData.pincode}%0A`;
    
    window.open(`https://wa.me/919892843211?text=${text}`, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <button onClick={() => navigate('/shop')} className="text-purple-600 hover:text-purple-700 font-medium">
          Continue Shopping &rarr;
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <h2 className="text-xl font-bold mb-4">Delivery Details</h2>
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input required type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input required type="tel" className="w-full px-4 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                <textarea required className="w-full px-4 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500" rows="3" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input required type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} />
              </div>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-4 border-b pb-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    <img src={item.image || '/placeholder.png'} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <select 
                        value={item.qty}
                        onChange={(e) => updateQty(item.product, item.size, Number(e.target.value))}
                        className="border rounded p-1 text-sm"
                      >
                        {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                      <span className="font-medium">₹{item.price * item.qty}</span>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.product, item.size)} className="text-red-500 hover:bg-red-50 p-2 rounded-md self-start">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex border-t pt-4 justify-between text-lg font-bold mb-6">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>
            
            <div className="space-y-3">
              <button form="checkout-form" type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex justify-center items-center">
                {loading ? 'Processing...' : 'Place Order (COD)'}
              </button>
              
              <button type="button" onClick={handleWhatsAppOrder} className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2">
                Order via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
