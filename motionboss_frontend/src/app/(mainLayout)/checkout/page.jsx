"use client";

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '@/redux/cartSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import { LuShieldCheck, LuPackage, LuCreditCard, LuChevronLeft, LuBadgeCheck, LuSmartphone, LuLoader, LuArrowRight } from 'react-icons/lu';
import { useLanguage } from '@/context/LanguageContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const CheckoutPage = () => {
    const { items: cartItems, totalAmount: cartTotal } = useSelector((state) => state.cart || { items: [], totalAmount: 0 });
    const searchParams = useSearchParams();
    const courseId = searchParams.get('courseId');
    const dispatch = useDispatch();
    const router = useRouter();
    const { language, t } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(!!courseId);
    const [paymentMethod, setPaymentMethod] = useState('bkash');
    const [checkoutItems, setCheckoutItems] = useState([]);
    const [totalValue, setTotalValue] = useState(0);

    // Auth Check
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("Please login to proceed with payment");
            router.push(`/login?redirect=/checkout${courseId ? `?courseId=${courseId}` : ''}`);
        }
    }, [router, courseId]);

    // Handle single course or cart items
    useEffect(() => {
        if (courseId) {
            setPageLoading(true);
            const fetchCourse = async () => {
                try {
                    const res = await fetch(`http://localhost:5000/api/courses/${courseId}`);
                    const result = await res.json();
                    if (res.ok && result.data) {
                        const course = result.data;
                        const item = {
                            id: course._id || course.id,
                            title: course.title,
                            type: 'course',
                            price: course.price || (parseInt(course.fee?.replace(/[^\d]/g, '') || 0)),
                            image: course.thumbnail || course.image
                        };
                        setCheckoutItems([item]);
                        setTotalValue(item.price);
                    } else {
                        toast.error("Failed to load course details");
                        router.push('/courses');
                    }
                } catch (error) {
                    console.error("Error fetching course:", error);
                } finally {
                    setPageLoading(false);
                }
            };
            fetchCourse();
        } else {
            setCheckoutItems(cartItems);
            setTotalValue(cartTotal);
            setPageLoading(false);
        }
    }, [courseId, cartItems, cartTotal, router]);

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
                fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || '',
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
                items: checkoutItems.map(item => ({
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
                // Handle bKash
                const bkashRes = await fetch(`${BASE_URL}/bkash/create-payment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        orderId: orderId,
                        amount: totalValue,
                        payerReference: formData.phone
                    })
                });

                const bkashResult = await bkashRes.json();
                if (!bkashRes.ok) throw new Error(bkashResult.message || 'bKash initiation failed');

                const paymentId = bkashResult.data.paymentID;

                // Execute Payment (Mock for demo)
                const executeRes = await fetch(`${BASE_URL}/bkash/execute-payment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ paymentID: paymentId })
                });

                const executeResult = await executeRes.json();
                if (!executeRes.ok) throw new Error(executeResult.message || 'Payment execution failed');

                toast.success('Payment successful! 🎉');
                setIsSuccess(true);
                if (!courseId) dispatch(clearCart());

                setTimeout(() => {
                    router.push('/dashboard/user/courses'); // Redirect to courses for courses
                }, 3000);

            } else {
                toast.success('Order placed! Redirecting...');
                setIsSuccess(true);
                if (!courseId) dispatch(clearCart());

                setTimeout(() => {
                    router.push('/dashboard/user/courses');
                }, 3000);
            }

        } catch (error) {
            console.error('Payment error:', error);
            toast.error(error.message || 'Payment failed');
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <LuLoader className="animate-spin text-[#41bfb8]" size={40} />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Preparing Checkout...</p>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8"
                >
                    <LuBadgeCheck className="text-emerald-500 text-5xl" />
                </motion.div>
                <h1 className="text-4xl font-black text-slate-900 mb-4 outfit">Payment Successful!</h1>
                <p className="text-slate-500 text-lg font-medium text-center max-w-md mb-8 work">
                    Thank you for your purchase. You can now access your content in your dashboard.
                </p>
                <button
                    onClick={() => router.push('/dashboard/user/courses')}
                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#41bfb8] transition-all flex items-center gap-3"
                >
                    Go to My Courses <LuArrowRight />
                </button>
            </div>
        );
    }

    if (checkoutItems.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                    <LuPackage className="text-slate-400 text-3xl" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-4 outfit uppercase tracking-tight">Your cart is empty</h2>
                <p className="text-slate-500 mb-8 max-w-sm">Looks like you haven't added any products to your cart yet.</p>
                <button onClick={() => router.push('/courses')} className="px-8 py-4 bg-[#41bfb8] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-xl transition-all">
                    Browse Courses
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 lg:py-20">
            <div className="container mx-auto px-4 lg:px-24">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Left: Billing Form */}
                    <div className="flex-1 space-y-8">
                        <div className="flex items-center gap-4">
                            <button onClick={() => router.back()} className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm text-slate-400 hover:text-[#41bfb8] hover:shadow-md transition-all">
                                <LuChevronLeft size={24} />
                            </button>
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 outfit uppercase tracking-tight">Secure Checkout</h1>
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Complete your enrollment</p>
                            </div>
                        </div>

                        {/* Billing Info */}
                        <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#41bfb8]/10 rounded-2xl flex items-center justify-center text-[#41bfb8]">
                                    <LuCreditCard size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 outfit">Personal Details</h2>
                            </div>

                            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 mb-2 block uppercase tracking-widest">Full Name</label>
                                    <input
                                        type="text" required name="fullName" value={formData.fullName} onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#41bfb8] focus:bg-white focus:ring-4 focus:ring-[#41bfb8]/10 outline-none transition-all font-bold text-slate-700"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 mb-2 block uppercase tracking-widest">Email Address</label>
                                    <input
                                        type="email" required name="email" value={formData.email} onChange={handleInputChange}
                                        placeholder="your@email.com"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#41bfb8] focus:bg-white focus:ring-4 focus:ring-[#41bfb8]/10 outline-none transition-all font-bold text-slate-700"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 mb-2 block uppercase tracking-widest">Phone Number</label>
                                    <input
                                        type="text" required name="phone" value={formData.phone} onChange={handleInputChange}
                                        placeholder="+880 1XXX-XXXXXX"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#41bfb8] focus:bg-white focus:ring-4 focus:ring-[#41bfb8]/10 outline-none transition-all font-bold text-slate-700"
                                    />
                                </div>

                                <div className="md:col-span-2 pt-4 space-y-6">
                                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Payment Method</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('bkash')}
                                            className={`p-6 rounded-3xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'bkash'
                                                ? 'border-pink-500 bg-pink-50 shadow-lg shadow-pink-100'
                                                : 'border-slate-100 hover:border-slate-200 bg-white'
                                                }`}
                                        >
                                            <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200">
                                                <LuSmartphone className="text-white" size={24} />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-black text-slate-800 uppercase tracking-tight">bKash</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Instant Pay</p>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('direct')}
                                            className={`p-6 rounded-3xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'direct'
                                                ? 'border-slate-900 bg-slate-900 shadow-lg shadow-slate-200'
                                                : 'border-slate-100 hover:border-slate-200 bg-white'
                                                }`}
                                        >
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${paymentMethod === 'direct' ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>
                                                <LuPackage size={24} />
                                            </div>
                                            <div className="text-left">
                                                <p className={`font-black uppercase tracking-tight ${paymentMethod === 'direct' ? 'text-white' : 'text-slate-800'}`}>Demo</p>
                                                <p className={`text-[10px] font-bold uppercase tracking-widest ${paymentMethod === 'direct' ? 'text-slate-400' : 'text-slate-400'}`}>No Real Bill</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <div className="md:col-span-2 pt-6">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-5 bg-[#41bfb8] hover:bg-[#38a89d] disabled:bg-slate-300 text-white rounded-3xl font-black text-lg shadow-xl shadow-[#41bfb8]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-4 group"
                                    >
                                        {loading ? (
                                            <>
                                                <LuLoader className="animate-spin" size={24} />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Authorize Payment
                                                <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="w-full lg:w-[450px]">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8 lg:sticky lg:top-8">
                            <h3 className="text-xl font-bold text-slate-800 outfit border-b border-slate-50 pb-6">Payment Review</h3>

                            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {checkoutItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-50 shrink-0">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-black text-slate-800 leading-tight mb-1">{item.title}</h4>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.type}</span>
                                        </div>
                                        <div className="text-slate-900 font-black outfit text-lg">৳{item.price?.toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 space-y-4 border-t border-slate-50">
                                <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                    <span>Subtotal</span>
                                    <span className="text-slate-900 text-sm">৳{totalValue.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                    <span>Instant Access Fee</span>
                                    <span className="text-[#41bfb8] text-sm">FREE</span>
                                </div>
                                <div className="pt-4 flex justify-between items-center border-t-2 border-dashed border-slate-100">
                                    <span className="text-slate-900 font-black text-lg">Total Amount</span>
                                    <span className="text-3xl font-black text-[#41bfb8] outfit">৳{totalValue.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                                <LuShieldCheck className="text-[#41bfb8] text-2xl shrink-0" />
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-loose leading-relaxed">
                                    Encrypted Transaction. Your payment data is handled securely via SSL protocol.
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
