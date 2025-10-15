# User Campaigns Update

## Changes Made

### 1. Updated Campaign Images in WalletStore
**File:** `src/store/walletStore.ts`

Added proper image URLs to the three default user campaigns:
- **Community Food Bank Drive**: Food Bank Philippines image
- **Medical Equipment for Rural Clinics**: Medical equipment image from Unsplash
- **School Supplies for 500 Students**: School supplies/education image from Unsplash

### 2. Added Campaign Detail Pages
**File:** `src/app/(main)/campaign/[id]/page.tsx`

Added three new campaign entries to `mockCampaignsData`:

#### user-campaign-1: Community Food Bank Drive
- **Title**: Community Food Bank Drive
- **Goal**: 50 ETH
- **Raised**: 32.5 ETH (65%)
- **Donors**: 47
- **Location**: Manila, Philippines
- **Status**: Active
- **Description**: Detailed description about providing meals to 500+ families weekly
- **Image**: Food Bank Philippines photo
- **Creator**: Maria Santos (MS)

#### user-campaign-2: Medical Equipment for Rural Clinics
- **Title**: Medical Equipment for Rural Clinics
- **Goal**: 75 ETH
- **Raised**: 58.8 ETH (78%)
- **Donors**: 112
- **Location**: Cebu, Philippines
- **Status**: Active
- **Description**: Equipping 10 rural clinics with essential medical equipment
- **Image**: Medical equipment photo
- **Creator**: Red Cross PH (RC)

#### user-campaign-3: School Supplies for 500 Students
- **Title**: School Supplies for 500 Students
- **Goal**: 25 ETH
- **Raised**: 25 ETH (100% - COMPLETED!)
- **Donors**: 89
- **Location**: Davao, Philippines
- **Status**: Completed
- **Description**: Complete school supply kits for 500 students in remote areas
- **Image**: School supplies photo
- **Creator**: Juan Dela Cruz (JD)

## Features

Each campaign now has:
- ✅ **Unique detailed descriptions** explaining the cause and impact
- ✅ **Real images** (not placeholders)
- ✅ **Proper creator information** with avatars and bios
- ✅ **Dynamic deadlines** (calculated from current date)
- ✅ **Unique contract addresses** for blockchain tracking
- ✅ **Complete campaign stats** (donors, percentage, dates)
- ✅ **Verification badges** for trusted campaigns
- ✅ **Different statuses** (active vs completed)

## How It Works

1. **Dashboard "My Campaigns"**: Shows these three campaigns with images
2. **Click "View Details"**: Now navigates to unique campaign detail pages
3. **Campaign Detail Page**: Shows full information specific to each campaign
4. **Donation History**: Each campaign can track its own donations
5. **Creator Profiles**: Clicking creator names links to their dashboards

## User Experience Flow

```
Dashboard → My Campaigns → View Details (for any campaign)
    ↓
Campaign Detail Page (user-campaign-1, 2, or 3)
    ↓
- See unique description and images
- View campaign progress and stats
- Donate to the campaign
- View donation history
- See creator profile
- Navigate to creator's dashboard
```

## Benefits

- **Realistic Demo**: Each campaign feels unique and authentic
- **Complete Testing**: Users can test the full donation flow
- **Visual Appeal**: Professional images enhance credibility
- **Story Telling**: Detailed descriptions connect emotionally with donors
- **Status Variety**: Mix of active and completed campaigns shows lifecycle

All campaigns are now fully functional with their own unique content and images!
