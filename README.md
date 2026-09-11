# OruPaad-LeafTHANda

"Because some gaps simply deserve to be measured."

This is a humorous "useless project" for a TinkerHub Make-a-thon. The application analyzes a photograph of a palm leaf and estimates the approximate physical width of the empty gaps between adjacent palm-leaf strips/leaflets. 

It uses in-browser computer vision (`OpenCV.js`) to find a ₹1 coin for scale, isolate the green regions of the palm leaf, and measure the empty void between leaflets, producing highly scientific-sounding but practically useless statistics.

## Setup Instructions

1. Ensure you have Node.js and `npm` installed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## How it works

- **Coin Detection**: Converts the image to grayscale, applies a median blur, and uses Hough Circle Transform to locate the ₹1 coin for pixel-to-millimeter scale calibration.
- **Leaflet Segmentation**: Uses HSV color space thresholding to isolate the green sections of the leaf.
- **Gap Measurement**: Inverts the leaf mask to identify empty regions within the bounding box of the leaf. Uses contour analysis to find gaps that match plausible inter-leaflet spaces, and calculates representative widths.
- **Humor generation**: Generates a Uselessness Score based on gap density and average spacing. 

## Tech Stack
- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS
- Icons: Lucide React
- Computer Vision: OpenCV.js (loaded via CDN)
- Charts: Recharts

*All processing happens locally in your browser. No image data is sent to external servers.*
