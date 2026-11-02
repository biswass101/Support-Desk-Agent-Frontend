import { Ticket } from './ticket';
import { ResolutionTag, ExecutionTrace } from './agent';

export type ExecutionStatus = 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface AgentExecution {
  id: string;
  ticketId: string;
  status: ExecutionStatus;
  resolutionTag: ResolutionTag | null;
  customerResponse: string | null;
  summary: string | null;
  errorMessage: string | null;
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
  ticket: Ticket;
  traces: ExecutionTrace[];
}
