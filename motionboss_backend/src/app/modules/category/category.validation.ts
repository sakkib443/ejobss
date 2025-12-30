// ===================================================================
// ExtraWeb Backend - Category Validation
// Zod validation schemas for Category CRUD
// ===================================================================

import { z } from 'zod';

/**
 * Create Category Validation
 */
export const createCategoryValidation = z.object({
    body: z.object({
        name: z
            .string({ required_error: 'Category name is required' })
            .min(1, 'Name is required')
            .max(100, 'Name cannot exceed 100 characters'),
        slug: z.string().max(100).optional(),
        description: z.string().max(500).optional(),
        icon: z.string().optional(),
        image: z.string().url().optional(),
        status: z.enum(['active', 'inactive']).optional().default('active'),
        order: z.number().optional().default(0),
    }),
});

/**
 * Update Category Validation
 */
export const updateCategoryValidation = z.object({
    body: z.object({
        name: z.string().min(1).max(100).optional(),
        slug: z.string().max(100).optional(),
        description: z.string().max(500).optional(),
        icon: z.string().optional(),
        image: z.string().url().optional(),
        status: z.enum(['active', 'inactive']).optional(),
        order: z.number().optional(),
    }),
    params: z.object({
        id: z.string({ required_error: 'Category ID is required' }),
    }),
});

export type TCreateCategoryInput = z.infer<typeof createCategoryValidation>['body'];
export type TUpdateCategoryInput = z.infer<typeof updateCategoryValidation>['body'];
