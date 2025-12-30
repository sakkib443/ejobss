// ===================================================================
// ExtraWeb Backend - Software Interface
// Software Product মডেলের TypeScript interface
// CodeCanyon style software/script products
// ===================================================================

import { Types } from 'mongoose';

/**
 * ISoftware - Main software product data structure
 * Software/Scripts that are sold on the marketplace
 */
export interface ISoftware {
    _id?: Types.ObjectId;

    // Basic Info
    title: string;
    slug: string;
    author: Types.ObjectId;          // User (seller) reference
    platform: Types.ObjectId;        // Platform reference (PHP, Python, JavaScript etc.)
    category: Types.ObjectId;        // Category reference

    // Type & Access
    softwareType: string;            // Plugin, Script, Application, Tool, etc.
    accessType: 'free' | 'paid';

    // Pricing
    price: number;
    offerPrice?: number;

    // Licensing
    licenseType: 'regular' | 'extended';
    regularLicensePrice: number;
    extendedLicensePrice?: number;

    // Ratings & Sales
    rating: number;                  // Average rating (1-5)
    reviewCount: number;
    salesCount: number;

    // Details
    version: string;                 // Software version (e.g., "1.0.0")
    features: string[];              // Feature list
    requirements: string[];          // System requirements
    technologies: string[];          // Tech stack used
    description: string;             // Short description
    longDescription?: string;        // Full description (markdown)
    changelog?: string;              // Version history

    // Compatibility
    browserCompatibility?: string[];
    softwareCompatibility?: string[];

    // Media
    images: string[];                // Screenshot URLs
    previewUrl?: string;             // Live demo URL
    downloadFile: string;            // Secure file path/URL
    documentationUrl?: string;       // Documentation link

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
 * ISoftwareFilters - Query filters for software listing
 */
export interface ISoftwareFilters {
    searchTerm?: string;
    category?: string;
    platform?: string;
    author?: string;
    accessType?: 'free' | 'paid';
    status?: string;
    softwareType?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    isFeatured?: boolean;
}

/**
 * ISoftwareQuery - Pagination and sorting options
 */
export interface ISoftwareQuery {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
