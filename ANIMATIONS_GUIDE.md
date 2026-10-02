# 🎬 Animation System Guide - Etsy AI Command Center

This document details all animations available in the production-ready Etsy AI Command Center with animated sidebar, page transitions, and card glows.

---

## 🚀 Quick Start with PowerShell Install

### Run the Installer
```powershell
# Navigate to project directory
cd C:\Users\YourUsername\Documents\AI-Etsy-Command-Center

# Run the installer (this handles all setup + starts dev server)
.\INSTALL.ps1
```

### Installer Options
```powershell
# Skip Node.js version check
.\INSTALL.ps1 -SkipNodeCheck

# Setup only (don't start dev server)
.\INSTALL.ps1 -DevMode:$false

# Skip build step
.\INSTALL.ps1 -SkipBuild
```

---

## ✨ Animation Features

### 1. Sidebar Animations

#### `animate-sidebar-in` (400ms)
- **Usage**: Applied to the main sidebar container
- **Effect**: Smooth slide-in from left with fade-in
- **Easing**: Cubic-bezier for natural motion
- **CSS**: `sidebar-slide-in` keyframe

```html
<div className="animate-sidebar-in">
  {/* Sidebar content */}
</div>
```

#### `animate-sidebar-out` (400ms)
- **Usage**: Exit animation when sidebar closes
- **Effect**: Slide-out to left with fade-out
- **Easing**: Cubic-bezier exit easing

---

### 2. Page Transition Animations

#### `animate-page-in` (400ms)
- **Usage**: Applied to main content container
- **Effect**: Fade-in with subtle upward movement (8px)
- **Easing**: Cubic-bezier entrance curve
- **CSS**: `page-fade-in` keyframe

```html
<div className="animate-page-in">
  {/* Page content */}
</div>
```

#### `animate-page-out` (300ms)
- **Usage**: Exit animation between pages
- **Effect**: Fade-out with downward movement
- **Easing**: Cubic-bezier exit curve

---

### 3. Card Glow Animations

