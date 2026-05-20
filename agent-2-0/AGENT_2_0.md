# Agent 2.0 - Dental AI Clinic Management System

Welcome to Agent 2.0. This is a professional-grade WhatsApp AI agent designed for dental clinics. It transforms a simple chatbot into an autonomous clinic coordinator.

## 🌟 Core Workflow
**Lead Capture $\rightarrow$ Calendar Integration $\rightarrow$ Patient CRM $\rightarrow$ Automated Reminders $\rightarrow$ RAG Knowledge Base**

---

## 🚀 Features & Implementation Details

### 1. Structured Lead Capture (CRM)
The agent no longer just chats; it builds a database of patients.
- **Patient Profiling**: Captures `full_name`, `email`, `date_of_birth`, `insurance_provider`, and `medical_history`.
- **Clinical Notes**: The agent can add specific clinical or administrative notes to a patient's record using a dedicated tool.
- **CRM Dashboard**: A professional admin panel allows clinic staff to view patient profiles, update medical history, and track lead status in real-time alongside the chat.

### 2. Intelligent Calendar Integration
The agent manages the clinic's schedule autonomously.
- **Availability Checks**: Uses the `check_availability` tool to suggest real-time slots to patients.
- **Automated Booking**: Uses the `book_appointment` tool to record appointments in the database and external calendar.
- **Safe Booking**: Ensures a patient profile is created *before* an appointment is booked.

### 3. Proactive Automated Reminders
Reduces no-shows by engaging patients before their visit.
- **Cron Job**: A secure API endpoint (`/api/cron/reminders`) identifies appointments for the next day.
- **Automated Outreach**: Sends a personalized WhatsApp reminder including the appointment time and reason.
- **Rescheduling Flow**: The AI is trained to handle "I can't make it" replies by guiding the patient back through the booking flow.

### 4. RAG Knowledge Base (Vector Search)
The agent's intelligence is augmented by clinic-specific documentation.
- **Vector Store**: Uses Supabase `pgvector` to store document embeddings.
- **Contextual Retrieval**: For every user query, the agent performs a similarity search to find relevant clinic policies, procedure guides, or FAQs.
- **Accurate Responses**: Instead of hallucinating, the agent uses retrieved "ground truth" context to answer complex dental questions.

---

## 🛠️ Technical Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL + pgvector + Realtime)
- **AI**: OpenRouter (Claude 3.5 Sonnet)
- **Embeddings**: OpenAI `text-embedding-3-small`
- **Connectivity**: Meta WhatsApp Business API

### Database Schema
- `conversations`: Basic chat tracking and AI/Human mode.
- `patients`: Core CRM data and patient state.
- `appointments`: Scheduled visits linked to patients.
- `patient_notes`: Chronological clinical logs.
- `documents`: Vectorized knowledge base chunks.

---

## ⚙️ Setup & Deployment

### Environment Variables
Add these to your `.env.local` and Vercel settings:
- `OPENROUTER_API_KEY`: For AI and Embeddings.
- `CRON_SECRET`: A secure string used to authorize the reminder cron job.
- `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_VERIFY_TOKEN`: Standard Meta API keys.
- `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`: Supabase project keys.

### Knowledge Base Setup
To add documents to the AI's brain, send a POST request to `/api/kb`:
```json
{
  "text": "Our clinic offers Invisalign starting at $3000. Patients are eligible for a free consultation.",
  "metadata": { "category": "pricing", "topic": "invisalign" }
}
```

### Reminder Automation
Schedule a daily cron job (e.g., via Vercel Cron or GitHub Actions) to hit:
`GET https://your-app.vercel.app/api/cron/reminders`
Header: `Authorization: Bearer <YOUR_CRON_SECRET>`
