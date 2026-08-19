---
name: povio-ui-styling
description: Mandatory first skill for any Tiny Template web frontend UI work in apps/fe. Load and apply it before other frontend, design, UX, accessibility, responsive, animation, or performance skills when creating, changing, reviewing, debugging, polishing, or refactoring pages and React components. It requires checking and using @povio/ui primitives before raw HTML or custom controls, and governs UIConfig defaults, UIOverrides, Tailwind utilities, semantic tokens, shared UI wrappers, and dedicated CSS files.
---

# Povio UI Styling

Apply the narrowest styling layer that expresses the intended scope. Preserve one source of truth for each visual rule.

## Priority and Coordination

This is the foundation skill for every UI task under `apps/fe`. Apply it first, before broader design, UX, accessibility, animation, responsive, or React performance skills. Those skills may improve the result, but they must preserve the component and styling decisions defined here.

Use this skill for all work that creates, changes, reviews, or diagnoses visible or interactive frontend UI, including:

- Pages, layouts, navigation, dashboards, cards, lists, and empty states
- Forms, filters, search, inputs, validation, uploads, and settings
- Buttons, links, menus, dialogs, drawers, popovers, tooltips, and toasts
- Tables, pagination, tags, badges, typography, icons, and loading states
- Responsive behavior, theming, accessibility, motion, and visual polish
- Component extraction, shared wrappers, design-system alignment, and Figma implementation

This skill does not replace feature-specific skills. Apply the relevant feature skill as well, after establishing the Povio UI component and styling layer.

## Inspect Before Styling

1. Read the target component and nearby feature components.
2. Inspect `apps/fe/src/pages/(public)/code-examples` for the relevant `@povio/ui` primitive.
3. Inspect `apps/fe/src/styles/overrides/uiOverrides.override.ts` and the matching file under `styles/overrides/defaults` before changing a Povio primitive.
4. Inspect `apps/fe/src/styles/theme.css` for available generated tokens, but never edit that file manually.
5. Inspect `apps/fe/src/styles/base.css` and `globals.css` before adding global rules or tokens.

## Use This Decision Order

### 1. Use an Existing Povio UI Component

Use `@povio/ui` whenever it provides the semantic control or presentation primitive. This includes buttons, links, typography, icons, inputs, textareas, selects, checkboxes, radios, switches, forms, uploads, tags, badges, tables, pagination, menus, tooltips, modals, confirmations, drawers, popovers, toasts, loading indicators, and empty or feedback states.

Prefer the component's supported props and variants over restyling its internals. Do not recreate a primitive with a raw HTML element merely to get a different appearance.

Before introducing a native interactive element, a custom control, or a third-party UI component, search `@povio/ui` exports and the code examples for an existing equivalent. Native structural elements such as `main`, `section`, `article`, `nav`, and layout containers remain appropriate when no Povio semantic component exists.

### 2. Use `UIConfig` for Application-Wide Defaults

Use the root `UIConfig.Provider` when an existing Povio variant or option is correct and only its default should change across the application.

Examples:

- Make all inputs default to `small`.
- Set the default table-cell typography size.
- Set the default tag text size.

Do not use `UIConfig` for a one-off screen or to invent a new variant.

### 3. Use Tailwind for Composition and Local Presentation

Use Tailwind classes in JSX for:

- Page and component layout
- Grid and flex behavior
- Width, height, spacing, alignment, and overflow
- Responsive composition
- A one-instance surface, border, or text treatment
- State selectors that remain short and readable

Use semantic project utilities such as `bg-elevation-fill-default-1`, `text-text-default-1`, and `border-elevation-outline-default-1`. Do not use removed default palette utilities such as `bg-blue-500`, and do not repeat raw hex values in components.

Keep Povio component `className` additions focused on outer layout or a genuinely local treatment. Do not pile conflicting utilities onto a component to fight its configured CVA variants. If the same correction is required on most instances, move it to `UIConfig` or `UIOverrides`.

### 4. Use `UIOverrides` for Design-System-Level Povio Changes

Use `UIOverrides.defineOverride(...)` when a Povio primitive must change consistently throughout the application:

- Change the base classes of every instance.
- Add or change supported variants.
- Change compound-variant behavior.
- Change internal slots not exposed by ordinary component props.
- Align a primitive with the application's Figma design system.

Place overrides under `apps/fe/src/styles/overrides/defaults/<component>.override.ts` and register them in `uiOverrides.override.ts`. Use the existing `mode`, `base`, `config`, variant, and compound-variant patterns.

