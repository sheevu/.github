export interface MCPServerOptions {
  name: string;
  cacheToolsList?: boolean;
  requestInit?: Record<string, unknown>;
}

export class MCPServer {
  readonly name: string;
  cacheToolsList: boolean;
  constructor(options: MCPServerOptions) {
    this.name = options.name;
    this.cacheToolsList = options.cacheToolsList ?? false;
  }
}

export class MCPServerSSE extends MCPServer {
  constructor(options: MCPServerOptions) {
    super(options);
  }
}

export class MCPServerStreamableHttp extends MCPServer {
  constructor(options: MCPServerOptions) {
    super(options);
  }
}

export type AgentConfig<TOutput = unknown> = {
  name: string;
  description?: string;
  instructions: string;
  tools: readonly unknown[];
  mcpServers?: readonly MCPServer[];
  model?: string;
} & Record<string, unknown>;

export function defineAgent<TOutput = unknown>(
  config: AgentConfig<TOutput>
): AgentConfig<TOutput> {
  return Object.freeze({ ...config });
}
