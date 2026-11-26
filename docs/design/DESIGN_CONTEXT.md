# CallsInsight Frontend - Design System Context

> **Purpose**: This document contains all design patterns, folder structures, and best practices for the CallsInsight frontend. Use this as reference when building new components or refactoring existing ones.

---

## 📁 Folder Structure Pattern

### Page Component Organization

```
src/pages/[page-name]/
├── index.tsx                    # Main page component
├── components/
│   ├── [ComponentName].tsx      # Page-specific components
│   ├── sliders/                 # Side slider components
│   │   ├── [Name]Slider.tsx
│   │   └── index.ts             # Barrel exports (optional)
│   └── modals/                  # Modal components
│       ├── [Name]Modal.tsx
│       └── index.ts             # Barrel exports
```

### Example: Action Center Structure

```
src/pages/action-center/
├── ActionCenter.tsx              # Main page
├── components/
│   ├── ActionHero.tsx
│   ├── MeterCard.tsx
│   ├── CoachingQueue.tsx
│   ├── blockerDetails/
│   │   ├── index.tsx
│   │   ├── PerformanceAlert.tsx
│   │   ├── ImpactSection.tsx
│   │   ├── RootCauseSection.tsx
│   │   └── RecommendedSection.tsx
│   ├── sliders/
│   │   ├── ReportSlider.tsx
│   │   ├── BlockerEvidenceSlider.tsx
│   │   ├── CoachAgentsSlider.tsx
│   │   ├── BestExamplesSlider.tsx
│   │   └── TranscriptSlider.tsx
│   └── companyHealth/
│       ├── index.tsx
│       └── GaugeCard.tsx
```

### Example: Agent Performance Structure

```
src/pages/agent/performance/
├── index.tsx                     # Main page
├── components/
│   ├── ImprovementAreas.tsx
│   ├── PerformanceSnapshot.tsx
│   ├── CoachingQueue.tsx
│   ├── modals/
│   │   ├── index.ts              # Barrel export
│   │   ├── SuccessModal.tsx
│   │   ├── ErrorModal.tsx
│   │   ├── EvidenceModal.tsx
│   │   ├── CoachingRequestModal.tsx
│   │   └── CompletePlaybookModal.tsx
│   └── sliders/
│       ├── PlaybookSlider.tsx
│       └── PlaybookDetailSlider.tsx
```

### Key Rules

1. ✅ **Use `modals/` folder** for all modal components
2. ✅ **Use `sliders/` folder** for all SideSlider components
3. ✅ **Create `index.ts`** for barrel exports when you have 3+ related components
4. ✅ **Group related components** in subfolders (e.g., `blockerDetails/`)
5. ❌ **Never inline modals/sliders** in the main component file

---

## 🎨 Color System

### Semantic Color Usage

| Purpose          | Color Class              | Hex Value | Usage                                               |
| ---------------- | ------------------------ | --------- | --------------------------------------------------- |
| **Danger/Error** | `text-primary-500`       | #dc425f   | Error states, critical priorities, negative metrics |
| **Warning**      | `text-status-orange`     | #ff802d   | Warning states, high priorities                     |
| **Success**      | `text-secondary-500`     | #82c441   | Success states, positive metrics                    |
| **Info**         | `text-status-blue-chart` | #60cae4   | Informational states                                |
| **Bright Error** | `text-status-error`      | #ff0909   | ⚠️ **AVOID** - Too harsh!                           |

### Priority Colors

```tsx
const priorityColors = {
  critical: {
    bg: "bg-neutral-50",
    badge: "bg-primary-500 text-white", // Softer red
    icon: "text-primary-500",
  },
  high: {
    bg: "bg-neutral-50",
    badge: "bg-status-orange text-white", // Orange
    icon: "text-status-orange",
  },
  medium: {
    bg: "bg-neutral-50",
    badge: "bg-secondary-500 text-white", // Green
    icon: "text-secondary-500",
  },
};
```

### Icon Colors

- **Neutral icons**: `text-neutral-700`
- **Danger icons**: `text-primary-500` (not `text-status-error`)
- **Success icons**: `text-secondary-500`
- **Warning icons**: `text-status-orange`

---

## 📦 Card & Background Hierarchy

### The Golden Pattern: Container → White Card → Nested Card

