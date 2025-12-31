"use client";

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '@/redux/cartSlice';
import { useRouter } from 'next/navigation';
import { LuShieldCheck, LuPackage, LuCreditCard, LuChevronLeft, LuBadgeCheck, LuSmartphone, LuLoader } from 'react-icons/lu';
import { useLanguage } from '@/context/LanguageContext';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
    const { items, totalAmount } = useSelector((state) => state.cart || { items: [], totalAmount: 0 });
    const dispatch = useDispatch();
    const router = useRouter();
    const { language } = useLanguage();
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('bkash');

    // Auth Check
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("Please login to place an order");
            router.push('/login?redirect=/checkout');
        }
    }, [router]);

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user) {
            setFormData({
                fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token');
        const BASE_URL = 'http://localhost:5000/api';

        try {
            // Step 1: Create Order
            const orderData = {
                items: items.map(item => ({
                    productId: item.id,
                    productType: item.type,
                    title: item.title,
                    price: item.price,
                    image: item.image
                })),
                paymentMethod: paymentMethod,
                paymentStatus: 'pending'
            };

            const orderRes = await fetch(`${BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            const orderResult = await orderRes.json();

            if (!orderRes.ok) {
                throw new Error(orderResult.message || 'Failed to create order');
            }

            const orderId = orderResult.data._id;

            if (paymentMethod === 'bkash') {
                // Step 2: Create bKash Payment
                const bkashRes = await fetch(`${BASE_URL}/bkash/create-payment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        orderId: orderId,
                        amount: totalAmount,
                        payerReference: formData.phone
                    })
                });

                const bkashResult = await bkashRes.json();

                if (!bkashRes.ok) {
                    throw new Error(bkashResult.message || 'bKash payment failed');
                }

                // For demo, we directly execute payment
                const paymentId = bkashResult.data.paymentID;

                // Execute Payment
                const executeRes = await fetch(`${BASE_URL}/bkash/execute-payment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ paymentID: paymentId })
                });

                const executeResult = await executeRes.json();

                if (!executeRes.ok) {
                    throw new Error(executeResult.message || 'Payment execution failed');
                }

                // Success
                toast.success('Payment successful! 🎉');
                setIsSuccess(true);
                dispatch(clearCart());

                setTimeout(() => {
                    router.push('/dashboard/user/purchases');
                }, 3000);

            } else {
                // Direct order (for demo)
                toast.success('Order placed successfully! 🎉');
                setIsSuccess(true);
                dispatch(clearCart());

                setTimeout(() => {
                    router.push('/dashboard/user/purchases');
                }, 3000);
            }

        } catch (error) {
            console.error('Payment error:', error);
            toast.error(error.message || 'Payment failed');
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex flex-col items-center justify-center px-4">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-8 animate-bounce">
                    <LuBadgeCheck className="text-emerald-500 text-5xl" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
                <p className="text-gray-500 text-lg font-medium text-center max-w-md mb-6">
                    Thank you for your purchase. Your digital assets are now available in your dashboard.
                </p>
                <div className="flex gap-4">
                    <button onClick={() => router.push('/dashboard/user/purchases')} className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-all">
                        View My Purchases
                    </button>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                <button onClick={() => router.push('/software')} className="px-6 py-3 bg-[#41bfb8] text-white rounded-xl font-semibold hover:bg-[#38a89d] transition-all">
                    Browse Products
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 lg:py-20">
            <div className="container mx-auto px-4 lg:px-16">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Left: Billing Form */}
                    <div className="flex-1 space-y-8">
                        <div className="flex items-center gap-4">
                            <button onClick={() => router.back()} className="p-3 bg-white rounded-xl shadow-sm hover:text-[#41bfb8] transition-all">
                                <LuChevronLeft size={20} />
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
                        </div>

                        {/* Billing Info */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#41bfb8]/10 rounded-xl flex items-center justify-center text-[#41bfb8]">
                                    <LuCreditCard size={20} />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">Billing Information</h2>
                            </div>

                            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Full Name</label>
                                    <input
                                        type="text" required name="fullName" value={formData.fullName} onChange={handleInputChange}
                                        placeholder="Your name"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#41bfb8] focus:ring-2 focus:ring-[#41bfb8]/20 outline-none transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Email</label>
                                    <input
                                        type="email" required name="email" value={formData.email} onChange={handleInputChange}
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#41bfb8] focus:ring-2 focus:ring-[#41bfb8]/20 outline-none transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Phone</label>
                                    <input
                                        type="text" required name="phone" value={formData.phone} onChange={handleInputChange}
                                        placeholder="+880 1XXX-XXXXXX"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#41bfb8] focus:ring-2 focus:ring-[#41bfb8]/20 outline-none transition-all font-medium"
                                    />
                                </div>

                                {/* Payment Method Selection */}
                                <div className="md:col-span-2 pt-4 space-y-4">
                                    <h3 className="text-sm font-bold text-gray-700">Payment Method</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('bkash')}
                                            className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${paymentMethod === 'bkash'
                                                    ? 'border-pink-500 bg-pink-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                                                <LuSmartphone className="text-white" size={20} />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-gray-800">bKash</p>
                                                <p className="text-xs text-gray-500">Mobile Payment</p>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('direct')}
                                            className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${paymentMethod === 'direct'
                                                    ? 'border-emerald-500 bg-emerald-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                                                <LuPackage className="text-white" size={20} />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-gray-800">Demo Order</p>
                                                <p className="text-xs text-gray-500">Skip Payment</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <div className="md:col-span-2 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 bg-gradient-to-r from-[#41bfb8] to-[#38a89d] hover:from-[#38a89d] hover:to-[#2f9991] disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-[#41bfb8]/25 transition-all flex items-center justify-center gap-3"
                                    >
                                        {loading ? (
                                            <>
                                                <LuLoader className="animate-spin" size={20} />
                                                Processing Payment...
                                            </>
                                        ) : paymentMethod === 'bkash' ? (
                                            <>
                                                <LuSmartphone size={20} />
                                                Pay with bKash - ৳{totalAmount.toLocaleString()}
                                            </>
                                        ) : (
                                            <>
                                                <LuPackage size={20} />
                                                Place Order - ৳{totalAmount.toLocaleString()}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="w-full lg:w-[400px]">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 lg:sticky lg:top-8">
                            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Order Summary</h3>

                            <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3 items-center">
                                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold text-gray-800 truncate">{item.title}</h4>
                                            <span className="text-xs text-gray-400 capitalize">{item.type}</span>
                                        </div>
                                        <div className="text-gray-900 font-bold">৳{item.price?.toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 space-y-3 border-t border-gray-100">
                                <div className="flex justify-between items-center text-gray-500 text-sm">
                                    <span>Subtotal ({items.length} items)</span>
                                    <span className="text-gray-900 font-semibold">৳{totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-500 text-sm">
                                    <span>Processing Fee</span>
                                    <span className="text-emerald-500 font-semibold">FREE</span>
                                </div>
                                <div className="pt-3 flex justify-between items-center border-t border-gray-100">
                                    <span className="text-gray-900 font-bold">Total</span>
                                    <span className="text-2xl font-bold text-[#41bfb8]">৳{totalAmount.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                                <LuShieldCheck className="text-emerald-500 text-lg shrink-0" />
                                <p className="text-xs text-gray-600">
                                    Secure payment. Your data is protected with SSL encryption.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
