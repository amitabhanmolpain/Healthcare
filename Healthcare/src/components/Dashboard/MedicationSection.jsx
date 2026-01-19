import { useState } from "react";
import toast from 'react-hot-toast';
import { 
  Pill, 
  ShoppingCart, 
  Search, 
  Filter,
  Package,
  Heart,
  Star,
  Trash,
  Plus,
  Minus,
  Upload,
  Check,
  Clock,
  Truck,
  CreditCard,
  X,
  ArrowLeft,
  MapPin,
  Home,
  User
} from "lucide-react";

const MedicationSection = () => {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentView, setCurrentView] = useState("medications"); // medications, cart, checkout
  const [showPrescriptionUpload, setShowPrescriptionUpload] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    addressType: "home"
  });

  const categories = [
    { id: "all", label: "All", icon: Package },
    { id: "pain-relief", label: "Pain Relief", icon: Pill },
    { id: "vitamins", label: "Vitamins", icon: Heart },
    { id: "antibiotics", label: "Antibiotics", icon: Pill },
    { id: "cold-flu", label: "Cold & Flu", icon: Package },
  ];

  const medications = [
    {
      id: 1,
      name: "Paracetamol 500mg",
      category: "pain-relief",
      price: 749,
      description: "For fever and pain relief",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop",
      requiresPrescription: false,
      inStock: true,
      rating: 4.5,
      reviews: 234
    },
    {
      id: 2,
      name: "Ibuprofen 400mg",
      category: "pain-relief",
      price: 1099,
      description: "Anti-inflammatory and pain reliever",
      image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=300&fit=crop",
      requiresPrescription: false,
      inStock: true,
      rating: 4.7,
      reviews: 189
    },
    {
      id: 3,
      name: "Amoxicillin 500mg",
      category: "antibiotics",
      price: 1349,
      description: "Antibiotic for bacterial infections",
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop",
      requiresPrescription: true,
      inStock: true,
      rating: 4.6,
      reviews: 156
    },
    {
      id: 4,
      name: "Vitamin D3 1000 IU",
      category: "vitamins",
      price: 1599,
      description: "Bone health and immunity support",
      image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=300&fit=crop",
      requiresPrescription: false,
      inStock: true,
      rating: 4.8,
      reviews: 412
    },
    {
      id: 5,
      name: "Multivitamin Complex",
      category: "vitamins",
      price: 2099,
      description: "Complete daily vitamin supplement",
      image: "https://images.unsplash.com/photo-1526434426615-1abe81efcb0b?w=400&h=300&fit=crop",
      requiresPrescription: false,
      inStock: true,
      rating: 4.5,
      reviews: 328
    },
    {
      id: 6,
      name: "Cold Relief Syrup",
      category: "cold-flu",
      price: 1249,
      description: "Relief from cold and flu symptoms",
      image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=300&fit=crop",
      requiresPrescription: false,
      inStock: true,
      rating: 4.4,
      reviews: 267
    },
    {
      id: 7,
      name: "Antihistamine Tablets",
      category: "pain-relief",
      price: 999,
      description: "For allergy relief",
      image: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&h=300&fit=crop",
      requiresPrescription: false,
      inStock: true,
      rating: 4.6,
      reviews: 198
    },
    {
      id: 8,
      name: "Cough Suppressant",
      category: "cold-flu",
      price: 1149,
      description: "Effective cough relief",
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop",
      requiresPrescription: false,
      inStock: false,
      rating: 4.3,
      reviews: 145
    },
    {
      id: 9,
      name: "Omega-3 Fish Oil",
      category: "vitamins",
      price: 2499,
      description: "Heart and brain health support",
      image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=300&fit=crop",
      requiresPrescription: false,
      inStock: true,
      rating: 4.7,
      reviews: 389
    },
    {
      id: 10,
      name: "Azithromycin 500mg",
      category: "antibiotics",
      price: 1949,
      description: "Broad-spectrum antibiotic",
      image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=300&fit=crop",
      requiresPrescription: true,
      inStock: true,
      rating: 4.5,
      reviews: 142
    },
    {
      id: 11,
      name: "Vitamin C 1000mg",
      category: "vitamins",
      price: 1399,
      description: "Immune system support",
      image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&h=300&fit=crop",
      requiresPrescription: false,
      inStock: true,
      rating: 4.6,
      reviews: 456
    },
    {
      id: 12,
      name: "Pain Relief Gel",
      category: "pain-relief",
      price: 1699,
      description: "Topical pain relief",
      image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=300&fit=crop",
      requiresPrescription: false,
      inStock: true,
      rating: 4.4,
      reviews: 223
    },
  ];

  const filteredMedications = medications.filter((med) => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          med.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (medication) => {
    const existingItem = cart.find(item => item.id === medication.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === medication.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      toast.success(`Increased ${medication.name} quantity`);
    } else {
      setCart([...cart, { ...medication, quantity: 1 }]);
      toast.success(`${medication.name} added to cart`);
    }
  };

  const removeFromCart = (medicationId) => {
    const item = cart.find(item => item.id === medicationId);
    setCart(cart.filter(item => item.id !== medicationId));
    toast.success(`${item.name} removed from cart`);
  };

  const updateQuantity = (medicationId, delta) => {
    setCart(cart.map(item => {
      if (item.id === medicationId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setCurrentView("checkout");
  };

  const validateAddress = () => {
    if (!deliveryAddress.fullName || !deliveryAddress.phone || 
        !deliveryAddress.addressLine1 || !deliveryAddress.city || 
        !deliveryAddress.state || !deliveryAddress.pincode) {
      toast.error('Please fill all required fields');
      return false;
    }
    
    if (deliveryAddress.pincode.length !== 6) {
      toast.error('Please enter valid 6-digit pincode');
      return false;
    }
    
    if (deliveryAddress.phone.length !== 10) {
      toast.error('Please enter valid 10-digit phone number');
      return false;
    }
    
    return true;
  };

  const handleFinalCheckout = () => {
    if (!validateAddress()) {
      return;
    }

    const hasPrescriptionItems = cart.some(item => item.requiresPrescription);
    
    if (hasPrescriptionItems) {
      setShowPrescriptionUpload(true);
    } else {
      completeOrder();
    }
  };

  const completeOrder = () => {
    toast.success('Order placed successfully! Expected delivery in 2-3 days');
    setCart([]);
    setCurrentView("medications");
    setDeliveryAddress({
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      addressType: "home"
    });
    setShowPrescriptionUpload(false);
  };

  const handlePrescriptionUpload = () => {
    toast.success('Prescription uploaded! Proceeding with order');
    setTimeout(() => {
      completeOrder();
    }, 1000);
  };

  // Cart View
  if (currentView === "cart") {
    return (
      <div className="space-y-6">
        {/* Cart Header */}
        <div className="bg-gradient-to-r from-blue-600/20 to-green-600/20 rounded-2xl p-8 backdrop-blur-sm border border-blue-500/20 shadow-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView("medications")}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <ShoppingCart size={32} className="text-blue-400" />
                <h1 className="font-poppins font-bold text-4xl text-white">
                  Shopping Cart
                </h1>
              </div>
              <p className="text-gray-200 text-lg">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-16 border border-white/10 shadow-lg text-center">
            <ShoppingCart size={80} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-white text-2xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-gray-400 mb-6">Add some medications to get started</p>
            <button
              onClick={() => setCurrentView("medications")}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl text-white font-semibold hover:shadow-lg transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-purple-700/30">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-white font-semibold text-lg">{item.name}</h3>
                          <p className="text-gray-400 text-sm">{item.description}</p>
                          {item.requiresPrescription && (
                            <span className="inline-flex items-center gap-1 text-xs text-yellow-400 mt-1">
                              <Package size={12} />
                              Prescription Required
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 hover:text-red-300 transition"
                        >
                          <Trash size={20} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3 bg-purple-700/30 rounded-xl p-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 rounded-lg bg-purple-600/50 hover:bg-purple-600 text-white transition flex items-center justify-center"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-white font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 rounded-lg bg-purple-600/50 hover:bg-purple-600 text-white transition flex items-center justify-center"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-gray-400 text-sm">₹{item.price} each</p>
                          <p className="text-green-400 font-bold text-xl">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg sticky top-6">
                <h2 className="font-poppins font-semibold text-2xl text-white mb-6">
                  Order Summary
                </h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span className="text-white font-medium">₹{getTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Delivery Charges</span>
                    <span className="text-green-400 font-medium">
                      {getTotalPrice() >= 4000 ? 'FREE' : '₹50'}
                    </span>
                  </div>
                  <div className="border-t border-white/10 pt-3 mt-3">
                    <div className="flex justify-between text-lg">
                      <span className="text-white font-semibold">Total</span>
                      <span className="text-green-400 font-bold text-2xl">
                        ₹{getTotalPrice() >= 4000 ? getTotalPrice() : getTotalPrice() + 50}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl text-white font-bold text-lg hover:shadow-lg transition flex items-center justify-center gap-2 mb-4"
                >
                  <CreditCard size={24} />
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => setCurrentView("medications")}
                  className="w-full py-3 bg-white/10 hover:bg-white/15 rounded-xl text-white font-medium transition"
                >
                  Continue Shopping
                </button>
                
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-start gap-2 text-gray-400 text-sm mb-3">
                    <Truck size={16} className="mt-0.5 flex-shrink-0 text-blue-400" />
                    <span>Free delivery on orders over ₹4000</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-400 text-sm">
                    <Clock size={16} className="mt-0.5 flex-shrink-0 text-blue-400" />
                    <span>Expected delivery in 2-3 business days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Checkout View
  if (currentView === "checkout") {
    return (
      <div className="space-y-6">
        {/* Checkout Header */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-8 backdrop-blur-sm border border-purple-500/20 shadow-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView("cart")}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CreditCard size={32} className="text-purple-400" />
                <h1 className="font-poppins font-bold text-4xl text-white">
                  Checkout
                </h1>
              </div>
              <p className="text-gray-200 text-lg">
                Complete your order
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Delivery Address Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-lg">
              <h2 className="font-poppins font-semibold text-2xl text-white mb-6 flex items-center gap-2">
                <MapPin size={24} className="text-blue-400" />
                Delivery Address
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-gray-300 mb-2">
                      <User size={16} />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.fullName}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, fullName: e.target.value})}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-xl border bg-purple-700/30 border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-300 mb-2">
                      <Phone size={16} />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={deliveryAddress.phone}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, phone: e.target.value})}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className="w-full px-4 py-3 rounded-xl border bg-purple-700/30 border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-300 mb-2">
                    <MapPin size={16} />
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.addressLine1}
                    onChange={(e) => setDeliveryAddress({...deliveryAddress, addressLine1: e.target.value})}
                    placeholder="House No., Building Name"
                    className="w-full px-4 py-3 rounded-xl border bg-purple-700/30 border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-300 mb-2">
                    <MapPin size={16} />
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.addressLine2}
                    onChange={(e) => setDeliveryAddress({...deliveryAddress, addressLine2: e.target.value})}
                    placeholder="Road Name, Area, Colony (Optional)"
                    className="w-full px-4 py-3 rounded-xl border bg-purple-700/30 border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-gray-300 mb-2">
                      <MapPin size={16} />
                      City *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.city}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
                      placeholder="City"
                      className="w-full px-4 py-3 rounded-xl border bg-purple-700/30 border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-300 mb-2">
                      <MapPin size={16} />
                      State *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.state}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, state: e.target.value})}
                      placeholder="State"
                      className="w-full px-4 py-3 rounded-xl border bg-purple-700/30 border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-300 mb-2">
                      <MapPin size={16} />
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.pincode}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, pincode: e.target.value})}
                      placeholder="6-digit pincode"
                      maxLength={6}
                      className="w-full px-4 py-3 rounded-xl border bg-purple-700/30 border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 mb-3 block">Address Type</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setDeliveryAddress({...deliveryAddress, addressType: "home"})}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition ${
                        deliveryAddress.addressType === "home"
                          ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg"
                          : "bg-purple-700/30 text-gray-300 hover:text-white"
                      }`}
                    >
                      <Home size={18} />
                      Home
                    </button>
                    <button
                      onClick={() => setDeliveryAddress({...deliveryAddress, addressType: "work"})}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition ${
                        deliveryAddress.addressType === "work"
                          ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg"
                          : "bg-purple-700/30 text-gray-300 hover:text-white"
                      }`}
                    >
                      <Package size={18} />
                      Work
                    </button>
                    <button
                      onClick={() => setDeliveryAddress({...deliveryAddress, addressType: "other"})}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition ${
                        deliveryAddress.addressType === "other"
                          ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg"
                          : "bg-purple-700/30 text-gray-300 hover:text-white"
                      }`}
                    >
                      <MapPin size={18} />
                      Other
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg sticky top-6">
              <h2 className="font-poppins font-semibold text-xl text-white mb-4">
                Order Summary
              </h2>
              
              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-300">{item.name} x{item.quantity}</span>
                    <span className="text-white">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span className="text-white">₹{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Delivery</span>
                  <span className="text-green-400">
                    {getTotalPrice() >= 4000 ? 'FREE' : '₹50'}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-2">
                  <div className="flex justify-between">
                    <span className="text-white font-semibold text-lg">Total</span>
                    <span className="text-green-400 font-bold text-xl">
                      ₹{getTotalPrice() >= 4000 ? getTotalPrice() : getTotalPrice() + 50}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleFinalCheckout}
                className="w-full mt-6 py-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl text-white font-bold text-lg hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <Check size={24} />
                Place Order
              </button>

              <p className="text-gray-400 text-xs text-center mt-4">
                By placing order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Medications View (Default)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-green-600/20 rounded-2xl p-8 backdrop-blur-sm border border-blue-500/20 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Pill size={32} className="text-blue-400" />
              <h1 className="font-poppins font-bold text-4xl text-white">
                Medication Store
              </h1>
            </div>
            <p className="text-gray-200 text-lg">
              Order your medications online with fast delivery
            </p>
          </div>
          
          <button
            onClick={() => setCurrentView("cart")}
            className="relative px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl text-white font-semibold hover:shadow-lg transition flex items-center gap-2"
          >
            <ShoppingCart size={20} />
            <span>Cart</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medications..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-purple-700/30 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg"
                      : "bg-purple-700/30 text-gray-300 hover:text-white border border-white/10 hover:border-blue-500/50"
                  }`}
                >
                  <Icon size={18} />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Medications Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMedications.map((medication) => (
          <div
            key={medication.id}
            className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all shadow-lg hover:shadow-2xl group"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={medication.image}
                alt={medication.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {!medication.inStock && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">Out of Stock</span>
                </div>
              )}
              {medication.requiresPrescription && (
                <div className="absolute top-3 left-3 px-3 py-1 bg-red-500/90 rounded-lg text-white text-xs font-semibold flex items-center gap-1">
                  <Package size={14} />
                  Prescription Required
                </div>
              )}
              <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 rounded-lg text-yellow-400 text-sm font-semibold flex items-center gap-1">
                <Star size={14} fill="currentColor" />
                {medication.rating}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-white font-semibold text-lg mb-1">{medication.name}</h3>
              <p className="text-gray-400 text-sm mb-3">{medication.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-green-400 text-2xl font-bold">₹{medication.price}</span>
                <span className="text-gray-400 text-sm">{medication.reviews} reviews</span>
              </div>
              
              <button
                onClick={() => addToCart(medication)}
                disabled={!medication.inStock}
                className={`w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                  medication.inStock
                    ? "bg-gradient-to-r from-blue-500 to-green-500 text-white hover:shadow-lg"
                    : "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ShoppingCart size={18} />
                {medication.inStock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMedications.length === 0 && (
        <div className="text-center py-16 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
          <Package size={64} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-white text-xl font-semibold mb-2">No medications found</h3>
          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      )}


      {/* Prescription Upload Modal */}
      {showPrescriptionUpload && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-purple-800/95 backdrop-blur-md rounded-2xl max-w-md w-full border border-white/20 shadow-2xl p-8">
            <h2 className="font-poppins font-bold text-2xl text-white mb-4 flex items-center gap-2">
              <Upload size={28} className="text-blue-400" />
              Upload Prescription
            </h2>
            
            <p className="text-gray-300 mb-6">
              Some items in your cart require a valid prescription. Please upload your prescription to continue.
            </p>
            
            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 mb-6 text-center hover:border-blue-500/50 transition cursor-pointer">
              <Upload size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-white font-medium mb-1">Click to upload prescription</p>
              <p className="text-gray-400 text-sm">PDF, JPG, or PNG (Max 5MB)</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowPrescriptionUpload(false)}
                className="flex-1 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/15 transition border border-white/20"
              >
                Cancel
              </button>
              <button
                onClick={handlePrescriptionUpload}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <Check size={20} />
                Confirm & Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationSection;
