import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, Search, Trash2, Plus, Minus, CheckCircle, PackageOpen } from 'lucide-react';
import { addToCart, removeFromCart, updateQuantity, clearCart } from '../../store/cartSlice';

function ProductStore() {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const { token } = useSelector(state => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load products from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load products:', err);
        setLoading(false);
      });
  }, []);

  // Derive unique categories dynamically from product data, fallback to default set
  const rawCategories = products.length > 0
    ? products.map(p => p.category).filter(Boolean)
    : ['Hair Care', 'Beard Care', 'Skin Care', 'Styling', 'Tools'];
  const categories = ['All', ...Array.from(new Set(rawCategories))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCheckout = async () => {
    if (cart.items.length === 0) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart.items.map(item => ({
            product: item.id,
            quantity: item.quantity
          })),
          shippingAddress: 'Main Salon Guest Desk',
          paymentMethod: 'Cash'
        })
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        setOrderCompleted(true);
        setTimeout(() => {
          dispatch(clearCart());
          setOrderCompleted(false);
          setIsCartOpen(false);
        }, 2500);
      } else {
        alert(resData.message || 'Checkout failed.');
      }
    } catch (err) {
      alert('Could not connect to checkout service.');
    }
  };

  // Calculations
  const taxRate = 0.0825; // 8.25%
  const subtotal = cart.totalAmount;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  if (loading) {
    return (
      <div className="text-slate-500 text-center py-20 font-semibold">
        Loading product catalog...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 relative">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="serif-font text-3xl font-bold text-slate-800 mb-2">Aurum Retail Store</h1>
          <p className="text-sm text-slate-500">Shop our curated range of professional hair care, beard maintenance, and facial skincare products.</p>
        </div>

        {/* Cart Trigger Button */}
        <button 
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all self-start relative"
        >
          <ShoppingCart size={18} />
          <span>My Cart</span>
          {cart.totalQuantity > 0 && (
            <span className="absolute -top-2.5 -right-2 bg-rose-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
              {cart.totalQuantity}
            </span>
          )}
        </button>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full max-w-[300px]">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 outline-none h-10 transition-all"
          />
          <Search size={14} className="absolute left-3 top-3.5 text-slate-400" />
        </div>

        <div className="flex gap-2.5 flex-wrap">
          {categories.map(cat => {
            const isActive = categoryFilter === cat;
            
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(p => (
          <div key={p._id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
            <span className="self-start text-[10px] bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded font-bold uppercase tracking-wider mb-3">
              {p.category}
            </span>

            <h3 className="text-base font-bold text-slate-800 mb-2">{p.name}</h3>
            <p className="text-xs text-slate-500 flex-grow mb-5 min-h-[36px] leading-relaxed">
              {p.description || 'Professional grooming treatment formula.'}
            </p>

            <div className="flex justify-between items-center mt-auto border-t border-slate-50 pt-4">
              <span className="text-lg font-bold text-slate-800">
                ₹{p.price?.toFixed(2)}
              </span>
              <button 
                onClick={() => dispatch(addToCart({
                  id: p._id,
                  name: p.name,
                  price: p.price,
                  category: p.category
                }))}
                className="border border-indigo-600 hover:bg-indigo-50 text-indigo-600 text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
              >
                Add To Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Slider Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end p-0">
          {/* Overlay Close area */}
          <div onClick={() => setIsCartOpen(false)} className="flex-grow" />

          {/* Drawer content panel */}
          <div className="w-full max-w-[450px] bg-white h-full flex flex-col p-8 shadow-2xl border-l border-slate-200 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="serif-font text-lg font-bold text-slate-800 flex items-center gap-2">
                <ShoppingCart size={22} className="text-indigo-600" />
                Shopping Drawer
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl font-bold bg-transparent border-none cursor-pointer">
                &times;
              </button>
            </div>

            {orderCompleted ? (
              <div className="flex-grow flex flex-col items-center justify-center gap-3.5 text-center">
                <CheckCircle size={60} className="text-emerald-600" />
                <h3 className="serif-font text-lg font-bold text-slate-800">Order Placed Successfully!</h3>
                <p className="text-xs text-slate-500">Generating transaction invoice and packaging store items.</p>
              </div>
            ) : cart.items.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center gap-3 text-slate-400">
                <PackageOpen size={48} className="text-slate-300" />
                <span className="text-sm font-semibold">Your cart is empty.</span>
              </div>
            ) : (
              <>
                {/* Cart Items list */}
                <div className="flex-grow overflow-y-auto flex flex-col gap-4 pr-1.5">
                  {cart.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center border-b border-slate-100 pb-4">
                      <div className="flex-grow pr-4">
                        <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                        <div className="text-xs text-indigo-600 mt-1 font-semibold">
                          ₹{item.price?.toFixed(2)} each
                        </div>
                      </div>

                      {/* Quantity Toggles */}
                      <div className="flex items-center gap-2.5 mr-4">
                        <button 
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                          className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold text-slate-800 w-5 text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                          className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button 
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-slate-400 hover:text-red-600 transition-colors bg-transparent border-none cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Subtotal summaries */}
                <div className="border-t border-slate-100 pt-5 flex flex-col gap-3 text-xs text-slate-500 font-semibold">
                  <div className="flex justify-between">
                    <span>Items Subtotal:</span>
                    <span className="text-slate-800 font-bold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Sales Tax (8.25%):</span>
                    <span className="text-slate-800 font-bold">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-800 border-t border-slate-100 pt-3.5 mt-2.5">
                    <span>Order Total:</span>
                    <span className="text-indigo-600 font-black">₹{total.toFixed(2)}</span>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    className="mt-5 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    Place Secure Order (₹{total.toFixed(2)})
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductStore;
