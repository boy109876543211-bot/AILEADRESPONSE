export function generateAIDraft(lead: {
  customer_name: string;
  service_requested: string;
  message: string | null;
}): string {
  const firstName = lead.customer_name.split(' ')[0];
  const service = lead.service_requested.toLowerCase();

  const templates = [
    `Hi ${firstName}! Thanks for reaching out about ${service}. I'm available to help and can be there today. Would you like me to stop by for a free estimate?`,
    `Hey ${firstName}, got your message about ${service}! I'm in your area and could swing by in the next hour. What works best for you?`,
    `${firstName}, thanks for contacting us! I'd be happy to help with ${service}. I have availability this afternoon - shall I come take a look?`,
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}
