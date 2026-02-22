# WorkBee Database Models Documentation

## Overview

All models use Mongoose schemas with proper relationships, indexes, and validations. Models are stored in `backend/models/` and exported via `models/index.js`.

---

## 1. User Model (`User.js`)

**Purpose:** Authentication and user identity for customers, workers, and admins.

### Fields:
| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `name` | String | User's full name | ✓ |
| `email` | String | Unique email address | ✓ |
| `password` | String | Hashed password (not returned by default) | ✓ |
| `phone` | String | 10-digit phone number | ✓ |
| `role` | String | `customer` \| `worker` \| `admin` | ✓ (default: customer) |
| `profileImage` | String | Cloudinary URL | false |
| `isVerified` | Boolean | Email verification status | false |
| `isSuspended` | Boolean | Account suspension status | false |
| `lastLogin` | Date | Last login timestamp | false |
| `location` | GeoJSON | GPS coordinates + address | false |
| `createdAt` | Date | Auto timestamp | auto |
| `updatedAt` | Date | Auto timestamp | auto |

### Indexes:
- `email` (unique)
- `role` (for filtering by user type)
- `location.coordinates` (2dsphere for geo-queries)

### Methods:
- `comparePassword(enteredPassword)` - Compare hashed passwords during login
- `toJSON()` - Exclude password from responses

### Example Usage:
```javascript
import { User } from './models/index.js';

// Create user
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: '123456', // Auto-hashed via pre-save hook
  phone: '9876543210',
  role: 'customer'
});

// Compare password during login
const isPasswordCorrect = await user.comparePassword(enteredPassword);
```

---

## 2. WorkerProfile Model (`WorkerProfile.js`)

**Purpose:** Detailed profile for workers (electricians, plumbers, etc.).

### Fields:
| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `userId` | ObjectId | Reference to User (unique) | ✓ |
| `bio` | String | Professional bio (max 500 chars) | false |
| `skills` | [String] | Array of skills/expertise | ✓ |
| `category` | ObjectId | Reference to ServiceCategory | ✓ |
| `experience` | Number | Years of experience (0-60) | false (default: 0) |
| `serviceRate` | Number | Hourly/service rate in rupees | ✓ |
| `documents` | [Object] | Verification documents (Aadhar, PAN, etc.) | false |
| `availability` | Object | Working days/hours | false |
| `ratings` | Object | Average rating, count, total | false |
| `totalBookings` | Number | Lifetime bookings count | false |
| `completedBookings` | Number | Completed bookings count | false |
| `earnings` | Number | Total earnings | false |
| `isApproved` | Boolean | Admin approval status | false |
| `approvedAt` | Date | Approval timestamp | false |
| `location` | GeoJSON | Service location + coordinates | false |
| `createdAt` | Date | Auto timestamp | auto |
| `updatedAt` | Date | Auto timestamp | auto |

### Nested Document: Documents
```javascript
{
  type: 'aadhar' | 'pan' | 'driving_license' | 'passport' | 'skill_certificate',
  url: 'Cloudinary URL',
  verificationStatus: 'pending' | 'approved' | 'rejected',
  rejectionReason: 'Optional reason if rejected',
  uploadedAt: Date,
  verifiedAt: Date
}
```

### Nested Document: Availability
```javascript
{
  daysOfWeek: [1, 2, 3, 4, 5], // 0=Sunday, 6=Saturday
  timeSlots: [
    { startTime: '09:00', endTime: '17:00' }
  ],
  isAvailable: true
}
```

### Indexes:
- `userId` (unique)
- `category`
- `isApproved`
- `ratings.average` (descending)
- `location.coordinates` (2dsphere)

---

## 3. ServiceCategory Model (`ServiceCategory.js`)

**Purpose:** Service types that workers can offer (Electrician, Plumber, etc.).

