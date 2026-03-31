import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { toast } from 'react-toastify';
import { Plus, Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 10;

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [page, setPage]               = useState(1);
  const [search, setSearch]           = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products?limit=1000');
      setAllProducts(res.data.products || []);
      setPage(1);
    } catch {
      toast.error('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchData();
    } catch { toast.error('Delete failed'); }
  };

  /* ── Filter + paginate ── */
  const filtered    = allProducts.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage    = Math.min(page, totalPages);
  const pageItems   = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSearch = (val) => { setSearch(val); setPage(1); };

  /* ── Pagination page numbers with ellipsis ── */
  const getPageNums = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = new Set([1, totalPages, safePage, safePage - 1, safePage + 1].filter(n => n >= 1 && n <= totalPages));
    return [...pages].sort((a, b) => a - b).reduce((acc, n, i, arr) => {
      if (i > 0 && arr[i - 1] !== n - 1) acc.push('…');
      acc.push(n);
      return acc;
    }, []);
  };

  return (
    <div className="max-w-[1400px] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-display font-black text-theme-black uppercase tracking-tight">Product Catalog</h1>
          <p className="mt-1 text-gray-400 font-medium">{allProducts.length} products total</p>
        </div>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="bg-theme-black text-theme-yellow px-8 py-4 flex items-center gap-3 font-black uppercase tracking-widest border-2 border-theme-black hover:bg-theme-yellow hover:text-theme-black transition-colors"
        >
          <Plus size={20} strokeWidth={3} /> Add Product
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, brand or category…"
          value={search}
          onChange={e => handleSearch(e.target.value)}
          className="w-full md:w-80 border-2 border-gray-200 px-4 py-3 bg-gray-50 focus:bg-white focus:border-theme-black outline-none text-sm font-medium transition-colors"
        />
        {search && (
          <span className="ml-3 text-xs text-gray-400 font-bold uppercase tracking-widest">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border-2 border-gray-200">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-24 text-gray-400 font-black uppercase tracking-widest animate-pulse">
              Loading…
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="px-6 py-5 text-xs font-black text-gray-500 uppercase tracking-widest">Product</th>
                  <th className="px-6 py-5 text-xs font-black text-gray-500 uppercase tracking-widest">Price</th>
                  <th className="px-6 py-5 text-xs font-black text-gray-500 uppercase tracking-widest">Category</th>
                  <th className="px-6 py-5 text-xs font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pageItems.map((p, index) => (
                  <tr key={p._id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-18 bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0" style={{ aspectRatio: '3/4' }}>
                          <img
                            src={p.images?.[0]}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&q=60'; }}
                          />
                        </div>
                        <div>
                          <p className="font-black text-theme-black text-sm uppercase leading-snug">{p.name}</p>
                          {p.brand && <p className="text-xs text-gray-400 font-bold mt-0.5">{p.brand}</p>}
                          {p.isFeatured && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-theme-yellow text-theme-black text-[9px] font-black tracking-widest uppercase">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-theme-black">₹{p.price}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wide">
                      {p.category?.name || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/products/edit/${p._id}`)}
                          className="p-2.5 text-gray-400 border-2 border-transparent hover:border-theme-black hover:text-theme-black bg-white shadow-sm transition-all"
                          title="Edit"
                        >
                          <Edit2 size={15} strokeWidth={3} />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-2.5 text-red-400 border-2 border-transparent hover:border-red-500 hover:text-red-600 hover:bg-red-50 bg-white shadow-sm transition-all"
                          title="Delete"
                        >
                          <Trash2 size={15} strokeWidth={3} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <p className="text-gray-400 font-bold uppercase tracking-widest mb-4">
                        {search ? `No products match "${search}"` : 'No products yet.'}
                      </p>
                      {!search && (
                        <button
                          onClick={() => navigate('/admin/products/new')}
                          className="bg-theme-black text-theme-yellow px-6 py-3 font-bold uppercase tracking-widest"
                        >
                          Add First Product
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination bar — inside the table card */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-400 font-black uppercase tracking-widest">
              Page {safePage} of {totalPages} · showing {pageItems.length} of {filtered.length}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="flex items-center px-3 py-2 border-2 border-gray-200 text-xs font-black uppercase hover:border-theme-black disabled:opacity-30 transition"
              >
                <ChevronLeft size={14} /> Prev
              </button>

              {getPageNums().map((n, i) =>
                n === '…' ? (
                  <span key={`e-${i}`} className="px-2 text-gray-400 font-black">…</span>
                ) : (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-9 h-9 text-xs font-black border-2 transition ${n === safePage ? 'bg-theme-black text-theme-yellow border-theme-black' : 'border-gray-200 hover:border-theme-black'}`}
                  >
                    {n}
                  </button>
                )
              )}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="flex items-center px-3 py-2 border-2 border-gray-200 text-xs font-black uppercase hover:border-theme-black disabled:opacity-30 transition"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
