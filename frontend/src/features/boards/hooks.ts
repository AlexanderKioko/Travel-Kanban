import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tokenManager } from '../auth/hooks';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

const getHeaders = (token: string | null) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

export interface Board {
  id: number;
  title: string;
  description: string | null;
  owner: User;
  members: User[];
  status: 'planning' | 'active' | 'completed';
  budget: string;
  currency: string;
  start_date: string | null;
  end_date: string | null;
  is_favorite: boolean;
  tags: string[];
  cover_image: string | null;
  lists: List[];
  created_at: string;
  updated_at: string;
}

export interface List {
  id: number;
  board: number;
  title: string;
  color: string;
  position: number;
  cards: Card[];
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: number;
  list: number;
  title: string;
  description: string | null;
  budget: string;
  people_number: number;
  tags: string[];
  due_date: string | null;
  assigned_members: User[];
  subtasks: { title: string; completed: boolean }[];
  attachments: { name: string; size: string }[];
  location: { name: string; lat: number; lng: number } | null;
  position: number;
  created_at: string;
  updated_at: string;
}

// Fetch all boards
export const useGetBoards = () => {
  return useQuery<Board[]>({
    queryKey: ['boards'],
    queryFn: async () => {
      const token = tokenManager.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/boards/`, {
        headers: getHeaders(token),
      });
      if (!response.ok) throw new Error('Failed to fetch boards');
      return response.json();
    },
  });
};

// Fetch single board
export const useGetBoard = (boardId: string | number) => {
  return useQuery<Board>({
    queryKey: ['board', boardId],
    queryFn: async () => {
      const token = tokenManager.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/boards/${boardId}/`, {
        headers: getHeaders(token),
      });
      if (!response.ok) throw new Error('Failed to fetch board');
      return response.json();
    },
  });
};

// Create board
export const useCreateBoard = () => {
  const queryClient = useQueryClient();
  return useMutation<Board, Error, Partial<Board>>({
    mutationFn: async (data) => {
      const token = tokenManager.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/boards/`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create board');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
};

// Update board
export const useUpdateBoard = (boardId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation<Board, Error, Partial<Board>>({
    mutationFn: async (data) => {
      const token = tokenManager.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/boards/${boardId}/`, {
        method: 'PATCH',
        headers: getHeaders(token),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update board');
      return response.json();
    },
    onSuccess: (updatedBoard) => {
      queryClient.setQueryData(['board', boardId], updatedBoard);
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
};

// Delete board
export const useDeleteBoard = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string | number>({
    mutationFn: async (boardId) => {
      const token = tokenManager.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/boards/${boardId}/`, {
        method: 'DELETE',
        headers: getHeaders(token),
      });
      if (!response.ok) throw new Error('Failed to delete board');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
};

// Create list
export const useCreateList = (boardId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation<List, Error, Partial<List>>({
    mutationFn: async (data) => {
      const token = tokenManager.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/boards/${boardId}/lists/`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create list');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });
};

// Update list
export const useUpdateList = (boardId: string | number, listId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation<List, Error, Partial<List>>({
    mutationFn: async (data) => {
      const token = tokenManager.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/boards/${boardId}/lists/${listId}/`, {
        method: 'PATCH',
        headers: getHeaders(token),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update list');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });
};

// Delete list
export const useDeleteList = (boardId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string | number>({
    mutationFn: async (listId) => {
      const token = tokenManager.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/boards/${boardId}/lists/${listId}/`, {
        method: 'DELETE',
        headers: getHeaders(token),
      });
      if (!response.ok) throw new Error('Failed to delete list');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });
};

// Create card
export const useCreateCard = (boardId: string | number, listId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation<Card, Error, Partial<Card>>({
    mutationFn: async (data) => {
      const token = tokenManager.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/boards/${boardId}/lists/${listId}/cards/`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create card');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });
};

// Update card
export const useUpdateCard = (boardId: string | number, listId: string | number, cardId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation<Card, Error, Partial<Card>>({
    mutationFn: async (data) => {
      const token = tokenManager.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/boards/${boardId}/lists/${listId}/cards/${cardId}/`, {
        method: 'PATCH',
        headers: getHeaders(token),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update card');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });
};

// Delete card
export const useDeleteCard = (boardId: string | number, listId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string | number>({
    mutationFn: async (cardId) => {
      const token = tokenManager.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/boards/${boardId}/lists/${listId}/cards/${cardId}/`, {
        method: 'DELETE',
        headers: getHeaders(token),
      });
      if (!response.ok) throw new Error('Failed to delete card');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });
};

// Move card
export const useMoveCard = () => {
  const queryClient = useQueryClient();
  return useMutation<Card, Error, { cardId: number; new_list_id?: number; new_position: number; boardId: number }>({
    mutationFn: async ({ cardId, new_list_id, new_position }) => {
      const token = tokenManager.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/cards/${cardId}/move/`, {
        method: 'PATCH',
        headers: getHeaders(token),
        body: JSON.stringify({ new_list_id, new_position }),
      });
      if (!response.ok) throw new Error('Failed to move card');
      return response.json();
    },
    onSuccess: (_, { boardId }) => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });
};