# Motion system

Motion is part of the KWKR visual identity and is centralized instead of being implemented ad hoc per section.

- The orange `8000` opening runs once per browser session.
- Internal route changes reuse the orange plane with deterministic destination words/directions.
- `SiteMotion` uses one requestAnimationFrame loop and one route-aware registration lifecycle.
- `ExperienceMotion` uses GSAP and ScrollTrigger for small, non-masking heading and cover entrances on desktop with a fine pointer. Each route owns a matchMedia context which reverts on navigation and when reduced-motion preferences change. Native scrolling is preserved. Hero and footer text never move sideways out of the viewport.
- Depth movement is bounded by each element's declared intensity, including during viewport changes.
- The homepage presents the artist's own music immediately after the hero, without a pinned feature scene.
- The featured clip only loads YouTube after activation; closing it removes the player and restores focus to the trigger. Without JavaScript the same link opens the clip on YouTube.
- Photographs and covers carry the visual identity. Decorative coordinates, waveform marks, camera frames, numbered labels and the homepage ticker have been removed.
- Fine-pointer tilt is optional enhancement only.
- `RecordExplorer` is shared by home and music: compact, front-facing sleeves with a 3D credit flip, selectable releases, reverse-side credits, arrow-key navigation, touch swiping and explicit streaming links. The selected release is announced to assistive technology.
- `ExploreMenu` uses a native modal dialog, photographic destination previews and clear close/navigation controls.
- `PhotoGallery` uses native dialog focus containment, previous/next controls, arrow keys and Escape. Closing restores focus to the original photograph.
- `LiveArchive` filters real event data by year; hover/focus previews preserve normal links to every event.
- `BookingComposer` builds an encoded email draft. It does not send messages or store form data; the visitor sends from their own mail app.
- `prefers-reduced-motion` removes spatial choreography and delayed transitions.
- Reveal content stays visible with or without JavaScript. No heading uses a clipping mask, and no text waits for an intersection observer to become readable.
- Covers use official 1600px artwork, responsive image sizes and quality 90. The selected sleeve is front-facing for sharp rendering; hover adds a small vertical lift.
- Text links use underline and color transitions, with visible keyboard focus and no decorative arrows.

Route descriptors live in `src/lib/ui/route-transition.ts`; the navigation engine lives in `src/components/RouteTransition.tsx`.
