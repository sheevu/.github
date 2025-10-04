import assert from 'node:assert/strict';
import agent from '../agents/leeila.agent';
import saveLeadToSheet from '../tools/save_lead_to_sheet.tool';

assert.equal(agent.name, 'leeila', 'Agent name should be "leeila"');
assert.ok(agent.instructions?.includes('Namastey!'), 'Instructions should include greeting guidance.');
assert.ok(Array.isArray(agent.tools) && agent.tools.length > 0, 'Agent must expose at least one tool.');

if (Array.isArray(agent.mcpServers)) {
  agent.mcpServers.forEach((server) => {
    assert.ok(server.name, 'Each MCP server should have a name.');
  });
}

console.log('Agent configuration loaded successfully with', agent.tools.length, 'tools.');

const invalidResult = await saveLeadToSheet({
  name: '',
  phone: '12345',
  email: 'invalid',
});

assert.equal(invalidResult.success, false, 'Invalid lead data should fail validation.');
assert.equal(invalidResult.forwarded, false, 'Invalid lead should not be forwarded.');
assert.ok(
  invalidResult.message.includes('Validation failed'),
  'Validation failure should mention the reason.',
);

const originalSudarshanWebhookUrl = process.env.SUDARSHAN_LEADS_WEBHOOK_URL;
const originalWebhookUrl = process.env.LEADS_WEBHOOK_URL;

delete process.env.SUDARSHAN_LEADS_WEBHOOK_URL;
delete process.env.LEADS_WEBHOOK_URL;

try {
  const validResult = await saveLeadToSheet({
    name: 'Test User',
    phone: '9876543210',
    email: 'test@example.com',
    city: 'Lucknow',
    message: 'Interested in a demo',
    source: 'automated-test',
  });

  assert.equal(validResult.success, true, 'Valid leads should be accepted.');
  assert.equal(
    validResult.forwarded,
    false,
    'When no webhook is configured, leads should be stored locally and not forwarded.',
  );
  assert.ok(
    validResult.message.includes('Lead captured'),
    'Success message should mention local capture when no webhook is configured.',
  );
} finally {
  if (originalSudarshanWebhookUrl === undefined) {
    delete process.env.SUDARSHAN_LEADS_WEBHOOK_URL;
  } else {
    process.env.SUDARSHAN_LEADS_WEBHOOK_URL = originalSudarshanWebhookUrl;
  }

  if (originalWebhookUrl === undefined) {
    delete process.env.LEADS_WEBHOOK_URL;
  } else {
    process.env.LEADS_WEBHOOK_URL = originalWebhookUrl;
  }
}

console.log('Lead capture tool validated successfully.');
