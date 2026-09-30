import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Package, AlertTriangle, RefreshCw, Layers, Database, Plus, X, Trash2 } from 'lucide-react';

function InventoryTracker() {
  const { token } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('retail'); // Options: retail | operational
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const minThreshold = 5;

  // Add Item Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [formType, setFormType] = useState('retail'); // retail | operational
  const [submitting, setSubmitting] = useState(false);

  // Retail Product fields
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('Hair Care');
  const [productBrand, setProductBrand] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productStock, setProductStock] = useState('20');
  const [productDesc, setProductDesc] = useState('');

  // Operational Supply fields
  const [supplyName, setSupplyName] = useState('');
  const [supplyCategory, setSupplyCategory] = useState('Shampoo');
  const [supplierName, setSupplierName] = useState('');
  const [supplyStock, setSupplyStock] = useState('20');
  const [supplyMinStock, setSupplyMinStock] = useState('10');
  const [supplyUnit, setSupplyUnit] = useState('bottles');
  const [supplyCost, setSupplyCost] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'retail') {
        const response = await fetch('http://localhost:5000/api/products');
        const resData = await response.json();
        if (resData.success) {
          setItems(resData.data);
        }
      } else {
        const response = await fetch('http://localhost:5000/api/inventory', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const resData = await response.json();
        if (resData.success) {
          setItems(resData.data);
        }
      }
    } catch (err) {
      console.error('Failed to load inventory assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, token]);

  const resetForm = () => {
    setProductName('');
    setProductCategory('Hair Care');
    setProductBrand('');
    setProductPrice('');
    setProductStock('20');
    setProductDesc('');

    setSupplyName('');
    setSupplyCategory('Shampoo');
    setSupplierName('');
    setSupplyStock('20');
    setSupplyMinStock('10');
    setSupplyUnit('bottles');
    setSupplyCost('');

    setShowAddForm(false);
  };

  const handleOpenAddForm = () => {
    setFormType(activeTab);
    setShowAddForm(prev => !prev);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (formType === 'retail') {
        if (!productName || !productPrice) {
          alert('Please fill in product name and price.');
          setSubmitting(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: productName,
            category: productCategory,
            brand: productBrand || 'Aurum',
            price: Number(productPrice),
            stockQuantity: Number(productStock) || 0,
            description: productDesc
          })
        });

        const resData = await response.json();
        if (response.ok && resData.success) {
          resetForm();
          if (activeTab !== 'retail') {
            setActiveTab('retail');
          } else {
            loadData();
          }
        } else {
          alert(resData.message || 'Failed to add product.');
        }
      } else {
        if (!supplyName || !supplyCost) {
          alert('Please fill in supply item name and cost per unit.');
          setSubmitting(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/inventory', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            itemName: supplyName,
            category: supplyCategory,
            currentStock: Number(supplyStock) || 0,
            minimumStock: Number(supplyMinStock) || 5,
            unit: supplyUnit || 'units',
            costPerUnit: Number(supplyCost),
            supplier: { name: supplierName || 'SalonSupply Co' }
          })
        });

        const resData = await response.json();
        if (response.ok && resData.success) {
          resetForm();
          if (activeTab !== 'operational') {
            setActiveTab('operational');
          } else {
            loadData();
          }
        } else {
          alert(resData.message || 'Failed to add supply item.');
        }
      }
    } catch (err) {
      alert('Could not connect to add asset.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestockRetail = async (id, currentStock) => {
    try {
      const product = items.find(p => p._id === id);
      if (!product) return;

      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: product.name,
          category: product.category,
          price: product.price,
          description: product.description,
          stockQuantity: currentStock + 10
        })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        loadData();
      } else {
        alert(resData.message || 'Failed to restock retail product.');
      }
    } catch (err) {
      alert('Could not connect to update product inventory.');
    }
  };

  const handleRestockOperational = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/inventory/${id}/restock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: 10 })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        loadData();
      } else {
        alert(resData.message || 'Failed to replenish operational supplies.');
      }
    } catch (err) {
      alert('Could not connect to replenish supplies inventory.');
    }
  };

  const handleDeleteRetail = async (id) => {
    if (!window.confirm('Are you sure you want to delete this retail product?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        loadData();
      } else {
        alert(resData.message || 'Failed to delete product.');
      }
    } catch (err) {
      alert('Could not connect to delete product.');
    }
  };

  const handleDeleteOperational = async (id) => {
    if (!window.confirm('Are you sure you want to delete this salon supply item?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/inventory/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        loadData();
      } else {
        alert(resData.message || 'Failed to delete supply item.');
      }
    } catch (err) {
      alert('Could not connect to delete supply item.');
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm col-span-2">
      
      {/* Header with Title, Add Button & Tab Selectors */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 border-b border-slate-100 pb-4">
        <div>
          <h3 className="serif-font text-lg font-bold text-slate-800 flex items-center gap-2">
            <Package size={20} className="text-indigo-600" />
            Inventory & Asset Management
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-1">Manage retail sales catalogs and stylist workspace tools.</p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          {/* Add Product/Supply Trigger */}
          <button
            onClick={handleOpenAddForm}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            {showAddForm ? <X size={14} /> : <Plus size={14} />}
            {showAddForm ? 'Cancel' : (activeTab === 'retail' ? 'Add New Product' : 'Add New Supply')}
          </button>

          {/* Tab Selector */}
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => { setActiveTab('retail'); setFormType('retail'); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'retail' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layers size={13} />
              Retail Products
            </button>
            
            <button 
              onClick={() => { setActiveTab('operational'); setFormType('operational'); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'operational' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Database size={13} />
              Salon Supplies
            </button>
          </div>
        </div>
      </div>

      {/* Add New Item Expandable Form */}
      {showAddForm && (
        <form onSubmit={handleAddItem} className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 animate-fade-in shadow-inner">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Plus size={14} className="text-indigo-600" />
              {formType === 'retail' ? 'Add New Retail Product' : 'Add New Salon Supply Item'}
            </h4>

            {/* Form Type Switcher */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormType('retail')}
                className={`text-[11px] font-bold px-2.5 py-1 rounded transition-colors ${
                  formType === 'retail' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                Retail Product
              </button>
              <button
                type="button"
                onClick={() => setFormType('operational')}
                className={`text-[11px] font-bold px-2.5 py-1 rounded transition-colors ${
                  formType === 'operational' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                Salon Supply
              </button>
            </div>
          </div>

          {formType === 'retail' ? (
            /* Retail Product Form Fields */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Product Name *</label>
                <input
                  type="text"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:border-indigo-500 outline-none"
                  placeholder="e.g. Matte Clay Wax"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Category *</label>
                <select
                  value={productCategory}
                  onChange={e => setProductCategory(e.target.value)}
                  className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:border-indigo-500 outline-none cursor-pointer"
                >
                  <option value="Hair Care">Hair Care</option>
                  <option value="Beard Care">Beard Care</option>
                  <option value="Skin Care">Skin Care</option>
                  <option value="Styling">Styling</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Brand</label>
                <input
                  type="text"
                  value={productBrand}
                  onChange={e => setProductBrand(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:border-indigo-500 outline-none"
                  placeholder="e.g. StylePro"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Price (₹) *</label>
                <input
                  type="number"
                  value={productPrice}
                  onChange={e => setProductPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:border-indigo-500 outline-none"
                  placeholder="e.g. 299"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Initial Stock Quantity</label>
                <input
                  type="number"
                  value={productStock}
                  onChange={e => setProductStock(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:border-indigo-500 outline-none"
                  placeholder="e.g. 25"
                  min="0"
                />
              </div>

              <div className="flex flex-col gap-1 md:col-span-3">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Description</label>
                <input
                  type="text"
                  value={productDesc}
                  onChange={e => setProductDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:border-indigo-500 outline-none"
                  placeholder="Brief description of product features..."
                />
              </div>
            </div>
          ) : (
            /* Salon Supply Form Fields */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Supply Item Name *</label>
                <input
                  type="text"
                  value={supplyName}
                  onChange={e => setSupplyName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:border-indigo-500 outline-none"
                  placeholder="e.g. Professional Shampoo 1L"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Category *</label>
                <select
                  value={supplyCategory}
                  onChange={e => setSupplyCategory(e.target.value)}
                  className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:border-indigo-500 outline-none cursor-pointer"
                >
                  <option value="Shampoo">Shampoo</option>
                  <option value="Hair Wax">Hair Wax</option>
                  <option value="Hair Color">Hair Color</option>
                  <option value="Face Cream">Face Cream</option>
                  <option value="Gel">Gel</option>
                  <option value="Oil">Oil</option>
                  <option value="Razor">Razor</option>
                  <option value="Towel">Towel</option>
                  <option value="Cape">Cape</option>
                  <option value="Scissors">Scissors</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Supplier Name</label>
                <input
                  type="text"
                  value={supplierName}
                  onChange={e => setSupplierName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:border-indigo-500 outline-none"
                  placeholder="e.g. SalonSupply Co"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cost Per Unit (₹) *</label>
                <input
                  type="number"
                  value={supplyCost}
                  onChange={e => setSupplyCost(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:border-indigo-500 outline-none"
                  placeholder="e.g. 199"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Current Stock</label>
                <input
                  type="number"
                  value={supplyStock}
                  onChange={e => setSupplyStock(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:border-indigo-500 outline-none"
                  placeholder="e.g. 20"
                  min="0"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Unit Type</label>
                <input
                  type="text"
                  value={supplyUnit}
                  onChange={e => setSupplyUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:border-indigo-500 outline-none"
                  placeholder="e.g. bottles, tubes, packets"
                />
              </div>
            </div>
          )}

          <div className="flex gap-2.5 mt-5">
            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Saving Asset...' : (formType === 'retail' ? 'Save Retail Product' : 'Save Salon Supply')}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="border border-slate-200 hover:bg-white text-slate-600 text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Grid Layout Table */}
      <div className="border border-slate-100 rounded-lg overflow-hidden">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">ID</th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Asset Name</th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                {activeTab === 'retail' ? 'Brand' : 'Supplier'}
              </th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Stock Status</th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Quantity</th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Unit Cost</th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-slate-400 font-medium">
                  Loading catalog inventory...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-slate-400 font-medium">
                  No assets found in database.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                if (activeTab === 'retail') {
                  const stockVal = item.stockQuantity ?? 0;
                  const isLowStock = stockVal < minThreshold;
                  return (
                    <tr key={item._id} className={`hover:bg-slate-50/50 transition-colors ${isLowStock ? 'bg-rose-50/30' : ''}`}>
                      <td className="p-4 font-mono text-xs text-slate-400">{item._id?.substring(item._id.length - 8)}</td>
                      <td className="p-4 font-bold text-slate-800">{item.name}</td>
                      <td className="p-4 text-slate-600">{item.brand || 'Aurum'}</td>
                      <td className="p-4">
                        {isLowStock ? (
                          <span className="inline-flex items-center gap-1 text-red-600 text-[10px] font-bold uppercase tracking-wider bg-red-100/50 border border-red-150 px-2 py-0.5 rounded">
                            <AlertTriangle size={12} /> Low Stock
                          </span>
                        ) : (
                          <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-wider bg-emerald-100/50 border border-emerald-150 px-2 py-0.5 rounded">
                            Healthy
                          </span>
                        )}
                      </td>
                      <td className={`p-4 font-extrabold text-sm ${isLowStock ? 'text-red-600' : 'text-slate-800'}`}>{stockVal}</td>
                      <td className="p-4 font-bold text-indigo-600">₹{item.price?.toFixed(2)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleRestockRetail(item._id, stockVal)}
                            className={`flex items-center gap-1.5 border text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded transition-all shadow-sm cursor-pointer ${
                              isLowStock 
                                ? 'border-red-200 hover:bg-red-50 text-red-700' 
                                : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                            }`}
                          >
                            <RefreshCw size={10} /> +10 Restock
                          </button>
                          <button
                            onClick={() => handleDeleteRetail(item._id)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                } else {
                  const stockVal = item.currentStock ?? 0;
                  const threshold = item.minimumStock ?? 5;
                  const isLowStock = stockVal < threshold;
                  return (
                    <tr key={item._id} className={`hover:bg-slate-50/50 transition-colors ${isLowStock ? 'bg-rose-50/30' : ''}`}>
                      <td className="p-4 font-mono text-xs text-slate-400">{item._id?.substring(item._id.length - 8)}</td>
                      <td className="p-4 font-bold text-slate-800">{item.itemName}</td>
                      <td className="p-4 text-slate-600 truncate max-w-[120px]">{item.supplier?.name || 'N/A'}</td>
                      <td className="p-4">
                        {isLowStock ? (
                          <span className="inline-flex items-center gap-1 text-red-600 text-[10px] font-bold uppercase tracking-wider bg-red-100/50 border border-red-150 px-2 py-0.5 rounded">
                            <AlertTriangle size={12} /> Low Stock
                          </span>
                        ) : (
                          <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-wider bg-emerald-100/50 border border-emerald-150 px-2 py-0.5 rounded">
                            Healthy
                          </span>
                        )}
                      </td>
                      <td className={`p-4 font-extrabold text-sm ${isLowStock ? 'text-red-600' : 'text-slate-800'}`}>
                        {stockVal} <span className="text-[10px] text-slate-400 font-medium">{item.unit || 'units'}</span>
                      </td>
                      <td className="p-4 font-bold text-indigo-600">₹{item.costPerUnit?.toFixed(2)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleRestockOperational(item._id)}
                            className={`flex items-center gap-1.5 border text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded transition-all shadow-sm cursor-pointer ${
                              isLowStock 
                                ? 'border-red-200 hover:bg-red-50 text-red-700' 
                                : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                            }`}
                          >
                            <RefreshCw size={10} /> +10 Restock
                          </button>
                          <button
                            onClick={() => handleDeleteOperational(item._id)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded transition-colors cursor-pointer"
                            title="Delete Supply Item"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryTracker;
