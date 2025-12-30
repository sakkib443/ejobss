// ===================================================================
// MotionBoss LMS - Lesson Model
// MongoDB Lesson Schema with Mongoose
// লেসন কালেকশনের Mongoose স্কিমা
// ===================================================================

import { Schema, model } from 'mongoose';
import { ILesson, LessonModel, IModuleGroup } from './lesson.interface';

/**
 * Resource Sub-Schema
 */
const resourceSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        titleBn: String,
        fileUrl: {
            type: String,
            required: true,
        },
        fileType: {
            type: String,
            enum: ['pdf', 'doc', 'zip', 'image', 'other'],
            default: 'other',
        },
        fileSize: String,
    },
    { _id: false }
);

/**
 * Lesson Schema Definition
 */
const lessonSchema = new Schema<ILesson, LessonModel>(
    {
        // ==================== Course Reference ====================
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Course reference is required'],
            index: true,
        },

        // ==================== Module/Section Info ====================
        moduleTitle: {
            type: String,
            required: [true, 'Module title is required'],
            trim: true,
        },
        moduleTitleBn: {
            type: String,
            required: [true, 'Bengali module title is required'],
            trim: true,
        },
        moduleOrder: {
            type: Number,
            required: true,
            default: 1,
        },
        moduleDescription: {
            type: String,
            maxlength: 500,
        },

        // ==================== Lesson Basic Info ====================
        title: {
            type: String,
            required: [true, 'Lesson title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        titleBn: {
            type: String,
            required: [true, 'Bengali title is required'],
            trim: true,
            maxlength: [200, 'Bengali title cannot exceed 200 characters'],
        },
        description: {
            type: String,
            maxlength: 2000,
        },
        descriptionBn: {
            type: String,
            maxlength: 2000,
        },

        // ==================== Video Content ====================
        videoUrl: {
            type: String,
            required: [true, 'Video URL is required'],
        },
        videoDuration: {
            type: Number,
            required: [true, 'Video duration is required'],
            min: [0, 'Duration cannot be negative'],
        },
        videoProvider: {
            type: String,
            enum: {
                values: ['cloudinary', 'vimeo', 'youtube', 'bunny', 'custom'],
                message: '{VALUE} is not a valid video provider',
            },
            default: 'youtube',
        },
        videoThumbnail: {
            type: String,
        },

        // ==================== Resources ====================
        resources: {
            type: [resourceSchema],
            default: [],
        },

        // ==================== Order & Access ====================
        order: {
            type: Number,
            required: true,
            default: 1,
        },
        isFree: {
            type: Boolean,
            default: false,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },

        // ==================== Quiz/Assignment ====================
        hasQuiz: {
            type: Boolean,
            default: false,
        },
        quizId: {
            type: Schema.Types.ObjectId,
            ref: 'Exam',
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                delete ret.__v;
                return ret;
            },
        },
    }
);

// ==================== Indexes ====================
lessonSchema.index({ course: 1, moduleOrder: 1, order: 1 });
lessonSchema.index({ course: 1, isPublished: 1 });
lessonSchema.index({ title: 'text', titleBn: 'text' });

// ==================== Static Methods ====================

/**
 * Get all lessons for a course
 */
lessonSchema.statics.getLessonsByCourse = async function (
    courseId: string
): Promise<ILesson[]> {
    return await this.find({ course: courseId, isPublished: true })
        .sort({ moduleOrder: 1, order: 1 })
        .lean();
};

/**
 * Get lessons grouped by module
 */
lessonSchema.statics.getGroupedLessons = async function (
    courseId: string
): Promise<IModuleGroup[]> {
    const lessons = await this.find({ course: courseId, isPublished: true })
        .sort({ moduleOrder: 1, order: 1 })
        .lean();

    // Group lessons by module
    const moduleMap = new Map<string, IModuleGroup>();

    lessons.forEach((lesson: ILesson) => {
        const key = `${lesson.moduleOrder}-${lesson.moduleTitle}`;

        if (!moduleMap.has(key)) {
            moduleMap.set(key, {
                moduleTitle: lesson.moduleTitle,
                moduleTitleBn: lesson.moduleTitleBn,
                moduleOrder: lesson.moduleOrder,
                moduleDescription: lesson.moduleDescription,
                lessons: [],
                totalDuration: 0,
                totalLessons: 0,
            });
        }

        const module = moduleMap.get(key)!;
        module.lessons.push(lesson);
        module.totalDuration += lesson.videoDuration;
        module.totalLessons += 1;
    });

    // Convert map to sorted array
    return Array.from(moduleMap.values()).sort(
        (a, b) => a.moduleOrder - b.moduleOrder
    );
};

// ==================== Export Model ====================
export const Lesson = model<ILesson, LessonModel>('Lesson', lessonSchema);
