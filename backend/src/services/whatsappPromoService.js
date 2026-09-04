/**
 * Send a WhatsApp promo message via the Cloud API.
 * Falls back to preview mode when credentials are absent.
 */
export async function sendPromo({ message, imageUrl, recipient, phoneId, accessToken } = {}) {
  const token = accessToken || process.env.WHATSAPP_ACCESS_TOKEN;
  const phone = phoneId  || process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to    = recipient || process.env.WHATSAPP_RECIPIENT;

  if (!token || !phone || !to) {
    return { queued: false, mode: 'preview', message, imageUrl: imageUrl || null };
  }

  const payload = imageUrl
    ? { messaging_product: 'whatsapp', to, type: 'image', image: { link: imageUrl, caption: message.trim() } }
    : { messaging_product: 'whatsapp', to, type: 'text', text: { body: message.trim() } };

  const response = await fetch(`https://graph.facebook.com/v20.0/${phone}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error?.message || 'WhatsApp API rejected the message');
    error.status = 502;
    throw error;
  }

  return { queued: true, provider: 'WhatsApp Cloud API', id: data.messages?.[0]?.id || null };
}
