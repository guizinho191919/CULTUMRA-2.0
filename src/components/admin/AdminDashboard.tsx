
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/hooks/useAdmin';
import { 
  Users, Calendar, CreditCard, Backpack, TrendingUp, 
  AlertTriangle, CheckCircle, Clock, Bell 
} from 'lucide-react';

const AdminDashboard = () => {
  const { stats, alerts, markAlertAsRead, refreshStats } = useAdmin();

  const kpiCards = [
    {
      title: 'Total de Reservas',
      value: stats.totalReservations,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Receita Total',
      value: `R$ ${stats.totalRevenue.toFixed(2)}`,
      icon: CreditCard,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Novos Usuários',
      value: stats.newUsers,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Mochilas Ativas',
      value: stats.totalBackpacks,
      icon: Backpack,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const statusCards = [
    {
      title: 'Reservas Confirmadas',
      value: stats.confirmedReservations,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Reservas Pendentes',
      value: stats.pendingReservations,
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Novos Guias',
      value: stats.newGuides,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Cupons Ativos',
      value: stats.activeCoupons,
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard Administrativo</h1>
          <p className="text-gray-600">Visão geral do sistema Mato Grosso Guide</p>
        </div>
        <Button onClick={refreshStats} className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4" />
          <span>Atualizar</span>
        </Button>
      </div>

      {/* Alerts */}
      {alerts.filter(a => !a.isRead).length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-700">
              <Bell className="h-5 w-5" />
              <span>Alertas do Sistema</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.filter(a => !a.isRead).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className={`h-4 w-4 ${
                      alert.type === 'error' ? 'text-red-500' :
                      alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                    }`} />
                    <div>
                      <h4 className="font-medium">{alert.title}</h4>
                      <p className="text-sm text-gray-600">{alert.message}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => markAlertAsRead(alert.id)}
                  >
                    Marcar como lido
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${kpi.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statusCards.map((status, index) => {
          const IconComponent = status.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <IconComponent className={`h-5 w-5 ${status.color}`} />
                  <div>
                    <p className="text-sm text-gray-600">{status.title}</p>
                    <p className="text-xl font-bold">{status.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <h4 className="font-medium">Aprovar Roteiros</h4>
                <p className="text-sm text-gray-600">Revisar novos roteiros pendentes</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <h4 className="font-medium">Moderar Avaliações</h4>
                <p className="text-sm text-gray-600">Verificar avaliações reportadas</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <h4 className="font-medium">Relatório Financeiro</h4>
                <p className="text-sm text-gray-600">Gerar relatório do período</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
