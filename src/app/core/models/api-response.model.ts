export interface ApiListResponse<T> {
  data: T[];
  meta: { total: number };
}

export interface ApiSingleResponse<T> {
  data: T;
}

export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiErrorBody {
  error: {
    message: string;
    details?: ApiErrorDetail[];
  };
}
