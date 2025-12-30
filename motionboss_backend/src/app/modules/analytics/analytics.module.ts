// ===================================================================
// MotionBoss LMS - Analytics & Reports Module
// Dashboard Analytics, Revenue Reports, LMS Stats
// ===================================================================

import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import express from 'express';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';
import { Order } from '../order/order.module';
import { BkashPayment } from '../bkash/bkash.module';
import { User } from '../user/user.model';
import { Website } from '../website/website.model';
import { Course } from '../course/course.model';
import { Lesson } from '../lesson/lesson.model';
import { Enrollment } from '../enrollment/enrollment.model';

// ==================== SERVICE ====================
const AnalyticsService = {
    /**
     * Dashboard Summary - Admin dashboard এর জন্য সব stats একসাথে
     * LMS + Marketplace data combined
     */
    async getDashboardSummary(): Promise<{
        // User Stats
        totalUsers: number;
        totalStudents: number;
        newUsersThisMonth: number;
        // Course Stats
        totalCourses: number;
        publishedCourses: number;
        totalLessons: number;
        // Enrollment Stats
        totalEnrollments: number;
        activeEnrollments: number;
        completedEnrollments: number;
        enrollmentsThisMonth: number;
        // Product Stats
        totalWebsites: number;
        totalSoftware: number;
        // Order & Revenue Stats
        totalOrders: number;
        pendingOrders: number;
        completedOrders: number;
        totalRevenue: number;
        todayRevenue: number;
        monthlyRevenue: number;
        // Category Stats
        totalCategories: number;
    }> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // Import dynamically to avoid circular dependencies
        const { Software } = await import('../software/software.model');
        const { Category } = await import('../category/category.model');

        const [
            // User counts
            totalUsers,
            totalStudents,
            newUsersThisMonth,
            // Course counts
            totalCourses,
            publishedCourses,
            totalLessons,
            // Enrollment counts
            totalEnrollments,
            activeEnrollments,
            completedEnrollments,
            enrollmentsThisMonth,
            // Product counts
            totalWebsites,
            totalSoftware,
            // Category count
            totalCategories,
            // Order counts
            totalOrders,
            pendingOrders,
            completedOrders,
            // Revenue aggregations
            totalRevenueResult,
            todayRevenueResult,
            monthlyRevenueResult,
        ] = await Promise.all([
            // User queries
            User.countDocuments({ isDeleted: false }),
            User.countDocuments({ role: 'student', isDeleted: false }),
            User.countDocuments({ createdAt: { $gte: firstDayOfMonth }, isDeleted: false }),
            // Course queries
            Course.countDocuments({}),
            Course.countDocuments({ status: 'published' }),
            Lesson.countDocuments({ isPublished: true }),
            // Enrollment queries
            Enrollment.countDocuments({}),
            Enrollment.countDocuments({ status: 'active' }),
            Enrollment.countDocuments({ status: 'completed' }),
            Enrollment.countDocuments({ enrolledAt: { $gte: firstDayOfMonth } }),
            // Product queries
            Website.countDocuments({ isDeleted: false }),
            Software.countDocuments({ isDeleted: false }),
            // Category query
            Category.countDocuments({ isDeleted: false }),
            // Order queries
            Order.countDocuments(),
            Order.countDocuments({ paymentStatus: 'pending' }),
            Order.countDocuments({ paymentStatus: 'completed' }),
            // Revenue aggregations
            Order.aggregate([
                { $match: { paymentStatus: 'completed' } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } },
            ]),
            Order.aggregate([
                { $match: { paymentStatus: 'completed', orderDate: { $gte: today } } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } },
            ]),
            Order.aggregate([
                { $match: { paymentStatus: 'completed', orderDate: { $gte: firstDayOfMonth } } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } },
            ]),
        ]);

        return {
            // User Stats
            totalUsers,
            totalStudents,
            newUsersThisMonth,
            // Course Stats
            totalCourses,
            publishedCourses,
            totalLessons,
            // Enrollment Stats
            totalEnrollments,
            activeEnrollments,
            completedEnrollments,
            enrollmentsThisMonth,
            // Product Stats
            totalWebsites,
            totalSoftware,
            // Order & Revenue Stats
            totalOrders,
            pendingOrders,
            completedOrders,
            totalRevenue: totalRevenueResult[0]?.total || 0,
            todayRevenue: todayRevenueResult[0]?.total || 0,
            monthlyRevenue: monthlyRevenueResult[0]?.total || 0,
            // Category Stats
            totalCategories,
        };
    },

    /**
     * Public Statistics - Home page এর জন্য public stats (no auth required)
     */
    async getPublicStatistics(): Promise<{
        totalWebsites: number;
        totalSoftware: number;
        totalCustomers: number;
        totalDownloads: number;
        averageRating: number;
        totalReviews: number;
    }> {
        // Import Software model dynamically to avoid circular dependency
        const { Software } = await import('../software/software.model');
        const { Review } = await import('../review/review.module');

        const [
            totalWebsites,
            totalSoftware,
            totalCustomers,
            totalDownloads,
            ratingResult,
            totalReviews,
        ] = await Promise.all([
            Website.countDocuments({ isDeleted: false }),
            Software.countDocuments({ isDeleted: false }),
            User.countDocuments({ isDeleted: false }),
            Order.countDocuments({ paymentStatus: 'completed' }),
            Website.aggregate([
                { $match: { isDeleted: false, rating: { $gt: 0 } } },
                { $group: { _id: null, avg: { $avg: '$rating' } } }
            ]),
            Review ? Review.countDocuments() : Promise.resolve(0),
        ]);

        return {
            totalWebsites,
            totalSoftware,
            totalCustomers,
            totalDownloads,
            averageRating: ratingResult[0]?.avg ? parseFloat(ratingResult[0].avg.toFixed(1)) : 4.8,
            totalReviews,
        };
    },

    /**
     * Revenue by Date Range - নির্দিষ্ট সময়ে কত আয় হয়েছে
     */
    async getRevenueByDateRange(
        startDate: Date,
        endDate: Date
    ): Promise<{ date: string; revenue: number; orders: number }[]> {
        const result = await Order.aggregate([
            {
                $match: {
                    paymentStatus: 'completed',
                    orderDate: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$orderDate' } },
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        return result.map((item) => ({
            date: item._id,
            revenue: item.revenue,
            orders: item.orders,
        }));
    },

    /**
     * Top Selling Products - সবচেয়ে বেশি বিক্রি হওয়া products
     */
    async getTopSellingProducts(limit = 10): Promise<any[]> {
        return await Website.find({ isDeleted: false })
            .select('title slug price salesCount rating images')
            .sort({ salesCount: -1 })
            .limit(limit);
    },

    /**
     * Recent Purchases - সাম্প্রতিক purchases
     */
    async getRecentPurchases(limit = 20): Promise<any[]> {
        return await Order.find({ paymentStatus: 'completed' })
            .populate('user', 'firstName lastName email')
            .sort({ orderDate: -1 })
            .limit(limit);
    },

    /**
     * Sales Report Data - CSV ডাউনলোড এর জন্য
     */
    async getSalesReportData(
        startDate: Date,
        endDate: Date
    ): Promise<{
        orders: any[];
        summary: {
            totalOrders: number;
            totalRevenue: number;
            avgOrderValue: number;
        };
    }> {
        const orders = await Order.find({
            paymentStatus: 'completed',
            orderDate: { $gte: startDate, $lte: endDate },
        })
            .populate('user', 'firstName lastName email')
            .sort({ orderDate: -1 });

        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        return {
            orders,
            summary: {
                totalOrders: orders.length,
                totalRevenue,
                avgOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
            },
        };
    },

    /**
     * Customer Report - কোন customer কি কিনেছে
     */
    async getCustomerReport(): Promise<any[]> {
        return await Order.aggregate([
            { $match: { paymentStatus: 'completed' } },
            {
                $group: {
                    _id: '$user',
                    totalOrders: { $sum: 1 },
                    totalSpent: { $sum: '$totalAmount' },
                    lastOrder: { $max: '$orderDate' },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $unwind: '$user' },
            {
                $project: {
                    _id: 0,
                    userId: '$_id',
                    firstName: '$user.firstName',
                    lastName: '$user.lastName',
                    email: '$user.email',
                    totalOrders: 1,
                    totalSpent: 1,
                    lastOrder: 1,
                },
            },
            { $sort: { totalSpent: -1 } },
        ]);
    },

    /**
     * Generate CSV Content - CSV format এ data তৈরি
     */
    generateSalesCSV(orders: any[]): string {
        const headers = [
            'Order Number',
            'Order Date',
            'Customer Name',
            'Customer Email',
            'Products',
            'Total Amount (BDT)',
            'Payment Status',
        ];

        const rows = orders.map((order) => [
            order.orderNumber,
            new Date(order.orderDate).toISOString().split('T')[0],
            `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim(),
            order.user?.email || '',
            order.items?.map((i: any) => i.title).join('; ') || '',
            order.totalAmount,
            order.paymentStatus,
        ]);

        // Create CSV string
        const csvContent = [
            headers.join(','),
            ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
        ].join('\n');

        return csvContent;
    },

    /**
     * Generate Customer CSV
     */
    generateCustomerCSV(customers: any[]): string {
        const headers = [
            'Customer Name',
            'Email',
            'Total Orders',
            'Total Spent (BDT)',
            'Last Order Date',
        ];

        const rows = customers.map((c) => [
            `${c.firstName || ''} ${c.lastName || ''}`.trim(),
            c.email || '',
            c.totalOrders,
            c.totalSpent,
            c.lastOrder ? new Date(c.lastOrder).toISOString().split('T')[0] : '',
        ]);

        return [
            headers.join(','),
            ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
        ].join('\n');
    },
};

// ==================== CONTROLLER ====================
const AnalyticsController = {
    // Dashboard Summary
    getDashboard: catchAsync(async (req: Request, res: Response) => {
        const summary = await AnalyticsService.getDashboardSummary();

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Dashboard data fetched',
            data: summary,
        });
    }),

    // Revenue by Date Range
    getRevenue: catchAsync(async (req: Request, res: Response) => {
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const end = endDate ? new Date(endDate as string) : new Date();

        const revenueData = await AnalyticsService.getRevenueByDateRange(start, end);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Revenue data fetched',
            data: revenueData,
        });
    }),

    // Top Selling Products
    getTopProducts: catchAsync(async (req: Request, res: Response) => {
        const limit = Number(req.query.limit) || 10;
        const products = await AnalyticsService.getTopSellingProducts(limit);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Top products fetched',
            data: products,
        });
    }),

    // Recent Purchases
    getRecentPurchases: catchAsync(async (req: Request, res: Response) => {
        const limit = Number(req.query.limit) || 20;
        const purchases = await AnalyticsService.getRecentPurchases(limit);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Recent purchases fetched',
            data: purchases,
        });
    }),

    // Download Sales Report (CSV)
    downloadSalesReport: catchAsync(async (req: Request, res: Response) => {
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const end = endDate ? new Date(endDate as string) : new Date();

        const { orders, summary } = await AnalyticsService.getSalesReportData(start, end);
        const csv = AnalyticsService.generateSalesCSV(orders);

        // Set headers for CSV download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=sales-report-${start.toISOString().split('T')[0]}-to-${end.toISOString().split('T')[0]}.csv`);

        res.send(csv);
    }),

    // Download Customer Report (CSV)
    downloadCustomerReport: catchAsync(async (req: Request, res: Response) => {
        const customers = await AnalyticsService.getCustomerReport();
        const csv = AnalyticsService.generateCustomerCSV(customers);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=customer-report.csv');

        res.send(csv);
    }),

    // Get Customer Report (JSON)
    getCustomerReport: catchAsync(async (req: Request, res: Response) => {
        const customers = await AnalyticsService.getCustomerReport();

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Customer report fetched',
            data: customers,
        });
    }),

    // Public Statistics (no auth required)
    getPublicStats: catchAsync(async (req: Request, res: Response) => {
        const stats = await AnalyticsService.getPublicStatistics();

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Public statistics fetched',
            data: stats,
        });
    }),
};

// ==================== ROUTES ====================
const router = express.Router();

// ========== PUBLIC ROUTES (No Auth) ==========
// Public stats for home page - MUST be before auth middleware
router.get('/public-stats', AnalyticsController.getPublicStats);

// ========== ADMIN ROUTES (Auth Required) ==========
// All routes below require admin authentication
router.use(authMiddleware, authorizeRoles('admin'));

// Dashboard
router.get('/dashboard', AnalyticsController.getDashboard);

// Revenue
router.get('/revenue', AnalyticsController.getRevenue);

// Top Products
router.get('/top-products', AnalyticsController.getTopProducts);

// Recent Purchases
router.get('/recent-purchases', AnalyticsController.getRecentPurchases);

// Customer Report
router.get('/customers', AnalyticsController.getCustomerReport);

// Download Reports (CSV)
router.get('/download/sales', AnalyticsController.downloadSalesReport);
router.get('/download/customers', AnalyticsController.downloadCustomerReport);

export const AnalyticsRoutes = router;
export default AnalyticsService;
