'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/cartSlice';
import { LuShoppingCart, LuEye, LuStar, LuCheck, LuSparkles } from 'react-icons/lu';

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
        <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300">
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                <img
                    src={productImage}
                    alt={product.title || product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
                    <div className="flex gap-2">
                        <Link
                            href={detailUrl}
                            className="px-4 py-2 bg-white/95 backdrop-blur-sm text-gray-800 rounded-lg text-xs font-semibold hover:bg-white transition-all flex items-center gap-1.5 shadow-lg"
                        >
                            <LuEye size={14} /> View
                        </Link>
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdded}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-lg ${isAdded
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-[#41bfb8] text-white hover:bg-[#38a89d]'
                                }`}
                        >
                            {isAdded ? <><LuCheck size={14} /> Added</> : <><LuShoppingCart size={14} /> Add</>}
                        </button>
                    </div>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {discountPercent > 0 && (
                        <span className="px-2.5 py-1 bg-rose-500 text-white text-[10px] font-bold rounded-lg shadow-sm">
                            -{discountPercent}% OFF
                        </span>
                    )}
                    {product.isFeatured && (
                        <span className="px-2.5 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-lg shadow-sm flex items-center gap-1">
                            <LuSparkles size={10} /> Featured
                        </span>
                    )}
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-semibold rounded-lg shadow-sm">
                        {product.category?.name || type === 'website' ? 'Website' : 'Software'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Platform/Type Tag */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-[#41bfb8]/10 text-[#41bfb8] text-[10px] font-semibold rounded">
                        {product.platform || (type === 'website' ? 'HTML' : 'Windows')}
                    </span>
                    {product.rating > 0 && (
                        <span className="flex items-center gap-0.5 text-[10px] text-amber-500 font-semibold">
                            <LuStar size={10} className="fill-amber-500" /> {product.rating?.toFixed(1) || '4.5'}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-gray-800 line-clamp-1 mb-1 group-hover:text-[#41bfb8] transition-colors">
                    {product.title || product.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-500 line-clamp-2 mb-3 min-h-[2.5rem]">
                    {product.description?.substring(0, 80) || 'Premium digital product ready for instant download.'}
                </p>

                {/* Footer: Price & Stats */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-800">
                            ৳{displayPrice?.toLocaleString() || '0'}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs text-gray-400 line-through">
                                ৳{product.price?.toLocaleString()}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-gray-400">
                        {(product.salesCount > 0 || product.viewCount > 0) && (
                            <>
                                <span>{product.salesCount || 0} sales</span>
                                <span>{product.viewCount || 0} views</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
