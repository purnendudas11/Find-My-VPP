# Development Guide - Find My VPP

This guide provides detailed technical information for developers working with the Find My VPP application.

## Architecture Overview

The application follows a React component-based architecture with:
- Functional components using hooks
- Unidirectional data flow (top-down)
- Callback-based parent-child communication
- API integration for backend services

### Component Hierarchy

```
App (root)
├── Header
├── Chat
│   ├── ChatMessage (multiple)
│   ├── TypingIndicator
│   └── MessageInput (form)
└── Recommendations
    └── ProductCard (multiple)
```

## Component Details

### App.js (Main Component)

**Responsibilities:**
- Manage global application state
- Handle API communication
- Coordinate chat and recommendations
- Manage product selections
- Track conversation flow

**State Variables:**
```javascript
messages[]              // Chat history
recommendations{}       // API response data
selectedProducts[]     // User-selected products
isLoading              // API request state
error                  // Error messages
questionIndexRef       // Current questionnaire position
```

**Key Functions:**
- `handleSendMessage(text)` - Process user messages
- `sendMessageToAPI(text)` - Make API calls
- `handleSelectProduct(product)` - Toggle product selection

### Chat.js

**Responsibilities:**
- Render chat interface
- Display messages in order
- Handle message input
- Auto-scroll to latest messages
- Show loading state

**Props:**
```javascript
messages: Array<{text, isUser, timestamp}>
isLoading: Boolean
onSendMessage: (text) => void
```

**Features:**
- Auto-scroll to bottom on new messages
- Disabled input during API calls
- Max length validation (500 chars)
- Empty state placeholder

### ChatMessage.js

**Responsibilities:**
- Render individual chat message
- Style user vs assistant messages differently
- Display timestamps
- Animate message appearance

**Props:**
```javascript
message: {text, isUser, timestamp}
```

### Recommendations.js

**Responsibilities:**
- Display product recommendations
- Extract products from nested API response
- Track selected products
- Show selection summary

**Props:**
```javascript
recommendations: Object
selectedProducts: Array<Product>
onSelectProduct: (product) => void
isLoading: Boolean
```

**Key Logic:**
- De-duplicates products from multiple sources
- Calculates total monthly cost
- Combines individual recommendations and packages

### ProductCard.js

**Responsibilities:**
- Render single product card
- Handle product selection
- Show expandable details
- Display pricing and benefits

**Props:**
```javascript
product: Product
isSelected: Boolean
onSelect: (product) => void
isRecommended: Boolean
```

**Features:**
- Expandable details section
- Recommended badge
- Quick selection toggle
- Benefits checklist

## State Management Flow

### Message Flow
```
User Types Message
    ↓
handleSendMessage() adds to messages[]
    ↓
sendMessageToAPI() makes POST request
    ↓
API Response parsed
    ↓
Assistant response added to messages[]
    ↓
recommendations[] updated
    ↓
Next question displayed
    ↓
Chat UI re-renders
```

### Product Selection Flow
```
User clicks Select/Deselect
    ↓
handleSelectProduct() called
    ↓
selectedProducts[] updated
    ↓
ProductCard detects selection state
    ↓
Card styling changes
    ↓
Selection summary updates
```

## API Integration Details

### Request Structure

```javascript
// Constructed in sendMessageToAPI()
const body = JSON.stringify({
  message: userText
});

// Sent via fetch
fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body
})
```

### Response Parsing

```javascript
// Receive response with nested JSON structure
const data = await response.json();

// Parse outer layer
const bodyParsed = JSON.parse(data.body);

// Parse inner layer
const responseData = JSON.parse(bodyParsed.response);

// Access fields
responseData.summary
responseData.individual_recommendations
responseData.recommended_packages
responseData.follow_up_question
```

### Error Handling

```javascript
try {
  // API call
} catch (err) {
  // Set error state
  setError(err.message);
  
  // Show user message
  addErrorMessage("I encountered an error...");
  
  // Reset loading state
  setIsLoading(false);
}
```

## Styling System

### CSS Architecture

**Global Styles** (App.css, index.css)
- Layout structure
- Color scheme
- Typography
- Responsive breakpoints

**Component Styles** (Component.css)
- Component-specific styles
- Animations
- Interactive states
- Custom scrollbars

### Color Palette

```css
Primary Blue: #3b82f6
Dark Text: #111827
Light Text: #6b7280
Disabled Text: #9ca3af
Background: #ffffff
Sub-background: #f9fafb
Borders: #e5e7eb
Success: #10b981
Error: #dc2626
Warning: #f59e0b
```

### Responsive Breakpoints

```css
Desktop:  > 1024px (2-column grid)
Tablet:   640px - 1024px (1-column)
Mobile:   < 640px (stacked, optimized)
```

