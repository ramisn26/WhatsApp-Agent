# 🦷 Agent 2.0 - Dental AI Clinic Management System

Agent 2.0 is a professional-grade WhatsApp AI coordinator for dental clinics. It transforms a simple chatbot into an autonomous clinic coordinator, integrating lead capture, appointment scheduling, a patient CRM, and a RAG-powered knowledge base.

## 🌟 Key Features
- **Autonomous WhatsApp Agent**: Handles patient queries, lead capture, and appointment booking.
- **Patient CRM Dashboard**: A real-time admin panel to manage patient profiles, medical history, and lead status.
- **Intelligent Scheduling**: Real-time availability checks and automated booking.
- **RAG Knowledge Base**: Clinic-specific documentation used to provide accurate, grounded answers.
- **Automated Reminders**: Daily cron jobs to notify patients of upcoming appointments.

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router, TypeScript)
- **Database**: Supabase (PostgreSQL + pgvector + Realtime)
- **AI**: OpenRouter (Claude 3.5 Sonnet / Haiku)
- **Embeddings**: OpenAI `text-embedding-3-small`
- **Connectivity**: Meta WhatsApp Business API

## 🚀 Getting Started

### Environment Variables
Create a `.env.local` file with the following keys:
- `OPENROUTER_API_KEY`: AI & Embeddings access.
- `CRON_SECRET`: Secret for reminder automation.
- `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_VERIFY_TOKEN`: Meta API credentials.
- `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`: Supabase project keys.

### Installation
```bash
npm install
npm run dev
```

## 📂 Project Structure
- `src/app/api`: API routes for conversations, patients, KB, and webhooks.
- `src/app/page.tsx`: The main Admin Dashboard with integrated CRM.
- `src/lib`: Core business logic and Supabase clients.
- `TESTING.md`: Comprehensive test suite and verification results.
- `AGENT_2_0.md`: Detailed system architecture and workflow documentation.

## 🧪 Testing
Refer to [TESTING.md](./TESTING.md) for the full test matrix and verification steps.

## 📖 Setup Guide

### 1. Meta Business Setup
- Create a Business App at [developers.facebook.com](https://developers.facebook.com).
- Set up the WhatsApp product and obtain a **Permanent Access Token**, **Phone Number ID**, and a **Verify Token**.
- Configure the webhook to point to your public URL: `/api/webhook`.

### 2. Supabase Setup
- Create a project at [supabase.com](https://supabase.com).
- Run the provided `supabase-schema.sql` in the SQL Editor to set up tables for `conversations`, `messages`, `patients`, `appointments`, and `documents`.
- Enable **Realtime** for the `messages` and `conversations` tables.

### 3. Knowledge Base Ingestion
To add clinic-specific knowledge, send a POST request to `/api/kb`:
```json
{
  "text": "Our clinic offers Invisalign starting at $3000.",
  "metadata": { "category": "pricing" }
}
```

### 4. Deployment
Deploy to Vercel:
```bash
vercel
```
Update the Meta webhook URL to your Vercel production URL.
