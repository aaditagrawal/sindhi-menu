# Menu Manager System Documentation

## Overview

Sindhi Mess operates on a **4-week rotating menu cycle** where they cycle through 4 different weekly menus repeatedly:
- Week 1 → Menu 1
- Week 2 → Menu 2  
- Week 3 → Menu 3
- Week 4 → Menu 4
- Week 5 → Menu 1 (cycle repeats)

## Reference Point

As of **October 16, 2025**, Sindhi Mess is on **Week 2**, which uses **menu2.json**.

This date serves as the synchronization reference point. All week calculations derive from this baseline:
- Weeks before Oct 16, 2025 adjust the menu accordingly in the 4-week cycle
- Weeks after Oct 16, 2025 follow the forward rotation pattern

## Menu Files

There are 4 menu JSON files in the `/public` directory:
- `menu1.json` - First menu in the rotation
- `menu2.json` - Second menu in the rotation (current as of Oct 16, 2025)
- `menu3.json` - Third menu in the rotation
- `menu4.json` - Fourth menu in the rotation

Each file contains the weekly meal schedule with lunch and dinner options for Monday through Saturday.

## Menu Manager Module

Located at: `src/lib/menuManager.ts`

### Key Functions

#### `getWeekNumberFromDate(date: Date): number`
Calculates the week number based on any given date, using Oct 13, 2025 (Monday of Week 2) as the reference.

**Example:**
```typescript
const weekNum = getWeekNumberFromDate(new Date("2025-10-20")); // Returns 2
const weekNum = getWeekNumberFromDate(new Date("2025-10-27")); // Returns 3
```

#### `getMenuNumberForWeek(weekNumber: number): number`
Returns the menu number (1-4) for a given week number using modulo arithmetic.

**Example:**
```typescript
getMenuNumberForWeek(1);  // Returns 1 (menu1)
getMenuNumberForWeek(2);  // Returns 2 (menu2)
getMenuNumberForWeek(5);  // Returns 1 (menu1 - cycle repeats)
```

#### `getMenuNameForWeek(weekNumber: number): MenuName`
Returns the menu file name for a given week number.

**Example:**
```typescript
getMenuNameForWeek(2);  // Returns "menu2"
getMenuNameForWeek(5);  // Returns "menu1"
```

#### `getMenuNameForDate(date: Date): MenuName`
Combines week calculation and menu selection in one call.

**Example:**
```typescript
getMenuNameForDate(new Date("2025-10-16")); // Returns "menu2"
```

#### `getMenuNameForOverriddenWeek(userOverrideWeekNumber: number | null): { menuName: MenuName; weekNumber: number; isOverridden: boolean }`
Handles user override logic - if a user wants to view a different week's menu, this function will determine which menu to load.

**Example:**
```typescript
// No override - returns current week
getMenuNameForOverriddenWeek(null);
// Returns: { menuName: "menu2", weekNumber: 2, isOverridden: false }

// User selects Week 5
getMenuNameForOverriddenWeek(5);
// Returns: { menuName: "menu1", weekNumber: 5, isOverridden: true }
```

## UI Components

### WeekSelector Component

Located at: `src/components/WeekSelector.tsx`

A dropdown menu that allows users to:
1. View the current week's menu
2. Browse menus from ±12 weeks around the current week
3. See which menu file each week uses
4. Reset back to the current week

**Props:**
- `onWeekChange: (weekNumber: number) => void` - Callback when week selection changes (-1 means reset to current)
- `currentOverride: number | null` - Current override week (null = no override)

**Features:**
- Shows week number and associated menu name
- Displays "(Current)" indicator on the current week
- Shows "Override" badge when user has selected a non-current week
- Provides a "Reset" button to return to current week

### MenuViewer Component Updates

Located at: `src/components/MenuViewer.tsx`

Updated to integrate the menu manager:

**New Features:**
1. **Dynamic Menu Loading**: Automatically loads the correct menu based on the current date or user override
2. **Week Override UI**: Integrates the WeekSelector component
3. **Loading State**: Shows a spinner while loading menu data
4. **Accurate Menu Display**: Menu subtitle now shows "Weekly rotating menu (4-week cycle)"

