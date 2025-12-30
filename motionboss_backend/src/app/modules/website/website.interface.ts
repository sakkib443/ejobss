// ===================================================================
// ExtraWeb Backend - Website Interface
// Website Product মডেলের TypeScript interface
// ThemeForest style website/template products
// ===================================================================

import { Types } from 'mongoose';

/**
 * IWebsite - Main product data structure
 * Website templates/themes that are sold on the marketplace
 */
export interface IWebsite {
    _id?: Types.ObjectId;

    // Basic Info
    title: string;
    slug: string;
    author: Types.ObjectId;          // User (seller) reference
    platform: Types.ObjectId;        // Platform reference (WordPress, React etc.)
    category: Types.ObjectId;        // Category reference
    subCategory?: string;

    // Type & Access
    projectType: string;             // Ecommerce, Blog, LMS, Dashboard etc.
    accessType: 'free' | 'paid';

    // Pricing
    price: number;
    offerPrice?: number;

    // Ratings & Sales
    rating: number;                  // Average rating (1-5)
    reviewCount: number;
    salesCount: number;
    viewCount: number;               // Total views
    likeCount: number;               // Total likes/loves

    // Details
    features: string[];              // Feature list
    technologies: string[];          // Tech stack used
    description: string;             // Short description
    longDescription?: string;        // Full description (markdown)

    // Media
    images: string[];                // Screenshot URLs
    previewUrl?: string;             // Live demo URL
    downloadFile: string;            // Secure file path/URL

    // Status
    status: 'pending' | 'approved' | 'rejected' | 'draft';
    isDeleted: boolean;
    isFeatured: boolean;

    // Dates
    publishDate?: Date;
    lastUpdate: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * IWebsiteFilters - Query filters for product listing
 */
export interface IWebsiteFilters {
    searchTerm?: string;
    category?: string;
    platform?: string;
    author?: string;
    accessType?: 'free' | 'paid';
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    isFeatured?: boolean;
}

/**
 * IWebsiteQuery - Pagination and sorting options
 */
export interface IWebsiteQuery {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
