export type ResolutionTag = 'AUTO_RESOLVE' | 'ESCALATE_TO_SALES';

export interface AgentResponse {
  customerResponse: string;
  resolutionTag: ResolutionTag;
  summary: string;
}

export type TraceEventType =
  | 'AGENT_DECISION'
  | 'TOOL_CALL'
  | 'TOOL_RESULT'
  | 'AGENT_RESPONSE'
  | 'ERROR';

export interface ExecutionTrace {
  id: string;
  executionId: string;
  step: number;
  eventType: TraceEventType;
  toolName: string | null;
  message: string;
  parameters: unknown | null;
  output: unknown | null;
  durationMs: number | null;
  createdAt: string;
}
