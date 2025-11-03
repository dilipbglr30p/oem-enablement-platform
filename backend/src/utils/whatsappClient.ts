import twilio from 'twilio';
import { config } from '../config/env';
import logger from './logger';

// Initialize Twilio client
const client = twilio(config.twilio.accountSid, config.twilio.authToken);

// WhatsApp message interfaces
export interface WhatsAppMessage {
  to: string;
  message: string;
  mediaUrl?: string;
}

export interface WhatsAppTemplate {
  to: string;
  templateName: string;
  parameters: string[];
}

// Send WhatsApp message
export const sendWhatsAppMessage = async (data: WhatsAppMessage) => {
  try {
    const message = await client.messages.create({
      body: data.message,
      from: config.twilio.whatsappNumber,
      to: `whatsapp:${data.to}`,
      ...(data.mediaUrl && { mediaUrl: [data.mediaUrl] }),
    });

    logger.info(`WhatsApp message sent: ${message.sid}`);
    
    return {
      success: true,
      messageId: message.sid,
      status: message.status,
    };
  } catch (error) {
    logger.error('Error sending WhatsApp message:', error);
    return {
      success: false,
      error: 'Failed to send WhatsApp message',
    };
  }
};

// Send WhatsApp template message
export const sendWhatsAppTemplate = async (data: WhatsAppTemplate) => {
  try {
    const message = await client.messages.create({
      from: config.twilio.whatsappNumber,
      to: `whatsapp:${data.to}`,
      contentSid: data.templateName,
      contentVariables: JSON.stringify({
        '1': data.parameters[0] || '',
        '2': data.parameters[1] || '',
        '3': data.parameters[2] || '',
      }),
    });

    logger.info(`WhatsApp template sent: ${message.sid}`);
    
    return {
      success: true,
      messageId: message.sid,
      status: message.status,
    };
  } catch (error) {
    logger.error('Error sending WhatsApp template:', error);
    return {
      success: false,
      error: 'Failed to send WhatsApp template',
    };
  }
};

// Send order confirmation message
export const sendOrderConfirmation = async (phoneNumber: string, orderData: any) => {
  const message = `🎉 *Order Confirmed!*

Order ID: ${orderData.id}
Client: ${orderData.client}
Product: ${orderData.product}
Quantity: ${orderData.quantity}
Status: ${orderData.status}

We'll keep you updated on your order progress. Thank you for choosing TextileOEM!`;

  return await sendWhatsAppMessage({
    to: phoneNumber,
    message,
  });
};

// Send order status update
export const sendOrderStatusUpdate = async (phoneNumber: string, orderData: any) => {
  const message = `📦 *Order Status Update*

Order ID: ${orderData.id}
New Status: ${orderData.status}
Progress: ${orderData.progress}%

${orderData.status === 'Completed' ? '🎉 Your order has been completed and is ready for delivery!' : 'We\'ll continue to keep you updated.'}`;

  return await sendWhatsAppMessage({
    to: phoneNumber,
    message,
  });
};

// Send compliance alert
export const sendComplianceAlert = async (phoneNumber: string, complianceData: any) => {
  const message = `⚠️ *Compliance Alert*

${complianceData.title}
Due Date: ${complianceData.dueDate}
Priority: ${complianceData.priority}

Please review and take necessary action. Contact us if you need assistance.`;

  return await sendWhatsAppMessage({
    to: phoneNumber,
    message,
  });
};

// Send payment confirmation
export const sendPaymentConfirmation = async (phoneNumber: string, paymentData: any) => {
  const message = `💳 *Payment Confirmed*

Payment ID: ${paymentData.id}
Amount: ₹${paymentData.amount}
Status: ${paymentData.status}
Date: ${new Date(paymentData.created_at).toLocaleDateString()}

Thank you for your payment!`;

  return await sendWhatsAppMessage({
    to: phoneNumber,
    message,
  });
};
