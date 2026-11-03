# Urdu Property Receipt Generator

A mobile-friendly Urdu property transaction receipt generator built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- Urdu right-to-left receipt layout
- Urdu Nastaleeq font support
- Shop logo and business information
- Customer and property details
- Automatic receipt number and date
- Automatic calculation of percentage-based charges
- Pre-filled, editable fixed charges
- Automatic total calculation
- Receipt preview before downloading
- Export receipts as JPEG images and PDF documents
- Responsive design for mobile devices
- No database or account required

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- html-to-image
- jsPDF

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/KAS1966-tech/property-receipt.git
```

Navigate into the project directory:

```bash
cd property-receipt
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown in your terminal.

### Production Build

Build the project for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deployment

This project can be deployed to [Vercel](https://vercel.com/).

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Select Vite as the framework preset.
4. Set the build command to `npm run build`.
5. Set the output directory to `dist`.
6. Deploy the application.

## Important Notes

- Receipts are generated in the browser and are not saved in a database.
- Download important receipts as JPEG or PDF files for future reference.
- Verify charge rates and amounts before issuing receipts. The configured rates are application settings and should not be assumed to represent current official government rates.
- Ensure the Urdu font's license permits its intended use and distribution.

## License

No license has been specified yet.