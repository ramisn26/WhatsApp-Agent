# Google Calendar Integration

## Overview
The Google Calendar integration allows the WhatsApp Agent to check for available appointment slots and book dental appointments directly into a Google Calendar.

## Setup and Configuration

### Environment Variables
The following variables must be configured in the `.env` file:

| Variable | Description |
| :--- | :--- |
| `GOOGLE_CALENDAR_CLIENT_ID` | OAuth2 Client ID from Google Cloud Console |
| `GOOGLE_CALENDAR_CLIENT_SECRET` | OAuth2 Client Secret from Google Cloud Console |
| `GOOGLE_CALENDAR_REFRESH_TOKEN` | Long-lived refresh token for the service account/user |

### API Requirements
- **Google Calendar API** must be enabled in the Google Cloud Project.
- The OAuth2 credentials must have the `https://www.googleapis.com/auth/calendar` scope.

## Technical Implementation

### Authentication (`src/lib/calendar.ts`)
The integration uses the `googleapis` library with an OAuth2 refresh token flow. A helper function `getCalendarClient()` manages the authentication and returns a configured Google Calendar v3 client.

### Availability Logic (`checkAvailability`)
1. **Time Window**: Checks slots between `09:00` and `18:00` UTC for the requested date.
2. **FreeBusy Query**: Calls `calendar.freebusy.query` to retrieve all busy intervals for the `primary` calendar.
3. **Slot Generation**: Generates 30-minute increments. A slot is marked available if it does not overlap with any busy interval returned by the API.

### Appointment Booking (`createAppointment`)
1. **Event Creation**: Uses `calendar.events.insert`.
2. **Event Metadata**:
   - **Summary**: `Appointment: [Patient Name] - [Reason]`
   - **Description**: Includes `Patient ID` and `Conversation ID` for CRM traceability.
   - **Time**: Uses ISO 8601 timestamps for start and end times.

## Integration with AI Agent

The calendar functions are exposed to the AI through the following tools in `src/lib/tools.ts`:

- `check_availability`: Takes a `date` and returns a list of available time slots.
- `book_appointment`: Takes `conversation_id`, `startTime`, `endTime`, and `reason`. It fetches the patient's full name from Supabase before creating the calendar event.

## Verification
To verify the integration:
1. Ensure valid credentials are in `.env`.
2. Ask the agent: "Check available slots for [Date]" $\rightarrow$ Verify output matches the Google Calendar.
3. Ask the agent: "Book an appointment for [Date] at [Time] for a cleaning" $\rightarrow$ Verify event appears in Google Calendar.
