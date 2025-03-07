import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Printer, Download, ArrowLeft, Loader2 } from 'lucide-react';
import axios from 'axios'; // Importando o axios

interface TransferProps {
  senderId: number; // ID do remetente herdado do componente Card
}

export const Transfer: React.FC<TransferProps> = ({ senderId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [transfer, setTransfer] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    value: '',
    payeeId: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Fazendo a requisição POST usando axios
      const response = await axios.post('http://localhost:8080/transfer', {
        value: parseFloat(formData.value),
        payer: 1, // ID do remetente herdado do componente Card                 //<---------------------------------------------------------
        payee: parseInt(formData.payeeId) // ID do destinatário fornecido pelo formulário
      });

      // Simula um tempo de carregamento de 3 segundos
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Define os dados da transferência no estado
      setTransfer(response.data);
      setShowReceipt(true);
    } catch (error) {
      alert('Transferência falhou: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const receiptContent = `
Comprovante de Transferência
---------------
Data: ${new Date().toLocaleString()}
ID da Transferência: ${transfer?.id}
Valor: R$ ${transfer?.value.toFixed(2)}
De: ${transfer?.sender.fullName}
Para: ${transfer?.receiver.fullName}
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprovante-transferencia-${transfer?.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Processando sua transferência...</p>
        </div>
      </div>
    );
  }

  if (showReceipt && transfer) {
    return (
      <div className="max-w-lg mx-auto p-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Comprovante de Transferência</h2>
            <p className="text-gray-500">Transação concluída com sucesso</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">ID da Transferência</span>
              <span className="font-medium">{transfer.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Valor</span>
              <span className="font-medium text-green-600">R$ {transfer.value.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">De</span>
              <span className="font-medium">{transfer.sender.fullName}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Para</span>
              <span className="font-medium">{transfer.receiver.fullName}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Data</span>
              <span className="font-medium">{new Date().toLocaleString()}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200"
            >
              <Printer className="w-5 h-5" />
              Imprimir
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              <Download className="w-5 h-5" />
              Salvar Comprovante
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <button
        onClick={() => navigate('/home')}
        className="flex items-center gap-2 text-gray-600 mb-6 hover:text-gray-800"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar para Home
      </button>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Realizar Transferência</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-2">
              Valor (R$)
            </label>
            <input
              type="number"
              id="value"
              step="0.01"
              required
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="payeeId" className="block text-sm font-medium text-gray-700 mb-2">
              ID do Destinatário
            </label>
            <input
              type="number"
              id="payeeId"
              required
              value={formData.payeeId}
              onChange={(e) => setFormData(prev => ({ ...prev, payeeId: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite o ID do destinatário"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Realizar Transferência
          </button>
        </form>
      </div>
    </div>
  );
};