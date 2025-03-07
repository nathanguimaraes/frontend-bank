export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  date: string;
}