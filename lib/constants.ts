// constants.ts
export const PUTER_WORKER_URL = import.meta.env.VITE_PUTER_WORKER_URL || "";

// Storage Paths
export const STORAGE_PATHS = {
  ROOT: "roomify",
  SOURCES: "roomify/sources",
  RENDERS: "roomify/renders",
} as const;

// Timing Constants (in milliseconds)
export const SHARE_STATUS_RESET_DELAY_MS = 1500;
export const PROGRESS_INCREMENT = 15;
export const REDIRECT_DELAY_MS = 600;
export const PROGRESS_INTERVAL_MS = 100;
export const PROGRESS_STEP = 5;

// UI Constants
export const GRID_OVERLAY_SIZE = "60px 60px";
export const GRID_COLOR = "#3B82F6";

// HTTP Status Codes
export const UNAUTHORIZED_STATUSES = [401, 403];

// Image Dimensions
export const IMAGE_RENDER_DIMENSION = 1024;

// Using Nano Banana Pro (Gemini 3 Pro Image) — it has a "thinking" reasoning
// step before generating, which matters a lot for dense CAD-style plans with
// dimension lines, door swings, and room labels to interpret correctly.
export const ROOMIFY_IMAGE_MODEL = "gemini-3-pro-image-preview";

export const ROOMIFY_RENDER_PROMPT = `
You are an architectural visualization engine. You will receive ONE input image: a 2D architectural floor plan (it may include dimension lines, room labels, door swings, hatching, and CAD annotations).

TASK: Re-render this EXACT floor plan as a photorealistic, top-down 3D architectural render — same room layout, same wall positions, same proportions. Treat the input image strictly as a structural blueprint to trace, not as inspiration.

HOW TO READ THE PLAN:
- Thick/double lines = walls. Trace their exact positions and angles.
- Curved quarter-circle lines near gaps in walls = door swings → render as an open door at that position.
- Thin parallel lines on the perimeter or between rooms = windows.
- Room name text (e.g. "BEDROOM 2", "KITCHEN", "WC/BATH", "LOUNGE", "DINING", "PORCH", "STORE") tells you what furniture to place in that room — read these labels to decide furniture, then DELETE the text itself from the final render.
- Ignore all dimension numbers, grid reference letters/numbers (A, B, C / 1, 2, 3), "MH" markers, and arrows — these are construction annotations, not physical objects. Do not render them.

STRICT REQUIREMENTS:
1) NO TEXT, NUMBERS, OR LABELS anywhere in the output. Flooring must be continuous and clean where text/annotations were.
2) GEOMETRY MUST MATCH the input exactly — same number of rooms, same wall layout, same relative proportions and room shapes. Do not merge, resize, invent, or omit rooms.
3) TOP-DOWN ORTHOGRAPHIC VIEW ONLY. No perspective, no tilt, no isometric angle.
4) Do not add rooms, walls, or furniture that aren't implied by the plan's layout or room labels.

FURNITURE BY ROOM LABEL:
- Bedroom → bed with duvet/pillows, small nightstands.
- Lounge/Living → sofa, coffee table, armchairs.
- Dining → table with chairs.
- Kitchen → counters, sink, stove/hob.
- WC/Bath/Bathroom → toilet, sink, shower or tub.
- Store → minimal shelving, no clutter.
- Porch/Patio → simple outdoor seating, planters if shown.
- Office/Study → desk, chair, light shelving.
- Utility/Laundry → washer/dryer, minimal cabinetry.

STYLE: Bright neutral daylight, realistic wood/tile flooring matched to room type, clean walls, soft shadows, professional architectural visualization quality. No watermark, no logo, no sketch/hand-drawn look.
`.trim();