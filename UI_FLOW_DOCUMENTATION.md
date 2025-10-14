# BlockBayan UI Flow Documentation

## Overview

BlockBayan is a blockchain-powered donation platform for transparent, community-driven giving. This document outlines the complete UI flow implementation.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Libraries**: React 19, Tailwind CSS 4, Framer Motion, Radix UI
- **Icons**: Lucide Icons
- **State Management**: React Hooks

## User Flow Journey

### 1. Landing Page (`/`)

**Components:**

- Hero section with animated headline
- Wallet connection button (simulated)
- Featured sections (Features, Testimonials, FAQ)
- Login/Signup CTAs in header

**Actions:**

- Click "Log In" → Navigate to `/login`
- Click "Sign Up" → Navigate to `/signup`
- View features and information

---

### 2. Sign Up Flow (`/signup`)

**Multi-step registration process:**

#### Step 1: Account Type Selection

- Choose between Personal or Organization account
- Visual card selection interface

#### Step 2: Credentials & Terms

- Personal accounts: Name, Email, Password
- Organization accounts: Additional org name and address fields
- Accept Terms and Conditions checkbox
- Password confirmation validation

#### Step 3: ID Upload

- Upload front and back of valid government ID
- Drag-and-drop or click-to-upload interface
- File preview with success indicators

#### Step 4: Face Verification

- Simulated face verification process
- Instructions for proper verification
- Loading state during verification

#### Step 5: Completion

- Success message with account summary
- Display all registered information
- Redirect to login page

---

### 3. Login Flow (`/login`)

**Features:**

- Email and password authentication
- Remember me checkbox
- Forgot password link
- Social login options (Google, GitHub)
- Automatic redirect to `/dashboard` on success

---

### 4. Dashboard (`/dashboard`)

**Header:**

- BlockBayan logo with navigation
- Dashboard, Explore, Start Campaign links
- Wallet connection status (simulated)
- Connected wallet address display
- Disconnect wallet option

**Tabs:**

#### Tab 1: Overview

- **Stats Cards:**
  - Total Donated (with USD conversion)
  - Total Raised (across all campaigns)
  - Active Campaigns count
- **Recent Activity Feed:**
  - Latest donations and withdrawals
  - Transaction timestamps and amounts
  - Status badges (success/pending)

#### Tab 2: My Campaigns

- **Campaign Cards Display:**
  - Campaign title and chain
  - Progress bar with percentage
  - Raised vs. Goal amounts
  - Deadline date
  - Status badge
  - "View Details" and "Withdraw Funds" buttons
- **Empty State:**
  - Message: "No campaigns yet—launch one in minutes"
  - Create Campaign CTA

#### Tab 3: My Donations

- **Donations Table:**
  - Campaign name
  - Amount donated
  - Date of donation
  - Transaction hash (copyable)
  - Status badge
  - Actions: "View on Blockchain" and "Download Receipt"

#### Tab 4: Ledger

- **Complete Transaction History:**
  - Timestamp
  - Transaction type (donation/withdrawal)
  - From and To addresses
  - Amount and status
  - Clickable transaction hash with external link

---

### 5. Explore Page (`/explore`)

**Tabs:**

#### Tab 1: Campaigns

**Features:**

- Search bar with icon
- Filter button and view toggle (Grid/List)
- Category filter badges (Education, Healthcare, Infrastructure, etc.)
- Verified only filter

**Grid View:**

- Campaign cards with:
  - Featured image
  - Verified badge (if applicable)
  - Title and description
  - Category and location
  - Progress bar
  - Donors count and deadline
  - "View Campaign" button

**List View:**

- Horizontal campaign cards with:
  - Thumbnail image
  - Full details in expanded format
  - "Donate Now" button

#### Tab 2: Transactions

**Features:**

- Search by wallet, campaign, or tx hash
- Filter buttons and CSV export
- Transaction type filters (Donations, Withdrawals)
- Status and chain filters
- Time range filters

**Transactions Table:**

- Timestamp
- Status badge (success/pending/failed)
- Type badge (donation/withdrawal)
- From and To addresses (truncated)
- Amount (native + USD estimate)
- Campaign link
- Transaction hash with external link
- Infinite scroll/Load More

---

### 6. Create Campaign Flow (`/create-campaign`)

**Progress Indicator:**

