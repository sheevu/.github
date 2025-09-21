export interface LeadDetails {
  name: string;
  phone: string;
  email: string;
  city?: string;
  message?: string;
  source?: string;
}

export interface SaveLeadResult {
  success: boolean;
  message: string;
  forwarded?: boolean;
  timestamp: string;
}

const PHONE_REGEX = /^[0-9]{10}$/;

function normalise(value: string | undefined): string {
  return (value ?? '').trim();
}

function validateLead(details: LeadDetails): string[] {
  const errors: string[] = [];

  if (!normalise(details.name)) {
    errors.push('name is required');
  }

  const phone = normalise(details.phone);
  if (!PHONE_REGEX.test(phone)) {
    errors.push('phone must be a 10-digit Indian number');
  }

  const email = normalise(details.email);
  if (!email || !email.includes('@')) {
    errors.push('email must contain @');
  }

  return errors;
}

async function forwardToWebhook(payload: Record<string, unknown>): Promise<SaveLeadResult> {
  const webhookUrl =
    process.env.SUDARSHAN_LEADS_WEBHOOK_URL ?? process.env.LEADS_WEBHOOK_URL;
  const webhookToken =
    process.env.SUDARSHAN_LEADS_WEBHOOK_TOKEN ?? process.env.LEADS_WEBHOOK_TOKEN;

  if (!webhookUrl) {
    console.info('Lead captured (no webhook configured):', payload);
    return {
      success: true,
      message: 'Lead captured locally. Configure SUDARSHAN_LEADS_WEBHOOK_URL to enable forwarding.',
      forwarded: false,
      timestamp: new Date().toISOString(),
    };
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (webhookToken) {
    headers.Authorization = `Bearer ${webhookToken}`;
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    return {
      success: false,
      message: `Failed to forward lead: ${response.status} ${response.statusText}${
        body ? ` - ${body}` : ''
      }`,
      forwarded: true,
      timestamp: new Date().toISOString(),
    };
  }

  return {
    success: true,
    message: 'Lead forwarded to configured webhook.',
    forwarded: true,
    timestamp: new Date().toISOString(),
  };
}

export default async function saveLeadToSheet(
  details: LeadDetails,
): Promise<SaveLeadResult> {
  const errors = validateLead(details);

  if (errors.length > 0) {
    return {
      success: false,
      message: `Validation failed: ${errors.join(', ')}`,
      forwarded: false,
      timestamp: new Date().toISOString(),
    };
  }

  const payload = {
    ...details,
    name: normalise(details.name),
    phone: normalise(details.phone),
    email: normalise(details.email),
    city: normalise(details.city),
    message: normalise(details.message),
    capturedAt: new Date().toISOString(),
  };

  try {
    return await forwardToWebhook(payload);
  } catch (error) {
    console.error('Failed to save lead to sheet:', error);
    return {
      success: false,
      message: 'Unexpected error while saving lead details.',
      forwarded: false,
      timestamp: new Date().toISOString(),
    };
  }
}
