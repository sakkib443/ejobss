// ===================================================================
// MotionBoss LMS - Design Service
// Business logic for Design module
// ===================================================================

import { IDesign } from './design.interface';
import { Design } from './design.model';

/**
 * Get design by section
 */
const getDesignBySection = async (section: string): Promise<IDesign | null> => {
    let design = await Design.findBySection(section);

    // If hero section doesn't exist, create default
    if (!design && section === 'hero') {
        design = await Design.create({
            section: 'hero',
            heroContent: {
                badge: {
                    text: 'Premium Learning Platform',
                    textBn: 'প্রিমিয়াম লার্নিং প্ল্যাটফর্ম',
                    showNew: true
                },
                heading: {
                    line1: 'Discover Premium',
                    line1Bn: 'আবিষ্কার করুন প্রিমিয়াম'
                },
                dynamicTexts: ['Professional Courses', 'Software Tools', 'Web Development'],
                dynamicTextsBn: ['প্রফেশনাল কোর্স', 'সফটওয়্যার টুলস', 'ওয়েব ডেভেলপমেন্ট'],
                description: {
                    text: 'Access thousands of premium courses, software, and digital products. Built by experts, ready for you to launch in minutes.',
                    textBn: 'হাজার হাজার প্রিমিয়াম কোর্স, সফটওয়্যার এবং ডিজিটাল প্রোডাক্ট অ্যাক্সেস করুন। বিশেষজ্ঞদের দ্বারা তৈরি।',
                    brandName: 'eJobsIT'
                },
                features: [
                    { text: 'Instant Access', textBn: 'তাৎক্ষণিক অ্যাক্সেস' },
                    { text: 'Lifetime Updates', textBn: 'আজীবন আপডেট' },
                    { text: 'Premium Support', textBn: 'প্রিমিয়াম সাপোর্ট' },
                    { text: 'Money Back Guarantee', textBn: 'মানি ব্যাক গ্যারান্টি' }
                ],
                searchPlaceholder: {
                    text: 'Search courses, software, themes...',
                    textBn: 'কোর্স, সফটওয়্যার, থিম খুঁজুন...'
                },
                stats: {
                    activeUsers: 5000,
                    downloads: 12000,
                    avgRating: 4.8,
                    totalCourses: 500
                }
            },
            isActive: true
        });
    }

    return design;
};

/**
 * Get all designs
 */
const getAllDesigns = async (): Promise<IDesign[]> => {
    return Design.find({});
};

/**
 * Update design by section
 */
const updateDesignBySection = async (
    section: string,
    payload: Partial<IDesign>
): Promise<IDesign | null> => {
    // Use upsert to create if doesn't exist
    const result = await Design.findOneAndUpdate(
        { section },
        { $set: payload },
        { new: true, upsert: true }
    );
    return result;
};

/**
 * Create or update design
 */
const createDesign = async (payload: IDesign): Promise<IDesign> => {
    // Check if section already exists
    const existing = await Design.findOne({ section: payload.section });

    if (existing) {
        // Update existing
        const updated = await Design.findOneAndUpdate(
            { section: payload.section },
            { $set: payload },
            { new: true }
        );
        return updated!;
    }

    // Create new
    const result = await Design.create(payload);
    return result;
};

export const DesignService = {
    getDesignBySection,
    getAllDesigns,
    updateDesignBySection,
    createDesign
};