### Fields:
| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `name` | String | Category name (unique) | ✓ |
| `description` | String | Category description | false |
| `icon` | String | Emoji or icon code | false (default: 🔧) |
| `image` | String | Cloudinary image URL | false |
| `isActive` | Boolean | Show in listings | false (default: true) |
| `totalWorkers` | Number | Worker count in this category | false |
| `totalBookings` | Number | Booking count in this category | false |
| `avgRating` | Number | Average rating (1-5) | false |
| `createdAt` | Date | Auto timestamp | auto |
| `updatedAt` | Date | Auto timestamp | auto |

### Indexes:
- `name` (unique)
- `isActive`

### Pre-configured Categories:
- Electrician
- Plumber
- Maid
- Cook
- Catering
- AC Repair
- Carpenter
- Painter
- Beautician
- Mechanic

---

## 4. Booking Model (`Booking.js`)

**Purpose:** Service booking records with status flow.

### Fields:
| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `customerId` | ObjectId | Reference to Customer (User) | ✓ |
| `workerId` | ObjectId | Reference to Worker (User) | ✓ |
| `categoryId` | ObjectId | Reference to ServiceCategory | ✓ |
| `workerProfileId` | ObjectId | Reference to WorkerProfile | ✓ |
| `status` | String | See status flow below | ✓ |
| `serviceDescription` | String | What customer needs | ✓ |
| `bookingDate` | Date | When service is needed | ✓ |
| `estimatedCompletionDate` | Date | Expected completion | ✓ |
| `actualCompletionDate` | Date | Actual completion | false |
| `amount` | Number | Service cost in rupees | ✓ |
| `paymentStatus` | String | `pending` \| `completed` \| `refunded` | false |
| `paymentMethod` | String | `upi` \| `card` \| `bank_transfer` \| `cash` | false |
| `notes` | String | Customer notes | false |
| `workerNotes` | String | Worker notes | false |
| `images` | [String] | Cloudinary URLs of work photos | false |
| `cancellationReason` | String | Why booking was cancelled | false |
| `location` | GeoJSON | Service location + coordinates | ✓ |
| `createdAt` | Date | Auto timestamp | auto |
| `updatedAt` | Date | Auto timestamp | auto |

### Booking Status Flow:
```
pending → accepted → in_progress → completed → reviewed
                  ↓
              rejected
                  ↓
              cancelled
```

### Indexes:
- `customerId` (with createdAt descending)
- `workerId` (with createdAt descending)
- `status`
- `bookingDate`

---

## 5. Review Model (`Review.js`)

**Purpose:** Customer feedback/ratings for workers after completed bookings.

### Fields:
| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `bookingId` | ObjectId | Reference to Booking (unique) | ✓ |
| `customerId` | ObjectId | Reference to Customer (User) | ✓ |
| `workerId` | ObjectId | Reference to Worker (User) | ✓ |
| `workerProfileId` | ObjectId | Reference to WorkerProfile | ✓ |
| `categoryId` | ObjectId | Reference to ServiceCategory | false |
| `rating` | Number | 1-5 star rating | ✓ |
| `comment` | String | Review text (max 1000 chars) | false |
| `pros` | [String] | What went well | false |
| `cons` | [String] | What could improve | false |
| `wouldRecommend` | Boolean | Would recommend worker | false (default: true) |
| `images` | [String] | Photos from completed work | false |
| `helpful` | Number | Helpful votes count | false |
| `unhelpful` | Number | Unhelpful votes count | false |
| `isPublished` | Boolean | Show in public reviews | false (default: true) |
| `anonymousReview` | Boolean | Hide customer identity | false |
| `createdAt` | Date | Auto timestamp | auto |
| `updatedAt` | Date | Auto timestamp | auto |

### Indexes:
- `workerId` (with createdAt descending)
- `customerId`
- `rating`
- `bookingId` (unique)

### Validation:
- Only one review per booking (enforced via pre-save hook)
- Rating must be 1-5

---

## 6. Notification Model (`Notification.js`)

**Purpose:** System notifications for users about bookings, reviews, documents, etc.

