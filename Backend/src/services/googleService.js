import { google } from 'googleapis';
import User from '../models/User.js';

class GoogleCalendarService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,                  
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  /**
   * Get OAuth2 client with user's credentials
   */
  async getAuthClient(userId) {
    const user = await User.findById(userId);
    if (!user || !user.googleTokens?.accessToken) {
      throw new Error('User not authenticated with Google');
    }

    this.oauth2Client.setCredentials({
      access_token: user.googleTokens.accessToken,
      refresh_token: user.googleTokens.refreshToken,
      expiry_date: user.googleTokens.expiryDate
    });

    // Handle token refresh
    this.oauth2Client.on('tokens', async (tokens) => {
      if (tokens.refresh_token) {
        user.googleTokens.refreshToken = tokens.refresh_token;
      }
      user.googleTokens.accessToken = tokens.access_token;
      user.googleTokens.expiryDate = new Date(tokens.expiry_date);
      await user.save();
    });

    return this.oauth2Client;
  }

  /**
   * Create a calendar event
   */
  async createCalendarEvent(userId, eventDetails) {
    try {
      const auth = await this.getAuthClient(userId);
      const calendar = google.calendar({ version: 'v3', auth });

      const event = {
        summary: eventDetails.summary,
        description: eventDetails.description || '',
        start: {
          dateTime: eventDetails.startTime,
          timeZone: eventDetails.timeZone || 'UTC',
        },
        end: {
          dateTime: eventDetails.endTime,
          timeZone: eventDetails.timeZone || 'UTC',
        },
        attendees: eventDetails.attendees || [],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 30 }, // 30 minutes before
          ],
        },
        conferenceData: eventDetails.includeVideoConference ? {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        } : undefined,
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: eventDetails.includeVideoConference ? 1 : 0,
        sendUpdates: 'all', // Send email notifications to attendees
      });

      return response.data;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw new Error(`Failed to create calendar event: ${error.message}`);
    }
  }

  /**
   * Update a calendar event
   */
  async updateCalendarEvent(userId, eventId, eventDetails) {
    try {
      const auth = await this.getAuthClient(userId);
      const calendar = google.calendar({ version: 'v3', auth });

      const event = {
        summary: eventDetails.summary,
        description: eventDetails.description,
        start: {
          dateTime: eventDetails.startTime,
          timeZone: eventDetails.timeZone || 'UTC',
        },
        end: {
          dateTime: eventDetails.endTime,
          timeZone: eventDetails.timeZone || 'UTC',
        },
        attendees: eventDetails.attendees || [],
      };

      const response = await calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        resource: event,
        sendUpdates: 'all',
      });

      return response.data;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw new Error(`Failed to update calendar event: ${error.message}`);
    }
  }

  /**
   * Delete/Cancel a calendar event
   */
  async deleteCalendarEvent(userId, eventId) {
    try {
      const auth = await this.getAuthClient(userId);
      const calendar = google.calendar({ version: 'v3', auth });

      await calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
        sendUpdates: 'all', // Notify attendees
      });

      return { success: true, message: 'Event cancelled successfully' };
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw new Error(`Failed to delete calendar event: ${error.message}`);
    }
  }

  /**
   * Get calendar events
   */
  async getCalendarEvents(userId, startDate, endDate) {
    try {
      const auth = await this.getAuthClient(userId);
      const calendar = google.calendar({ version: 'v3', auth });

      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: startDate || new Date().toISOString(),
        timeMax: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ahead
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw new Error(`Failed to fetch calendar events: ${error.message}`);
    }
  }

  /**
   * Check if a time slot is available
   */
  async isTimeSlotAvailable(userId, startTime, endTime) {
    try {
      const events = await this.getCalendarEvents(userId, startTime, endTime);
      
      // Check if there are any overlapping events
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();

      for (const event of events) {
        const eventStart = new Date(event.start.dateTime || event.start.date).getTime();
        const eventEnd = new Date(event.end.dateTime || event.end.date).getTime();

        // Check for overlap
        if ((start < eventEnd && end > eventStart)) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error checking time slot availability:', error);
      return false;
    }
  }
}

export default new GoogleCalendarService();