```tsx
// 1. Outer container (neutral-50 background)
<div className="bg-neutral-50 rounded-xl p-6 shadow-sm">
  // 2. White content cards
  <div className="bg-white rounded-lg shadow-sm p-6">
    // 3. Nested inner cards (back to neutral-50)
    <div className="bg-neutral-50 rounded-lg p-4">
      <div className="text-sm text-neutral-900">Content</div>
    </div>
    // 4. If needed, another level (back to white)
    <div className="bg-white rounded-lg p-3">
      <div className="text-xs text-neutral-700">Inner content</div>
    </div>
  </div>
</div>
```

### Border Rules

- ✅ **NO borders** on regular cards
- ✅ **Use `shadow-sm`** for elevation instead

- ❌ **NEVER**: `border border-neutral-200` on cards

### Border Radius

**⚠️ IMPORTANT: Do NOT use `rounded-full` for number badges or icon wrappers!**

```tsx
// ✅ CORRECT - Use rounded-lg for number badges
<div className="w-10 h-10 rounded-lg bg-primary-500 text-white">
  #1
</div>
<div className="w-8 h-8 rounded-lg bg-primary-500 text-white">
  1
</div>

// ✅ CORRECT - Use rounded-xl for large icon wrappers
<div className="w-16 h-16 rounded-xl bg-secondary-500/10">
  <CheckCircle className="w-8 h-8" />
</div>

// ✅ CORRECT - Use rounded-md for small icon wrappers
<div className="w-6 h-6 rounded-md bg-secondary-500 text-white">
  !
</div>

// ✅ CORRECT - Use rounded-sm for text badges/chips
<span className="text-xs bg-primary-500/20 text-primary-500 px-2 py-1 rounded-sm font-medium">
  Issue Detected
</span>

// ❌ WRONG - Don't use rounded-full for these elements
<div className="w-10 h-10 rounded-full bg-primary-500">#1</div>
<div className="w-16 h-16 rounded-full bg-secondary-500/10">
  <Icon />
</div>
<span className="text-xs bg-primary-500/20 text-primary-500 px-2 py-1 rounded-full font-medium">
  {/* Don't use rounded-full for text badges! */}
  Issue Detected
</span>
```

**Border Radius Guide:**

- Main cards/containers: `rounded-xl`
- Nested cards: `rounded-lg`
- Number badges (w-8 to w-10): `rounded-lg`
- Large icon wrappers (w-16+): `rounded-xl`
- Small icon wrappers (w-6): `rounded-md`
- Text badges/chips (inline text): `rounded-sm` ✅
- Progress bars: `rounded-full` ✅
- Avatar images: `rounded-full` ✅
- Small elements: `rounded-md`

### Example: Action Center Card Pattern

```tsx
{
  /* Main white card */
}
<div className="bg-white rounded-xl p-6 shadow-sm">
  <h2 className="h4 mb-2">Section Title</h2>

  {/* Nested neutral-50 cards */}
  <div className="grid grid-cols-3 gap-4">
    <div className="bg-neutral-50 rounded-lg p-4">
      <div className="text-2xl font-bold text-neutral-900">42</div>
      <div className="text-sm text-neutral-500">Metric label</div>
    </div>
  </div>
</div>;
```

---

## 📝 Typography & Text Colors

### ✅ Semantic Typography Classes (ALL SAFE TO USE!)

**All built-in semantic classes from `index.css` default to dark text (text-neutral-500/800) and are safe to use:**

#### Heading Classes (All Default to Dark Text)

```tsx
className = "h2"; // 40px, font-bold, text-neutral-500 ✅
className = "h3"; // 24px, font-semibold, text-neutral-800 ✅
className = "h4"; // 20px, font-semibold, text-neutral-800 ✅
className = "h5"; // 16px, font-semibold, text-neutral-800 ✅
className = "h6"; // 15px, font-semibold, text-neutral-800 ✅
```

#### Body Text Classes (All Default to Dark Text)

```tsx
className = "body-m"; // 16px, font-normal, text-neutral-500 ✅
className = "body-sm"; // 14px, font-normal, text-neutral-500 ✅
className = "body-xs"; // 12px, font-normal, text-neutral-500 ✅
className = "body-lg"; // 18px, leading-relaxed, text-neutral-500 ✅
```

