import assert from 'node:assert/strict';
import agent from '../agents/leeila.agent';

assert.equal(agent.name, 'leeila', 'Agent name should be "leeila"');
assert.ok(agent.instructions?.includes('Namastey!'), 'Instructions should include greeting guidance.');
assert.ok(Array.isArray(agent.tools) && agent.tools.length > 0, 'Agent must expose at least one tool.');

if (Array.isArray(agent.mcpServers)) {
  agent.mcpServers.forEach((server) => {
    assert.ok(server.name, 'Each MCP server should have a name.');
  });
}

console.log('Agent configuration loaded successfully with', agent.tools.length, 'tools.');
