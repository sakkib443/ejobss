// ===================================================================
// ExtraWeb Backend - Order Module
// Purchase/Order management
// ===================================================================

import { Schema, model, Types } from 'mongoose';
import { z } from 'zod';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../utils/AppError';
import express from 'express';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import DownloadService from '../download/download.module';
import EmailService from '../email/email.service';
import { User } from '../user/user.model';

// ==================== INTERFACE ====================
export interface IOrderItem {
    product: Types.ObjectId;
    productType: 'website' | 'software';
    title: string;
    price: number;
    image?: string;
}

export interface IOrder {
    _id?: Types.ObjectId;
    orderNumber: string;
    user: Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
    paymentMethod: string;
    transactionId?: string;
    orderDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

// ==================== MODEL ====================
const orderSchema = new Schema<IOrder>(
    {
        orderNumber: { type: String, required: true, unique: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        items: [
            {
                product: { type: Schema.Types.ObjectId, required: true },
                productType: { type: String, enum: ['website', 'software'], required: true },
                title: { type: String, required: true },
                price: { type: Number, required: true },
                image: { type: String },
            },
        ],
        totalAmount: { type: Number, required: true },
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending',
        },
        paymentMethod: { type: String, default: 'stripe' },
        transactionId: { type: String },
        orderDate: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

orderSchema.index({ user: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ paymentStatus: 1 });

export const Order = model<IOrder>('Order', orderSchema);

// ==================== VALIDATION ====================
export const createOrderValidation = z.object({
    body: z.object({
        items: z.array(
            z.object({
                productId: z.string(),
                productType: z.enum(['website', 'software']),
                title: z.string(),
                price: z.number(),
                image: z.string().optional(),
            })
        ).min(1, 'At least one item is required'),
        paymentMethod: z.string().optional(),
    }),
});

// ==================== SERVICE ====================
// Generate unique order number
const generateOrderNumber = (): string => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `EW-${timestamp}-${random}`;
};

const OrderService = {
    async createOrder(
        userId: string,
        items: Array<{ productId: string; productType: 'website' | 'software'; title: string; price: number; image?: string }>,
        paymentMethod: string = 'stripe',
        paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded' = 'pending'
    ): Promise<IOrder> {
        const orderItems = items.map((item) => ({
            product: new Types.ObjectId(item.productId),
            productType: item.productType,
            title: item.title,
            price: item.price,
            image: item.image,
        }));

        const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

        const order = await Order.create({
            orderNumber: generateOrderNumber(),
            user: userId,
            items: orderItems,
            totalAmount,
            paymentMethod,
            paymentStatus,
            orderDate: new Date(),
        });

        // If payment is completed, create download records for all items
        if (paymentStatus === 'completed') {
            for (const item of items) {
                try {
                    await DownloadService.createDownloadRecord(
                        userId,
                        order._id!.toString(),
                        item.productId,
                        item.productType,
                        item.title
                    );
                } catch (error) {
                    console.error(`Failed to create download record for ${item.title}:`, error);
                }
            }

            // Send invoice email
            try {
                const user = await User.findById(userId);
                if (user) {
                    EmailService.sendInvoiceEmail(user.email, {
                        firstName: user.firstName,
                        email: user.email,
                        orderId: order._id!.toString(),
                        items: items.map(item => ({
                            title: item.title,
                            price: item.price,
                            productType: item.productType
                        })),
                        totalAmount,
                        paymentMethod,
                        transactionId: order.transactionId,
                        orderDate: order.orderDate
                    }).catch(err => console.error('Invoice email error:', err));
                }
            } catch (error) {
                console.error('Failed to send invoice email:', error);
            }
        }

        return order;
    },

    async getUserOrders(userId: string, page = 1, limit = 10): Promise<{ data: IOrder[]; total: number }> {
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            Order.find({ user: userId }).sort({ orderDate: -1 }).skip(skip).limit(limit),
            Order.countDocuments({ user: userId }),
        ]);
        return { data: orders, total };
    },

    async getOrderById(orderId: string, userId: string): Promise<IOrder> {
        const order = await Order.findOne({ _id: orderId, user: userId });
        if (!order) throw new AppError(404, 'Order not found');
        return order;
    },

    async updatePaymentStatus(orderId: string, status: IOrder['paymentStatus'], transactionId?: string): Promise<IOrder> {
        const order = await Order.findByIdAndUpdate(
            orderId,
            { paymentStatus: status, transactionId },
            { new: true }
        );
        if (!order) throw new AppError(404, 'Order not found');
        return order;
    },

    async getAllOrders(page = 1, limit = 10, status?: string): Promise<{ data: IOrder[]; total: number }> {
        const query: any = {};
        if (status) query.paymentStatus = status;

        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            Order.find(query).populate('user', 'firstName lastName email').sort({ orderDate: -1 }).skip(skip).limit(limit),
            Order.countDocuments(query),
        ]);
        return { data: orders, total };
    },
};

// ==================== CONTROLLER ====================
const OrderController = {
    createOrder: catchAsync(async (req: Request, res: Response) => {
        const { items, paymentMethod, paymentStatus } = req.body;
        const order = await OrderService.createOrder(req.user!.userId, items, paymentMethod, paymentStatus);
        sendResponse(res, { statusCode: 201, success: true, message: 'Order created', data: order });
    }),

    getMyOrders: catchAsync(async (req: Request, res: Response) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const result = await OrderService.getUserOrders(req.user!.userId, page, limit);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Orders fetched',
            meta: { page, limit, total: result.total, totalPages: Math.ceil(result.total / limit) },
            data: result.data,
        });
    }),

    getOrderById: catchAsync(async (req: Request, res: Response) => {
        const order = await OrderService.getOrderById(req.params.id, req.user!.userId);
        sendResponse(res, { statusCode: 200, success: true, message: 'Order fetched', data: order });
    }),

    // Admin
    getAllOrders: catchAsync(async (req: Request, res: Response) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const status = req.query.status as string | undefined;
        const result = await OrderService.getAllOrders(page, limit, status);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Orders fetched',
            meta: { page, limit, total: result.total, totalPages: Math.ceil(result.total / limit) },
            data: result.data,
        });
    }),

    updateOrderStatus: catchAsync(async (req: Request, res: Response) => {
        const { status, transactionId } = req.body;
        const order = await OrderService.updatePaymentStatus(req.params.id, status, transactionId);
        sendResponse(res, { statusCode: 200, success: true, message: 'Order updated', data: order });
    }),
};

// ==================== ROUTES ====================
const router = express.Router();

router.post('/', authMiddleware, validateRequest(createOrderValidation), OrderController.createOrder);
router.get('/my', authMiddleware, OrderController.getMyOrders);
router.get('/my/:id', authMiddleware, OrderController.getOrderById);

// Admin
router.get('/admin/all', authMiddleware, authorizeRoles('admin'), OrderController.getAllOrders);
router.patch('/admin/:id/status', authMiddleware, authorizeRoles('admin'), OrderController.updateOrderStatus);

export const OrderRoutes = router;
export default OrderService;