## Code Patterns

### Component Pattern

```javascript
import React, { useState } from 'react';
import './Component.css';

const Component = ({ prop1, prop2, onCallback }) => {
  const [state, setState] = useState(initialValue);

  const handleEvent = () => {
    // Logic
    onCallback(value);
  };

  return (
    <div className="component">
      {/* JSX */}
    </div>
  );
};

export default Component;
```

### Hook Pattern

```javascript
// State management
const [value, setValue] = useState(initial);

// Side effects
useEffect(() => {
  // Run after render
  return () => {
    // Cleanup
  };
}, [dependencies]);

// Callbacks
const callback = useCallback(() => {
  // Logic
}, [dependencies]);

// References
const ref = useRef(null);
```

## Performance Optimization

### Memoization

```javascript
// Memoize expensive calculations
const allProducts = useMemo(() => {
  return calculateProducts(recommendations);
}, [recommendations]);

// Memoize callbacks
const handleSelect = useCallback((product) => {
  setSelected(product);
}, []);
```

### Re-render Optimization

- Use `useCallback` for event handlers
- Proper dependency arrays in `useEffect`
- Avoid creating new objects/arrays in render
- Leverage React's diffing algorithm

## Common Tasks

### Adding a New Component

1. Create `src/components/NewComponent.js`
2. Create `src/components/NewComponent.css`
3. Import in parent component
4. Pass required props
5. Add event handlers as needed

### Adding a New State Variable

```javascript
const [newState, setNewState] = useState(initialValue);

// Update state
setNewState(newValue);

// Or with functional update
setNewState(prev => ({ ...prev, field: newValue }));
```

### Adding a New Feature

1. Identify required state changes
2. Add state variables in App.js
3. Create/modify components
4. Add event handlers
5. Style with CSS
6. Test responsiveness

### Debugging Tips

```javascript
// Log component renders
console.log('Component rendered');

// Log state changes
console.log('State:', state);

// Log API calls
console.log('Sending:', JSON.stringify(body));

// Check network tab for API requests
// Use React DevTools for component inspection
```

## Testing Strategy

### Unit Testing
- Component rendering
- State updates
- Props handling
- Callback invocation

### Integration Testing
- Full message flow
- API communication
- Product selection
- Response parsing

### Browser Testing
- Chrome
- Firefox
- Safari
- Mobile browsers

## Build and Deployment

### Development Build
```bash
npm start
# Runs on http://localhost:3000
# Hot module reloading enabled
```

### Production Build
```bash
npm build
# Creates optimized build in /build
# Minified and optimized assets
```

### Environment Configuration

For production, configure proxy:
```json
"proxy": "http://your-api-server.com"
```

## Browser Compatibility

**Supported Versions:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Not Supported:**
- IE 11 and below
- Very old mobile browsers

## Security Considerations

### Input Validation
```javascript
// Validate message length
if (text.length > 500) return;

// Sanitize HTML if needed
// Use textContent instead of innerHTML
```

### API Security
- Use HTTPS in production
- Validate API responses
- Handle CORS properly
- Don't expose sensitive data in comments

## Performance Metrics

### Target Performance
- First Paint: < 1s
- Interactive: < 2s
- Message Response: < 3s
- Select Product: < 100ms

### Optimization Tips
- Minimize unnecessary re-renders
- Use production builds
- Optimize images
- Lazy load optional features

## Troubleshooting Guide

### Issue: API calls failing
**Debug Steps:**
1. Check network tab for requests
2. Verify endpoint URL
3. Check request format
4. Inspect response status
5. Check console for errors

### Issue: Styles not applying
**Debug Steps:**
1. Check CSS file is imported
2. Verify class names match
3. Check CSS specificity
4. Clear browser cache
5. Check for CSS conflicts

### Issue: Messages not scrolling
**Debug Steps:**
1. Check ref is attached properly
2. Verify scroll container has height
3. Check for overflow settings
4. Test auto-scroll logic

## Future Improvements

- [ ] Add state persistence with localStorage
- [ ] Implement auth/user sessions
- [ ] Add analytics tracking
- [ ] Optimize bundle size
- [ ] Add PWA support
- [ ] Implement advanced caching
- [ ] Add accessibility features
- [ ] Support dark mode

## Resources

- React Documentation: https://react.dev
- CSS Reference: https://developer.mozilla.org/en-US/docs/Web/CSS
- JavaScript: https://developer.mozilla.org/en-US/docs/Web/JavaScript
- Web APIs: https://developer.mozilla.org/en-US/docs/Web/API

---

**Last Updated:** 2026  
For questions or issues, refer to the README.md and API_EXAMPLES.md files.
