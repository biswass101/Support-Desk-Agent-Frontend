export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    count?: number;
    message?: string;
    filters?: {
      status?: string | null;
      search?: string | null;
    };
  };
  error?: {
    code?: string;
    message: string;
    details?: unknown;
  };
}

export interface HealthCheckData {
  status: string;
  database: string;
  uptimeSeconds: number;
  timestamp: string;
  service: string;
}
