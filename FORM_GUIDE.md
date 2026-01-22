# New Trip Form - Visual Guide

## Admin Dashboard "Add New Trip" Modal

### Form Fields (Top to Bottom):

```
┌─────────────────────────────────────────────┐
│         Add New Trip / Edit Trip            │
├─────────────────────────────────────────────┤
│                                             │
│  Place Name*                                │
│  [e.g., Mountain Resort, Beach Villa]      │
│                                             │
│  Destination*                              │
│  [e.g., New York, Paris]                   │
│                                             │
│  Select State* ▼                           │
│  [Dropdown: Andhra Pradesh, Arunachal...]  │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ State Information Box (if selected) │   │
│  │ Description: [State details...]     │   │
│  │ [State Image Preview]               │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Description About the Place*              │
│  ┌─────────────────────────────────────┐   │
│  │ [Textarea for detailed info]        │   │
│  │ Describe attractions, highlights... │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Cost of Trip*                              │
│  [e.g., 5000]                              │
│                                             │
│  Date*                                      │
│  [Date Picker: dd/mm/yyyy]                 │
│                                             │
│  Time*                                      │
│  [Time Picker: HH:MM]                      │
│                                             │
│  Total Seats*                              │
│  [e.g., 50]                                │
│                                             │
│  Image of the Place*                       │
│  [Browse... No file selected.]             │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ Image Preview (if uploaded):        │   │
│  │ [Preview Image]                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [Cancel]  [Save]                          │
└─────────────────────────────────────────────┘
```

## Client-Side Trip Card Display

```
┌────────────────────────────────────────┐
│     [Trip Image]                       │
├────────────────────────────────────────┤
│                                        │
│  Taj Mahal Sunset Tour                 │
│  Agra, Uttar Pradesh                   │
│  January 15, 2026                      │
│                                        │
│  "Experience the breathtaking beauty   │
│  of the Taj Mahal at sunset with       │
│  expert guides..."                     │
│                                        │
│  • Tirupati Balaji Temple - ₹10,300   │
│  • Araku Valley - ₹10,800             │
│  • Borra Caves - ₹10,600              │
│                                        │
│  ╭──────────────────────╮             │
│  │ Trip Cost      ₹5,000 │             │
│  ╰──────────────────────╯             │
│                                        │
│  [Info] [Add to Package]              │
│                                        │
└────────────────────────────────────────┘
```

## Trip Details Page

```
[Hero Image of Place]

Trip Details: Taj Mahal Sunset Tour - Agra

₹5,000 per seat

January 15, 2026 at 09:00 AM

┌─────────────────────────────────────┐
│ About Taj Mahal Sunset Tour          │
│ Experience the breathtaking beauty   │
│ of the Taj Mahal at sunset...        │
└─────────────────────────────────────┘

🔍 About Uttar Pradesh
Beautiful description of the state...

Popular Attractions in Uttar Pradesh:
- Taj Mahal - ₹500
- Agra Fort - ₹350
- Akbar's Tomb - ₹200
- ...

Seat Selector:
[A1][A2][A3][A4][A5]
[B1][B2][B3][B4][B5]
...

[Book Now]
```

## Key Features

### 1. Dynamic State Info Display
- When state is selected, system shows:
  - State description
  - State image
  - Popular attractions in that state

### 2. Real-Time Preview
- Image upload shows instant preview
- Form validation happens in real-time
- All changes visible before saving

### 3. Client-Side Display
- Trip cards show:
  - Place name (bold, prominent)
  - Destination and state
  - Trip cost in a colorful gradient box
  - Trip description
  - State attractions
  - Info button to see more details

### 4. Trip Details
- Full trip information display
- State-specific attractions listed
- Cost clearly visible
- Booking options available

## Data Flow

```
Admin Form Input
    ↓
    ├─ Place Name
    ├─ Destination
    ├─ State (triggers STATE_INFO lookup)
    ├─ Description
    ├─ Trip Cost
    ├─ Date & Time
    ├─ Total Seats
    └─ Image (with preview)
    ↓
Save to Database
    ↓
Client Requests Trips
    ↓
Display on Trip Cards
    ├─ Show Place Name
    ├─ Show Destination & State
    ├─ Show Trip Cost
    ├─ Show Description
    └─ Show State Attractions
```

## Example Trip Entry

**Admin Fills:**
- Place Name: "Taj Mahal Sunset Experience"
- Destination: "Agra"
- State: "Uttar Pradesh"
- Description: "A magical journey to witness the world's most beautiful monument at the golden hour. This exclusive tour includes guided tours, photography tips, and a traditional dinner by the riverside."
- Cost: "₹5,000"
- Date: "2026-02-15"
- Time: "04:00 PM"
- Seats: "50"
- Image: [Beautiful Taj Mahal sunset image]

**Client Sees:**
- Card Title: "Taj Mahal Sunset Experience"
- Location: "Agra, Uttar Pradesh"
- Description: "A magical journey to witness..."
- Cost: "₹5,000" (in purple gradient)
- Attractions: Lists all Uttar Pradesh attractions
- Can click "Info" to see full details
- Can add to package tour

## Validation Rules

✅ **Required Fields:**
- Place Name (text)
- Destination (text)
- State (dropdown selection)
- Description (textarea, min 10 chars recommended)
- Trip Cost (number > 0)
- Date (future date)
- Time (24-hour format)
- Total Seats (number > 0)
- Image (required for new trips, optional for edits)

✅ **Optional Enhancements:**
- Image must be < 5MB (if size validation added)
- Description length recommendations
- Cost range validation
