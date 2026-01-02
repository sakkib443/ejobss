// ===================================================================
// MotionBoss LMS - Design Interface
// Website Design/Content management module
// ওয়েবসাইট ডিজাইন এবং কন্টেন্ট ম্যানেজমেন্ট
// ===================================================================

import { Model, Types } from 'mongoose';

/**
 * IHeroContent - Hero Section Content
 * হিরো সেকশনের কন্টেন্ট
 */
export interface IHeroContent {
    badge: {
        text: string;
        textBn: string;
        showNew: boolean;
    };
    heading: {
        line1: string;
        line1Bn: string;
    };
    dynamicTexts: string[];       // Typing animation texts
    dynamicTextsBn: string[];     // Bengali typing texts
    description: {
        text: string;
        textBn: string;
        brandName: string;        // e.g., "eJobsIT"
    };
    features: {
        text: string;
        textBn: string;
    }[];
    searchPlaceholder: {
        text: string;
        textBn: string;
    };
    stats: {
        activeUsers: number;
        downloads: number;
        avgRating: number;
        totalProducts: number;
    };
}

/**
 * IDesign - Main Design Interface
 * Website design settings and content
 */
export interface IDesign {
    _id?: Types.ObjectId;

    // Section identifier
    section: 'hero' | 'about' | 'footer' | 'topHeader' | 'navbar';

    // Hero section content
    heroContent?: IHeroContent;

    // General settings
    isActive: boolean;

    // Timestamps
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * DesignModel - Mongoose Model Type
 */
export interface DesignModel extends Model<IDesign> {
    findBySection(section: string): Promise<IDesign | null>;
}
