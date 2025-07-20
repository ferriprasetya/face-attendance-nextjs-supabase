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
-   **File Storage:** [Supabase Storage](https://supabase.com/storage)
-   **Serverless Logic:** [Supabase Edge Functions](https://supabase.com/edge-functions) (Deno Runtime)

---