**State Management:**
- `weekOverride: number | null` - Tracks user's week selection override
- `isLoading: boolean` - Tracks menu loading state

## How It Works

### Automatic Menu Selection

When a user visits the site:
1. `MenuViewer` component mounts with initial server-rendered menu for the current date
2. On the client side, `MenuViewer` automatically fetches the correct menu based on today's date
3. The `getMenuNameForDate()` function calculates which week we're in
4. The appropriate menu JSON file is loaded and displayed

### User Override Flow

When a user selects a different week from the WeekSelector:
1. `weekOverride` state is updated with the selected week number
2. `MenuViewer` triggers a new menu load using `loadMenuForWeekNumber()`
3. `getMenuNameForOverriddenWeek()` determines the correct menu file for that week
4. The menu is fetched and displayed
5. The "Override" badge shows to indicate a non-current week is being viewed
6. User can click "Reset" to return to the current week

## Data Flow

```
User selects Week 5
         ↓
WeekSelector calls onWeekChange(5)
         ↓
MenuViewer sets weekOverride = 5
         ↓
useEffect triggers with new weekOverride
         ↓
loadMenuForWeekNumber(5) is called
         ↓
getMenuNameForOverriddenWeek(5) returns menuName: "menu1"
         ↓
fetch("/menu1.json")
         ↓
Menu is processed and displayed
```

## Implementation Details

### Week Number Calculation

The week number is calculated based on Monday of each week:
- Reference date: October 13, 2025 (Monday of Week 2)
- Any date's week is determined by how many full 7-day periods it is from the reference Monday
- Formula: `weekNumber = 2 + ((date - referenceDate) / 7 days)`

### Menu Assignment

The menu assignment uses modulo arithmetic with offset:
```
offset = ((weekNumber - 1) % 4 + 4) % 4
menuNumber = offset + 1
```

This ensures:
- Week 1 → offset 0 → menu1 ✓
- Week 2 → offset 1 → menu2 ✓
- Week 3 → offset 2 → menu3 ✓
- Week 4 → offset 3 → menu4 ✓
- Week 5 → offset 0 → menu1 ✓

The formula correctly cycles through menus 1-4.

## File Changes

### New Files
- `src/lib/menuManager.ts` - Core menu manager logic
- `src/components/WeekSelector.tsx` - Week selection UI component
- `MENU_MANAGER.md` - This documentation

### Modified Files
- `src/data/weeks/index.ts` - Added `loadMenuByName()` and `loadMenuForDate()` functions
- `src/components/MenuViewer.tsx` - Integrated menu manager and WeekSelector
- `src/components/InlineSelect.tsx` - Added `disabled` prop

### Public Files (Added)
- `public/menu1.json` - Menu 1 rotation
- `public/menu2.json` - Menu 2 rotation
- `public/menu3.json` - Menu 3 rotation
- `public/menu4.json` - Menu 4 rotation

## Testing

To test the menu manager:

```typescript
import { getMenuNameForDate, getWeekNumberFromDate, getMenuNameForWeek } from "@/lib/menuManager";

// Test Oct 16, 2025 (Week 2)
console.log(getMenuNameForDate(new Date("2025-10-16"))); // Should be "menu2"

// Test Week progression
for (let i = 1; i <= 8; i++) {
  console.log(`Week ${i} uses ${getMenuNameForWeek(i)}`);
}
// Output:
// Week 1 uses menu1
// Week 2 uses menu2
// Week 3 uses menu3
// Week 4 uses menu4
// Week 5 uses menu1
// Week 6 uses menu2
// ...
```

## Future Enhancements

Potential improvements:
1. **Persistent Override**: Store user's week override in localStorage to persist across sessions
2. **Week Preview**: Show upcoming weeks in a sidebar
3. **Menu History**: Allow viewing past weeks' menus
4. **Automatic Sync**: Sync with a backend server for updated menu schedules
5. **Notifications**: Notify users when menu changes
