import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface WalletType {
  id: number;
  description: string;
}

export interface User {
  id: number;
  fullName: string;
  cpfCnpj: string;
  email: string;
  balance: number;
  walletType: WalletType;
  transferAllowedForWalletType: boolean;
}

export interface Transfer {
  id: string;
  sender: User;
  receiver: User;
  value: number;
}

export const bankingApi = {
  // Make a transfer
  async transfer(value: number, payerId: number, payeeId: number): Promise<Transfer> {
    const { data } = await api.post('/transfers', {
      value,
      payer: payerId,
      payee: payeeId
    });
    return data;
  },

  // Get sent transfers
  async getSentTransfers(userId: string): Promise<Transfer[]> {
    const { data } = await api.get(`/transfers/sender/${userId}`);
    return data;
  },

  // Get received transfers
  async getReceivedTransfers(userId: string): Promise<Transfer[]> {
    const { data } = await api.get(`/transfers/receiver/${userId}`);
    return data;
  }
};