#### `animate-card-glow` (3s infinite)
- **Usage**: Applies pulsing emerald glow effect to cards
- **Effect**: Box shadow radiates outward in 3-second cycle
- **Color**: Emerald (#10B981)
- **CSS**: `card-glow-emerald` keyframe

```html
<div className="card glow-accent animate-card-glow">
  {/* Card content */}
</div>
```

#### `animate-card-glow-blue` (3s infinite)
- **Usage**: Blue glow variant for secondary cards
- **Effect**: Same pulsing effect with blue color
- **Color**: Blue (#3B82F6)
- **CSS**: `card-glow-blue` keyframe

#### `glow-emerald` (class modifier)
- **Usage**: Hover-specific emerald glow
- **Effect**: Enhanced shadow on hover with inset glow

#### `glow-accent` (class modifier)
- **Usage**: Accent cards with default glow
- **Effect**: Permanent subtle glow with enhanced hover

```html
<div className="card glow-accent">
  {/* Always glows subtly, brightens on hover */}
</div>
```

---

### 4. Staggered List Animations

Apply staggered entrance to lists with `animate-stagger` + delay class:

```html
<div className="animate-stagger animate-stagger-1">Item 1</div>
<div className="animate-stagger animate-stagger-2">Item 2</div>
<div className="animate-stagger animate-stagger-3">Item 3</div>
```

#### Available Delay Classes
- `.animate-stagger-1` (50ms delay)
- `.animate-stagger-2` (100ms delay)
- `.animate-stagger-3` (150ms delay)
- `.animate-stagger-4` (200ms delay)
- `.animate-stagger-5` (250ms delay)
- `.animate-stagger-6` (300ms delay)
- `.animate-stagger-7` (350ms delay)
- `.animate-stagger-8` (400ms delay)

**Duration**: 250ms per item
**Total animation time**: ~650ms for 8 items

---

### 5. Button Animations

#### Button Press Effect
- **Trigger**: `:active` state
- **Duration**: 200ms
- **Effect**: Scales from 1 → 0.98 → 1 for tactile feedback

```html
<button className="btn btn-accent">Click Me</button>
```

---

### 6. Text Glow Animation

#### `animate-text-glow` (3s infinite)
- **Usage**: Highlights important text with pulsing glow
- **Effect**: Color stays constant, shadow pulses
- **Duration**: 3-second cycle

```html
<h1 className="animate-text-glow">Important Title</h1>
```

---

## 🎨 Existing Animations

### Legacy Animation Classes

#### `animate-pulse-glow` (2s infinite)
- Pulsing box-shadow outward expansion
- Use for active status indicators

#### `animate-pulse-dot` (2s infinite)
- Smaller pulsing effect for status dots
- Used in agent status indicators

#### `animate-spin` (1s infinite)
- Full 360° rotation
- Use for loading spinners

#### `animate-fade-in` (250ms)
- Simple opacity change from 0 to 1

#### `animate-slide-up` (250ms)
- Slide upward with fade-in
- Y-axis: 10px to 0

---

## 📊 Performance Considerations

### GPU-Accelerated Animations
All animations use `transform` and `opacity` for optimal performance:
- ✅ `transform: translateX()`, `translateY()`, `scale()`
- ✅ `opacity`
- ❌ Avoid animating: `width`, `height`, `top`, `left`

### Timing
- **Fast transitions**: 150ms (UI feedback)
- **Normal transitions**: 250ms (page elements)
- **Slow transitions**: 350ms (major layout changes)
- **Sidebar**: 400ms (smooth navigation)
- **Card glows**: 3000ms (background effect, low priority)

### CSS Variables Used
```css
--transition-fast: 150ms ease;
--transition-normal: 250ms ease;
--transition-slow: 350ms ease;
```

---

## 🎭 Animation Combinations

### Dashboard Load Sequence
1. **Sidebar**: `animate-sidebar-in` (0ms)
2. **Main content**: `animate-page-in` (0ms, staggered)
3. **Metric cards**: `animate-stagger` + delay (50-400ms)
4. **Card hover**: `card:hover` glow effect

**Total perceived load time**: ~650ms with professional stagger

### Page Navigation Flow
```
Current page: animate-page-out (300ms)
↓
New page: animate-page-in (400ms)
Total: 300ms + page render + 400ms = ~700ms transition
```

---

## 🔧 Using Animations in Components

### Apply to Card with Glow
```tsx
<div className="card glow-accent animate-card-glow">
  <h3>My Card</h3>
  <p>Content here</p>
</div>
```

### Apply Stagger to List
```tsx
{items.map((item, i) => (
  <div key={i} className={`card animate-stagger animate-stagger-${i + 1}`}>
    {item.title}
  </div>
))}
```

### Combine Multiple Animations
```tsx
<div className="card glow-emerald animate-page-in">
  <button className="btn btn-accent">
    Press me for tactile feedback
  </button>
</div>
```

---

## 🎨 CSS Variable Customization

### Colors Used in Animations
```css
--color-emerald: #10B981;    /* Primary glow */
--color-blue: #3B82F6;       /* Secondary glow */
--bg-primary: #0F172A;       /* Dark background */
--bg-secondary: #1E293B;     /* Card background */
```

### Modify Animation Speed
Edit `globals.css` to adjust timing:
```css
:root {
  --transition-fast: 100ms ease;      /* was 150ms */
  --transition-normal: 200ms ease;    /* was 250ms */
  --transition-slow: 300ms ease;      /* was 350ms */
}
```

---

## 📝 Browser Support

### Supported Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Features Used
- CSS Keyframes animations
- CSS Transforms (GPU accelerated)
- Cubic-bezier easing
- Pseudo-elements (::before)

---

## 🚀 Production Deployment

### Build for Production
```powershell
npm run build
```

### Serve Static Files
All animation assets are baked into the compiled CSS. No additional dependencies needed.

### Performance in Production
- Bundle size: ~+2KB (CSS animations only, no JavaScript)
- No runtime performance overhead
- Fully static, no layout thrashing

---

## 🐛 Troubleshooting

### Animations Not Running
1. Check browser console for CSS errors
2. Verify classes are applied: `<div class="animate-sidebar-in">`
3. Check if element has `display: none` (animations won't run on hidden elements)
4. Try disabling browser extensions (some block animations)

### Animations Too Fast/Slow
Edit the specific `@keyframes` in `globals.css` or override with CSS:
```css
.animate-sidebar-in {
  animation-duration: 600ms !important;
}
```

### GPU Acceleration Issues
Ensure using `transform` and `opacity` only:
```css
/* Good */
transform: translateX(100px);

/* Bad - causes reflow */
left: 100px;
```

---

## 📚 References

- [MDN: CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [Web.dev: Animations Performance](https://web.dev/animations-guide/)
- [Cubic-bezier.com](https://cubic-bezier.com) - Easing function visualizer

---

## 📄 License

All animations are part of the Etsy AI Command Center production system.
