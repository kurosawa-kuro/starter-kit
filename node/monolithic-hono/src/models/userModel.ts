export interface User {
  id: number;
  name: string;
  email: string | null;
  password: string | null;
  avatar: string | null;
  createdAt: Date;
} 