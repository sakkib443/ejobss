# 🎯 LMS & Digital Product Platform - Implementation Plan

## 📅 Project Start Date: December 30, 2025

---

## 🏗️ Backend Architecture Overview

### Current State (ExtraWeb - Marketplace)
```
📂 modules/
├── auth/           ✅ Keep & Modify
├── user/           ✅ Keep & Modify (roles: admin + student)
├── category/       ✅ Keep (for courses & products)
├── platform/       ⚠️ May remove or repurpose
├── website/        ❌ Remove (not needed)
├── software/       🔄 Rename to → digitalProduct
├── cart/           ✅ Keep
├── wishlist/       ✅ Keep
├── order/          ✅ Keep & Modify (for enrollment)
├── review/         ✅ Keep & Modify (video + text)
├── download/       ✅ Keep
├── bkash/          ✅ Keep
├── analytics/      ✅ Keep & Expand
├── upload/         ✅ Keep
└── email/          ✅ Keep
```

### Target State (LMS & Digital Marketplace Platform)
```
📂 modules/
├── auth/               ✅ Authentication (Login, Register, Reset)
├── user/               ✅ User Management (Admin + Student)
├── category/           ✅ Categories (Course & Product)
├── course/             🆕 NEW - Core LMS
├── lesson/             🆕 NEW - Video Lessons
├── enrollment/         🆕 NEW - Course Enrollment
├── website/            ✅ KEEP - Website Templates Sale (Admin posts)
├── software/           ✅ KEEP - Software/Plugins Sale (Admin posts)
├── meeting/            🆕 NEW - Live Classes (Zoom/Meet)
├── event/              🆕 NEW - Seminars & Events
├── digitalProduct/     🔄 Unified Digital Products
├── exam/               🆕 NEW - Exams & Quizzes
├── certificate/        🆕 NEW - Auto Certificates
├── coupon/             🆕 NEW - Discount Coupons
├── license/            🆕 NEW - Product License Keys
├── payment/            🔄 Expand (SSLCommerz, Stripe, PayPal)
├── cart/               ✅ Shopping Cart
├── wishlist/           ✅ Wishlist
├── order/              ✅ Orders & Transactions
├── review/             ✅ Reviews (Video + Text)
├── download/           ✅ File Downloads
├── notification/       🆕 NEW - Email + In-App
├── settings/           🆕 NEW - System Settings
├── analytics/          ✅ Dashboard Analytics
├── upload/             ✅ File Upload (Cloudinary)
└── email/              ✅ Email Service
```

---

## 📋 Phase-by-Phase Implementation

### 🔷 Phase 1: Core Foundation (Week 1)
**Goal:** Clean up existing code, restructure user roles

#### 1.1 User Role Restructure
- [ ] Modify `user.interface.ts` - Change roles to: `admin` | `student`
- [ ] Update `user.model.ts` - Remove seller-specific fields
- [ ] Update `auth.interface.ts` - Update role options
- [ ] Update `auth.service.ts` - Registration with student role
- [ ] Remove/Archive unused modules (website, platform if not needed)

#### 1.2 Cleanup
- [ ] Remove `website` module
- [ ] Rename project references from "ExtraWeb" to "MotionBoss LMS"
- [ ] Update `.env.example` with new project name
- [ ] Update `app.ts` comments and health check message

---

### 🔷 Phase 2: Course Module (Week 2)
**Goal:** Build complete Course management system

#### 2.1 Course Module Structure
```typescript
// course.interface.ts
interface ICourse {
  _id: ObjectId;
  title: string;
  titleBn: string;              // Bengali title
  slug: string;
  description: string;
  descriptionBn: string;
  thumbnail: string;
  previewVideo?: string;
  category: ObjectId;           // Reference to Category
  instructor?: string;          // Optional instructor name
  
  // Pricing
  price: number;
  discountPrice?: number;
  currency: 'BDT' | 'USD';
  
  // Course Type
  courseType: 'online' | 'offline' | 'recorded';
  level: 'beginner' | 'intermediate' | 'advanced';
  language: 'bangla' | 'english' | 'both';
  
  // Duration
  totalDuration: number;        // In minutes
  totalLessons: number;
  
  // Meta
  tags: string[];
  features: string[];
  requirements: string[];
  whatYouWillLearn: string[];
  
  // Status
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  
  // Stats (auto-updated)
  totalEnrollments: number;
  averageRating: number;
  totalReviews: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

#### 2.2 Files to Create
- [ ] `course.interface.ts`
- [ ] `course.model.ts`
- [ ] `course.validation.ts`
- [ ] `course.service.ts`
- [ ] `course.controller.ts`
- [ ] `course.routes.ts`

#### 2.3 API Endpoints
```
GET     /api/courses              - List all courses (with filters)
GET     /api/courses/:id          - Single course details
GET     /api/courses/slug/:slug   - Get by slug
POST    /api/courses              - Create course (Admin)
PATCH   /api/courses/:id          - Update course (Admin)
DELETE  /api/courses/:id          - Delete course (Admin)
GET     /api/courses/featured     - Featured courses
GET     /api/courses/category/:id - Courses by category
```

---

### 🔷 Phase 3: Lesson Module (Week 2-3)
**Goal:** Video lessons management

#### 3.1 Lesson Module Structure
```typescript
interface ILesson {
  _id: ObjectId;
  course: ObjectId;             // Parent course
  moduleTitle: string;          // Module/Section name
  moduleTitleBn: string;
  moduleOrder: number;
  
