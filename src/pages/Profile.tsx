import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Profile: React.FC = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Função para buscar os dados da carteira
    const fetchWalletData = async () => {
      try {
        const response = await fetch('http://localhost:8080/wallets/123'); // Substitua o ID pelo valor dinâmico se necessário
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
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-600">
              {wallet.fullName.charAt(0)}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{wallet.fullName}</h2>
            <p className="text-gray-600">{wallet.walletType.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">{wallet.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">+55 (11) 98765-4321</span> {/* Este dado não está na API, pode ser removido ou ajustado */}
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">São Paulo, Brasil</span> {/* Este dado não está na API, pode ser removido ou ajustado */}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Account Details</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Account Type</span>
            <span className="font-medium">{wallet.walletType.description}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Balance</span>
            <span className="font-medium">R$ {wallet.balance.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Transfer Allowed</span>
            <span className={`font-medium ${wallet.transferAllowedForWalletType ? 'text-green-600' : 'text-red-600'}`}>
              {wallet.transferAllowedForWalletType ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};