#### 🌙 Light Variants (For Dark Backgrounds Only)

```tsx
className = "h2-light"; // text-white (use on dark backgrounds)
className = "h4-light"; // text-white (use on dark backgrounds)
className = "h5-light"; // text-white (use on dark backgrounds)
className = "h6-light"; // text-white (use on dark backgrounds)
className = "body-sm-light"; // text-white-text (use on dark backgrounds)
```

**You can use semantic classes OR explicit Tailwind classes:**

```tsx
// Option 1: Semantic classes (recommended for consistency)
className = "h4"; // ✅ Safe
className = "body-sm"; // ✅ Safe

// Option 2: Explicit Tailwind (more flexibility)
className = "text-sm text-neutral-700";
className = "text-base font-semibold text-neutral-900";
```

### Text Color Patterns

#### On `bg-neutral-50` (light gray background)

```tsx
<div className="bg-neutral-50">
  <h3 className="text-base font-semibold text-neutral-900">Header</h3>
  <p className="text-sm text-neutral-700">Body text</p>
  <span className="text-xs text-neutral-500">Label</span>
</div>
```

#### On `bg-white` (white background)

```tsx
<div className="bg-white">
  <h3 className="text-base font-semibold text-neutral-800">Header</h3>
  <p className="text-sm text-neutral-600">Body text</p>
  <span className="text-xs text-neutral-500">Subtext</span>
</div>
```

### Typography Scale

```tsx
// Headers (always specify color!)
"text-2xl font-bold text-neutral-900"; // Large number
"text-xl font-semibold text-neutral-900"; // H3
"text-lg font-semibold text-neutral-800"; // H4
"text-base font-semibold text-neutral-800"; // H5

// Body text (always specify color!)
"text-base text-neutral-700"; // Large body
"text-sm text-neutral-700"; // Regular body
"text-xs text-neutral-500"; // Small text
```

---

## 🔘 Button Patterns

### Button Variants

```tsx
variant = "primary"; // bg-neutral-800 text-white (dark button)
variant = "secondary"; // bg-white text-neutral-900 (white button)
variant = "tertiary"; // bg-neutral-50 text-neutral-900 (light gray button)
variant = "main"; // bg-primary-500 text-white (red CTA)
variant = "danger"; // bg-status-error text-white
variant = "success"; // bg-secondary-500 text-white (green)
```

### ⚠️ CRITICAL: Tertiary Buttons on White Backgrounds

Tertiary buttons have `bg-neutral-50` which is invisible on white cards!

**Always add `className="bg-white"`**:

```tsx
<div className="bg-white rounded-lg p-6">
  {/* ❌ WRONG - invisible! */}
  <Button variant="tertiary">Click me</Button>

  {/* ✅ CORRECT - visible! */}
  <Button variant="tertiary" className="bg-white">
    Click me
  </Button>
</div>
```

### Button Sizing Rules

**⚠️ IMPORTANT: Different button sizes for different contexts**

```tsx
// ✅ In SideSliders - ALWAYS use size="sm"
<SideSlider>
  <Button variant="primary" size="sm" leftIcon={<Play />}>
    Play Full Call
  </Button>
  <Button variant="tertiary" size="sm" className="bg-white">
    View Details
  </Button>
</SideSlider>

// ✅ In Modals and Main Pages - Use regular size (no size prop)
<Modal>
  <Button variant="primary" leftIcon={<CheckCircle />}>
    Confirm
  </Button>
  <Button variant="tertiary" className="bg-white">
    Cancel
  </Button>
</Modal>
```

### Button Icon Colors

**⚠️ CRITICAL: Icons in buttons must match the button text color!**

```tsx
// ✅ CORRECT - Primary/Main/Success buttons (white text) need white icons
<Button variant="primary" leftIcon={<CheckCircle className="w-4 h-4 text-white" />}>
  Confirm
</Button>

<Button variant="main" leftIcon={<Save className="w-4 h-4 text-white" />}>
  Save Changes
</Button>

<Button variant="success" leftIcon={<Check className="w-4 h-4 text-white" />}>
  Complete
</Button>

// ✅ CORRECT - Tertiary/Secondary buttons (dark text) need dark icons
<Button variant="tertiary" className="bg-white" leftIcon={<Play className="w-4 h-4" />}>
  Play Clip
</Button>

<Button variant="secondary" leftIcon={<Eye className="w-4 h-4" />}>
  View Details
</Button>

// ❌ WRONG - Icon color doesn't match text color
<Button variant="primary" leftIcon={<CheckCircle className="w-4 h-4" />}>
  {/* Icon is dark, text is white - inconsistent! */}
  Confirm
</Button>
```