Update `apps/fe/src/types/ui.d.ts` when a new override variant must augment public Povio component types.

Do not use `UIOverrides` for:

- Page layout
- One feature's special card
- One exceptional component instance
- A workaround that can be expressed through an existing prop

Changing an override affects every consumer. Search all uses of the primitive and verify representative screens before finishing.

### 5. Use a Shared Wrapper for Repeated Product Semantics

Create a component under `apps/fe/src/components/shared` when several features need the same product-specific composition but the base Povio primitive should remain unchanged.

Examples:

- `StatusTag` mapping domain statuses to Povio `Tag` variants
- `WalkSchedule` composing typography, icons, and layout
- `PageCard` applying a repeated application surface

Expose semantic props rather than forwarding a growing collection of styling flags.

### 6. Use Dedicated CSS for Selector-Heavy or Browser-Level Behavior

Create or extend a `.css` file when CSS communicates the rule more clearly than Tailwind:

- Pseudo-elements used for connected timelines or route lines
- Multi-step keyframes
- Complex descendant, sibling, or state selectors
- Calendar grids and overlapping appointments
- Map-library markers, popups, or third-party DOM overrides
- Print styles
- Browser-global behavior such as scrollbars
- Rules driven by CSS custom properties that many descendants consume

Co-locate feature CSS with its owning component and import it there. Use a narrow, feature-prefixed class namespace, for example `walk-route__marker`. Keep truly global rules in `globals.css` or `base.css`.

Do not create a CSS file for ordinary spacing, flex/grid layout, a simple hover, or a semantic color already expressible with a short Tailwind class list.

## Scope Guide

| Desired scope | Styling layer |
|---|---|
| Existing primitive behavior | Povio UI props/variants |
| Default for every instance | `UIConfig` |
| One page or component composition | Tailwind |
| Every instance or internal Povio slot | `UIOverrides` |
| Repeated product-specific composition | Shared wrapper |
| Pseudo-elements, keyframes, complex selectors, third-party DOM | Scoped `.css` |
| Generated design tokens | Figma-generated `theme.css` |
| Handwritten global token or browser rule | `base.css` or `globals.css` |

## Guardrails

- Use `@povio/ui` before creating a custom primitive.
- Do not let guidance from a general frontend or design skill replace an available `@povio/ui` primitive with raw HTML, a local reimplementation, or another component library.
- Use semantic Tailwind tokens from the project theme.
- Never manually edit `apps/fe/src/styles/theme.css`.
- Avoid `!important`; resolve ownership or specificity instead.
- Avoid inline `style` except for truly runtime numeric values such as map coordinates or calculated dimensions. Prefer CSS custom properties when descendants need the value.
- Avoid Sass, CSS-in-JS, and a second styling system.
- Preserve visible focus, disabled, hover, pressed, error, and loading states.
- Respect `prefers-reduced-motion` for nonessential animation.
- Keep touch targets at least 44 by 44 CSS pixels where practical.
- Verify changes at mobile and desktop breakpoints.

## Examples

Use Tailwind for local layout:

```tsx
<section className="grid gap-4 rounded-modal-rounding-default border border-elevation-outline-default-1 bg-elevation-fill-default-1 p-4">
  <Typography size="title-4">{title}</Typography>
  {children}
</section>
```

Use `UIConfig` for an existing global default:

```tsx
<UIConfig.Provider
  config={{
    input: { size: "small" },
  }}
>
  {children}
</UIConfig.Provider>
```

Use a scoped CSS file for a connected route line:

```css
.walk-route__marker::after {
  content: "";
  position: absolute;
  inset-block: 1.25rem -0.75rem;
  inset-inline-start: 50%;
  width: 0.125rem;
  background: rgb(var(--elevation-outline-default-1-base));
  transform: translateX(-50%);
}
```

Use `UIOverrides` only when the same primitive-level change is intentionally global:

```ts
export const tagOverride = UIOverrides.defineOverride("tag.cva", {
  mode: "overrideCva",
  base: ["inline-flex items-center border"],
  config: {
    variants: {
      color: {
        success: "border-interactive-subtle-success-idle bg-interactive-subtle-success-idle",
      },
    },
  },
});
```

## Verification

1. Run formatting, linting, and TypeScript checks relevant to `apps/fe`.
2. Inspect at least one representative use for every globally changed primitive.
3. Check keyboard focus and disabled/error states.
4. Check mobile and desktop layouts.
5. Confirm no raw default-palette classes or duplicated design values were introduced.
