export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

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
  description?: string;
  owner: User;
  members: User[];
  status: 'planning' | 'active' | 'completed';
  budget: string;
  currency: string;
  start_date?: string;
  end_date?: string;
  is_favorite: boolean;
  tags: string[];
  cover_image?: string;
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
  description?: string;
  budget: string;
  people_number: number;
  tags: string[];
  due_date?: string;
  assigned_members: User[];
  subtasks: { title: string; completed: boolean }[];
  attachments: { name: string; size: string }[];
  location?: { name: string; lat: number; lng: number };
  position: number;
  created_at: string;
  updated_at: string;
  category?: "flight" | "hotel" | "food" | "activity" | "romantic" | "family";
  expense_id?: number;
}

export interface Expense {
  id: number;
  board: number;
  title: string;
  amount: string;
  category: string;
  date?: string;
  notes?: string;
  created_by: User;
  created_at: string;
  updated_at: string;
  currency: string;
}

export interface BudgetSummary {
  board_budget: string;
  actual_spend_total: string;
  remaining: string;
  by_category: { category: string; total: string }[];
}

export interface Location {
  id: number;
  board: number;
  name: string;
  lat: number;
  lng: number;
  created_by: User;
  created_at: string;
  updated_at: string;
}

export interface InviteResponse {
  message: string;
}
