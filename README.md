# Face Attendance Management System (Experimental)

> A simple, vibes-coded face attendance management system built using Next.js and Supabase.

![Next.js](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
---

## 📋 Project Overview

The Face Attendance Management System is a modern, full-stack application designed to streamline the process of recording attendance through facial recognition. This project leverages a client-centric AI approach, where face detection and embedding generation occur directly in the user's browser, ensuring privacy and fast processing times.

The system provides a complete solution, from administrator-managed student enrollment to a seamless, real-time attendance checking interface. The backend is powered by Supabase, utilizing its powerful combination of a Postgres database with the `pgvector` extension for efficient similarity searches, and serverless Edge Functions for secure, scalable business logic.

## ✨ Key Features

-   **Client-Side AI:** Utilizes `face-api.js` to run face detection models directly in the browser, ensuring user images are not transmitted over the network for embedding generation.
-   **Admin Dashboard:** A secure area for administrators to perform CRUD (Create, Read, Update, Delete) operations on student records.
-   **Vector-Based Recognition:** Face embeddings (128-dimension vectors) are stored in Supabase and queried using `pgvector` for highly efficient and accurate similarity searches.
-   **Real-time Attendance:** A simple user interface allows for quick facial captures to mark attendance.
-   **Decoupled Architecture:** A clean separation between the frontend application, server-side actions, and serverless business logic, making the system maintainable and scalable.

## 🛠️ Tech Stack

This project is built with a modern, type-safe, and efficient technology stack.

#### **Frontend (`face-attendance-frontend`)**

-   **Framework:** [Next.js](https://nextjs.org/) (v15+ with App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
-   **AI / Face Recognition:** [face-api.js](https://github.com/justadudewhohacks/face-api.js) (on top of TensorFlow.js)
-   **Package Manager:** [pnpm](https://pnpm.io/)

#### **Backend (`supabase`)**

-   **Platform:** [Supabase](https://supabase.com/)
-   **Database:** [PostgreSQL](https://www.postgresql.org/)
-   **Vector Search:** [pgvector](https://github.com/pgvector/pgvector) Extension
-   **Authentication:** [Supabase Auth](https://supabase.com/auth)
-   **Serverless Logic:** [Supabase Edge Functions](https://supabase.com/edge-functions) (Deno Runtime)


---

## 🚀 Getting Started

Follow these steps to set up and run the project on your local machine.

### Prerequisites

Make sure you have the following tools installed on your system:
-   [Node.js](https://nodejs.org/) (v20 or later)
-   [pnpm](https://pnpm.io/installation) package manager
-   [Supabase CLI](https://supabase.com/docs/guides/cli) (`npm install -g supabase`)
-   [Docker](https://www.docker.com/products/docker-desktop/) (must be running for the local Supabase instance)

### Installation Steps

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/your-username/face-attendance-management-system.git](https://github.com/your-username/face-attendance-management-system.git)
    cd face-attendance-management-system
    ```

2.  **Set Up the Backend (Supabase)**
    You have two options for the backend: running Supabase locally or using a hosted project on the Supabase website.

    #### **Option A: Local Development Setup (Recommended for testing)**
    This project uses the Supabase CLI to manage a local development environment.

    ```bash
    # Navigate to the supabase directory from the root
    cd supabase

    # Start the local Supabase services (this will take a moment)
    supabase start
    ```
    After Supabase has started, it will output your local API URL and `anon` key. You will use these for the frontend setup.

    #### **Option B: Hosted Supabase Project Setup (For staging/production)**
    Use this option if you want to connect to a live project on `supabase.com`.

    a. **Create a Supabase Project:** If you haven't already, create a new project on the [Supabase website](https://supabase.com).

    b. **Log in to Supabase CLI:** First, authenticate the CLI with your Supabase account. This will open a browser window for you to log in.
    ```bash
    supabase login
    ```

    c. **Link Your Project:** Connect your local repository to your hosted project.
    ```bash
    # Navigate to the supabase directory from the root
    cd supabase

    # Replace [YOUR-PROJECT-ID] with the ID from your project's dashboard URL
    supabase link --project-ref [YOUR-PROJECT-ID]
    ```

    d. **Apply Database Migrations:** Run the versioned migration files from this repository against your hosted database.
    ```bash
    # This will apply all local migration files to your hosted database.
    supabase migration up
    ```

3.  **Set Up the Frontend Environment**
    Open a new terminal window and navigate to the frontend directory.

    ```bash
    # Navigate to the frontend directory from the root
    cd face-attendance-frontend

    # Create a local environment file from the example
    cp .env.example .env.local
    ```
    Now, open the newly created `.env.local` file and add the Supabase URL and Anon Key.
    -   **If using Option A (local):** Use the keys provided when you ran `supabase start`.
    -   **If using Option B (hosted):** Get the keys from your project's dashboard under `Project Settings` > `API`.

    ```env
    # .env.local
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL_HERE
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
    ```

4.  **Install Dependencies and Run the App**

    ```bash
    # Navigate to the frontend directory if you aren't already there
    cd face-attendance-frontend

    # Install all project dependencies
    pnpm install

    # Run the Next.js development server
    pnpm run dev
    ```

Your application should now be running at `http://localhost:3000`, connected to your chosen Supabase instance.

---