- 5-step visual progress bar
- Step labels: Basic Info, Funding, Media, Preview, Deploy

#### Step 1: Basic Information

- Campaign title input
- Description textarea
- Category dropdown (8 categories)
- Location input
- Validation: Required fields
- "Continue" button

#### Step 2: Funding Details

- Funding goal in ETH (with USD conversion)
- Campaign end date picker
- Blockchain network selection (Ethereum, Polygon, Base)
- Visual chain selector with logos
- "Back" and "Continue" buttons

#### Step 3: Media Upload

- Campaign image upload (required)
  - Drag-and-drop or click interface
  - File type: PNG, JPG, GIF
  - Max size: 5MB
- Campaign video upload (optional)
  - File type: MP4, WebM
  - Max size: 50MB
- Upload success indicators
- "Back" and "Continue" buttons

#### Step 4: Preview

- Full campaign preview card showing:
  - Media placeholder
  - Title and category badges
  - Description
  - Progress bar (0% initially)
  - Goal, chain, and deadline
  - Verified badge
- "Back" and "Continue to Deploy" buttons

#### Step 5: Deploy

- Network information display
- Estimated gas fee
- Important warning about immutability
- "Deploy Campaign" button with loading state
- Simulated blockchain deployment (3-second delay)

#### Step 6: Success

- Success checkmark animation
- Deployment details card:
  - Campaign title
  - Contract address (copyable)
  - Transaction hash (clickable)
  - Network name
- "Go to Dashboard" and "View Campaign" buttons

---

### 7. Campaign Details Page (`/campaign/[id]`)

**Layout:**

**Left Column (Main Content):**

- Campaign featured image with verified badge
- Campaign title (large heading)
- Category badge, location, and deadline
- Share button
- Full description text
- Tabbed content area:

  **Tab 1: Donation History**

  - Table with:
    - Donor address
    - Amount (ETH + USD)
    - Timestamp
    - Transaction hash with external link

  **Tab 2: Updates**

  - Timeline of campaign updates
  - Date, title, and description
  - Visual timeline with colored borders

  **Tab 3: Smart Contract**

  - Contract address (copyable)
  - Network name
  - Campaign creator address (copyable)
  - Creation date
  - "View on Etherscan" button

**Right Column (Sidebar - Sticky):**

**Donation Card:**

- Raised amount (large, primary color)
- Goal amount
- Progress bar with percentage
- Donors count and days left
- "Donate Now" button (primary)
- "Share Campaign" button (outline)

**Campaign Stats Card:**

- Average donation
- Top donation
- Total transactions
- Verification status badge

---

### 8. Donation Modal Flow

**Triggered by:** "Donate Now" button

**Step 1: Enter Amount**

- Amount input field (ETH)
- USD conversion display
- Network and gas fee information
- "Cancel" and "Confirm Donation" buttons

**Step 2: Processing**

- Loading spinner
- "Processing..." message
- Simulated blockchain transaction (2.5 seconds)

**Step 3: Success**

- Success checkmark animation
- "Thank you for your donation!" message
- Donation amount display
- Transaction hash (copyable)
- "Receipt" and "Explorer" buttons
- "Close" button

---

## Design System

### Colors

- **Primary**: Amber/Orange (`#e78a53`)
- **Background**: Black with gradient overlays
- **Text**: White/Gray scale
- **Accent**: Green for success, Amber for warnings

### Components

- **Cards**: Rounded borders, subtle shadows, hover effects
- **Buttons**:
  - Primary: Amber gradient
  - Outline: Border with hover fill
  - Ghost: Transparent with hover background
- **Badges**: Category-coded, rounded, subtle backgrounds
- **Progress Bars**: Smooth transitions, primary color fill
- **Tables**: Hover states, alternating row colors, copyable elements

### Animations (Framer Motion)

- Page transitions: Fade and slide
- Step transitions: Enter from right, exit to left
- Success states: Scale and fade
- Loading states: Spinner animations
- Hover effects: Smooth color and scale transitions

### Responsive Design

- **Mobile**: Hamburger menu, stacked layouts, single column
- **Tablet**: 2-column grids, condensed spacing
- **Desktop**: 3-column grids, sticky sidebars, expanded tables

---

## Key Features Demonstrated

### 1. Wallet Connection (Simulated)

