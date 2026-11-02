import { Customer } from './customer';
import { ExecutionTrace } from './agent';

export type TicketStatus = 'PENDING' | 'PROCESSING' | 'RESOLVED' | 'FAILED';

export interface Ticket {
  id: string;
  ticketNumber: string;
  customerId: string;
  orderId: string | null;
  message: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
}

export interface TicketDetail extends Ticket {
  executions?: AgentExecutionSummary[];
}

export interface AgentExecutionSummary {
  id: string;
  ticketId: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED';
  resolutionTag: 'AUTO_RESOLVE' | 'ESCALATE_TO_SALES' | null;
  customerResponse: string | null;
  summary: string | null;
  errorMessage: string | null;
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
  traces?: ExecutionTrace[];
}

export interface TicketFilters {
  status?: TicketStatus | 'ALL';
  search?: string;
}
