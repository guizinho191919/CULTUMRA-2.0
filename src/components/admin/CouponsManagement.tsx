
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Ticket, Search, Filter, Plus, Edit, Trash2, 
  Calendar, Users, TrendingUp, Eye
} from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  applicableFor: 'all' | 'spots' | 'itineraries' | 'events';
  createdAt: string;
}

const CouponsManagement = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    type: 'percentage',
    applicableFor: 'all',
    isActive: true
  });
  const { toast } = useToast();

  useEffect(() => {
    loadCoupons();
  }, []);

  useEffect(() => {
    filterCoupons();
  }, [coupons, searchTerm, statusFilter]);

  const loadCoupons = () => {
    const mockCoupons: Coupon[] = [
      {
        id: '1',
        code: 'DESCONTO10',
        description: 'Desconto de 10% para novos usuários',
        type: 'percentage',
        value: 10,
        minPurchase: 100,
        maxDiscount: 50,
        usageLimit: 100,
        usedCount: 23,
        validFrom: '2024-05-01',
        validUntil: '2024-06-30',
        isActive: true,
        applicableFor: 'all',
        createdAt: '2024-04-25'
      },
      {
        id: '2',
        code: 'PANTANAL50',
        description: 'R$ 50 de desconto em roteiros do Pantanal',
        type: 'fixed',
        value: 50,
        minPurchase: 200,
        usageLimit: 50,
        usedCount: 12,
        validFrom: '2024-06-01',
        validUntil: '2024-07-31',
        isActive: true,
        applicableFor: 'itineraries',
        createdAt: '2024-05-15'
      }
    ];
    setCoupons(mockCoupons);
  };

  const filterCoupons = () => {
    let filtered = coupons;

    if (searchTerm) {
      filtered = filtered.filter(coupon => 
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(coupon => {
        const validFrom = new Date(coupon.validFrom);
        const validUntil = new Date(coupon.validUntil);
        
        switch (statusFilter) {
          case 'active':
            return coupon.isActive && now >= validFrom && now <= validUntil;
          case 'expired':
            return now > validUntil;
          case 'upcoming':
            return now < validFrom;
          case 'inactive':
            return !coupon.isActive;
          default:
            return true;
        }
      });
    }

    setFilteredCoupons(filtered);
  };

  const handleCreateCoupon = () => {
    if (!newCoupon.code || !newCoupon.description || !newCoupon.value) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const coupon: Coupon = {
      id: Date.now().toString(),
      code: newCoupon.code!,
      description: newCoupon.description!,
      type: newCoupon.type!,
      value: newCoupon.value!,
      minPurchase: newCoupon.minPurchase,
      maxDiscount: newCoupon.maxDiscount,
      usageLimit: newCoupon.usageLimit,
      usedCount: 0,
      validFrom: newCoupon.validFrom!,
      validUntil: newCoupon.validUntil!,
      isActive: newCoupon.isActive!,
      applicableFor: newCoupon.applicableFor!,
      createdAt: new Date().toISOString()
    };

    setCoupons(prev => [coupon, ...prev]);
    setNewCoupon({ type: 'percentage', applicableFor: 'all', isActive: true });
    setIsCreateModalOpen(false);
    
    toast({
      title: "Cupom criado",
      description: "O cupom foi criado com sucesso."
    });
  };

  const handleToggleStatus = (couponId: string) => {
    setCoupons(prev => prev.map(c => 
      c.id === couponId ? { ...c, isActive: !c.isActive } : c
    ));
  };

  const handleDeleteCoupon = (couponId: string) => {
    setCoupons(prev => prev.filter(c => c.id !== couponId));
    toast({
      title: "Cupom excluído",
      description: "O cupom foi excluído com sucesso."
    });
  };

  const getStatusColor = (coupon: Coupon) => {
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (!coupon.isActive) return 'bg-gray-100 text-gray-700';
    if (now > validUntil) return 'bg-red-100 text-red-700';
    if (now < validFrom) return 'bg-blue-100 text-blue-700';
    return 'bg-green-100 text-green-700';
  };

  const getStatusLabel = (coupon: Coupon) => {
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (!coupon.isActive) return 'Inativo';
    if (now > validUntil) return 'Expirado';
    if (now < validFrom) return 'Agendado';
    return 'Ativo';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Gestão de Cupons</h1>
          <p className="text-gray-600">Crie e gerencie cupons de desconto</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Novo Cupom</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Novo Cupom</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="code">Código do Cupom</Label>
                <Input
                  id="code"
                  value={newCoupon.code || ''}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="Ex: DESCONTO10"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={newCoupon.description || ''}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição do cupom"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={newCoupon.type} onValueChange={(value: 'percentage' | 'fixed') => setNewCoupon(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentual</SelectItem>
                      <SelectItem value="fixed">Valor Fixo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="value">Valor</Label>
                  <Input
                    id="value"
                    type="number"
                    value={newCoupon.value || ''}
                    onChange={(e) => setNewCoupon(prev => ({ ...prev, value: Number(e.target.value) }))}
                    placeholder={newCoupon.type === 'percentage' ? 'Ex: 10' : 'Ex: 50'}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="validFrom">Válido de</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={newCoupon.validFrom || ''}
                    onChange={(e) => setNewCoupon(prev => ({ ...prev, validFrom: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="validUntil">Válido até</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={newCoupon.validUntil || ''}
                    onChange={(e) => setNewCoupon(prev => ({ ...prev, validUntil: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="applicableFor">Aplicável para</Label>
                <Select value={newCoupon.applicableFor} onValueChange={(value: 'all' | 'spots' | 'itineraries' | 'events') => setNewCoupon(prev => ({ ...prev, applicableFor: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os itens</SelectItem>
                    <SelectItem value="spots">Apenas pontos turísticos</SelectItem>
                    <SelectItem value="itineraries">Apenas roteiros</SelectItem>
                    <SelectItem value="events">Apenas eventos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={newCoupon.isActive}
                  onCheckedChange={(checked) => setNewCoupon(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Cupom ativo</Label>
              </div>
              <Button onClick={handleCreateCoupon} className="w-full">
                Criar Cupom
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Ticket className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Cupons Ativos</p>
                <p className="text-2xl font-bold">{coupons.filter(c => c.isActive && new Date() <= new Date(c.validUntil)).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Usos</p>
                <p className="text-2xl font-bold">{coupons.reduce((sum, c) => sum + c.usedCount, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Expirados</p>
                <p className="text-2xl font-bold">{coupons.filter(c => new Date() > new Date(c.validUntil)).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Taxa de Uso</p>
                <p className="text-2xl font-bold">{Math.round((coupons.reduce((sum, c) => sum + c.usedCount, 0) / coupons.reduce((sum, c) => sum + (c.usageLimit || 0), 0)) * 100) || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar cupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="expired">Expirados</SelectItem>
                <SelectItem value="upcoming">Agendados</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filtros Avançados</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Cupons */}
      <div className="grid grid-cols-1 gap-4">
        {filteredCoupons.map((coupon) => (
          <Card key={coupon.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-gradient-to-r from-cerrado-500 to-pantanal-500 text-white px-3 py-1 rounded-lg font-mono font-bold">
                      {coupon.code}
                    </div>
                    <Badge className={getStatusColor(coupon)}>
                      {getStatusLabel(coupon)}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2">{coupon.description}</h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p><span className="font-medium">Desconto:</span> {coupon.type === 'percentage' ? `${coupon.value}%` : `R$ ${coupon.value}`}</p>
                      <p><span className="font-medium">Válido:</span> {new Date(coupon.validFrom).toLocaleDateString()} - {new Date(coupon.validUntil).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p><span className="font-medium">Usos:</span> {coupon.usedCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''}</p>
                      <p><span className="font-medium">Aplicável:</span> {coupon.applicableFor === 'all' ? 'Todos' : coupon.applicableFor}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>Detalhes</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Edit className="h-4 w-4" />
                    <span>Editar</span>
                  </Button>
                  <Button 
                    variant={coupon.isActive ? "secondary" : "default"} 
                    size="sm"
                    onClick={() => handleToggleStatus(coupon.id)}
                  >
                    {coupon.isActive ? 'Desativar' : 'Ativar'}
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteCoupon(coupon.id)}
                    className="flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Excluir</span>
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

export default CouponsManagement;
