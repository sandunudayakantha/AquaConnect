# 🔍 Explore Screen Features Documentation

## 🎯 Overview

The Explore Screen is a comprehensive discovery interface that allows users to search for tips, view nearby water quality issues on a map, find safe water locations, and stay informed about their community's water situation.

## ✨ Key Features

### 1. **Unified Search**
- ✅ Search across **issues** and **tips**
- ✅ Search by keywords, categories, or locations
- ✅ Real-time filtering as you type
- ✅ Filter by type (All, Issues, Tips)

### 2. **Interactive Map View**
- ✅ **Visual representation** of nearby issues
- ✅ **Color-coded markers** by priority
  - 🔴 Red = High Priority
  - 🟠 Orange = Medium Priority
  - 🔵 Blue = Low Priority
  - 🟢 Green = Resolved
- ✅ **5km radius circle** showing search area
- ✅ **User location marker** (blue pin)
- ✅ **Tap markers** to see issue details
- ✅ **Toggle between map and list view**

### 3. **Nearby Issues**
- ✅ **Distance calculation** from user location
- ✅ **Sorted by proximity** (nearest first)
- ✅ **Shows top 10 nearest** issues
- ✅ **Status and priority badges**
- ✅ **Photo indicators**
- ✅ **Full issue details**

### 4. **Safe Water Locations**
- ✅ Shows **resolved issues** (safe areas)
- ✅ **Resolution dates** displayed
- ✅ **Location addresses**
- ✅ **Green checkmark** indicators
- ✅ Helps users find **reliable water sources**

### 5. **Community Statistics**
- ✅ **Total reports** count
- ✅ **Pending issues** count
- ✅ **Resolved issues** count
- ✅ **Available tips** count
- ✅ **Color-coded** for quick reference

### 6. **Priority Alerts**
- ✅ **High priority warning** banner
- ✅ Shows count of urgent issues
- ✅ **Red alert styling**
- ✅ Draws attention to critical problems

## 🗺️ Map Features

### Interactive Elements
```
┌─────────────────────────────────────────┐
│           [Map View]                    │
│                                          │
│    🔵 (You)                             │
│         ○ 5km radius                    │
│    🔴 High Priority Issue               │
│    🟠 Medium Priority Issue             │
│    🟢 Resolved Issue                    │
│                                          │
│  Legend:                                │
│  🔴 High  🟠 Medium  🟢 Resolved        │
└─────────────────────────────────────────┘
```

### Map Controls
- **Pinch to zoom** in/out
- **Drag to pan** around the map
- **Tap markers** to see details
- **Toggle button** to switch to list view

## 🔍 Search Functionality

### Search Capabilities
```javascript
// Search across multiple fields:
- Report categories (water_quality, leakage, etc.)
- Report descriptions
- Location addresses
- Tip titles
- Tip descriptions
- Tip content
```

### Filter Types
1. **All** - Shows both issues and tips
2. **Issues** - Only water quality reports
3. **Tips** - Only conservation tips

### Search Examples
- "water quality" → Shows related issues and tips
- "leakage" → Shows leak reports
- "conservation" → Shows conservation tips
- "downtown" → Shows issues in downtown area

## 📊 Data Integration

### Report Data
```javascript
{
  category: "water_quality",
  description: "Water tastes strange",
  location: {
    latitude: 40.7128,
    longitude: -74.0060,
    address: "123 Main St"
  },
  priority: "High",
  status: "pending",
  photos: ["url1", "url2"],
  distance: 1.5 // km from user
}
```

### Distance Calculation
Uses **Haversine formula** to calculate accurate distances:
```javascript
distance = calculateDistance(
  userLat, userLon,
  reportLat, reportLon
);
// Returns distance in kilometers
```

### Sorting
- Reports sorted by **distance** (nearest first)
- Tips sorted by **relevance** to search query
- Safe locations sorted by **resolution date** (most recent first)

## 🎨 User Interface

### Main Layout
```
┌─────────────────────────────────────────┐
│  Explore                                │
│  156 issues • 45 tips • 12 nearby       │
├─────────────────────────────────────────┤
│  [Search: issues, tips, locations...]🔍│
├─────────────────────────────────────────┤
│  [All] [Issues (156)] [Tips (45)]       │
├─────────────────────────────────────────┤
│  [🗺️ Show Map / 📋 Show List]          │
├─────────────────────────────────────────┤
│  💡 Tips (5)                            │
│  ┌───────────────────────────────────┐  │
│  │ 💧 Fix Leaky Faucets              │  │
│  │ CONSERVATION                      │  │
│  │ A dripping faucet can waste...    │  │
│  └───────────────────────────────────┘  │
├─────────────────────────────────────────┤
│  📍 Nearby Issues (12)                  │
│  ┌───────────────────────────────────┐  │
│  │ WATER QUALITY    [High] [Pending] │  │
│  │ Water tastes strange...           │  │
│  │ 📍 123 Main St        📏 0.5 km   │  │
│  │ 📷 3 photos                       │  │
│  └───────────────────────────────────┘  │
├─────────────────────────────────────────┤
│  ✅ Safe Water Locations                │
│  Areas where issues have been resolved  │
│  ┌───────────────────────────────────┐  │
│  │ ✅ LEAKAGE - Fixed                │  │
│  │ 📍 456 Oak Ave                    │  │
│  │ Resolved on 10/10/2025            │  │
│  └───────────────────────────────────┘  │
├─────────────────────────────────────────┤
│  Community Stats                        │
│  [156 Total] [23 Pending]              │
│  [89 Resolved] [45 Tips]               │
└─────────────────────────────────────────┘
```

