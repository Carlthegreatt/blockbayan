# Author Dashboard Feature

## Overview
This feature allows users to view a campaign creator's public dashboard by clicking on their name in the explore page or campaign detail page. Users can also search for creators directly from the main dashboard.

## Implementation Details

### 1. New Route: `/dashboard/[userId]`
**File:** `src/app/(main)/dashboard/[userId]/page.tsx`

A new dynamic route that displays:
- **User Profile Header** with avatar, name, verification badge, and rating
- **User Stats** including:
  - Total campaigns created
  - Total funds raised
  - Success rate
  - Total backers
  - Response time
  - Join date and location
- **Campaigns Tab** showing all campaigns by that creator
- **About Tab** with detailed creator statistics

### 2. Updated Main Dashboard with User Search
**File:** `src/app/(main)/dashboard/page.tsx`

Added a comprehensive user search feature:
- **Search Bar** in the dashboard header
- **Real-time Search** filters users as you type
- **Search by:**
  - Creator name
  - Wallet address
  - Bio/description
  - Location
- **Dropdown Results** with:
  - User avatar and name
  - Star rating
  - Wallet address
  - Location
- **Click to Navigate** to user's dashboard
- **Overlay close** when clicking outside dropdown

### 3. Updated Explore Page
**File:** `src/app/(main)/explore/page.tsx`

Modified creator info sections to be clickable:
- **Grid View**: Creator card now wraps in a Link to `/dashboard/[userId]`
- **List View**: Creator info also clickable with hover effects
- Added transition effects for better UX

### 4. Updated Campaign Detail Page
**File:** `src/app/(main)/campaign/[id]/page.tsx`

- Campaign Creator card now clickable
- Links to the creator's dashboard at `/dashboard/[userId]`
- Hover effects added for better visual feedback

## User Profiles Database

The feature includes mock user profiles for:
- **Maria Santos** (`0x8e3b...A1d9`) - Education advocate
- **Red Cross PH** (`0x2c4d...F8a1`) - Disaster relief
- **Juan Dela Cruz** (`0x5a8c...D9f2`) - Civil engineer
- **Apo Foundation** (`0x3d2f...A7b9`) - Indigenous support

Each profile includes:
- Name, avatar, and wallet address
- Bio and location
- Join date
- Campaigns created by them
- Auto-generated reputation stats (rating, reviews, success rate, etc.)

## Features

### User Search Functionality
- **Real-time filtering** as you type
- **Multi-field search** across name, address, bio, and location
- **Animated dropdown** with smooth transitions
- **Visual feedback** with hover states
- **Rating display** for each search result
- **Click outside to close** for better UX
- **Responsive design** for mobile and desktop

### Dynamic Reputation System
- Ratings (3.5 - 5.0 stars)
- Review counts (10 - 160 reviews)
- Total campaigns (1 - 21)
- Total raised funds (50 - 550 ETH)
- Response time (1 - 49 hours)
- Success rate (85% - 100%)

### User Experience
- Clean, consistent design with the rest of the app
- Smooth hover transitions
- Mobile-responsive layout
- Back navigation to explore page
- Tab-based interface for campaigns and about sections

## How to Use

1. **Search for Creators from Dashboard:**
   - Go to your main dashboard
   - Use the search bar in the top right
   - Type a creator's name, address, or location
   - Click on any result to view their dashboard

2. **From Explore Page:**
   - Browse campaigns in grid or list view
   - Click on any creator's name/avatar
   - View their complete dashboard

3. **From Campaign Detail Page:**
   - Click on the campaign creator card
   - Navigate to their dashboard
   - See all their campaigns and stats

4. **User Dashboard Features:**
   - View all campaigns by the creator
   - Check their reputation and stats
   - See verification status
   - Navigate to individual campaigns

## Future Enhancements

Potential improvements:
- Real user authentication and profiles
- Actual review/rating system from donors
- Message/contact creator functionality
- Follow/subscribe to creators
- Campaign completion history
- Achievement badges
- Social media integration

## Technical Notes

- Uses Next.js dynamic routing with `[userId]` parameter
- Consistent reputation generation using address-based seeding
- Fully type-safe with TypeScript
- Integrated with existing design system
- No additional dependencies required
