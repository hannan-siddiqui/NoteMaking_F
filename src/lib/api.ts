const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
  code?: string;
}

export class ApiError extends Error {
  statusCode: number;
  data: any;

  constructor(message: string, statusCode: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('notion_token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json: ApiResponse<T> = await response.json().catch(() => ({
    success: false,
    message: response.statusText || 'Unknown server response',
  }));

  if (!response.ok || json.success === false) {
    throw new ApiError(
      json.message || `Request failed with status ${response.status}`,
      response.status,
      json
    );
  }

  return json.data as T;
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (payload: { name: string; email: string; password: string }) =>
    request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  demoLogin: () =>
    request<{ user: any; token: string }>('/auth/demo-login', {
      method: 'POST',
    }),

  me: () => request<{ user: any }>('/auth/me'),

  // Notes
  getNotes: (params?: { workspaceId?: string; parentId?: string }) => {
    const query = new URLSearchParams();
    if (params?.workspaceId) query.append('workspaceId', params.workspaceId);
    if (params?.parentId) query.append('parentId', params.parentId);
    return request<any[]>(`/notes?${query.toString()}`);
  },

  getNoteTree: (workspaceId?: string) => {
    const query = workspaceId ? `?workspaceId=${workspaceId}` : '';
    return request<any[]>(`/notes/tree${query}`);
  },

  getNoteById: (id: string) => request<any>(`/notes/${id}`),

  createNote: (data: {
    title?: string;
    icon?: string;
    coverImage?: string | null;
    content?: string;
    parentId?: string | null;
    workspaceId?: string | null;
  }) =>
    request<any>('/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateNote: (
    id: string,
    data: {
      title?: string;
      icon?: string | null;
      coverImage?: string | null;
      content?: string;
      parentId?: string | null;
      isFavorite?: boolean;
      position?: number;
      tags?: string | null;
    }
  ) =>
    request<any>(`/notes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  archiveNote: (id: string) =>
    request<any>(`/notes/${id}`, {
      method: 'DELETE',
    }),

  restoreNote: (id: string) =>
    request<any>(`/notes/${id}/restore`, {
      method: 'POST',
    }),

  deletePermanently: (id: string) =>
    request<any>(`/notes/${id}/permanent`, {
      method: 'DELETE',
    }),

  getTrash: () => request<any[]>('/notes/trash'),

  emptyTrash: () =>
    request<any>('/notes/trash', {
      method: 'DELETE',
    }),

  duplicateNote: (id: string) =>
    request<any>(`/notes/${id}/duplicate`, {
      method: 'POST',
    }),

  searchNotes: (query: string) =>
    request<any[]>(`/notes/search?q=${encodeURIComponent(query)}`),

  togglePublish: (id: string) =>
    request<{ isPublished: boolean; shareSlug: string | null }>(
      `/notes/${id}/publish`,
      {
        method: 'POST',
      }
    ),

  getPublicNote: (slug: string) => request<any>(`/notes/public/${slug}`),

  // Workspaces
  getWorkspaces: () => request<any[]>('/workspaces'),
  createWorkspace: (data: { name: string; icon?: string }) =>
    request<any>('/workspaces', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
