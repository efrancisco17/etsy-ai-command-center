# 🎬 Animations - Quick Reference Card

Copy & paste these animation classes into your components.

## Sidebar & Navigation
```jsx
// Sidebar entrance
<div className="animate-sidebar-in">...</div>

// Sidebar exit
<div className="animate-sidebar-out">...</div>
```

## Page Transitions
```jsx
// Page entrance (fade + slide up)
<div className="animate-page-in">...</div>

// Page exit
<div className="animate-page-out">...</div>
```

## Card Glows
```jsx
// Emerald glow (primary)
<div className="card glow-accent animate-card-glow">...</div>

// Blue glow (secondary)
<div className="card animate-card-glow-blue">...</div>

// Hover glow (emerald)
<div className="card glow-emerald">...</div>

// Always glowing (no hover needed)
<div className="card glow-accent">...</div>
```

## Staggered Lists
```jsx
{items.map((item, i) => (
  <div key={i} className={`card animate-stagger animate-stagger-${i + 1}`}>
    {item.name}
  </div>
))}
```

## Button Effects
```jsx
// Already has tactile press effect
<button className="btn btn-accent">Click me</button>
```

## Text Effects
```jsx
// Pulsing glow on text
<h1 className="animate-text-glow">Important Title</h1>
```

## Status Indicators
```jsx
// Pulsing glow (large)
<div className="animate-pulse-glow">Active</div>

// Pulsing dot (small)
<div className="animate-pulse-dot" style={{width: '10px', height: '10px', borderRadius: '50%'}}>●</div>

// Spinning loader
<div className="animate-spin">⟳</div>
```

## Basic Animations (Legacy)
```jsx
// Fade in
<div className="animate-fade-in">Appear</div>

// Slide up
<div className="animate-slide-up">Slide in</div>
```

## Timing Reference
- **Fast**: 150ms (UI feedback)
- **Normal**: 250ms (default)
- **Slow**: 350ms (major changes)
- **Sidebar**: 400ms
- **Card Glow**: 3000ms (infinite)

## Most Used Combinations
```jsx
// Dashboard metric card
<div className={`card glow-accent animate-stagger animate-stagger-${i + 1}`}>
  {metric.value}
</div>

// Page wrapper
<div className="animate-page-in">
  {/* All page content */}
</div>

// List of items
{items.map((item, i) => (
  <div className={`card animate-stagger animate-stagger-${Math.min(i + 1, 8)}`}>
    {item}
  </div>
))}

// Interactive card
<div className="card glow-emerald" style={{cursor: 'pointer'}}>
  {/* Hover triggers blue glow from globals.css */}
</div>
```

## Color Reference
- **Emerald (Primary)**: #10B981
- **Blue (Secondary)**: #3B82F6
- **Amber (Warning)**: #F59E0B

## Pro Tips
1. Use staggered animations for lists to feel more premium
2. Keep sidebar/page transitions around 400ms for natural feel
3. Card glows look best on dark backgrounds
4. Combine multiple animations for depth
5. Test animations on slower devices (reduce duration if needed)

## Disable Animation
```jsx
// Add to component that doesn't need animation
<div style={{animation: 'none'}}>...</div>
```

## Custom Timing
```jsx
// Override animation speed
<div className="animate-card-glow" style={{animationDuration: '2s'}}>
  Faster glow
</div>
```

---

For full details, see: **ANIMATIONS_GUIDE.md**
