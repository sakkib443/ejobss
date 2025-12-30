// ===================================================================
// ExtraWeb Backend - Website Routes
// API endpoints for Website Products
// ===================================================================

import express from 'express';
import WebsiteController from './website.controller';
import validateRequest from '../../middlewares/validateRequest';
import { authMiddleware, authorizeRoles, optionalAuth } from '../../middlewares/auth';
import { createWebsiteValidation, updateWebsiteValidation, websiteQueryValidation } from './website.validation';

const router = express.Router();

// ===================================================================
// PUBLIC ROUTES (Specific routes MUST come before dynamic /:id routes)
// ===================================================================

// GET /api/websites - Get all approved websites (public listing)
router.get('/', validateRequest(websiteQueryValidation), WebsiteController.getAllWebsites);

// GET /api/websites/featured - Get featured websites
router.get('/featured', WebsiteController.getFeaturedWebsites);

// GET /api/websites/slug/:slug - Get by slug (public detail page)
router.get('/slug/:slug', WebsiteController.getWebsiteBySlug);

// ===================================================================
// ADMIN ROUTES - Website Management (seller removed)
// ===================================================================

// GET /api/websites/seller/my - Get admin's websites
router.get(
    '/seller/my',
    authMiddleware,
    authorizeRoles('admin'),
    WebsiteController.getMyWebsites
);

// POST /api/websites/seller - Create new website
router.post(
    '/seller',
    authMiddleware,
    authorizeRoles('admin'),
    validateRequest(createWebsiteValidation),
    WebsiteController.createWebsite
);

// PATCH /api/websites/seller/:id - Update website
router.patch(
    '/seller/:id',
    authMiddleware,
    authorizeRoles('admin'),
    validateRequest(updateWebsiteValidation),
    WebsiteController.updateWebsite
);

// DELETE /api/websites/seller/:id - Delete website
router.delete(
    '/seller/:id',
    authMiddleware,
    authorizeRoles('admin'),
    WebsiteController.deleteWebsite
);

// ===================================================================
// ADMIN ROUTES (Must be BEFORE /:id to avoid route conflict)
// ===================================================================

// GET /api/websites/admin/all - Get all websites (with status filter)
router.get(
    '/admin/all',
    authMiddleware,
    authorizeRoles('admin'),
    WebsiteController.getAdminWebsites
);

// PATCH /api/websites/admin/:id/status - Approve/Reject website
router.patch(
    '/admin/:id/status',
    authMiddleware,
    authorizeRoles('admin'),
    WebsiteController.updateWebsiteStatus
);

// DELETE /api/websites/admin/:id - Admin delete
router.delete(
    '/admin/:id',
    authMiddleware,
    authorizeRoles('admin'),
    WebsiteController.deleteWebsite
);

// ===================================================================
// DYNAMIC ID ROUTES (Must be LAST to avoid matching specific routes)
// ===================================================================

// GET /api/websites/:id - Get by ID
router.get('/:id', WebsiteController.getWebsiteById);

// GET /api/websites/:id/stats - Get stats
router.get('/:id/stats', WebsiteController.getStats);

// POST /api/websites/:id/view - Increment view count
router.post('/:id/view', WebsiteController.incrementView);

// POST /api/websites/:id/like - Like a website
router.post('/:id/like', WebsiteController.likeWebsite);

// POST /api/websites/:id/unlike - Unlike a website
router.post('/:id/unlike', WebsiteController.unlikeWebsite);

export const WebsiteRoutes = router;

