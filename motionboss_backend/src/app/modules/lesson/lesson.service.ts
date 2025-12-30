// ===================================================================
// MotionBoss LMS - Lesson Service
// Business logic for Lesson module
// লেসন মডিউলের বিজনেস লজিক
// ===================================================================

import { Lesson } from './lesson.model';
import { Course } from '../course/course.model';
import { ILesson, ILessonFilters, IModuleGroup } from './lesson.interface';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';

/**
 * Create a new lesson
 */
const createLesson = async (payload: Partial<ILesson>): Promise<ILesson> => {
    // Check if course exists
    const course = await Course.findById(payload.course);
    if (!course) {
        throw new AppError(404, 'Course not found');
    }

    // Create lesson
    const lesson = await Lesson.create(payload);

    // Update course stats
    await updateCourseStats(payload.course!.toString());

    return lesson;
};

/**
 * Create multiple lessons at once
 */
const bulkCreateLessons = async (
    courseId: string,
    lessonsData: Partial<ILesson>[]
): Promise<ILesson[]> => {
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
        throw new AppError(404, 'Course not found');
    }

    // Add course reference to all lessons
    const lessonsWithCourse = lessonsData.map((lesson) => ({
        ...lesson,
        course: courseId,
    }));

    // Create all lessons
    const lessons = await Lesson.insertMany(lessonsWithCourse);

    // Update course stats
    await updateCourseStats(courseId);

    return lessons as unknown as ILesson[];
};

/**
 * Get all lessons for a course (flat list)
 */
const getLessonsByCourse = async (
    courseId: string,
    includeUnpublished: boolean = false
): Promise<ILesson[]> => {
    const query: any = { course: courseId };

    if (!includeUnpublished) {
        query.isPublished = true;
    }

    const lessons = await Lesson.find(query)
        .sort({ moduleOrder: 1, order: 1 })
        .lean();

    return lessons;
};

/**
 * Get lessons grouped by module
 */
const getGroupedLessons = async (
    courseId: string,
    includeUnpublished: boolean = false
): Promise<IModuleGroup[]> => {
    const query: any = { course: courseId };

    if (!includeUnpublished) {
        query.isPublished = true;
    }

    const lessons = await Lesson.find(query)
        .sort({ moduleOrder: 1, order: 1 })
        .lean();

    // Group lessons by module
    const moduleMap = new Map<string, IModuleGroup>();

    lessons.forEach((lesson) => {
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

    return Array.from(moduleMap.values()).sort(
        (a, b) => a.moduleOrder - b.moduleOrder
    );
};

/**
 * Get single lesson by ID
 */
const getLessonById = async (
    lessonId: string,
    checkPublished: boolean = true
): Promise<ILesson | null> => {
    const query: any = { _id: lessonId };

    if (checkPublished) {
        query.isPublished = true;
    }

    const lesson = await Lesson.findOne(query);

    if (!lesson) {
        throw new AppError(404, 'Lesson not found');
    }

    return lesson;
};

/**
 * Get free preview lessons for a course
 */
const getFreeLessons = async (courseId: string): Promise<ILesson[]> => {
    const lessons = await Lesson.find({
        course: courseId,
        isFree: true,
        isPublished: true,
    })
        .sort({ moduleOrder: 1, order: 1 })
        .lean();

    return lessons;
};

/**
 * Update lesson
 */
const updateLesson = async (
    lessonId: string,
    payload: Partial<ILesson>
): Promise<ILesson | null> => {
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
        throw new AppError(404, 'Lesson not found');
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(lessonId, payload, {
        new: true,
        runValidators: true,
    });

    // Update course stats if duration changed
    if (payload.videoDuration !== undefined) {
        await updateCourseStats(lesson.course.toString());
    }

    return updatedLesson;
};

/**
 * Delete lesson
 */
const deleteLesson = async (lessonId: string): Promise<ILesson | null> => {
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
        throw new AppError(404, 'Lesson not found');
    }

    const courseId = lesson.course.toString();

    const deletedLesson = await Lesson.findByIdAndDelete(lessonId);

    // Update course stats
    await updateCourseStats(courseId);

    return deletedLesson;
};

/**
 * Reorder lessons
 */
const reorderLessons = async (
    lessonsOrder: { lessonId: string; moduleOrder: number; order: number }[]
): Promise<void> => {
    const bulkOps = lessonsOrder.map((item) => ({
        updateOne: {
            filter: { _id: new Types.ObjectId(item.lessonId) },
            update: { $set: { moduleOrder: item.moduleOrder, order: item.order } },
        },
    }));

    await Lesson.bulkWrite(bulkOps as any);
};

/**
 * Toggle lesson publish status
 */
const togglePublishStatus = async (lessonId: string): Promise<ILesson | null> => {
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
        throw new AppError(404, 'Lesson not found');
    }

    lesson.isPublished = !lesson.isPublished;
    await lesson.save();

    return lesson;
};

/**
 * Update course stats (total duration, lessons count)
 * Internal helper function
 */
const updateCourseStats = async (courseId: string): Promise<void> => {
    const stats = await Lesson.aggregate([
        { $match: { course: courseId } },
        {
            $group: {
                _id: null,
                totalDuration: { $sum: '$videoDuration' },
                totalLessons: { $sum: 1 },
                totalModules: { $addToSet: '$moduleTitle' },
            },
        },
    ]);

    if (stats.length > 0) {
        await Course.findByIdAndUpdate(courseId, {
            totalDuration: Math.round(stats[0].totalDuration / 60), // Convert to minutes
            totalLessons: stats[0].totalLessons,
            totalModules: stats[0].totalModules.length,
        });
    } else {
        await Course.findByIdAndUpdate(courseId, {
            totalDuration: 0,
            totalLessons: 0,
            totalModules: 0,
        });
    }
};

/**
 * Get next and previous lesson
 */
const getAdjacentLessons = async (
    courseId: string,
    currentLessonId: string
): Promise<{ prev: ILesson | null; next: ILesson | null }> => {
    const lessons = await Lesson.find({ course: courseId, isPublished: true })
        .sort({ moduleOrder: 1, order: 1 })
        .lean();

    const currentIndex = lessons.findIndex(
        (l) => l._id?.toString() === currentLessonId
    );

    return {
        prev: currentIndex > 0 ? lessons[currentIndex - 1] : null,
        next: currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null,
    };
};

export const LessonService = {
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