### Button Examples from Action Center

```tsx
{
  /* Primary action in slider */
}
<Button
  variant="primary"
  size="sm"
  leftIcon={<Play className="w-4 h-4 text-white" />}
>
  Play Full Call
</Button>;

{
  /* Secondary action in slider with bg override */
}
<Button
  variant="tertiary"
  size="sm"
  className="bg-white"
  leftIcon={<Play className="w-4 h-4" />}
>
  Play Clip
</Button>;
```

---

## 📏 Spacing System

### Card Padding

- Main sections: `p-5`
- Nested cards: `p-4`
- Small inner cards: `p-3`

### Vertical Spacing

- Main sections: `space-y-5`
- Card content: `space-y-4`
- Nested content: `space-y-3`
- List items: `space-y-1`

### Horizontal Spacing (Gaps)

- Button groups: `gap-3`
- Icon + text in headers: `gap-2`
- Grid columns: `gap-4`
- Large sections: `gap-5`

### Margin

- Top spacing for expanded sections: `mt-6`
- Bottom spacing for headers: `mb-4`, `mb-2`

---

## 🎯 Icon Sizing

**⚠️ CRITICAL: NEVER use emojis - ALWAYS use Lucide React icons!**

```tsx
// ❌ WRONG - Don't use emojis
<p>⚠️ Issue: Price mentioned before establishing value</p>
<span>✅ Success</span>
<div>🚀 Launch</div>

// ✅ CORRECT - Use Lucide icons
import { AlertCircle, CheckCircle, Rocket } from "lucide-react";

<div className="flex items-center gap-1">
  <AlertCircle className="w-3 h-3 text-primary-500" />
  <p>Issue: Price mentioned before establishing value</p>
</div>

<div className="flex items-center gap-2">
  <CheckCircle className="w-4 h-4 text-secondary-500" />
  <span>Success</span>
</div>

<div className="flex items-center gap-2">
  <Rocket className="w-5 h-5 text-primary-500" />
  <span>Launch</span>
</div>
```

### Icon Size Guide

| Context          | Size Class    | Pixel Size |
| ---------------- | ------------- | ---------- |
| Section headers  | `w-5 h-5`     | 20px       |
| Inline with text | `w-4 h-4`     | 16px       |
| Small inline     | `w-3.5 h-3.5` | 14px       |
| Very small       | `w-3 h-3`     | 12px       |

---

## 📦 Shared Components

**ALWAYS use shared components from `@/components/shared/`:**

### Available Shared Components

```tsx
import { Button } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";
import { SideSlider } from "@/components/shared/SideSlider";
import { Input } from "@/components/shared/Input";
import { MultiSelect } from "@/components/shared/MultiSelect";
// ... other shared components
```

### Component Usage Rules

1. **Button** - Use for all clickable actions

   - In sliders: `size="sm"`
   - In modals/pages: regular size (no size prop)
   - Tertiary variant needs `className="bg-white"` on white backgrounds

2. **Modal** - Use for confirmations, forms, alerts

   - Small overlays that need user interaction
   - Available sizes: `sm`, `md`, `lg`

3. **SideSlider** - Use for detailed views, playbooks, evidence

   - Large content panels that slide in from the side
   - Available widths: `lg`, `xl`
   - ALWAYS use `size="sm"` for buttons inside sliders

4. **Input** - Use for all text inputs

   - Consistent styling across the app

5. **MultiSelect** - Use for both multi-select AND single select

   - Can act as a regular select dropdown
   - Handles multiple selections when needed

6. **AudioPlayer** - Use for call recording playback

   - Accepts `bgClassName` to adapt to different card backgrounds
   - Default: `bgClassName="bg-neutral-50"` (for white card backgrounds)
   - On neutral-50 backgrounds: use `bgClassName="bg-white"`
   - Accepts `className` for additional styling
   - Example:

     ```tsx
     {
       /* In white card - use bg-neutral-50 (default) */
     }
     <AudioPlayer src={audioSrc} callId="1234" />;

     {
       /* In neutral-50 card - use bg-white */
     }
     <AudioPlayer src={audioSrc} bgClassName="bg-white" />;
     ```

