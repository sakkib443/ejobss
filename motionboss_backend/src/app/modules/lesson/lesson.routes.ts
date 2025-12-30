// ===================================================================
// MotionBoss LMS - Lesson Routes
// Lesson module এর API endpoints
// লেসন মডিউলের API রাউটস
// ===================================================================

import express from 'express';
import { LessonController } from './lesson.controller';
import { LessonValidation } from './lesson.validation';
import { authMiddleware, authorizeRoles, optionalAuth } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

// ==================== Public Routes ====================

// Get free preview lessons for a course
router.get(
    '/course/:courseId/free',
    LessonController.getFreeLessons
);

// Get lessons grouped by module (public - only published)
router.get(
    '/course/:courseId/grouped',
    optionalAuth,
    LessonController.getGroupedLessons
);

// Get all lessons for a course (flat list)
router.get(
    '/course/:courseId',
    optionalAuth,
    LessonController.getLessonsByCourse
);

// ==================== Authenticated Routes ====================

// Get adjacent lessons (prev/next) - for enrolled students
router.get(
    '/:id/adjacent',
    authMiddleware,
    LessonController.getAdjacentLessons
);

// Get single lesson by ID
router.get(
    '/:id',
    optionalAuth,
    LessonController.getLessonById
);

// ==================== Admin Only Routes ====================

// Create new lesson
router.post(
    '/',
    authMiddleware,
    authorizeRoles('admin'),
    validateRequest(LessonValidation.createLessonSchema),
    LessonController.createLesson
);

// Bulk create lessons
router.post(
    '/bulk',
    authMiddleware,
    authorizeRoles('admin'),
    validateRequest(LessonValidation.bulkCreateLessonsSchema),
    LessonController.bulkCreateLessons
);

// Reorder lessons
router.patch(
    '/reorder',
    authMiddleware,
    authorizeRoles('admin'),
    validateRequest(LessonValidation.reorderLessonsSchema),
    LessonController.reorderLessons
);

// Toggle publish status
router.patch(
    '/:id/toggle-publish',
    authMiddleware,
    authorizeRoles('admin'),
    LessonController.togglePublishStatus
);

// Update lesson
router.patch(
    '/:id',
    authMiddleware,
    authorizeRoles('admin'),
    validateRequest(LessonValidation.updateLessonSchema),
    LessonController.updateLesson
);

// Delete lesson
router.delete(
    '/:id',
    authMiddleware,
    authorizeRoles('admin'),
    LessonController.deleteLesson
);

export const LessonRoutes = router;
