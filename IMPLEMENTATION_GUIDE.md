# Implementation Guide: 4-Menu Rotation System

## Summary

Successfully implemented a complete menu rotation system for Sindhi Mess that cycles through 4 different weekly menus. The system is synchronized to **Week 2 as of October 16, 2025**, and includes a user-friendly UI to override and browse different weeks' menus.

## What Was Implemented

### 1. Core Menu Manager (`src/lib/menuManager.ts`)
The heart of the rotation system with the following key functions:

- **`getWeekNumberFromDate(date: Date): number`**
  - Calculates which week number we're in based on any date
  - Uses Monday Oct 13, 2025 (Week 2) as the synchronization reference point
  - Handles IST timezone correctly

- **`getMenuNumberForWeek(weekNumber: number): number`**
  - Maps week numbers to menu numbers (1-4) using modulo arithmetic
  - Formula: `((weekNumber - 1) % 4 + 4) % 4 + 1`
  - Ensures perfect 4-week cycle

- **`getMenuNameForWeek(weekNumber: number): MenuName`**
  - Returns the menu filename (menu1, menu2, menu3, or menu4)

- **`getMenuNameForDate(date: Date): MenuName`**
  - One-call lookup of menu file for any date

- **`getMenuNameForOverriddenWeek(userOverrideWeekNumber: number | null): {...}`**
  - Handles user preferences when they want to view different weeks
  - Returns whether the current selection is overridden

### 2. Updated Data Loading (`src/data/weeks/index.ts`)
Extended the menu loading system:

- **New `loadMenuForDate(date: Date): Promise<WeekMenu>`**
  - Automatically selects the correct menu based on date
  - Used for server-side rendering and initial page load

- **New `loadMenuByName(menuName: MenuName): Promise<WeekMenu>`**
  - Loads a specific menu JSON file by name
  - Works both server-side (filesystem) and client-side (fetch)

- **Updated `RawMeal` interface**
  - Added support for `vegSides` field from new menu format
  - Backward compatible with existing `veg`, `specialVeg`, `nonVeg`

### 3. WeekSelector Component (`src/components/WeekSelector.tsx`)
Beautiful UI for week selection:

**Features:**
- Dropdown showing ±12 weeks around current week
- Each week option displays week number, menu name, and "(Current)" indicator
- "Override" badge when user selects a non-current week
- "Reset" button to return to current week at a glance

**Usage:**
```tsx
<WeekSelector
  onWeekChange={(weekNum) => {
    setWeekOverride(weekNum === -1 ? null : weekNum);
  }}
  currentOverride={weekOverride}
/>
```

### 4. Enhanced MenuViewer Component (`src/components/MenuViewer.tsx`)
Major updates for dynamic menu loading:

**New Features:**
- Integrates WeekSelector component
- Dynamic menu loading based on user selection or current date
- Loading spinner while fetching menu
- Updated subtitle: "Weekly rotating menu (4-week cycle)"
- Support for both original and new menu JSON formats

**State Management:**
- `weekOverride: number | null` - Tracks user's week override
- `isLoading: boolean` - Tracks menu loading state

### 5. Updated InlineSelect Component (`src/components/InlineSelect.tsx`)
Enhanced with disable support:

- Added `disabled?: boolean` prop
- Dropdown closes and becomes unresponsive when disabled
- Visual feedback with reduced opacity

## How to Use

### For End Users

1. **View Current Week Menu**
   - Site loads with the current week's menu automatically
   - Week selector shows "(Current)" on today's week

2. **Browse Other Weeks**
   - Use the Week dropdown to select any week within ±12 weeks
   - Each week shows its associated menu (menu1-4)
   - Menu content updates automatically

3. **Reset to Current**
   - Click the "Reset" button when an override is active
   - Or select the current week from the dropdown

### For Developers

#### Adding New Menus
When the cycle advances:
1. Update the JSON files in `/public/`
2. No code changes needed - the system automatically handles menu rotation

