'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/cartSlice';
import { LuShoppingCart, LuEye, LuStar, LuCheck, LuSparkles, LuPlus, LuArrowRight, LuClock, LuUsers } from 'react-icons/lu';
import { BiCategory } from "react-icons/bi";
import { FaStar } from "react-icons/fa";

const ProductCard = ({ product, type }) => {
    const dispatch = useDispatch();
    const [isAdded, setIsAdded] = useState(false);
    const detailUrl = `/${type}/${product._id}`;

    // Get first image from images array or fallback
    const productImage = product.images?.[0] || product.image || "/images/placeholder.png";

    // Calculate discount percentage
    const hasDiscount = product.offerPrice && product.offerPrice > 0 && product.offerPrice < product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
        : 0;

    const displayPrice = hasDiscount ? product.offerPrice : product.price;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart({
            id: product._id,
            title: product.title || product.name,
            price: displayPrice,
            image: productImage,
            type: type
        }));
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div className="group relative w-full">
            {/* Card Container */}
            <div className="relative bg-white rounded-md border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/60 hover:-translate-y-2 hover:border-transparent">

                {/* Image Container */}
                <div className="relative h-48 w-full overflow-hidden">
                    <Link href={detailUrl}>
                        <img
                            src={productImage}
                            alt={product.title || product.name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    </Link>

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Type Badge */}
                    <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F79952] text-white text-xs font-medium rounded-md shadow-lg capitalize">
                            {type}
                        </span>
                    </div>

                    {/* Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Link href={detailUrl} className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                            <LuEye className="w-8 h-8 text-[#41bfb8]" />
                        </Link>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/95 backdrop-blur-sm rounded-md shadow-lg">
                        <FaStar className="text-[#F79952] text-sm" />
                        <span className="text-sm font-semibold text-gray-800">{product.rating || 5}</span>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-4 space-y-3">
                    {/* Category */}
                    <div className="flex items-center gap-1.5 text-gray-500">
                        <BiCategory className="text-[#41bfb8]" />
                        <span className="text-xs work">{product.category?.name || (type === 'website' ? 'Website Template' : 'Software')}</span>
                    </div>

                    {/* Title */}
                    <Link href={detailUrl}>
                        <h3 className="text-lg font-bold text-gray-800 outfit-semibold line-clamp-2 group-hover:text-[#41bfb8] transition-colors duration-300 leading-tight min-h-[48px]">
                            {product.title || product.name}
                        </h3>
                    </Link>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 work">
                        <div className="flex items-center gap-1">
                            <LuClock className="text-[#41bfb8]" />
                            <span>{product.version || 'v1.0.0'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <LuUsers className="text-[#41bfb8]" />
                            <span>{product.salesCount || 10}+ Licenses</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

                    {/* Price & Rating Row */}
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs text-gray-400 work">License Fee</span>
                            <div className="flex items-baseline gap-2">
                                <p className="text-xl font-bold text-[#41bfb8] outfit">৳{displayPrice?.toLocaleString()}</p>
                                {hasDiscount && (
                                    <span className="text-xs text-gray-400 line-through">৳{product.price?.toLocaleString()}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <FaStar
                                    key={i}
                                    className={`text-sm ${i < (product.rating || 5) ? "text-[#F79952]" : "text-gray-200"}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex gap-2 pt-2">
                        <Link
                            href={detailUrl}
                            className="flex-1 flex items-center justify-center gap-2 bg-[#41bfb8] hover:bg-[#38a89d] text-white px-4 py-2.5 rounded-md font-medium text-sm work transition-all duration-300"
                        >
                            <LuEye className="text-lg" />
                            <span>Details</span>
                        </Link>
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdded}
                            className={`flex flex-1 items-center justify-center gap-2 border px-4 py-2.5 rounded-md font-medium text-sm work transition-all duration-300 ${isAdded
                                ? 'bg-emerald-500 text-white border-emerald-500'
                                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {isAdded ? <LuCheck className="text-lg" /> : <LuShoppingCart className="text-lg" />}
                            <span>{isAdded ? 'Added' : 'Cart'}</span>
                        </button>
                    </div>
                </div>

                {/* Bottom Accent Line */}
                <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-1 bg-gradient-to-r from-[#41bfb8] to-[#F79952] transition-all duration-500"></div>
            </div>
        </div>
    );
};

export default ProductCard;
