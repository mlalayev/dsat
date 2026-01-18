# PrepPulse - SAT Practice Platform

A modern, beautiful SAT preparation platform built with Next.js, featuring realistic timing, comprehensive question banks, and analytics similar to College Board's Bluebook.

## Features

- 🎯 **Topic-Based Practice**: Choose from 50+ topics across Math, Reading, and Writing
- ⏱️ **Realistic Timing**: Practice with actual SAT timing conditions
- 📊 **Progress Analytics**: Track your improvement with detailed analytics
- 💡 **Instant Feedback**: Get detailed explanations for every question
- 🎨 **Modern UI**: Beautiful, responsive design with glass-morphism effects
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile

## Project Structure

```
preppulse/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   ├── dashboard/
│   │   └── page.tsx        # Dashboard page
│   └── globals.css         # Global styles
├── components/
│   ├── common/             # Reusable common components
│   │   ├── AnimatedBackground.tsx
│   │   ├── Button.tsx
│   │   └── index.ts
│   ├── home/               # Home page specific components
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── CTASection.tsx
│   │   └── index.ts
│   └── layout/             # Layout components
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── index.ts
├── public/                 # Static assets
└── package.json           # Dependencies
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Component Architecture

The project follows a component-based architecture:

- **Layout Components**: Header, Footer (shared across pages)
- **Common Components**: Reusable UI elements (Button, AnimatedBackground)
- **Page Components**: Section components specific to pages (HeroSection, FeaturesSection, etc.)

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

```bash
npm run build
```

## License

MIT