## 🚀 Usage Examples

### Example 1: Find Nearby Issues
1. User opens Explore screen
2. Location permission granted
3. Map shows issues within 5km radius
4. User sees 3 high priority issues nearby
5. Taps marker to see details

### Example 2: Search for Tips
1. User types "save water" in search
2. Selects "Tips" filter
3. Sees 5 relevant conservation tips
4. Taps tip to read full content

### Example 3: Find Safe Water Locations
1. User scrolls to "Safe Water Locations"
2. Sees list of recently resolved issues
3. Finds nearest safe location (0.3 km away)
4. Can navigate there for safe water

### Example 4: Check Community Status
1. User views Community Stats
2. Sees 156 total reports
3. 89 resolved (good progress!)
4. 23 pending (need attention)

## 🗺️ Map Implementation

### Features
- **MapView** from react-native-maps
- **User location** with blue marker
- **Report markers** with color coding
- **5km radius** circle overlay
- **Marker clustering** for dense areas (future)

### Marker Colors
```javascript
getMarkerColor(report) {
  if (report.status === 'resolved') return '#4CAF50'; // Green
  if (report.priority === 'High') return '#F44336';   // Red
  if (report.priority === 'Medium') return '#FF9800'; // Orange
  return '#2196F3';                                    // Blue
}
```

### Location Permissions
- Requests foreground location permission
- Gracefully handles permission denial
- Works without location (no distance shown)

## 📱 Mobile Optimization

### Performance
- ✅ **Lazy loading** of map markers
- ✅ **Limited results** (top 10 nearby, top 5 tips)
- ✅ **Efficient distance calculations**
- ✅ **Pull-to-refresh** for data updates

### Responsive Design
- ✅ **Flexible layout** adapts to screen size
- ✅ **Scrollable content** for long lists
- ✅ **Touch-optimized** buttons and cards
- ✅ **Map height** optimized for mobile

## 🔄 Data Flow

```
User Opens Explore Screen
         ↓
Request Location Permission
         ↓
Fetch Reports & Tips from Database
         ↓
Calculate Distances from User Location
         ↓
Sort by Distance
         ↓
Display on Map & List
         ↓
User Searches/Filters
         ↓
Update Display in Real-time
```

## 🎯 Use Cases

### 1. Emergency Situations
**User needs safe water urgently:**
- Opens Explore screen
- Checks map for nearby issues
- Finds safe water locations (resolved areas)
- Navigates to nearest safe location

### 2. Planning Activities
**User planning outdoor activities:**
- Searches for water quality in specific area
- Checks map for any issues nearby
- Reads safety tips
- Makes informed decisions

### 3. Community Awareness
**User wants to know community status:**
- Views Community Stats
- Sees overall water quality situation
- Checks high priority alerts
- Stays informed about local issues

### 4. Learning
**User wants to improve water practices:**
- Searches for specific tips
- Filters by category
- Reads relevant tips
- Applies knowledge at home

## 🛡️ Privacy & Security

### Location Data
- ✅ **Permission-based** access
- ✅ **Not stored** on server
- ✅ **Used only for distance** calculations
- ✅ **Graceful degradation** if denied

### Data Display
- ✅ **Public reports** only
- ✅ **Published tips** only
- ✅ **No personal information** exposed
- ✅ **Aggregated statistics** only

## 📈 Future Enhancements

### Planned Features
- ✅ **Marker clustering** for dense areas
- ✅ **Route navigation** to locations
- ✅ **Augmented reality** view
- ✅ **Real-time updates** with WebSocket
- ✅ **Heatmap overlay** for issue density
- ✅ **Custom map styles**
- ✅ **Offline map caching**
- ✅ **Share locations** with friends
- ✅ **Save favorite locations**
- ✅ **Notifications** for nearby new issues

## 🧪 Testing

### Test Scenarios
1. **Load Screen** - Verify data loads from database
2. **Search** - Test search across issues and tips
3. **Filter** - Test each filter type
4. **Map View** - Verify markers display correctly
5. **Distance** - Check distance calculations
6. **Safe Locations** - Verify resolved issues show
7. **Pull to Refresh** - Test data refresh
8. **No Location** - Test without location permission

## 📝 Summary

The Explore Screen provides a powerful discovery interface that combines:
- 🗺️ **Interactive map** with nearby issues
- 🔍 **Unified search** across all content
- 📍 **Distance-based sorting** for relevance
- ✅ **Safe water locations** for emergencies
- 📊 **Community statistics** for awareness
- ⚠️ **Priority alerts** for urgent issues

**Key Benefits:**
- ✅ **Find nearby issues** quickly
- ✅ **Discover safe water sources**
- ✅ **Search tips and places** easily
- ✅ **Stay informed** about community
- ✅ **Visual representation** on map
- ✅ **Real-time data** from database

The Explore Screen is now a comprehensive tool for community water quality awareness! 🔍✨