---

## 🏗️ Component Patterns

### Modal Pattern

```tsx
import { Modal } from "@/components/shared/Modal";

<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Modal Title"
  description="Optional description"
  size="lg" // sm, md, lg
  showFooter={true} // Optional
  btnText="Confirm" // Optional
  onClick={handleConfirm} // Optional
>
  <div className="space-y-4">
    {/* Content with bg-neutral-50 nested cards */}
    <div className="bg-neutral-50 rounded-lg p-4">
      <h5 className="font-semibold text-neutral-900 mb-2">Section</h5>
      <p className="text-sm text-neutral-700">Content</p>
    </div>
  </div>
</Modal>;
```

### SideSlider Pattern

```tsx
import { SideSlider } from "@/components/shared/SideSlider";

<SideSlider
  isOpen={isOpen}
  onClose={onClose}
  title="Slider Title"
  subtitle="Optional subtitle"
  width="xl" // lg, xl
  icon={<Icon className="w-5 h-5 text-neutral-900" />}
>
  <div className="space-y-5">
    {/* White card sections */}
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-neutral-700" />
        <h3 className="text-base font-semibold text-neutral-800">
          Section Title
        </h3>
      </div>
      <p className="text-sm text-neutral-600">Content</p>
    </div>
  </div>
</SideSlider>;
```

### Accordion/Expandable Card Pattern

```tsx
<div
  className={cn(
    "rounded-xl p-6 transition-all",
    "bg-neutral-50",
    isExpanded ? "border-2 border-secondary-500" : "shadow-sm"
  )}
>
  {/* Header - always visible */}
  <div className="flex items-start justify-between cursor-pointer">
    <div>
      <h3 className="text-base font-semibold text-neutral-900">Title</h3>
      <p className="text-sm text-neutral-600">Summary</p>
    </div>
    <button className="p-2 hover:bg-white rounded-lg">
      <ChevronDown className="w-5 h-5 text-neutral-600" />
    </button>
  </div>

  {/* Expanded content */}
  {isExpanded && (
    <div className="mt-6 space-y-6">
      {/* White cards inside neutral-50 container */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <span className="text-sm font-semibold text-neutral-900">
          Section Header
        </span>
        <p className="text-sm text-neutral-700">Content</p>
      </div>
    </div>
  )}
</div>
```

### Badge/Chip Pattern

```tsx
{
  /* Success badge */
}
<span className="text-xs bg-secondary-100 text-secondary-700 px-2 py-0.5 rounded-full font-medium">
  Active
</span>;

{
  /* Error badge */
}
<span className="text-xs bg-primary-500/20 text-primary-500 px-2 py-1 rounded">
  Critical
</span>;

{
  /* Status with background */
}
<span className="flex items-center gap-2 px-4 py-2 bg-secondary-50 rounded-lg text-secondary-700 text-sm font-medium">
  <CheckCircle className="w-4 h-4" />
  Completed
</span>;
```

---

## 🚫 Common Mistakes & Fixes

### 1. Missing Text Colors (Rare Edge Case)

❌ **Mistake:**

```tsx
<div className="bg-white p-4">
  {/* Forgetting to add text color when using custom CSS */}
  <p style={{ fontSize: "14px" }}>Text</p> {/* May inherit wrong color */}
</div>
```

✅ **Fix:**

```tsx
<div className="bg-white p-4">
  {/* Use semantic classes (they have default colors) */}
  <p className="body-sm">Text</p> {/* ✅ Defaults to text-neutral-500 */}
  <h2 className="h2">Title</h2> {/* ✅ Defaults to text-neutral-500 */}
  {/* OR use explicit Tailwind classes */}
  <p className="text-sm text-neutral-700">Text</p>
</div>
```

### 2. Borders on Cards

❌ **Mistake:**

```tsx
<div className="bg-white border border-neutral-200 rounded-lg p-4">
```

✅ **Fix:**

```tsx
<div className="bg-white shadow-sm rounded-lg p-4">
```

### 3. Harsh Red Color

