// ===================================================================
// MotionBoss LMS - Lesson Validation
// Zod validation schemas for Lesson module
// লেসন মডিউলের জন্য Zod ভ্যালিডেশন স্কিমা
// ===================================================================

import { z } from 'zod';

/**
 * Resource Validation Schema
 */
const resourceSchema = z.object({
    title: z.string().min(1, 'Resource title is required'),
    titleBn: z.string().optional(),
    fileUrl: z.string().url('File URL must be valid'),
    fileType: z.enum(['pdf', 'doc', 'zip', 'image', 'other']).optional(),
    fileSize: z.string().optional(),
});

/**
 * Create Lesson Validation Schema
 */
const createLessonSchema = z.object({
    body: z.object({
        // Course reference
        course: z.string({ required_error: 'Course ID is required' }),

        // Module info
        moduleTitle: z
            .string({ required_error: 'Module title is required' })
            .min(1, 'Module title is required')
            .max(200, 'Module title cannot exceed 200 characters'),

        moduleTitleBn: z
            .string({ required_error: 'Bengali module title is required' })
            .min(1, 'Bengali module title is required')
            .max(200, 'Bengali module title cannot exceed 200 characters'),

        moduleOrder: z.number().min(1).optional().default(1),
        moduleDescription: z.string().max(500).optional(),

        // Lesson info
        title: z
            .string({ required_error: 'Lesson title is required' })
            .min(1, 'Lesson title is required')
            .max(200, 'Lesson title cannot exceed 200 characters'),

        titleBn: z
            .string({ required_error: 'Bengali lesson title is required' })
            .min(1, 'Bengali lesson title is required')
            .max(200, 'Bengali lesson title cannot exceed 200 characters'),

        description: z.string().max(2000).optional(),
        descriptionBn: z.string().max(2000).optional(),

        // Video content
        videoUrl: z
            .string({ required_error: 'Video URL is required' })
            .url('Video URL must be valid'),

        videoDuration: z
            .number({ required_error: 'Video duration is required' })
            .min(0, 'Duration cannot be negative'),

        videoProvider: z
            .enum(['cloudinary', 'vimeo', 'youtube', 'bunny', 'custom'])
            .optional()
            .default('youtube'),

        videoThumbnail: z.string().url().optional().or(z.literal('')),

        // Resources
        resources: z.array(resourceSchema).optional().default([]),

        // Order & Access
        order: z.number().min(1).optional().default(1),
        isFree: z.boolean().optional().default(false),
        isPublished: z.boolean().optional().default(false),

        // Quiz
        hasQuiz: z.boolean().optional(),
        quizId: z.string().optional(),
    }),
});

/**
 * Update Lesson Validation Schema
 */
const updateLessonSchema = z.object({
    body: z.object({
        moduleTitle: z.string().min(1).max(200).optional(),
        moduleTitleBn: z.string().min(1).max(200).optional(),
        moduleOrder: z.number().min(1).optional(),
        moduleDescription: z.string().max(500).optional(),

        title: z.string().min(1).max(200).optional(),
        titleBn: z.string().min(1).max(200).optional(),
        description: z.string().max(2000).optional(),
        descriptionBn: z.string().max(2000).optional(),

        videoUrl: z.string().url().optional(),
        videoDuration: z.number().min(0).optional(),
        videoProvider: z
            .enum(['cloudinary', 'vimeo', 'youtube', 'bunny', 'custom'])
            .optional(),
        videoThumbnail: z.string().url().optional().or(z.literal('')),

        resources: z.array(resourceSchema).optional(),

        order: z.number().min(1).optional(),
        isFree: z.boolean().optional(),
        isPublished: z.boolean().optional(),

        hasQuiz: z.boolean().optional(),
        quizId: z.string().optional().nullable(),
    }),
});

/**
 * Bulk Create Lessons Validation
 * Multiple lessons একসাথে create করার জন্য
 */
const bulkCreateLessonsSchema = z.object({
    body: z.object({
        course: z.string({ required_error: 'Course ID is required' }),
        lessons: z
            .array(
                z.object({
                    moduleTitle: z.string().min(1).max(200),
                    moduleTitleBn: z.string().min(1).max(200),
                    moduleOrder: z.number().min(1),
                    moduleDescription: z.string().max(500).optional(),

                    title: z.string().min(1).max(200),
                    titleBn: z.string().min(1).max(200),
                    description: z.string().max(2000).optional(),
                    descriptionBn: z.string().max(2000).optional(),

                    videoUrl: z.string().url(),
                    videoDuration: z.number().min(0),
                    videoProvider: z
                        .enum(['cloudinary', 'vimeo', 'youtube', 'bunny', 'custom'])
                        .optional(),

                    resources: z.array(resourceSchema).optional(),
                    order: z.number().min(1),
                    isFree: z.boolean().optional(),
                    isPublished: z.boolean().optional(),
                })
            )
            .min(1, 'At least one lesson is required'),
    }),
});

/**
 * Reorder Lessons Validation
 * Lessons এর order change করার জন্য
 */
const reorderLessonsSchema = z.object({
    body: z.object({
        lessons: z
            .array(
                z.object({
                    lessonId: z.string(),
                    moduleOrder: z.number().min(1),
                    order: z.number().min(1),
                })
            )
            .min(1, 'At least one lesson is required'),
    }),
});

export const LessonValidation = {
    createLessonSchema,
    updateLessonSchema,
    bulkCreateLessonsSchema,
    reorderLessonsSchema,
};