  title: string;
  titleBn: string;
  description?: string;
  
  // Content
  videoUrl: string;             // Secure video URL
  videoDuration: number;        // In seconds
  videoProvider: 'cloudinary' | 'vimeo' | 'youtube' | 'custom';
  
  // Resources
  resources: {
    title: string;
    fileUrl: string;
    fileType: string;
  }[];
  
  // Order & Access
  order: number;
  isFree: boolean;              // Free preview
  isPublished: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}
```

#### 3.2 Files to Create
- [ ] `lesson.interface.ts`
- [ ] `lesson.model.ts`
- [ ] `lesson.validation.ts`
- [ ] `lesson.service.ts`
- [ ] `lesson.controller.ts`
- [ ] `lesson.routes.ts`

---

### 🔷 Phase 4: Enrollment & Progress (Week 3)
**Goal:** Student course enrollment and progress tracking

#### 4.1 Enrollment Module
```typescript
interface IEnrollment {
  _id: ObjectId;
  student: ObjectId;
  course: ObjectId;
  order: ObjectId;              // Payment reference
  
  enrolledAt: Date;
  expiresAt?: Date;             // For time-limited access
  
  status: 'active' | 'completed' | 'expired';
  progress: number;             // 0-100 percentage
  
  lastAccessedAt: Date;
  completedAt?: Date;
}
```

#### 4.2 Progress Module
```typescript
interface IProgress {
  _id: ObjectId;
  enrollment: ObjectId;
  lesson: ObjectId;
  
  watchedDuration: number;      // Seconds watched
  isCompleted: boolean;
  completedAt?: Date;
  
  notes?: string;               // Student notes
}
```

---

### 🔷 Phase 5: Meeting Module (Week 4)
**Goal:** Live class integration

#### 5.1 Meeting Structure
```typescript
interface IMeeting {
  _id: ObjectId;
  title: string;
  titleBn: string;
  description?: string;
  
  course?: ObjectId;            // Optional course link
  
  // Meeting Details
  meetingType: 'zoom' | 'google_meet' | 'other';
  meetingLink: string;
  meetingId?: string;
  password?: string;
  
  // Schedule
  scheduledAt: Date;
  duration: number;             // Minutes
  timezone: string;
  
  // Recording
  recordingUrl?: string;
  
  // Access
  isPublic: boolean;            // Or restricted to enrolled students
  maxParticipants?: number;
  
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  
  createdBy: ObjectId;
  createdAt: Date;
}
```

---

### 🔷 Phase 6: Event/Seminar Module (Week 4)
**Goal:** Event management system

#### 6.1 Event Structure
```typescript
interface IEvent {
  _id: ObjectId;
  title: string;
  titleBn: string;
  slug: string;
  description: string;
  descriptionBn: string;
  
  thumbnail: string;
  bannerImage?: string;
  
  // Type & Pricing
  eventType: 'seminar' | 'workshop' | 'webinar' | 'meetup';
  mode: 'online' | 'offline' | 'hybrid';
  isFree: boolean;
  price?: number;
  
  // Location
  venue?: string;
  address?: string;
  meetingLink?: string;
  
  // Schedule
  startDate: Date;
  endDate: Date;
  timezone: string;
  
  // Capacity
  maxParticipants?: number;
  currentParticipants: number;
  
  // Speakers
  speakers: {
    name: string;
    title: string;
    image?: string;
    bio?: string;
  }[];
  
  // Status
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  isPublished: boolean;
  
  createdAt: Date;
}

interface IEventRegistration {
  _id: ObjectId;
  event: ObjectId;
  user: ObjectId;
  
  registeredAt: Date;
  status: 'registered' | 'attended' | 'cancelled';
  
  // For paid events
  payment?: ObjectId;
}
```

---

### 🔷 Phase 7: Digital Products (Week 5)
**Goal:** Software, plugins, e-books marketplace

#### 7.1 Digital Product Structure
```typescript
interface IDigitalProduct {
  _id: ObjectId;
  title: string;
  titleBn: string;
  slug: string;
  description: string;
  descriptionBn: string;
  
