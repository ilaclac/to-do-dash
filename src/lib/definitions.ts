export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
};

export interface ApiErrorInterface extends Error {
  response?: {
    status: number;
    data?: any;
  };
}

export interface Item {
  id: string;
  title: string;
  done: boolean;
}

export interface TodoTableProps {
  items: Item[];
  onDeleteItem: (id: string) => void;
  onEditItem: (id: string) => void;
  onSaveItem: (id: string, newTitle: string) => void;
  onItemChange: (id: string, title: string) => void;
  onCancelEdit: () => void;
  onToggleDone: (id: string) => void;
  editingItemId: string | null;
}
