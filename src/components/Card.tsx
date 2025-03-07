import React, { useState, useEffect } from 'react';
import { CreditCard, Wifi } from 'lucide-react';

interface CardProps {
  walletId: number; // Adicionamos uma prop para o ID da carteira
}

interface WalletData {
  id: number;
  fullName: string;
  balance: number;
}

export const Card: React.FC<CardProps> = ({ walletId }) => {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Função para buscar os dados da carteira
    const fetchWalletData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/wallets/123`);
        if (!response.ok) {
          throw new Error('Erro ao carregar os dados da carteira');
        }
        const data = await response.json();
        setWallet(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [walletId]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!wallet) return <div>Nenhum dado encontrado.</div>;

  return (
    <div className="w-full bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
      </div>

      {/* Chip and Wireless */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div className="w-10 h-7 bg-yellow-200/90 rounded-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/80 to-yellow-300/80"></div>
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_50%,rgba(255,255,255,0.2)_50%)] bg-[length:4px_4px]"></div>
          </div>
          <Wifi className="w-6 h-6 text-white/70" />
        </div>
        <CreditCard className="w-8 h-8 text-white/70" />
      </div>

      {/* Balance */}
      <div className="mb-8">
        <p className="text-sm text-white/80 font-medium mb-1">Saldo Atual</p>
        <p className="text-3xl font-bold tracking-tight">R$ {wallet.balance.toLocaleString()}</p>
      </div>

      {/* Card Footer */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-white/80 mb-1">{wallet.fullName.toUpperCase()}</p>
          <p className="text-xs text-white/60">**** **** **** 4242</p>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-sm font-medium text-white/80">VISA</p>
          <p className="text-xs text-white/60">09/25</p>
        </div>
      </div>

      {/* Hologram Effect */}
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-tl-full transform translate-x-12 translate-y-12"></div>
    </div>
  );
};