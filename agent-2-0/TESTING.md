# Agent 2.0 Testing Suite

This document outlines the test cases for the Dental AI Clinic Management System, covering the end-to-end flow from WhatsApp lead capture to CRM management.

## 📋 Test Matrix

| ID | Feature | Scenario | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **CRM-01** | Patient CRM | Create new patient profile via Dashboard | Patient record created in `patients` table linked to conversation | ✅ Passed |
| **CRM-02** | Patient CRM | Update patient details (Name, Email, Status) | Changes persist in database and reflect in UI | ⏳ Pending |
| **CRM-03** | Patient CRM | Fetch patient profile for selected conversation | Profile loads correctly from `/api/patients/[id]` | ✅ Passed |
| **CHAT-01** | Dashboard | Toggle between AI and Human mode | `mode` updates in `conversations` table; UI reflects change | ✅ Passed |
| **CHAT-02** | Dashboard | Send message from Dashboard | Message saved to `messages` table and sent via WhatsApp API | ⏳ Pending |
| **CHAT-03** | Dashboard | Real-time message updates | New messages appearing in chat via Supabase Realtime | ⏳ Pending |
| **KB-01** | Knowledge Base | Ingest new clinic document | Document embedded and stored in `documents` table | ⏳ Pending |
| **KB-02** | Knowledge Base | RAG Retrieval | AI uses ingested document to answer specific clinic questions | ⏳ Pending |
| **CAL-01** | Calendar | Check availability | Agent correctly identifies free slots using `check_availability` | ⏳ Pending |
| **CAL-02** | Calendar | Book appointment | Appointment created only if patient profile exists | ⏳ Pending |
| **CRON-01** | Reminders | Trigger daily reminders | `/api/cron/reminders` identifies tomorrow's apps and sends WhatsApps | ⏳ Pending |
| **WEB-01** | Web Portal | Root page access | Dashboard loads at `/` without 404 error | ✅ Passed |

## 🛠️ API Verification Results

### 1. Patient CRM API (`/api/patients/[id]`)
- **POST (Create)**: `Test: Create patient for conversation X` $\rightarrow$ Result: `200 OK`
- **GET (Read)**: `Test: Fetch patient X` $\rightarrow$ Result: `200 OK`
- **PATCH (Update)**: `Test: Update status to 'patient'` $\rightarrow$ Result: `200 OK`

### 2. Conversation API (`/api/conversations`)
- **GET (List)**: `Test: Fetch all conversations` $\rightarrow$ Result: `200 OK`
- **PATCH (Mode)**: `Test: Toggle mode` $\rightarrow$ Result: `200 OK`

### 3. Knowledge Base API (`/api/kb`)
- **POST (Ingest)**: `Test: Add pricing doc` $\rightarrow$ Result: `200 OK`

---

## 🚀 Manual Verification Steps (For Admin)
1. **Verify CRM**: Select a conversation $\rightarrow$ Click "Create Patient Profile" $\rightarrow$ Edit "Medical History" $\rightarrow$ Refresh page to ensure persistence.
2. **Verify AI Mode**: Toggle to "Human Mode" $\rightarrow$ Send a WhatsApp message as a patient $\rightarrow$ Verify the AI does NOT respond.
3. **Verify RAG**: Ingest a specific policy via `/api/kb` $\rightarrow$ Ask the bot about that policy on WhatsApp $\rightarrow$ Verify the answer matches the document.
