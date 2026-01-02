// ===================================================================
// MotionBoss LMS - Design Model
// Mongoose schema for website design/content
// ===================================================================

import { Schema, model } from 'mongoose';
import { IDesign, DesignModel } from './design.interface';

const heroContentSchema = new Schema({
    badge: {
        text: { type: String, default: 'Premium Learning Platform' },
        textBn: { type: String, default: 'প্রিমিয়াম লার্নিং প্ল্যাটফর্ম' },
        showNew: { type: Boolean, default: true }
    },
    heading: {
        line1: { type: String, default: 'Discover Premium' },
        line1Bn: { type: String, default: 'আবিষ্কার করুন প্রিমিয়াম' }
    },
    dynamicTexts: {
        type: [String],
        default: ['Professional Courses', 'Software Tools', 'Web Development']
    },
    dynamicTextsBn: {
        type: [String],
        default: ['প্রফেশনাল কোর্স', 'সফটওয়্যার টুলস', 'ওয়েব ডেভেলপমেন্ট']
    },
    description: {
        text: {
            type: String,
            default: 'Access thousands of premium courses, software, and digital products. Built by experts, ready for you to launch in minutes.'
        },
        textBn: {
            type: String,
            default: 'হাজার হাজার প্রিমিয়াম কোর্স, সফটওয়্যার এবং ডিজিটাল প্রোডাক্ট অ্যাক্সেস করুন। বিশেষজ্ঞদের দ্বারা তৈরি।'
        },
        brandName: { type: String, default: 'eJobsIT' }
    },
    features: [{
        text: { type: String },
        textBn: { type: String }
    }],
    searchPlaceholder: {
        text: { type: String, default: 'Search courses, software, themes...' },
        textBn: { type: String, default: 'কোর্স, সফটওয়্যার, থিম খুঁজুন...' }
    },
    stats: {
        activeUsers: { type: Number, default: 5000 },
        downloads: { type: Number, default: 12000 },
        avgRating: { type: Number, default: 4.8 },
        totalProducts: { type: Number, default: 500 }
    }
}, { _id: false });

const designSchema = new Schema<IDesign, DesignModel>(
    {
        section: {
            type: String,
            required: true,
            enum: ['hero', 'about', 'footer', 'topHeader', 'navbar'],
            unique: true
        },
        heroContent: heroContentSchema,
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Static method to find by section
designSchema.statics.findBySection = async function (section: string) {
    return this.findOne({ section });
};

export const Design = model<IDesign, DesignModel>('Design', designSchema);
