import { google } from 'googleapis';

class NotificationService {
  /**
   * Send email notification using Gmail API (leverages user's Google OAuth)
   */
  async sendEmailNotification(userId, to, subject, htmlContent) {
    try {
      // For now, we'll use console log as placeholder
      // In production, you'd use services like SendGrid, AWS SES, or Gmail API
      console.log('=== EMAIL NOTIFICATION ===');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Content: ${htmlContent}`);
      console.log('========================');
      
      // Note: To actually send emails, you would integrate with:
      // 1. Gmail API (requires additional setup)
      // 2. SendGrid (npm install @sendgrid/mail)
      // 3. AWS SES
      // 4. Nodemailer with SMTP

      return { success: true, message: 'Notification logged' };
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  /**
   * Generate booking confirmation email
   */
  generateBookingConfirmationEmail(bookingDetails) {
    const { guestName, eventTitle, startTime, endTime, hostName, hostEmail, meetLink } = bookingDetails;
    
    const startDate = new Date(startTime).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const endDate = new Date(endTime).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      subject: `Meeting Confirmed: ${eventTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { margin: 10px 0; }
            .label { font-weight: bold; color: #4b5563; }
            .value { color: #111827; }
            .button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; color: #6b7280; margin-top: 30px; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Meeting Confirmed!</h1>
            </div>
            <div class="content">
              <p>Hi ${guestName},</p>
              <p>Your meeting has been successfully scheduled with ${hostName}.</p>
              
              <div class="details">
                <div class="detail-row">
                  <span class="label">Event:</span>
                  <span class="value">${eventTitle}</span>
                </div>
                <div class="detail-row">
                  <span class="label">When:</span>
                  <span class="value">${startDate} - ${endDate}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Host:</span>
                  <span class="value">${hostName} (${hostEmail})</span>
                </div>
                ${meetLink ? `
                <div class="detail-row">
                  <span class="label">Join Link:</span>
                  <span class="value"><a href="${meetLink}" style="color: #3b82f6;">${meetLink}</a></span>
                </div>
                ` : ''}
              </div>

              <p>A calendar invite has been sent to your email. Please add it to your calendar.</p>
              
              <center>
                ${meetLink ? `<a href="${meetLink}" class="button">Join Meeting</a>` : ''}
              </center>

              <div class="footer">
                <p>This is an automated message from Slotify.</p>
                <p>If you need to cancel or reschedule, please contact ${hostEmail}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };
  }

  /**
   * Generate booking notification email for host
   */
  generateHostNotificationEmail(bookingDetails) {
    const { guestName, guestEmail, eventTitle, startTime, endTime, meetLink } = bookingDetails;
    
    const startDate = new Date(startTime).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      subject: `New Booking: ${eventTitle} with ${guestName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { margin: 10px 0; }
            .label { font-weight: bold; color: #4b5563; }
            .value { color: #111827; }
            .footer { text-align: center; color: #6b7280; margin-top: 30px; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📅 New Booking Alert!</h1>
            </div>
            <div class="content">
              <p>You have a new booking scheduled.</p>
              
              <div class="details">
                <div class="detail-row">
                  <span class="label">Event:</span>
                  <span class="value">${eventTitle}</span>
                </div>
                <div class="detail-row">
                  <span class="label">When:</span>
                  <span class="value">${startDate}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Guest:</span>
                  <span class="value">${guestName} (${guestEmail})</span>
                </div>
                ${meetLink ? `
                <div class="detail-row">
                  <span class="label">Meeting Link:</span>
                  <span class="value"><a href="${meetLink}" style="color: #10b981;">${meetLink}</a></span>
                </div>
                ` : ''}
              </div>

              <p>The event has been added to your Google Calendar.</p>

              <div class="footer">
                <p>This is an automated notification from Slotify.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };
  }

  /**
   * Generate cancellation email
   */
  generateCancellationEmail(bookingDetails, cancelledBy) {
    const { guestName, eventTitle, startTime, hostName } = bookingDetails;
    
    const startDate = new Date(startTime).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      subject: `Meeting Cancelled: ${eventTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { margin: 10px 0; }
            .label { font-weight: bold; color: #4b5563; }
            .value { color: #111827; }
            .footer { text-align: center; color: #6b7280; margin-top: 30px; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>❌ Meeting Cancelled</h1>
            </div>
            <div class="content">
              <p>The following meeting has been cancelled by ${cancelledBy}:</p>
              
              <div class="details">
                <div class="detail-row">
                  <span class="label">Event:</span>
                  <span class="value">${eventTitle}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Originally Scheduled:</span>
                  <span class="value">${startDate}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Between:</span>
                  <span class="value">${hostName} and ${guestName}</span>
                </div>
              </div>

              <p>The event has been removed from your Google Calendar.</p>

              <div class="footer">
                <p>This is an automated notification from Slotify.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };
  }

  /**
   * Send booking confirmation to guest
   */
  async notifyGuestBookingConfirmed(bookingDetails) {
    const emailContent = this.generateBookingConfirmationEmail(bookingDetails);
    await this.sendEmailNotification(
      null,
      bookingDetails.guestEmail,
      emailContent.subject,
      emailContent.html
    );
  }

  /**
   * Send booking notification to host
   */
  async notifyHostNewBooking(bookingDetails) {
    const emailContent = this.generateHostNotificationEmail(bookingDetails);
    await this.sendEmailNotification(
      null,
      bookingDetails.hostEmail,
      emailContent.subject,
      emailContent.html
    );
  }

  /**
   * Send cancellation notification
   */
  async notifyCancellation(bookingDetails, recipientEmail, cancelledBy) {
    const emailContent = this.generateCancellationEmail(bookingDetails, cancelledBy);
    await this.sendEmailNotification(
      null,
      recipientEmail,
      emailContent.subject,
      emailContent.html
    );
  }
}

export default new NotificationService();

