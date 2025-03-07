import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Gift, Receipt, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '../components/Card';
import { ActionButton } from '../components/ActionButton';
import { SpendingGraph } from '../components/SpendingGraph';

interface Transfer {
  id: string;
  sender: {
    id: number;
    fullName: string;
    balance: number;
  };
  receiver: {
    id: number;
    fullName: string;
  };
  value: number;
  date: string;
}

interface User {
  id: number;
  fullName: string;
  balance: number;
}

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  date: string;
}

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [sentTransfers, setSentTransfers] = useState<Transfer[]>([]);
  const [receivedTransfers, setReceivedTransfers] = useState<Transfer[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const userId = "123"; // ID do usuário (pode ser dinâmico)

  const loadData = async () => {
    try {
      // Busca transferências enviadas
      const sentResponse = await fetch(`http://localhost:8080/transfer/sender/${userId}`);
      if (!sentResponse.ok) throw new Error('Erro ao carregar transferências enviadas');
      const sentData = await sentResponse.json();

      // Busca transferências recebidas
      const receivedResponse = await fetch(`http://localhost:8080/transfer/receiver/${userId}`);
      if (!receivedResponse.ok) throw new Error('Erro ao carregar transferências recebidas');
      const receivedData = await receivedResponse.json();

      // Busca informações do usuário
      const userResponse = await fetch(`http://localhost:8080/wallets/${userId}`);
      if (!userResponse.ok) throw new Error('Erro ao carregar informações do usuário');
      const userData = await userResponse.json();

      setSentTransfers(sentData);
      setReceivedTransfers(receivedData);
      setUser(userData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  if (!user) {
    return <div>Nenhum dado do usuário encontrado.</div>;
  }

  // Mapear as transferências para transações
  const transactions: Transaction[] = [
    ...sentTransfers.map((transfer) => ({
      id: transfer.id,
      amount: transfer.value,
      type: 'expense',
      description: `Transferência para ${transfer.receiver.fullName}`,
      date: transfer.date,
    })),
    ...receivedTransfers.map((transfer) => ({
      id: transfer.id,
      amount: transfer.value,
      type: 'income',
      description: `Transferência de ${transfer.sender.fullName}`,
      date: transfer.date,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      {/* Exibe o saldo do usuário */}
      <Card balance={user.balance} name={user.fullName} />

      {/* Ações rápidas */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <div className="flex justify-between gap-4"> {/* Usando flex para alinhar os botões horizontalmente */}
          <ActionButton icon={Send} label="Transferir" onClick={() => navigate('/transfer')} />
          <ActionButton icon={Gift} label="Presente" onClick={() => {}} />
          <ActionButton icon={Receipt} label="Pagar" onClick={() => {}} />
          <ActionButton icon={CreditCard} label="Cartão" onClick={() => {}} />
        </div>
      </div>

      {/* Transações recentes */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Transações Recentes</h2>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowDownRight className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className={`font-medium ${
                transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                R$ {transaction.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfico de gastos */}
      <SpendingGraph transfers={[...sentTransfers, ...receivedTransfers]} />
    </div>
  );
};