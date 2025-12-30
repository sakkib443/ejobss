// ===================================================================
// ExtraWeb Backend - Category Routes
// API endpoints for Category module
// ===================================================================

import express from 'express';
import CategoryController from './category.controller';
import validateRequest from '../../middlewares/validateRequest';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';
import { createCategoryValidation, updateCategoryValidation } from './category.validation';

const router = express.Router();

// ===================================================================
// PUBLIC ROUTES
// ===================================================================

// GET /api/categories - Get all active categories (for website filter)
router.get('/', CategoryController.getActiveCategories);

// GET /api/categories/slug/:slug - Get category by slug
router.get('/slug/:slug', CategoryController.getCategoryBySlug);

// ===================================================================
// ADMIN ROUTES
// ===================================================================

// GET /api/categories/admin/all - Get all categories with filters
router.get(
    '/admin/all',
    authMiddleware,
    authorizeRoles('admin'),
    CategoryController.getAllCategories
);

// GET /api/categories/admin/:id - Get single category
router.get(
    '/admin/:id',
    authMiddleware,
    authorizeRoles('admin'),
    CategoryController.getCategoryById
);

// POST /api/categories/admin - Create new category
router.post(
    '/admin',
    authMiddleware,
    authorizeRoles('admin'),
    validateRequest(createCategoryValidation),
    CategoryController.createCategory
);

// PATCH /api/categories/admin/:id - Update category
router.patch(
    '/admin/:id',
    authMiddleware,
    authorizeRoles('admin'),
    validateRequest(updateCategoryValidation),
    CategoryController.updateCategory
);

// DELETE /api/categories/admin/:id - Delete category
router.delete(
    '/admin/:id',
    authMiddleware,
    authorizeRoles('admin'),
    CategoryController.deleteCategory
);

export const CategoryRoutes = router;
