import React, { useState, useEffect } from 'react';
import api from '../../api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async (pageNum = 1) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/orders?page=${pageNum}&limit=10`);
      setOrders(data.orders);
      setPage(data.page);
      setTotalPages(data.pages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated');
      setOrders(orders.map(order => order._id === orderId ? { ...order, orderStatus: newStatus } : order));
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && orders.length === 0) return <div>Loading orders...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {orders.map((order) => (
            <li key={order._id} className="p-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm text-gray-500">#{order._id.slice(-6).toUpperCase()}</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                    <span className="text-gray-500 text-sm">{format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{order.customerDetails.name}</h3>
                  <p className="text-sm text-gray-500">{order.customerDetails.phone} | {order.customerDetails.address}, {order.customerDetails.pincode}</p>
                  
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700">Items ({order.products.length}):</p>
                    <ul className="mt-1 text-sm text-gray-500 list-disc list-inside">
                      {order.products.map((item, idx) => (
                        <li key={idx}>{item.name} - Size: {item.size} x {item.qty}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 text-right">
                  <div className="text-lg font-bold text-gray-900">₹{order.totalAmount}</div>
                  <div className="text-sm text-gray-500">Method: {order.paymentType}</div>
                  
                  <select 
                    value={order.orderStatus} 
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md border"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 border rounded-md disabled:opacity-50">Prev</button>
          <span className="px-4 py-2">Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-4 py-2 border rounded-md disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
};

export default Orders;