  // Type
  productType: 'chrome_extension' | 'software_plugin' | 'wordpress_plugin' | 'ebook' | 'template' | 'other';
  category: ObjectId;
  
  // Media
  thumbnail: string;
  screenshots: string[];
  previewUrl?: string;
  demoUrl?: string;
  
  // Pricing
  price: number;
  discountPrice?: number;
  currency: 'BDT' | 'USD';
  
  // Files
  downloadFile: string;         // Secure file URL
  fileSize: string;
  version: string;
  
  // Features
  features: string[];
  requirements: string[];
  changelog: {
    version: string;
    date: Date;
    changes: string[];
  }[];
  
  // License
  licenseType: 'single' | 'multi' | 'unlimited';
  maxActivations?: number;
  
  // Support
  supportPeriod?: number;       // Months
  documentationUrl?: string;
  
  // Stats
  totalSales: number;
  totalDownloads: number;
  averageRating: number;
  
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 🔷 Phase 8: Exam & Certification (Week 5-6)
**Goal:** Quiz system and auto-certification

#### 8.1 Exam Structure
```typescript
interface IExam {
  _id: ObjectId;
  course: ObjectId;
  title: string;
  description?: string;
  
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;      // Index of correct option
    points: number;
  }[];
  
  totalPoints: number;
  passingScore: number;         // Percentage
  timeLimit?: number;           // Minutes
  
  attemptsAllowed: number;
  shuffleQuestions: boolean;
  
  isPublished: boolean;
}

interface IExamAttempt {
  _id: ObjectId;
  exam: ObjectId;
  student: ObjectId;
  
  answers: {
    questionIndex: number;
    selectedAnswer: number;
    isCorrect: boolean;
  }[];
  
  score: number;
  percentage: number;
  isPassed: boolean;
  
  startedAt: Date;
  completedAt: Date;
}
```

#### 8.2 Certificate Structure
```typescript
interface ICertificate {
  _id: ObjectId;
  certificateId: string;        // Unique ID for verification
  
  student: ObjectId;
  course: ObjectId;
  exam?: ObjectId;
  
  // Details
  studentName: string;
  courseName: string;
  issueDate: Date;
  
  // Approval
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: ObjectId;
  approvedAt?: Date;
  
  // Certificate
  certificateUrl?: string;      // Generated PDF
}
```

---

### 🔷 Phase 9: Payment Gateway Expansion (Week 6)
**Goal:** Multiple payment options

#### 9.1 Payment Gateways
- [ ] SSLCommerz integration
- [ ] aamarPay integration
- [ ] Stripe integration
- [ ] PayPal integration
- [ ] Bank Transfer (manual)
- [ ] Keep existing bKash

#### 9.2 Unified Payment Interface
```typescript
interface IPayment {
  _id: ObjectId;
  user: ObjectId;
  order: ObjectId;
  
  gateway: 'bkash' | 'sslcommerz' | 'aamarpay' | 'stripe' | 'paypal' | 'bank';
  transactionId: string;
  
  amount: number;
  currency: 'BDT' | 'USD';
  
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  
  // Gateway specific data
  gatewayResponse?: object;
  
  paidAt?: Date;
  createdAt: Date;
}
```

---

### 🔷 Phase 10: Coupon & License (Week 6)
**Goal:** Discount system and product licenses

#### 10.1 Coupon Structure
```typescript
interface ICoupon {
  _id: ObjectId;
  code: string;                 // Unique coupon code
  
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  
  minPurchase?: number;
  maxDiscount?: number;
  
  applicableTo: 'all' | 'course' | 'product';
  specificItems?: ObjectId[];   // Specific course/product IDs
  
  usageLimit?: number;
  usedCount: number;
  
  startDate: Date;
  endDate: Date;
  
  isActive: boolean;
}
```

#### 10.2 License Structure
```typescript
interface ILicense {
  _id: ObjectId;
  product: ObjectId;
  user: ObjectId;
  order: ObjectId;
  
  licenseKey: string;           // Generated license key
  
  activations: {
    deviceId: string;
    activatedAt: Date;
    ipAddress?: string;
  }[];
  
  maxActivations: number;
  
  expiresAt?: Date;
  status: 'active' | 'expired' | 'revoked';
  
  createdAt: Date;
}
```

---

### 🔷 Phase 11: Notification System (Week 7)
**Goal:** Email and in-app notifications

```typescript
interface INotification {
  _id: ObjectId;
  user: ObjectId;
  
  type: 'email' | 'in_app' | 'both';
  category: 'order' | 'course' | 'meeting' | 'event' | 'system' | 'announcement';
  
  title: string;
  message: string;
  link?: string;
  
  isRead: boolean;
  readAt?: Date;
  
  createdAt: Date;
}
```

---

### 🔷 Phase 12: Settings & Analytics (Week 7)
**Goal:** System configuration and dashboard

```typescript
interface ISettings {
  _id: ObjectId;
  key: string;
  value: any;
  category: 'general' | 'payment' | 'email' | 'seo' | 'appearance';
}
```

---

## 📁 Final Backend Folder Structure

```
📂 src/
├── 📄 app.ts
├── 📄 server.ts
└── 📂 app/
    ├── 📂 config/
    │   └── index.ts
    ├── 📂 middlewares/
    │   ├── auth.ts
    │   ├── validateRequest.ts
    │   ├── globalErrorHandler.ts
    │   └── notFoundHandler.ts
    ├── 📂 utils/
    │   ├── ApiError.ts
    │   ├── sendResponse.ts
    │   ├── generateSlug.ts
    │   ├── generateLicenseKey.ts
    │   └── paginationHelper.ts
    └── 📂 modules/
        ├── 📁 auth/
        ├── 📁 user/
        ├── 📁 category/
        ├── 📁 course/          🆕
        ├── 📁 lesson/          🆕
        ├── 📁 enrollment/      🆕
        ├── 📁 progress/        🆕
        ├── 📁 meeting/         🆕
        ├── 📁 event/           🆕
        ├── 📁 digitalProduct/  🆕
        ├── 📁 exam/            🆕
        ├── 📁 certificate/     🆕
        ├── 📁 coupon/          🆕
        ├── 📁 license/         🆕
        ├── 📁 payment/         🔄
        ├── 📁 cart/
        ├── 📁 wishlist/
        ├── 📁 order/
        ├── 📁 review/
        ├── 📁 download/
        ├── 📁 notification/    🆕
        ├── 📁 settings/        🆕
        ├── 📁 analytics/
        ├── 📁 upload/
        └── 📁 email/
```

---

## ✅ Progress Tracking

### Phase 1: Core Foundation ✅ COMPLETED (Dec 30, 2025)
- [x] User role modification (buyer/seller → admin/student)
- [x] Code cleanup (removed duplicate files)
- [x] Project renaming (ExtraWeb → MotionBoss LMS)
- [x] Auth validation updated
- [x] User validation updated
- [x] Middleware auth roles updated
- [x] Website/Software routes fixed (seller → admin only)
- [x] JWT type issues fixed
- [x] Build successful ✅

### Phase 2: Course Module ✅ COMPLETED (Dec 30, 2025)
- [x] Interface created (`course.interface.ts`)
- [x] Model created (`course.model.ts`)
- [x] Validation created (`course.validation.ts`)
- [x] Service created (`course.service.ts`)
- [x] Controller created (`course.controller.ts`)
- [x] Routes created (`course.routes.ts`)
- [x] Routes registered in `app.ts`
- [ ] Tested with Postman (pending)

### Phase 3: Lesson Module ✅ COMPLETED (Dec 30, 2025)
- [x] Interface created (`lesson.interface.ts`)
- [x] Model created (`lesson.model.ts`) - with module grouping
- [x] Validation created (`lesson.validation.ts`) - incl. bulk create
- [x] Service created (`lesson.service.ts`) - with course stats update
- [x] Controller created (`lesson.controller.ts`)
- [x] Routes created (`lesson.routes.ts`)
- [x] Routes registered in `app.ts`
- [ ] Tested with Postman (pending)

### Phase 4: Enrollment & Progress ✅ COMPLETED (Dec 30, 2025)
- [x] Enrollment Interface created
- [x] Enrollment Model created - with auto-progress calculation
- [x] Enrollment Service created - enroll, progress, stats
- [x] Enrollment Controller created
- [x] Enrollment Routes created
- [x] Routes registered in `app.ts`
- [ ] Progress Module (integrated into Enrollment)
- [ ] Tested with Postman (pending)

### Phase 5: Meeting Module
- [ ] All files created
- [ ] Tested

### Phase 6: Event Module
- [ ] Event CRUD
- [ ] Registration system
- [ ] Tested

### Phase 7: Digital Products
- [ ] Module created
- [ ] License system
- [ ] Tested

### Phase 8: Exam & Certification
- [ ] Exam module
- [ ] Certificate generation
- [ ] Tested

### Phase 9: Payment Gateways
- [ ] SSLCommerz
- [ ] aamarPay
- [ ] Stripe
- [ ] PayPal

### Phase 10: Coupon System
- [ ] Coupon CRUD
- [ ] Apply coupon logic
- [ ] Tested

### Phase 11: Notifications
- [ ] Email notifications
- [ ] In-app notifications

### Phase 12: Settings & Analytics
- [ ] Settings module
- [ ] Analytics enhancement

---

## 🚀 Next Steps

1. **Test APIs with Postman** - Course, Lesson, Enrollment APIs test করা
2. **Phase 5: Meeting Module** - Zoom/Google Meet integration
3. **Phase 6: Event Module** - Seminar & Workshop management
```
