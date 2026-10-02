# 🎨 Premium Dark Design System

## Color Palette

### Primary Colors
- **Primary Background**: `#0F172A` (Deep Navy)
- **Secondary Background**: `#1E293B` (Indigo)
- **Primary Accent**: `#10B981` (Emerald Green) - AI agents, success states
- **Secondary Accent**: `#3B82F6` (Electric Blue) - CTAs, focus states
- **Alert Color**: `#F59E0B` (Amber) - Warnings, paused states

### Text Colors
- **Primary**: `#F1F5F9` (Soft White) - Main text
- **Secondary**: `#94A3B8` (Muted) - Descriptions, secondary info
- **Muted**: `#64748B` (Gray) - Placeholders, hints

### Borders & Backgrounds
- **Border**: `#334155` (Subtle) - Card borders, dividers
- **Subtle**: `#1E293B` - Backgrounds, hover states

## Typography Scale

```
h1: 2.25rem (36px) - Page titles
h2: 1.875rem (30px) - Section headers
h3: 1.5rem (24px) - Subsection titles
p: 1rem (16px) - Body text
sm: 0.875rem (14px) - Secondary text
xs: 0.75rem (12px) - Labels, captions
```

## Components

### Cards
- Background: `#1E293B`
- Border: `1px solid #334155`
- Border Radius: `8px`
- Padding: `1.5rem`
- Hover: Glowing blue border, subtle shadow

### Buttons
**Primary (Blue)**
- Background: `#3B82F6`
- Hover: `#2563EB`
- Padding: `0.75rem 1.25rem`
- Border Radius: `6px`

**Accent (Emerald)**
- Background: `#10B981`
- Hover: `#059669`
- For AI actions, approval buttons

**Ghost (Transparent)**
- Border: `1px solid #334155`
- Hover: `#1E293B` background

### Status Indicators
- **Running**: Emerald dot with pulse animation
- **Paused**: Amber dot
- **Idle**: Gray dot

### Badges
- Success: Green background, emerald text
- Warning: Amber background, amber text
- Info: Blue background, blue text

### Form Elements
- Background: `#1E293B`
- Border: `1px solid #334155`
- Focus: Blue border with glow effect
- Padding: `1rem`
- Border Radius: `6px`

## Animations

### Pulse Glow
2-second loop, emerald glow effect for active agents

### Pulse Dot
Status indicator animation

### Transitions
- Fast: 150ms
- Normal: 250ms
- Slow: 350ms

## Layout

### Spacing Scale
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)

### Grid System
```
Grid 1: 1 column
Grid 2: 2 columns (1 on mobile)
Grid 3: 3 columns (2 on tablet, 1 on mobile)
Grid 4: 4 columns (2 on tablet, 1 on mobile)
```

## Design Principles

1. **Dark First**: All backgrounds are dark mode only
2. **High Contrast**: Text is always readable
3. **Strategic Accents**: Emerald for AI, Blue for actions
4. **Minimal Shadows**: Flat design with subtle borders
5. **Smooth Transitions**: All interactive elements have smooth feedback
6. **Professional**: Not playful, focused on operations
7. **Responsive**: Works on mobile, tablet, desktop
8. **Accessible**: Proper focus states, alt text, semantic HTML

## Usage

### CSS Variables
All colors, sizes, and transitions are CSS variables:

```css
background-color: var(--bg-primary);
color: var(--text-primary);
border-color: var(--border-color);
```

### Class Names
Utility classes available:

```html
<!-- Colors -->
<p class="text-primary">Primary text</p>
<p class="text-secondary">Secondary text</p>
<p class="text-emerald">Emerald text</p>

<!-- Components -->
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-accent">Accent Button</button>
<div class="card">Card content</div>

<!-- Badges -->
<span class="badge badge-success">Active</span>
<span class="badge badge-warning">Paused</span>

<!-- Animations -->
<div class="animate-pulse-glow">Pulsing element</div>
<div class="animate-fade-in">Fade in</div>
```

## Responsive Breakpoints

- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: 480px - 767px
- **Small Mobile**: < 480px

## Performance

- No heavy animations
- CSS-based transitions
- Minimal repaints
- Optimized for dark mode (lower power consumption)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS 14+, Android 11+)

---

This design system creates a professional, premium AI operations dashboard that feels modern and high-end while maintaining excellent performance and accessibility.
