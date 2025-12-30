// ===================================================================
// MotionBoss LMS - Lesson Controller
// HTTP request handlers for Lesson module
// লেসন মডিউলের HTTP রিকোয়েস্ট হ্যান্ডলার
// ===================================================================

import { Request, Response, NextFunction } from 'express';
import { LessonService } from './lesson.service';

/**
 * Create a new lesson
 * POST /api/lessons
 */
const createLesson = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lesson = await LessonService.createLesson(req.body);

        res.status(201).json({
            success: true,
            message: 'Lesson created successfully',
            data: lesson,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Bulk create lessons
 * POST /api/lessons/bulk
 */
const bulkCreateLessons = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { course, lessons: lessonsData } = req.body;
        const lessons = await LessonService.bulkCreateLessons(course, lessonsData);

        res.status(201).json({
            success: true,
            message: `${lessons.length} lessons created successfully`,
            data: lessons,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all lessons for a course (flat list)
 * GET /api/lessons/course/:courseId
 */
const getLessonsByCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId } = req.params;
        const includeUnpublished = req.query.includeUnpublished === 'true';

        // Only admin can see unpublished lessons
        const isAdmin = req.user?.role === 'admin';

        const lessons = await LessonService.getLessonsByCourse(
            courseId,
            isAdmin && includeUnpublished
        );

        res.status(200).json({
            success: true,
            message: 'Lessons retrieved successfully',
            data: lessons,
            meta: {
                total: lessons.length,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get lessons grouped by module
 * GET /api/lessons/course/:courseId/grouped
 */
const getGroupedLessons = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId } = req.params;
        const includeUnpublished = req.query.includeUnpublished === 'true';

        const isAdmin = req.user?.role === 'admin';

        const modules = await LessonService.getGroupedLessons(
            courseId,
            isAdmin && includeUnpublished
        );

        // Calculate totals
        const totalLessons = modules.reduce((sum, m) => sum + m.totalLessons, 0);
        const totalDuration = modules.reduce((sum, m) => sum + m.totalDuration, 0);

        res.status(200).json({
            success: true,
            message: 'Grouped lessons retrieved successfully',
            data: modules,
            meta: {
                totalModules: modules.length,
                totalLessons,
                totalDuration,
                totalDurationFormatted: formatDuration(totalDuration),
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get single lesson by ID
 * GET /api/lessons/:id
 */
const getLessonById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const isAdmin = req.user?.role === 'admin';

        const lesson = await LessonService.getLessonById(id, !isAdmin);

        res.status(200).json({
            success: true,
            message: 'Lesson retrieved successfully',
            data: lesson,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get free preview lessons
 * GET /api/lessons/course/:courseId/free
 */
const getFreeLessons = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId } = req.params;
        const lessons = await LessonService.getFreeLessons(courseId);

        res.status(200).json({
            success: true,
            message: 'Free lessons retrieved successfully',
            data: lessons,
            meta: {
                total: lessons.length,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update lesson
 * PATCH /api/lessons/:id
 */
const updateLesson = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const lesson = await LessonService.updateLesson(id, req.body);

        res.status(200).json({
            success: true,
            message: 'Lesson updated successfully',
            data: lesson,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete lesson
 * DELETE /api/lessons/:id
 */
const deleteLesson = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await LessonService.deleteLesson(id);

        res.status(200).json({
            success: true,
            message: 'Lesson deleted successfully',
            data: null,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Reorder lessons
 * PATCH /api/lessons/reorder
 */
const reorderLessons = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { lessons } = req.body;
        await LessonService.reorderLessons(lessons);

        res.status(200).json({
            success: true,
            message: 'Lessons reordered successfully',
            data: null,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Toggle publish status
 * PATCH /api/lessons/:id/toggle-publish
 */
const togglePublishStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const lesson = await LessonService.togglePublishStatus(id);

        res.status(200).json({
            success: true,
            message: `Lesson ${lesson?.isPublished ? 'published' : 'unpublished'} successfully`,
            data: lesson,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get adjacent lessons (prev/next)
 * GET /api/lessons/:id/adjacent
 */
const getAdjacentLessons = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { courseId } = req.query;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: 'Course ID is required',
            });
        }

        const adjacent = await LessonService.getAdjacentLessons(
            courseId as string,
            id
        );

        res.status(200).json({
            success: true,
            message: 'Adjacent lessons retrieved successfully',
            data: adjacent,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Helper: Format duration (seconds to readable string)
 */
const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
};

export const LessonController = {
    createLesson,
    bulkCreateLessons,
    getLessonsByCourse,
    getGroupedLessons,
    getLessonById,
    getFreeLessons,
    updateLesson,
    deleteLesson,
    reorderLessons,
    togglePublishStatus,
    getAdjacentLessons,
};
