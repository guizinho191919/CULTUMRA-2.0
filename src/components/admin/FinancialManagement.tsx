
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminSystem } from '@/hooks/useAdminSystem';
import { useToast } from '@/hooks/use-toast';
import { 
  Wallet, CreditCard, TrendingUp, TrendingDown, 
  DollarSign, Users, Calendar, Search, Filter,
  Download, Plus, Minus, Eye
} from 'lucide-react';

interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: 'credit' | 'debit' | 'payment' | 'refund' | 'commission';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  referenceId?: string;
}

const FinancialManagement = () => {
  const { users, reservations, updateUserBalance, generatePixKey } = useAdminSystem();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, typeFilter, statusFilter]);

  const loadTransactions = () => {
    const savedTransactions = localStorage.getItem('admin_transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          userId: '1',
          userName: 'João Silva',
          type: 'payment',
          amount: 450,
          description: 'Pagamento - Pantanal Adventure',
          status: 'completed',
          createdAt: '2024-05-28T10:30:00',
          referenceId: 'res-1'
        },
        {
          id: '2',
          userId: '2',
          userName: 'Carlos Pantanal',
          type: 'commission',
          amount: 90,
          description: 'Comissão - Pantanal Adventure',
          status: 'completed',
          createdAt: '2024-05-28T11:00:00',
          referenceId: 'res-1'
        }
      ];
      setTransactions(mockTransactions);
      localStorage.setItem('admin_transactions', JSON.stringify(mockTransactions));
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(transaction => 
        transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === typeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === statusFilter);
    }

    setFilteredTransactions(filtered);
  };

  const saveTransactions = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
    localStorage.setItem('admin_transactions', JSON.stringify(newTransactions));
  };

  const handleAddCredit = () => {
    if (!selectedUserId || !amount || parseFloat(amount) <= 0) {
      toast({
        title: "Erro",
        description: "Selecione um usuário e digite um valor válido.",
        variant: "destructive"
      });
      return;
    }

    const user = users.find(u => u.id === selectedUserId);
    if (!user) return;

    const creditAmount = parseFloat(amount);
    updateUserBalance(selectedUserId, creditAmount);

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      userId: selectedUserId,
      userName: user.name,
      type: 'credit',
      amount: creditAmount,
      description: description || `Crédito adicionado pela administração`,
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    const updatedTransactions = [newTransaction, ...transactions];
    saveTransactions(updatedTransactions);

    setAmount('');
    setDescription('');
    setSelectedUserId('');

    toast({
      title: "Crédito adicionado",
      description: `R$ ${creditAmount.toFixed(2)} foi creditado para ${user.name}`
    });
  };

  const handleDebitAmount = () => {
    if (!selectedUserId || !amount || parseFloat(amount) <= 0) {
      toast({
        title: "Erro",
        description: "Selecione um usuário e digite um valor válido.",
        variant: "destructive"
      });
      return;
    }

    const user = users.find(u => u.id === selectedUserId);
    if (!user) return;

    const debitAmount = parseFloat(amount);
    
    if (user.balance < debitAmount) {
      toast({
        title: "Saldo insuficiente",
        description: "O usuário não possui saldo suficiente para este débito.",
        variant: "destructive"
      });
      return;
    }

    updateUserBalance(selectedUserId, -debitAmount);

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      userId: selectedUserId,
      userName: user.name,
      type: 'debit',
      amount: debitAmount,
      description: description || `Débito efetuado pela administração`,
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    const updatedTransactions = [newTransaction, ...transactions];
    saveTransactions(updatedTransactions);

    setAmount('');
    setDescription('');
    setSelectedUserId('');

    toast({
      title: "Débito efetuado",
      description: `R$ ${debitAmount.toFixed(2)} foi debitado de ${user.name}`
    });
  };

  const generateFinancialReport = () => {
    const report = {
      totalTransactions: transactions.length,
      totalCredits: transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0),
      totalDebits: transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0),
      totalPayments: transactions.filter(t => t.type === 'payment').reduce((sum, t) => sum + t.amount, 0),
      totalCommissions: transactions.filter(t => t.type === 'commission').reduce((sum, t) => sum + t.amount, 0),
      generatedAt: new Date().toISOString()
    };

    toast({
      title: "Relatório gerado",
      description: "Relatório financeiro foi gerado com sucesso."
    });

    console.log('Relatório Financeiro:', report);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'credit': return 'bg-green-100 text-green-700';
      case 'debit': return 'bg-red-100 text-red-700';
      case 'payment': return 'bg-blue-100 text-blue-700';
      case 'refund': return 'bg-yellow-100 text-yellow-700';
      case 'commission': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'credit': return 'Crédito';
      case 'debit': return 'Débito';
      case 'payment': return 'Pagamento';
      case 'refund': return 'Reembolso';
      case 'commission': return 'Comissão';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const totalBalance = users.reduce((sum, user) => sum + user.balance, 0);
  const totalRevenue = transactions.filter(t => t.type === 'payment' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const totalCommissions = transactions.filter(t => t.type === 'commission' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Gestão Financeira</h1>
          <p className="text-gray-600">Controle financeiro e transações do sistema</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={generateFinancialReport} variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Gerar Relatório</span>
          </Button>
          <Button onClick={() => generatePixKey()} variant="outline" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Gerar PIX</span>
          </Button>
        </div>
      </div>

      {/* Estatísticas Financeiras */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Wallet className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Saldo Total</p>
                <p className="text-2xl font-bold">R$ {totalBalance.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold">R$ {totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Comissões</p>
                <p className="text-2xl font-bold">R$ {totalCommissions.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Transações Pendentes</p>
                <p className="text-2xl font-bold">{pendingTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gestão de Saldo */}
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Saldo dos Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um usuário" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} - R$ {user.balance.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              type="number"
              placeholder="Valor"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
            />
            
            <Input
              placeholder="Descrição (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            
            <Button 
              onClick={handleAddCredit}
              className="flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Creditar</span>
            </Button>
            
            <Button 
              onClick={handleDebitAmount}
              variant="outline"
              className="flex items-center space-x-1"
            >
              <Minus className="h-4 w-4" />
              <span>Debitar</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filtros de Transações */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de transação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="credit">Créditos</SelectItem>
                <SelectItem value="debit">Débitos</SelectItem>
                <SelectItem value="payment">Pagamentos</SelectItem>
                <SelectItem value="refund">Reembolsos</SelectItem>
                <SelectItem value="commission">Comissões</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="completed">Concluídas</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="failed">Falharam</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filtros Avançados</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Transações */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTransactions.map((transaction) => (
          <Card key={transaction.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-lg">{transaction.userName}</h3>
                    <Badge className={getTypeColor(transaction.type)}>
                      {getTypeLabel(transaction.type)}
                    </Badge>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status === 'completed' ? 'Concluída' : 
                       transaction.status === 'pending' ? 'Pendente' : 'Falhou'}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-2">{transaction.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <p><span className="font-medium">Data:</span> {new Date(transaction.createdAt).toLocaleString()}</p>
                      <p><span className="font-medium">ID:</span> {transaction.id}</p>
                    </div>
                    <div>
                      <p><span className="font-medium">Usuário ID:</span> {transaction.userId}</p>
                      {transaction.referenceId && (
                        <p><span className="font-medium">Referência:</span> {transaction.referenceId}</p>
                      )}
                    </div>
                    <div>
                      <p className={`text-xl font-bold ${
                        transaction.type === 'credit' ? 'text-green-600' : 
                        transaction.type === 'debit' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {transaction.type === 'debit' ? '-' : '+'}R$ {transaction.amount}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>Detalhes</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FinancialManagement;
