// ===================================================================
// ExtraWeb Backend - Software Validation
// Zod validation schemas for Software CRUD
// ===================================================================

import { z } from 'zod';

/**
 * Create Software Validation
 */
export const createSoftwareValidation = z.object({
    body: z.object({
        title: z.string({ required_error: 'Title is required' }).min(1).max(200),
        slug: z.string().optional(),
        platform: z.string({ required_error: 'Platform is required' }),
        category: z.string({ required_error: 'Category is required' }),
        softwareType: z.string({ required_error: 'Software type is required' }),
        accessType: z.enum(['free', 'paid']).optional().default('paid'),
        price: z.number({ required_error: 'Price is required' }).min(0),
        offerPrice: z.number().min(0).optional(),
        licenseType: z.enum(['regular', 'extended']).optional().default('regular'),
        regularLicensePrice: z.number({ required_error: 'Regular license price is required' }).min(0),
        extendedLicensePrice: z.number().min(0).optional(),
        version: z.string().optional().default('1.0.0'),
        features: z.array(z.string()).optional().default([]),
        requirements: z.array(z.string()).optional().default([]),
        technologies: z.array(z.string()).optional().default([]),
        description: z.string({ required_error: 'Description is required' }).max(1000),
        longDescription: z.string().optional(),
        changelog: z.string().optional(),
        browserCompatibility: z.array(z.string()).optional().default([]),
        softwareCompatibility: z.array(z.string()).optional().default([]),
        images: z.array(z.string()).optional().default([]),
        previewUrl: z.string().url().optional(),
        downloadFile: z.string({ required_error: 'Download file is required' }),
        documentationUrl: z.string().url().optional(),
        status: z.enum(['pending', 'approved', 'rejected', 'draft']).optional(),
    }),
});

/**
 * Update Software Validation
 */
export const updateSoftwareValidation = z.object({
    body: z.object({
        title: z.string().min(1).max(200).optional(),
        slug: z.string().optional(),
        platform: z.string().optional(),
        category: z.string().optional(),
        softwareType: z.string().optional(),
        accessType: z.enum(['free', 'paid']).optional(),
        price: z.number().min(0).optional(),
        offerPrice: z.number().min(0).optional(),
        licenseType: z.enum(['regular', 'extended']).optional(),
        regularLicensePrice: z.number().min(0).optional(),
        extendedLicensePrice: z.number().min(0).optional(),
        version: z.string().optional(),
        features: z.array(z.string()).optional(),
        requirements: z.array(z.string()).optional(),
        technologies: z.array(z.string()).optional(),
        description: z.string().max(1000).optional(),
        longDescription: z.string().optional(),
        changelog: z.string().optional(),
        browserCompatibility: z.array(z.string()).optional(),
        softwareCompatibility: z.array(z.string()).optional(),
        images: z.array(z.string()).optional(),
        previewUrl: z.string().url().optional(),
        downloadFile: z.string().optional(),
        documentationUrl: z.string().url().optional(),
        status: z.enum(['pending', 'approved', 'rejected', 'draft']).optional(),
        isFeatured: z.boolean().optional(),
    }),
    params: z.object({
        id: z.string({ required_error: 'ID is required' }),
    }),
});

/**
 * Software Query Validation
 */
export const softwareQueryValidation = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        searchTerm: z.string().optional(),
        category: z.string().optional(),
        platform: z.string().optional(),
        softwareType: z.string().optional(),
        accessType: z.enum(['free', 'paid']).optional(),
        minPrice: z.string().optional(),
        maxPrice: z.string().optional(),
        minRating: z.string().optional(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
    }),
});

export type TCreateSoftwareInput = z.infer<typeof createSoftwareValidation>['body'];
export type TUpdateSoftwareInput = z.infer<typeof updateSoftwareValidation>['body'];
