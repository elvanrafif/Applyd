# Applyd - Professional Job Application Tracker

**Applyd** is a production-grade Kanban board application designed to streamline the job hunting process. Built with modern web technologies, it demonstrates advanced frontend patterns including **Optimistic UI**, **AI Integration**, and **Real-time Data Syncing**.

![Project Screenshot](public/screenshot.png)

## 🚀 Key Features

### 1. 🤖 AI-Powered Automation (New!)
* **Magic Paste (Smart Parser):** Paste any raw job description (from LinkedIn/Indeed), and **Google Gemini AI** will automatically extract key details (Company, Position, Salary, Tech Stack, etc.) to fill the application form instantly.
* **AI Writing Assistant:** Generate personalized LinkedIn connection requests or cold emails contextually based on the specific job position and company.

### 2. 📋 Interactive Kanban Board
* **Drag & Drop Interface:** Powered by `@dnd-kit` for smooth card movements between statuses.
* **Optimistic Updates:** UI updates **instantly** when cards are moved, providing a native-app feel even on slower connections. The app handles background synchronization with Supabase automatically.

### 3. 💼 Comprehensive Job Management
* **Rich Data Tracking:** Track detailed information including Salary Range, Location, Job Type (Remote/Hybrid/On-site), and Tech Stack Tags.
* **Robust Forms:** Built with `react-hook-form` and `zod` for strict schema validation and type safety.

### 4. 🔍 Smart Search & Filtering
* **Instant Search:** Client-side filtering allows users to search jobs by Company Name, Position, or even **Tech Stack Tags** (e.g., searching "React" shows all jobs requiring React).
* **Facet Filtering:** Filter jobs specifically by type (Remote, Hybrid, On-site).

### 5. 📊 Visual Analytics Dashboard
* **Data Visualization:** Integrated `recharts` to display application status distribution (Donut Chart) and Offer Success Rate.
* **Responsive Dialogs:** Fully optimized for mobile and desktop viewing.

### 6. 🎨 Modern UX/UI
* **Dark Mode Support:** Fully integrated dark mode using `next-themes`.
* **Compact Card Design:** Information-dense UI with dynamic border colors representing status.
* **Responsive:** Optimized layout for both Desktop and Mobile devices.

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript (Strict Mode) |
| **AI Integration** | **Google Gemini API** (Flash & Pro Models) |
| **Styling** | Tailwind CSS + Shadcn UI |
| **State Management** | TanStack Query (React Query) v5 |
| **Database** | Supabase (PostgreSQL) |
| **Forms** | React Hook Form + Zod |
| **Drag & Drop** | @dnd-kit/core |
| **Charts** | Recharts |

---

## 📦 Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/applyd.git
cd applyd
```

### 2. Install dependencies
```bash
npm install
# or
pnpm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and add your credentials:

```env
# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI (Google AI Studio)
GOOGLE_API_KEY=your_gemini_api_key
```

### 4. Database Setup (Supabase SQL)
Run the following SQL query in your Supabase SQL Editor to set up the table:

```sql
-- Create Enum for Status
CREATE TYPE job_status AS ENUM ('WISHLIST', 'APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED');

-- Create Table
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  company_name TEXT NOT NULL,
  position TEXT NOT NULL,
  status job_status DEFAULT 'WISHLIST',
  salary TEXT,
  location TEXT,
  job_type TEXT, -- 'Remote', 'Hybrid', 'On-site'
  tags TEXT[], -- Array of strings
  url TEXT,
  notes TEXT
);

-- Enable RLS (Optional for local dev, recommended for prod)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access" ON jobs FOR ALL USING (true);
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🧩 Project Structure

* `app/`: Next.js App Router pages and layouts.
* `app/api/`: Edge Runtime API Routes for AI processing.
* `components/kanban/`: Domain-specific components (Board, Card, Filters, Dialogs).
* `components/ui/`: Reusable primitive components (Shadcn UI).
* `hooks/`: Custom React hooks for data fetching and mutations (`useJobs`, `useAddJob`, etc.).
* `lib/`: Utility functions and Supabase client configuration.
* `types/`: TypeScript interfaces and shared types.

---

Built with ❤️ by Elvan