#### Testing Menu Logic
```typescript
import { getMenuNameForDate, getWeekNumberFromDate } from "@/lib/menuManager";

// Test specific dates
getMenuNameForDate(new Date("2025-10-16")); // "menu2"
getMenuNameForDate(new Date("2025-10-20")); // "menu2" (same week)
getMenuNameForDate(new Date("2025-10-27")); // "menu3" (next week)

// Get week number for any date
getWeekNumberFromDate(new Date("2025-11-03")); // 5
```

## File Structure

### New Files
```
src/lib/menuManager.ts
src/components/WeekSelector.tsx
MENU_MANAGER.md
IMPLEMENTATION_GUIDE.md (this file)
```

### Modified Files
```
src/data/weeks/index.ts          // Added menu loading functions
src/components/MenuViewer.tsx     // Integrated WeekSelector and menu manager
src/components/InlineSelect.tsx   // Added disabled prop
```

### Menu Files (in public/)
```
public/menu1.json    // Rotation slot 1
public/menu2.json    // Rotation slot 2 (current as of Oct 16, 2025)
public/menu3.json    // Rotation slot 3
public/menu4.json    // Rotation slot 4
```

## Reference Dates & Week Mapping

| Date Range | Week | Menu |
|------------|------|------|
| Oct 13-19, 2025 | 2 | menu2 |
| Oct 20-26, 2025 | 3 | menu3 |
| Oct 27-Nov 2, 2025 | 4 | menu4 |
| Nov 3-9, 2025 | 5 | menu1 |
| Nov 10-16, 2025 | 6 | menu2 |
| Nov 17-23, 2025 | 7 | menu3 |

## Technical Details

### Week Calculation
- Based on Monday of each week in IST (Indian Standard Time)
- Reference point: Oct 13, 2025 (Monday of Week 2)
- Formula: `weekNumber = 2 + ((date - refDate) / 7 days)`

### Menu Rotation
- Cycles through menus 1, 2, 3, 4, then repeats
- Formula: `menuNumber = ((weekNumber - 1) % 4) + 1`
- Starting point: Week 2 uses menu2

### Timezone Handling
- All date calculations respect IST timezone
- Uses Intl API for proper timezone-aware date formatting
- Client-side menu loading works across timezones

## Error Handling

- If menu JSON file is missing, fetch error is logged
- Graceful fallback to empty menu rather than crash
- Loading state prevents UI interaction during fetch

## Performance Optimizations

- Menu files cached with `cache: 'force-cache'` for fast loading
- Week selector uses memoized week options
- Minimal re-renders with React state optimization

## Future Enhancements

1. **Persistent Preferences**
   - Store user's week override in localStorage
   - Auto-restore on next visit

2. **Backend Sync**
   - Fetch week/menu mapping from server
   - Enable dynamic menu updates without code changes

3. **Menu Caching**
   - Service Worker caching for offline support
   - IndexedDB for local menu history

4. **Notifications**
   - Alert users to menu changes
   - Highlight when new menus are available

5. **Week Preview**
   - Show mini previews of upcoming weeks
   - Sidebar with scrollable week list

## Testing Checklist

- [x] Week calculation correct for reference date (Oct 16, 2025 → Week 2)
- [x] Menu cycling works: Week 1→menu1, Week 2→menu2, ..., Week 5→menu1
- [x] WeekSelector UI renders correctly
- [x] Menu loading switches to correct file based on selection
- [x] Loading state shows/hides spinner appropriately
- [x] Reset button returns to current week
- [x] IST timezone handled correctly
- [x] Both menu formats (new and old) parse correctly
- [x] Build completes without errors
- [x] Lint passes with no warnings

## Deployment Notes

- No database changes required
- Menu files added to `/public/` directory
- Component imports may need updates in consuming pages
- Static generation works with menu files
- API routes can be updated to serve menu selection endpoint if needed

## Questions & Support

For more details on menu manager functions, see `MENU_MANAGER.md`.

For component API details, check the component files' JSDoc comments.