❌ **Mistake:**

```tsx
<div className="text-status-error">Error</div>  {/* Too bright! */}
```

✅ **Fix:**

```tsx
<div className="text-primary-500">Error</div>  {/* Softer */}
```

### 4. Invisible Tertiary Buttons

❌ **Mistake:**

```tsx
<div className="bg-white p-6">
  <Button variant="tertiary">Click</Button> {/* Invisible! */}
</div>
```

✅ **Fix:**

```tsx
<div className="bg-white p-6">
  <Button variant="tertiary" className="bg-white">
    Click
  </Button>
</div>
```

### 5. Excessive Border Radius

❌ **Mistake:**

```tsx
<div className="rounded-3xl">  {/* Too round! */}
```

✅ **Fix:**

```tsx
<div className="rounded-xl">  {/* Main cards */}
<div className="rounded-lg">  {/* Nested cards */}
```

### 6. Wrong Button Size in Sliders

❌ **Mistake:**

```tsx
<SideSlider>
  {/* Regular size buttons look too large in sliders */}
  <Button variant="primary">Play Call</Button>
</SideSlider>
```

✅ **Fix:**

```tsx
<SideSlider>
  {/* Always use size="sm" for buttons in sliders */}
  <Button variant="primary" size="sm">
    Play Call
  </Button>
  <Button variant="tertiary" size="sm" className="bg-white">
    View Details
  </Button>
</SideSlider>
```

### 7. Not Using Shared Components

❌ **Mistake:**

```tsx
// Creating custom button instead of using shared
<button className="px-4 py-2 bg-primary-500 text-white rounded-lg">
  Click me
</button>

// Creating custom select instead of using MultiSelect
<select className="custom-select">...</select>
```

✅ **Fix:**

```tsx
import { Button, MultiSelect } from "@/components/shared";

<Button variant="main">Click me</Button>

<MultiSelect
  options={options}
  value={value}
  onChange={setValue}
  placeholder="Select an option"
/>
```

### 8. Using `rounded-full` for Number Badges and Icon Wrappers

❌ **Mistake:**

```tsx
{
  /* Number badge */
}
<div className="w-10 h-10 rounded-full bg-primary-500 text-white">#1</div>;

{
  /* Icon wrapper */
}
<div className="w-16 h-16 rounded-full bg-secondary-500/10">
  <CheckCircle className="w-8 h-8" />
</div>;
```

✅ **Fix:**

```tsx
{/* Number badge - use rounded-lg */}
<div className="w-10 h-10 rounded-lg bg-primary-500 text-white">
  #1
</div>

{/* Icon wrapper - use rounded-xl for large, rounded-md for small */}
<div className="w-16 h-16 rounded-xl bg-secondary-500/10">
  <CheckCircle className="w-8 h-8" />
</div>
<div className="w-6 h-6 rounded-md bg-secondary-500 text-white">
  !
</div>
```

### 9. Wrong Icon Color in Buttons

❌ **Mistake:**

```tsx
{/* Icon doesn't match button text color */}
<Button variant="primary" leftIcon={<CheckCircle className="w-4 h-4" />}>
  Confirm
</Button>

<Button variant="main" leftIcon={<Save className="w-4 h-4" />}>
  Save Changes
</Button>
```

✅ **Fix:**

```tsx
{/* White background buttons need white icons */}
<Button variant="primary" leftIcon={<CheckCircle className="w-4 h-4 text-white" />}>
  Confirm
</Button>

<Button variant="main" leftIcon={<Save className="w-4 h-4 text-white" />}>
  Save Changes
</Button>

{/* Dark text buttons use default icon color */}
<Button variant="tertiary" className="bg-white" leftIcon={<Play className="w-4 h-4" />}>
  Play Clip
</Button>
```

### 10. Using Emojis Instead of Lucide Icons

❌ **Mistake:**

```tsx
{/* Using emojis for visual indicators */}
<p>⚠️ Issue: Price mentioned before establishing value</p>
<span>✅ Success</span>
<div>🚀 Ready to launch</div>
```

✅ **Fix:**

