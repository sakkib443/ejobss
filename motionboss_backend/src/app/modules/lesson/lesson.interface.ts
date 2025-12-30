// ===================================================================
// MotionBoss LMS - Lesson Interface
// Lesson module TypeScript interface definitions
// লেসন মডিউলের TypeScript interface definitions
// ===================================================================

import { Model, Types } from 'mongoose';

/**
 * Video Provider Types
 */
export type TVideoProvider = 'cloudinary' | 'vimeo' | 'youtube' | 'bunny' | 'custom';

/**
 * IResource - Lesson resource/attachment
 * লেসনের সাথে যুক্ত রিসোর্স/ফাইল
 */
export interface IResource {
    title: string;
    titleBn?: string;
    fileUrl: string;
    fileType: 'pdf' | 'doc' | 'zip' | 'image' | 'other';
    fileSize?: string;
}

/**
 * ILesson - Main Lesson Interface
 * Database এ যে format এ lesson data save হবে
 */
export interface ILesson {
    _id?: Types.ObjectId;

    // ==================== Course Reference ====================
    course: Types.ObjectId;           // Parent course

    // ==================== Module/Section Info ====================
    moduleTitle: string;              // Module/Section name (English)
    moduleTitleBn: string;            // Module/Section name (Bengali)
    moduleOrder: number;              // Order of this module in course
    moduleDescription?: string;       // Optional module description

    // ==================== Lesson Basic Info ====================
    title: string;                    // Lesson title (English)
    titleBn: string;                  // Lesson title (Bengali)
    description?: string;             // Lesson description
    descriptionBn?: string;           // Bengali description

    // ==================== Video Content ====================
    videoUrl: string;                 // Video URL (secure)
    videoDuration: number;            // Duration in seconds
    videoProvider: TVideoProvider;    // Video hosting platform
    videoThumbnail?: string;          // Custom thumbnail for video

    // ==================== Resources/Attachments ====================
    resources: IResource[];           // Downloadable resources

    // ==================== Order & Access ====================
    order: number;                    // Order within module
    isFree: boolean;                  // Free preview lesson
    isPublished: boolean;             // Published/Draft status

    // ==================== Quiz/Assignment (Optional) ====================
    hasQuiz?: boolean;
    quizId?: Types.ObjectId;

    // ==================== Timestamps ====================
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * ILessonFilters - Query Filters
 */
export interface ILessonFilters {
    course?: string;
    moduleTitle?: string;
    isFree?: boolean;
    isPublished?: boolean;
}

/**
 * IModuleGroup - Grouped lessons by module
 * Module অনুযায়ী lessons group করা
 */
export interface IModuleGroup {
    moduleTitle: string;
    moduleTitleBn: string;
    moduleOrder: number;
    moduleDescription?: string;
    lessons: ILesson[];
    totalDuration: number;            // Total duration of all lessons in module
    totalLessons: number;
}

/**
 * LessonModel - Mongoose Model Type
 */
export interface LessonModel extends Model<ILesson> {
    getLessonsByCourse(courseId: string): Promise<ILesson[]>;
    getGroupedLessons(courseId: string): Promise<IModuleGroup[]>;
}
