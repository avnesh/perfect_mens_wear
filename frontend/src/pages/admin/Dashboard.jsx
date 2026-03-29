import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Package, Grid, IndianRupee, ShoppingBag } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format, parseISO } from 'date-fns';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/stats/dashboard');
        
        // Format dates nicely for the charts
        if(data && data.chartData) {
            data.chartData = data.chartData.map(item => ({
                ...item,
                displayDate: format(parseISO(item.date), 'MMM dd')
            }));
        }

        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>;
  }

  if (!stats) return null;

  const { summary, chartData } = stats;

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Dashboard Overview</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-full">
            <Package size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Products</p>
            <p className="text-3xl font-bold text-gray-900">{summary.products}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full">
            <Grid size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Categories</p>
            <p className="text-3xl font-bold text-gray-900">{summary.categories}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="p-4 bg-pink-50 text-pink-600 rounded-full">
            <ShoppingBag size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900">{summary.orders}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="p-4 bg-green-50 text-green-600 rounded-full">
            <IndianRupee size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Gross Revenue</p>
            <p className="text-3xl font-bold text-gray-900">₹{summary.revenue}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue (Last 7 Days)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dx={-10} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Orders (Last 7 Days)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [value, 'Orders']}
                />
                <Area type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorOrders)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