- Shows connected wallet address (0x742d...C2f4)
- Dropdown with profile and disconnect options
- Persistent connection state across pages

### 2. Blockchain Interactions (Simulated)

- Campaign creation with contract deployment
- Donations with transaction hashes
- Withdrawal functionality
- Gas fee estimates
- Transaction confirmations

### 3. Data Display

- Real-time progress calculations
- Currency conversions (ETH to USD)
- Timestamp formatting
- Address truncation
- Copy-to-clipboard functionality

### 4. User Feedback

- Loading states with spinners
- Success messages with animations
- Error states (validation)
- Toast notifications (implied)
- Progress indicators

### 5. Navigation

- Breadcrumbs (Back to Dashboard, Back to Explore)
- Tab navigation within pages
- Header navigation (Dashboard, Explore, Create)
- Deep linking to campaigns

---

## Mock Data Structure

### Campaigns

```typescript
{
  id: string
  title: string
  description: string
  category: string
  goal: string (ETH)
  raised: string (ETH)
  percentage: number
  donors: number
  verified: boolean
  status: "active" | "completed" | "pending"
  deadline: string (ISO date)
  chain: "Ethereum" | "Polygon" | "Base"
  location: string
  image: string (path)
  contractAddress: string
  creator: string (address)
  createdAt: string (ISO date)
}
```

### Transactions

```typescript
{
  id: string;
  type: "donation" | "withdrawal";
  campaign: string;
  from: string(address);
  to: string(address);
  amount: string(ETH);
  amountUSD: string;
  status: "success" | "pending" | "failed";
  timestamp: string;
  txHash: string;
  chain: string;
}
```

### Donations

```typescript
{
  id: string
  donor: string (address)
  campaign: string
  amount: string (ETH)
  amountUSD: string
  date: string (ISO date)
  txHash: string
  status: "success" | "pending"
}
```

---

## Future Enhancements (Not Implemented)

- Real Web3 wallet integration (RainbowKit/Wagmi)
- Smart contract interaction (Ethers.js)
- IPFS media storage
- Real-time blockchain indexing
- Push notifications
- Multi-language support (Next Intl)
- Dark/Light theme toggle
- Campaign verification workflow
- Advanced filtering and search
- Analytics dashboard
- Email notifications
- Social sharing integration

---

## File Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page (existing)
│   ├── login/page.tsx              # Login page (updated)
│   ├── signup/page.tsx             # Sign up flow (existing)
│   ├── dashboard/page.tsx          # Dashboard with tabs (NEW)
│   ├── explore/page.tsx            # Explore campaigns & transactions (NEW)
│   ├── create-campaign/page.tsx    # Campaign creation flow (NEW)
│   └── campaign/[id]/page.tsx      # Campaign details page (NEW)
├── components/
│   ├── layout/
│   │   └── DashboardHeader.tsx     # Main navigation header (NEW)
│   └── ui/
│       ├── button.tsx              # Button component (existing)
│       ├── input.tsx               # Input component (existing)
│       ├── label.tsx               # Label component (existing)
│       ├── badge.tsx               # Badge component (existing)
│       ├── card.tsx                # Card component (NEW)
│       └── tabs.tsx                # Tabs component (NEW)
```

---

## Running the Application

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run development server:

   ```bash
   npm run dev
   ```

3. Open browser:

   ```
   http://localhost:3000
   ```

4. Test the complete flow:
   - View landing page
   - Click "Sign Up" and complete registration
   - Click "Go to Login" after signup
   - Login with any credentials
   - Explore Dashboard (all 4 tabs)
   - Click "Explore" in header
   - Browse campaigns and transactions
   - Click "View Campaign" on any campaign
   - Test donation modal
   - Click "Start Campaign" in header
   - Complete campaign creation flow
   - View deployed campaign

---

## Notes

- All blockchain interactions are simulated with setTimeout
- Mock data is hardcoded for demonstration
- Wallet connection is simulated (no real Web3 integration)
- All transactions show success states
- Currency conversions use fixed ETH price ($2,420)
- Images use placeholder paths from `/public`

---

## Conclusion

This UI implementation provides a complete demonstration of how BlockBayan would function as a full-stack blockchain donation platform. All user flows from the MVP specification have been implemented with modern UI/UX patterns, animations, and responsive design.
