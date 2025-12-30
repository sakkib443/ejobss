// ===================================================================
// ExtraWeb Backend - Category Service
// Category CRUD business logic
// ===================================================================

import AppError from '../../utils/AppError';
import { ICategory, ICategoryFilters } from './category.interface';
import { Category } from './category.model';
import { TCreateCategoryInput, TUpdateCategoryInput } from './category.validation';

const CategoryService = {
    // ==================== CREATE CATEGORY ====================
    async createCategory(payload: TCreateCategoryInput): Promise<ICategory> {
        // Generate slug if not provided
        if (!payload.slug) {
            payload.slug = payload.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        // Check if slug exists
        const existing = await Category.findOne({ slug: payload.slug });
        if (existing) {
            throw new AppError(400, 'Category with this slug already exists');
        }

        const category = await Category.create(payload);
        return category;
    },

    // ==================== GET ALL CATEGORIES ====================
    async getAllCategories(filters: ICategoryFilters): Promise<ICategory[]> {
        const { searchTerm, status } = filters;
        const query: any = {};

        if (searchTerm) {
            query.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
            ];
        }

        if (status) {
            query.status = status;
        }

        const categories = await Category.find(query).sort({ order: 1, name: 1 });
        return categories;
    },

    // ==================== GET ACTIVE CATEGORIES (Public) ====================
    async getActiveCategories(): Promise<ICategory[]> {
        return await Category.find({ status: 'active' }).sort({ order: 1, name: 1 });
    },

    // ==================== GET SINGLE CATEGORY ====================
    async getCategoryById(id: string): Promise<ICategory> {
        const category = await Category.findById(id);
        if (!category) {
            throw new AppError(404, 'Category not found');
        }
        return category;
    },

    // ==================== GET BY SLUG ====================
    async getCategoryBySlug(slug: string): Promise<ICategory> {
        const category = await Category.findOne({ slug, status: 'active' });
        if (!category) {
            throw new AppError(404, 'Category not found');
        }
        return category;
    },

    // ==================== UPDATE CATEGORY ====================
    async updateCategory(id: string, payload: TUpdateCategoryInput): Promise<ICategory> {
        // Check slug uniqueness if updating
        if (payload.slug) {
            const existing = await Category.findOne({ slug: payload.slug, _id: { $ne: id } });
            if (existing) {
                throw new AppError(400, 'Category with this slug already exists');
            }
        }

        const category = await Category.findByIdAndUpdate(
            id,
            { $set: payload },
            { new: true, runValidators: true }
        );

        if (!category) {
            throw new AppError(404, 'Category not found');
        }

        return category;
    },

    // ==================== DELETE CATEGORY ====================
    async deleteCategory(id: string): Promise<void> {
        const category = await Category.findById(id);
        if (!category) {
            throw new AppError(404, 'Category not found');
        }

        // Check if category has products
        if (category.productCount > 0) {
            throw new AppError(400, 'Cannot delete category with products. Move products first.');
        }

        await Category.findByIdAndDelete(id);
    },

    // ==================== INCREMENT PRODUCT COUNT ====================
    async incrementProductCount(categoryId: string): Promise<void> {
        await Category.findByIdAndUpdate(categoryId, { $inc: { productCount: 1 } });
    },

    // ==================== DECREMENT PRODUCT COUNT ====================
    async decrementProductCount(categoryId: string): Promise<void> {
        await Category.findByIdAndUpdate(categoryId, { $inc: { productCount: -1 } });
    },
};

export default CategoryService;
