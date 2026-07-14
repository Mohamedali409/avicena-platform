---
name: Clinical Clarity
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3f484c'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6f787d'
  outline-variant: '#bec8cd'
  surface-tint: '#006781'
  primary: '#005a71'
  on-primary: '#ffffff'
  primary-container: '#0e7490'
  on-primary-container: '#d3f1ff'
  inverse-primary: '#81d1f0'
  secondary: '#5c5f61'
  on-secondary: '#ffffff'
  secondary-container: '#e0e3e5'
  on-secondary-container: '#626567'
  tertiary: '#515353'
  on-tertiary: '#ffffff'
  tertiary-container: '#696b6b'
  on-tertiary-container: '#ececec'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b9eaff'
  primary-fixed-dim: '#81d1f0'
  on-primary-fixed: '#001f29'
  on-primary-fixed-variant: '#004d62'
  secondary-fixed: '#e0e3e5'
  secondary-fixed-dim: '#c4c7c9'
  on-secondary-fixed: '#191c1e'
  on-secondary-fixed-variant: '#444749'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: '0'
  headline-lg:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: '0'
  headline-lg-mobile:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: '0'
  headline-md:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: '0'
  body-lg:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-md:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  caption:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: '0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  section-gap: 64px
---

## Brand & Style
The design system is engineered for a high-trust healthcare environment, emphasizing clinical precision, hygiene, and calm. The aesthetic is rooted in **Modern Minimalism** with a focus on functional clarity and RTL (Right-to-Left) optimization for the Arabic language. 

The target audience includes patients seeking urgent care and practitioners managing high-density medical data. The UI must evoke an emotional response of safety and professional reliability. This is achieved through generous whitespace, a sanitized color palette, and soft, approachable geometry that reduces "medical anxiety."

## Colors
The palette is dominated by "Medical Teal" (#0e7490) to signify authority and health. 

- **Primary**: Used for core actions, active navigation states, and brand-heavy components.
- **Surface & Background**: A "Sanitized White" (#ffffff) is used for all interactive cards and containers, set against a "Clinic Gray" (#f8fafc) background to create soft contrast without eye strain.
- **Functional Colors**: Success, Warning, and Error colors follow standard clinical conventions but are tuned for high accessibility (WCAG AA compliant) against white backgrounds.

## Typography
This design system utilizes **IBM Plex Sans Arabic** (integrated as the equivalent for professional clinical systems) to ensure exceptional legibility across medical terminology. 

The type hierarchy is strictly RTL. All alignments are right-justified by default. Line heights are slightly increased (1.6 for body text) to accommodate Arabic script descenders and improve readability for elderly users or those under stress. Secondary information uses a muted Slate color to maintain clear information architecture.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a maximum container width of 1280px to prevent excessive line lengths on ultra-wide monitors.

- **Grid**: 12-column system for desktop, 4-column for mobile.
- **RTL Flow**: Logic follows a right-to-left orientation. Sidebars are anchored to the right; "Back" buttons point to the right.
- **Spacing Rhythm**: Uses a strict 8px linear scale. Generous internal padding within cards (minimum 24px) ensures content feels uncrowded, reflecting a modern, premium clinic experience.

## Elevation & Depth
Hierarchy is established through **Ambient Shadows** and tonal layering. 

1. **Background**: Level 0 (#f8fafc).
2. **Cards/Containers**: Level 1 (#ffffff) with a very soft, diffused shadow (Y: 4px, Blur: 20px, Opacity: 4% Black).
3. **Overlays/Modals**: Level 2 (#ffffff) with a deeper shadow (Y: 10px, Blur: 30px, Opacity: 8% Black) to focus user attention during critical tasks like booking or prescriptions.

Avoid heavy borders; use subtle 1px borders in #e2e8f0 only when elements are adjacent on the same elevation level.

## Shapes
The shape language is defined as **Rounded**, utilizing a consistent 0.5rem (8px) base radius. For larger surfaces like patient cards and dashboard modules, the `rounded-xl` (1.5rem / 24px) setting is used to soften the clinical environment and make the digital product feel more accessible and "human-centric."

## Components
- **Buttons**: Primary buttons are solid Teal (#0e7490) with white text. Secondary buttons use a light teal tint or ghost style. Buttons always feature the `rounded-lg` radius.
- **Input Fields**: Borders are #cbd5e1. On focus, they transition to a 2px Teal border with a soft teal outer glow. Labels are always right-aligned.
- **Status Chips**: Use high-contrast background tints. Success (Green 100 bg, Green 700 text), Pending (Amber 100 bg, Amber 700 text), and Error (Red 100 bg, Red 700 text).
- **Cards**: All cards use `rounded-xl` (24px) and a white background. They should have a subtle hover state where the shadow deepens slightly.
- **Telemedicine Specifics**: 
    - **Video Feed**: Rounded corners even on video containers to maintain the soft aesthetic.
    - **Prescription List**: Use high-legibility list items with clear dividers and "download" icons as the primary action.