```tsx
import { AlertCircle, CheckCircle, Rocket } from "lucide-react";

{/* Use Lucide icons with proper sizing and colors */}
<div className="flex items-center gap-1">
  <AlertCircle className="w-3 h-3 text-primary-500" />
  <p className="text-xs text-primary-500">Issue: Price mentioned before establishing value</p>
</div>

<div className="flex items-center gap-2">
  <CheckCircle className="w-4 h-4 text-secondary-500" />
  <span>Success</span>
</div>

<div className="flex items-center gap-2">
  <Rocket className="w-5 h-5 text-primary-500" />
  <span>Ready to launch</span>
</div>
```

---

## ✅ Quick Checklist

When building a new component:

### Shared Components

- [ ] Using `Button` from `@/components/shared/Button`
- [ ] Using `Modal` from `@/components/shared/Modal`
- [ ] Using `SideSlider` from `@/components/shared/SideSlider`
- [ ] Using `Input` from `@/components/shared/Input`
- [ ] Using `MultiSelect` from `@/components/shared/MultiSelect` (for both multi & single select)

### Layout & Structure

- [ ] Main container uses `bg-neutral-50` or `bg-white`
- [ ] Nested cards use `bg-white shadow-sm` (if parent is neutral-50)
- [ ] Inner cards use `bg-neutral-50` (if parent is white)
- [ ] **NO borders** except active states (`border-2 border-secondary-500`)
- [ ] Border radius: `rounded-xl` for main, `rounded-lg` for nested
- [ ] Spacing follows pattern: `p-6` main, `p-4` nested, `p-3` inner
- [ ] Modals are in `modals/` folder
- [ ] Sliders are in `sliders/` folder
- [ ] Barrel exports (`index.ts`) for 3+ related components

### Typography & Colors

- [ ] All text uses semantic classes (h2, h4, body-sm, etc.) or explicit Tailwind colors
- [ ] Error/danger states use `text-primary-500` not `text-status-error`
- [ ] Icons have proper semantic colors
- [ ] **NO emojis** - use Lucide icons instead (AlertCircle, CheckCircle, etc.)

### Buttons

- [ ] In SideSliders: use `size="sm"` for all buttons
- [ ] In Modals/Pages: use regular size (no size prop)
- [ ] Tertiary buttons have `className="bg-white"` on white backgrounds
- [ ] Button icons match button text color (`text-white` for primary/main/success variants)

### Border Radius

- [ ] Number badges (w-8 to w-10) use `rounded-lg` NOT `rounded-full`
- [ ] Large icon wrappers (w-16+) use `rounded-xl` NOT `rounded-full`
- [ ] Small icon wrappers (w-6) use `rounded-md` NOT `rounded-full`
- [ ] Only use `rounded-full` for text badges/pills, progress bars, and avatars

---

## 📚 Reference Files

### Core Design Files

- `src/index.css` - CSS variables and custom classes
- `tailwind.config.js` - Tailwind configuration
- `src/components/shared/Button.tsx` - Button component
- `src/components/shared/Modal.tsx` - Modal component
- `src/components/shared/SideSlider.tsx` - SideSlider component

### Example Implementations

- `src/pages/action-center/` - Manager view patterns
- `src/pages/action-center/components/sliders/` - Slider examples
- `src/pages/agent/performance/` - Agent view patterns
- `src/pages/agent/performance/components/modals/` - Modal examples

---

## 🎨 Color Reference Quick Guide

```tsx
// Text colors on different backgrounds
bg-white       → text-neutral-800 (headers), text-neutral-600 (body)
bg-neutral-50  → text-neutral-900 (headers), text-neutral-700 (body)

// Semantic colors
Danger/Error   → text-primary-500    (#dc425f)
Warning        → text-status-orange  (#ff802d)
Success        → text-secondary-500  (#82c441)
Info           → text-status-blue    (#60cae4)

// Icon colors
Neutral        → text-neutral-700
Danger         → text-primary-500
Success        → text-secondary-500
Warning        → text-status-orange

// Background colors
Main container → bg-neutral-50
Content cards  → bg-white
Nested cards   → bg-neutral-50
Success hint   → bg-secondary-50
```

---

**Last Updated**: December 2024
**Version**: 1.0
**Maintained by**: Development Team
<!-- for revamp first move modal and slider in slider folder the revamp these modal and sliders after go on component at time and revamp them user reusbale componet from share for button select input and after revamp cross verify with desigin context file side by side until you are statisfy -->
