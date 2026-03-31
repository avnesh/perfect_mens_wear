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
    return <div className="flex justify-center items-center h-[50vh]"><div className="w-16 h-16 border-4 border-theme-yellow border-t-theme-black rounded-full animate-spin"></div></div>;
  }

  if (!stats) return null;

  const { summary, chartData } = stats;

  return (
    <div className="space-y-8 animate-fade-in max-w-[1400px]">
      <div className="flex items-center justify-between mb-8">
         <div>
            <h1 className="text-4xl font-display font-black text-theme-black uppercase tracking-tight">System Status</h1>
            <p className="mt-2 text-gray-400 font-medium">Real-time metrics for your store performance.</p>
         </div>
         <div className="px-4 py-2 bg-theme-yellow text-theme-black font-bold uppercase tracking-widest text-xs border-2 border-theme-black shadow-[4px_4px_0px_#111]">
            Live Mode
         </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 border-2 border-gray-100 flex items-center gap-6 hover:shadow-[4px_4px_0px_#111] hover:-translate-y-1 transition-all rounded-xl relative overflow-hidden group">
          <div className="p-4 bg-gray-50 text-theme-black rounded-lg border-2 border-gray-100 group-hover:bg-theme-black group-hover:text-theme-yellow group-hover:border-theme-black transition-colors">
            <Package size={28} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Products</p>
            <p className="text-3xl font-display font-black text-theme-black mt-1">{summary.products}</p>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-theme-yellow rounded-bl-full -z-10 translate-x-8 -translate-y-8 opacity-0 group-hover:translate-x-0 group-hover:-translate-y-0 group-hover:opacity-100 transition-all duration-300"></div>
        </div>

        <div className="bg-white p-6 border-2 border-gray-100 flex items-center gap-6 hover:shadow-[4px_4px_0px_#111] hover:-translate-y-1 transition-all rounded-xl relative overflow-hidden group">
          <div className="p-4 bg-gray-50 text-theme-black rounded-lg border-2 border-gray-100 group-hover:bg-theme-black group-hover:text-theme-yellow group-hover:border-theme-black transition-colors">
            <Grid size={28} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Categories</p>
            <p className="text-3xl font-display font-black text-theme-black mt-1">{summary.categories}</p>
          </div>
           <div className="absolute top-0 right-0 w-16 h-16 bg-theme-yellow rounded-bl-full -z-10 translate-x-8 -translate-y-8 opacity-0 group-hover:translate-x-0 group-hover:-translate-y-0 group-hover:opacity-100 transition-all duration-300"></div>
        </div>

        <div className="bg-white p-6 border-2 border-gray-100 flex items-center gap-6 hover:shadow-[4px_4px_0px_#111] hover:-translate-y-1 transition-all rounded-xl relative overflow-hidden group">
          <div className="p-4 bg-gray-50 text-theme-black rounded-lg border-2 border-gray-100 group-hover:bg-theme-black group-hover:text-theme-yellow group-hover:border-theme-black transition-colors">
            <ShoppingBag size={28} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Orders</p>
            <p className="text-3xl font-display font-black text-theme-black mt-1">{summary.orders}</p>
          </div>
           <div className="absolute top-0 right-0 w-16 h-16 bg-theme-yellow rounded-bl-full -z-10 translate-x-8 -translate-y-8 opacity-0 group-hover:translate-x-0 group-hover:-translate-y-0 group-hover:opacity-100 transition-all duration-300"></div>
        </div>

        <div className="bg-theme-black p-6 border-2 border-theme-black flex items-center gap-6 hover:shadow-[4px_4px_0px_#FFEA00] hover:-translate-y-1 transition-all rounded-xl relative overflow-hidden group">
          <div className="p-4 bg-theme-yellow text-theme-black rounded-lg border-2 border-theme-yellow">
            <IndianRupee size={28} strokeWidth={3} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Gross Revenue</p>
            <p className="text-3xl font-display font-black text-white mt-1">₹{summary.revenue}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        
        {/* Revenue Chart */}
        <div className="bg-white p-8 border-2 border-gray-100 rounded-2xl relative">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
             <div className="w-3 h-8 bg-theme-yellow"></div>
             <h2 className="text-xl font-display font-black text-theme-black uppercase tracking-wider">Revenue Insight</h2>
          </div>
          <div className="h-72 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#111111" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#111111" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="displayDate" axisLine={{ stroke: '#111' }} tickLine={false} tick={{ fontSize: 13, fill: '#6B7280', fontWeight: 'bold' }} dy={15} />
                <YAxis axisLine={{ stroke: '#111' }} tickLine={false} tick={{ fontSize: 13, fill: '#6B7280', fontWeight: 'bold' }} dx={-15} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  cursor={{stroke: '#111', strokeWidth: 1, strokeDasharray: '4 4'}}
                  contentStyle={{ borderRadius: '0', border: '2px solid #111', backgroundColor: '#FFEA00', color: '#111', fontWeight: 'bold' }}
                  itemStyle={{ color: '#111' }}
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#111111" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{r: 6, fill: '#FFEA00', stroke: '#111', strokeWidth: 3}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white p-8 border-2 border-gray-100 rounded-2xl relative">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
             <div className="w-3 h-8 bg-theme-black"></div>
             <h2 className="text-xl font-display font-black text-theme-black uppercase tracking-wider">Order Volume</h2>
          </div>
          <div className="h-72 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFEA00" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FFEA00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="displayDate" axisLine={{ stroke: '#111' }} tickLine={false} tick={{ fontSize: 13, fill: '#6B7280', fontWeight: 'bold' }} dy={15} />
                <YAxis axisLine={{ stroke: '#111' }} tickLine={false} tick={{ fontSize: 13, fill: '#6B7280', fontWeight: 'bold' }} dx={-15} />
                <Tooltip 
                  cursor={{stroke: '#111', strokeWidth: 1, strokeDasharray: '4 4'}}
                  contentStyle={{ borderRadius: '0', border: '2px solid #111', backgroundColor: '#111111', color: '#fff', fontWeight: 'bold' }}
                  itemStyle={{ color: '#FFEA00' }}
                  formatter={(value) => [value, 'Orders']}
                />
                <Area type="monotone" dataKey="orders" stroke="#FFEA00" strokeWidth={4} fillOpacity={1} fill="url(#colorOrders)" activeDot={{r: 6, fill: '#111', stroke: '#FFEA00', strokeWidth: 3}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