### Fields:
| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `userId` | ObjectId | Reference to User | ✓ |
| `type` | String | Notification type (see below) | ✓ |
| `title` | String | Notification title | ✓ |
| `message` | String | Notification message | ✓ |
| `description` | String | Detailed description | false |
| `relatedId` | ObjectId | Booking/Review/User ID | false |
| `relatedModel` | String | `'Booking'` \| `'Review'` \| `'User'` | false |
| `isRead` | Boolean | Read status | false (default: false) |
| `readAt` | Date | When notification was read | false |
| `actionUrl` | String | Where to navigate on click | false |
| `priority` | String | `low` \| `normal` \| `high` | false |
| `sendEmail` | Boolean | Send email notification | false |
| `emailSent` | Boolean | Email delivery status | false |
| `createdAt` | Date | Auto timestamp | auto |

### Notification Types:
- `booking_request` - New booking request
- `booking_accepted` - Booking accepted
- `booking_rejected` - Booking rejected
- `booking_completed` - Service completed
- `review_received` - New review received
- `payment_received` - Payment received
- `document_verified` - Documents verified
- `system` - General system message

### Indexes:
- `userId` (with createdAt descending)
- `userId` + `isRead`
- `type`
- `createdAt` (with TTL - expires after 90 days)

---

## Database Relationships

```
User (1) ──── (1) WorkerProfile
  │
  ├─ (1) ──── (many) Booking (as customer)
  │
  ├─ (1) ──── (many) Booking (as worker)
  │
  ├─ (1) ──── (many) Review (as customer)
  │
  ├─ (1) ──── (many) Review (as worker)
  │
  └─ (1) ──── (many) Notification

ServiceCategory (1) ──── (many) WorkerProfile
ServiceCategory (1) ──── (many) Booking
ServiceCategory (1) ──── (many) Review

WorkerProfile (1) ──── (many) Booking
WorkerProfile (1) ──── (many) Review

Booking (1) ──── (1) Review (one review per booking)
```

---

## Usage Example

```javascript
import { 
  User, 
  WorkerProfile, 
  ServiceCategory, 
  Booking, 
  Review, 
  Notification 
} from './models/index.js';

// Create a customer
const customer = await User.create({
  name: 'Alice',
  email: 'alice@example.com',
  password: 'password123',
  phone: '9876543210',
  role: 'customer'
});

// Create a worker
const worker = await User.create({
  name: 'Bob',
  email: 'bob@example.com',
  password: 'password123',
  phone: '9876543211',
  role: 'worker'
});

// Get service category
const category = await ServiceCategory.findOne({ name: 'Electrician' });

// Create worker profile
const workerProfile = await WorkerProfile.create({
  userId: worker._id,
  skills: ['Wiring', 'Circuit breaker installation'],
  category: category._id,
  serviceRate: 500,
  experience: 5
});

// Create booking
const booking = await Booking.create({
  customerId: customer._id,
  workerId: worker._id,
  categoryId: category._id,
  workerProfileId: workerProfile._id,
  serviceDescription: 'Install new light fixture',
  bookingDate: new Date('2026-03-01'),
  estimatedCompletionDate: new Date('2026-03-02'),
  amount: 1000,
  location: {
    type: 'Point',
    coordinates: [72.8479, 19.0144],
    address: '123 Main St, Mumbai'
  }
});

// Accept booking
await Booking.findByIdAndUpdate(booking._id, { 
  status: 'accepted',
  acceptedAt: new Date()
});

// Leave review
const review = await Review.create({
  bookingId: booking._id,
  customerId: customer._id,
  workerId: worker._id,
  workerProfileId: workerProfile._id,
  rating: 5,
  comment: 'Great service!',
  wouldRecommend: true
});

// Create notification
await Notification.create({
  userId: worker._id,
  type: 'review_received',
  title: 'New Review',
  message: 'Alice gave you a 5-star review',
  relatedId: review._id,
  relatedModel: 'Review',
  priority: 'high'
});
```

---

## Next Steps

1. ✅ Models created and indexed
2. Step 3: Create Authentication middleware and controllers
3. Step 4: Create Worker APIs
4. Step 5: Create Booking APIs
