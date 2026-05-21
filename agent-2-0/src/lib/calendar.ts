import { google } from 'googleapis';

async function getCalendarClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CALENDAR_CLIENT_ID,
    process.env.GOOGLE_CALENDAR_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_CALENDAR_REFRESH_TOKEN,
  });

  return google.calendar({ version: 'v3', auth: oauth2Client });
}

export async function checkAvailability(date: string) {
  try {
    const calendar = await getCalendarClient();

    // Define working hours: 09:00 to 18:00
    const timeMin = new Date(`${date}T09:00:00Z`);
    const timeMax = new Date(`${date}T18:00:00Z`);

    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        items: [{ id: 'primary' }],
      },
    });

    const busySlots = response.data.calendars?.primary?.busy || [];

    // Generate 30-minute slots from 09:00 to 18:00
    const availableSlots = [];
    let currentStart = new Date(timeMin);

    while (currentStart < timeMax) {
      const currentEnd = new Date(currentStart.getTime() + 30 * 60 * 1000);

      const isBusy = busySlots.some(busy => {
        const busyStart = new Date(busy.start);
        const busyEnd = new Date(busy.end);
        return Math.max(currentStart.getTime(), busyStart.getTime()) < Math.min(currentEnd.getTime(), busyEnd.getTime());
      });

      if (!isBusy) {
        availableSlots.push({
          start: currentStart.toISOString().substring(11, 16),
          end: currentEnd.toISOString().substring(11, 16),
          available: true,
        });
      }

      currentStart = currentEnd;
    }

    return availableSlots;
  } catch (error: any) {
    console.error('Google Calendar checkAvailability error:', error);
    throw new Error(`Failed to check availability: ${error.message}`);
  }
}

export async function createAppointment(details: {
  patientId: string,
  conversationId: string,
  startTime: string,
  endTime: string,
  reason: string,
  patientName?: string
}) {
  try {
    const calendar = await getCalendarClient();

    const event = {
      summary: `Appointment: ${details.patientName || 'Patient'} - ${details.reason}`,
      description: `Patient ID: ${details.patientId}\nConversation ID: ${details.conversationId}\nReason: ${details.reason}`,
      start: {
        dateTime: details.startTime,
        timeZone: 'UTC',
      },
      end: {
        dateTime: details.endTime,
        timeZone: 'UTC',
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    return {
      success: true,
      appointmentId: response.data.id,
      confirmedTime: response.data.start?.dateTime,
    };
  } catch (error: any) {
    console.error('Google Calendar createAppointment error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create appointment in Google Calendar',
    };
  }
}
