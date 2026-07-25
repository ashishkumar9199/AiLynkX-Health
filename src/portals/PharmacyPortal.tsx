import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MedicineItem } from '../types';
import { 
  Pill, 
  ShoppingCart, 
  Search, 
  Building2, 
  Plus, 
  Minus, 
  Trash2, 
  Upload, 
  CheckCircle2, 
  ShieldAlert,
  Clock,
  Star
} from 'lucide-react';

export const PharmacyPortal: React.FC = () => {
  const { stores, medicines, cart, addToCart, removeFromCart, updateCartQuantity, clearCart, placeOrder, t } = useApp();

  const [selectedStoreId, setSelectedStoreId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [rxFile, setRxFile] = useState<{ name: string; url: string } | null>(null);

  const categories = ['All', 'Prescription', 'OTC', 'Vitamins', 'First Aid', 'Diabetes Care', 'Personal Care'];

  // Filter medicines
  const filteredMedicines = medicines.filter(med => {
    const matchesStore = selectedStoreId === 'all' || med.storeId === selectedStoreId;
    const matchesCat = selectedCategory === 'All' || med.category === selectedCategory;
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          med.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStore && matchesCat && matchesSearch;
  });

  const cartTotal = cart.reduce((acc, item) => acc + (item.medicine.price * item.quantity), 0);
  const requiresRxInCart = cart.some(item => item.medicine.requiresPrescription);

  const handleRxUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRxFile({
        name: file.name,
        url: URL.createObjectURL(file)
      });
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) return;
    if (!patientName.trim() || !patientPhone.trim() || !deliveryAddress.trim()) {
      alert("Please fill in your name, phone, and delivery address.");
      return;
    }

    if (requiresRxInCart && !rxFile) {
      alert("One or more items in your cart require a Doctor's Prescription. Please upload your prescription image/PDF.");
      return;
    }

    placeOrder({
      patientName,
      patientPhone,
      deliveryAddress,
      items: cart,
      totalAmount: cartTotal,
      prescriptionName: rxFile?.name,
      prescriptionUrl: rxFile?.url
    });

    setIsCheckoutOpen(false);
    setRxFile(null);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-amber-600">
        <div>
          <span className="bg-amber-500 text-amber-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider mb-2 inline-block">
            Pharmacy & Medicine Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Order Medicines from Partner Stores
          </h1>
          <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-xl">
            Browse verified pharmacy stores added by admin. Order prescription drugs, health supplements, and diagnostic monitoring devices with express home delivery.
          </p>
        </div>

        {/* View Cart Quick Trigger */}
        <button
          id="open-checkout-modal-btn"
          onClick={() => setIsCheckoutOpen(true)}
          className="bg-white text-amber-950 hover:bg-amber-50 font-extrabold px-5 py-3 rounded-2xl text-xs shadow-md transition-all flex items-center gap-2 shrink-0 border border-amber-200"
        >
          <ShoppingCart className="w-4 h-4 text-amber-700" />
          <span>View Cart ({cart.length} Items)</span>
        </button>
      </div>

      {/* Stores List (Added by Admin) */}
      <section className="space-y-3">
        <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
          Partner Pharmacy Stores (Added by Admin)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            id="select-store-all"
            onClick={() => setSelectedStoreId('all')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedStoreId === 'all'
                ? 'border-blue-600 bg-blue-50/80 shadow-sm ring-1 ring-blue-600/30'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <span className="font-extrabold text-xs text-slate-900 block">All Admin Stores</span>
            <span className="text-[11px] text-slate-500">{medicines.length} Medicines available</span>
          </button>

          {stores.map(store => (
            <button
              key={store.id}
              id={`select-store-${store.id}`}
              onClick={() => setSelectedStoreId(store.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedStoreId === store.id
                  ? 'border-blue-600 bg-blue-50/80 shadow-sm ring-1 ring-blue-600/30'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-xs text-slate-900 truncate">{store.name}</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                  ★ {store.rating}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">{store.address}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Category & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
          {categories.map(cat => (
            <button
              key={cat}
              id={`category-pill-${cat}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            id="search-medicines-input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search medicine name..."
            className="pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
          />
        </div>
      </div>

      {/* Medicine Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredMedicines.map(med => (
          <div key={med.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <img 
                  src={med.image} 
                  alt={med.name} 
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0" 
                />
                
                <div className="text-right">
                  <span className="text-lg font-black text-amber-950 block">${med.price.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{med.dosageForm}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {med.category}
                </span>
                
                <h3 className="font-extrabold text-sm text-slate-900 mt-1.5">
                  {med.name}
                </h3>

                <p className="text-[11px] text-slate-500 mt-1 leading-normal line-clamp-2">
                  {med.description}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="truncate">Store: <strong>{med.storeName}</strong></span>
                {med.requiresPrescription && (
                  <span className="text-red-600 font-bold shrink-0">Rx Required</span>
                )}
              </div>

              <button
                id={`add-to-cart-btn-${med.id}`}
                onClick={() => addToCart(med)}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Checkout Modal / Drawer */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-lg text-slate-900 flex items-center justify-between">
              <span>Shopping Cart & Checkout</span>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs">Close ✕</button>
            </h3>

            {cart.length === 0 ? (
              <p className="text-slate-500 text-xs py-6 text-center">Your cart is empty.</p>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                
                {/* Cart Items */}
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={item.medicine.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{item.medicine.name}</span>
                        <span className="text-[11px] text-slate-500">${item.medicine.price.toFixed(2)} each</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.medicine.id, -1)}
                          className="p-1 rounded bg-slate-200 hover:bg-slate-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.medicine.id, 1)}
                          className="p-1 rounded bg-slate-200 hover:bg-slate-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.medicine.id)}
                          className="p-1 rounded bg-red-100 text-red-600 hover:bg-red-200 ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex justify-between items-center text-xs font-bold text-amber-950">
                  <span>Total Amount:</span>
                  <span className="text-base">${cartTotal.toFixed(2)}</span>
                </div>

                {/* Delivery Info */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-xs uppercase text-slate-700">Delivery Information</h4>
                  <input
                    type="text"
                    id="checkout-name"
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    placeholder="Full Name *"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                    required
                  />
                  <input
                    type="tel"
                    id="checkout-phone"
                    value={patientPhone}
                    onChange={e => setPatientPhone(e.target.value)}
                    placeholder="Phone Number *"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                    required
                  />
                  <textarea
                    rows={2}
                    id="checkout-address"
                    value={deliveryAddress}
                    onChange={e => setDeliveryAddress(e.target.value)}
                    placeholder="Home Delivery Address *"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                    required
                  ></textarea>
                </div>

                {/* Upload Prescription if required */}
                {requiresRxInCart && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 space-y-2">
                    <label className="block text-xs font-bold text-red-900">
                      ⚠️ Prescription Required for Items in Cart
                    </label>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleRxUpload}
                      className="text-[11px] text-slate-600 w-full"
                    />
                    {rxFile && (
                      <p className="text-[10px] text-emerald-700 font-bold">✓ Uploaded: {rxFile.name}</p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  id="confirm-place-order-btn"
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all"
                >
                  Confirm & Place Order (${cartTotal.toFixed(2)})
                </button>

              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
