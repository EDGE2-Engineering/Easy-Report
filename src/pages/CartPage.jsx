
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const CartPage = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        notes: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const orderData = {
                customer_name: formData.name,
                customer_phone: formData.phone,
                customer_email: formData.email,
                customer_address: formData.address,
                total_amount: getCartTotal(),
                items: cart,
                status: 'Pending'
            };

            const { error } = await supabase
                .from('orders')
                .insert([orderData]);

            if (error) throw error;

            setOrderComplete(true);
            clearCart();
            window.scrollTo(0, 0);

        } catch (error) {
            console.error('Error placing order:', error);
            toast({
                title: "Order Failed",
                description: "There was a problem placing your order. Please try again.",
                variant: "destructive"
            });
            setIsSubmitting(false);
        }
    };

    if (orderComplete) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
                        <p className="text-gray-600 mb-8">
                            Thank you for shopping with EDGE2 MTR. We will contact you shortly to confirm your order details.
                        </p>
                        <div className="space-y-3">
                            <Link to="/">
                                <Button className="w-full bg-primary hover:bg-primary-dark text-white">
                                    Back to Store
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Helmet>
                <title>Your Cart | EDGE2 MTR</title>
            </Helmet>

            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
                    {cart.length > 0 && (
                        <Button
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center gap-2"
                            onClick={() => {
                                if (window.confirm('Are you sure you want to clear your cart?')) {
                                    clearCart();
                                }
                            }}
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear Cart
                        </Button>
                    )}
                </div>

                {cart.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ArrowRight className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8">Looks like you haven't added any products yet.</p>
                        <Link to="/">
                            <Button className="bg-primary hover:bg-primary-dark text-white">
                                Start Shopping
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex gap-4 items-center">
                                    <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                                        {item.images && item.images[0] ? (
                                            <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">No Img</div>
                                        )}
                                    </div>

                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                        <p className="text-sm text-gray-500">{item.weight}</p>
                                        <p className="font-bold text-primary mt-1">₹{item.price.toLocaleString()}</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center border rounded-md">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-2 hover:bg-gray-100 text-gray-600 disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-2 hover:bg-gray-100 text-gray-600"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                            aria-label="Remove item"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Checkout Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

                                {/* Itemized List */}
                                <div className="space-y-2 mb-6 pb-6 border-b border-gray-100">
                                    {cart.map((item) => (
                                        <div key={`summary-${item.id}`} className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                {item.title}: <span className="text-gray-400">{item.quantity} x {item.price.toLocaleString()}</span>
                                            </span>
                                            <span className="font-medium text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2 mb-4 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>₹{getCartTotal().toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Delivery</span>
                                        <span className="text-green-600 font-medium">Free</span>
                                    </div>
                                </div>

                                <div className="border-t pt-4 mb-6">
                                    <div className="flex justify-between items-center font-bold text-lg text-gray-900">
                                        <span>Total</span>
                                        <span>₹{getCartTotal().toLocaleString()}</span>
                                    </div>
                                </div>

                                {!isCheckingOut ? (
                                    <Button
                                        onClick={() => setIsCheckingOut(true)}
                                        className="w-full bg-primary hover:bg-primary-dark text-white"
                                    >
                                        Proceed to Place Order
                                    </Button>
                                ) : (
                                    <form onSubmit={handleSubmitOrder} className="space-y-4 animate-in slide-in-from-top-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input id="name" name="name" required value={formData.name} onChange={handleInputChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input id="phone" name="phone" required type="tel" value={formData.phone} onChange={handleInputChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email (Optional)</Label>
                                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address">Delivery Address</Label>
                                            <Textarea id="address" name="address" required value={formData.address} onChange={handleInputChange} />
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsCheckingOut(false)}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white" disabled={isSubmitting}>
                                                {isSubmitting ? 'Placing Order...' : 'Confirm Order'}
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default CartPage;
