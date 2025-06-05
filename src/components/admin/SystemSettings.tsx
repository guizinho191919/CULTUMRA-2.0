
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, Palette, Globe, Shield, Bell, 
  Database, Mail, CreditCard, Users, Save
} from 'lucide-react';

interface SystemConfig {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    supportPhone: string;
    currency: string;
    timezone: string;
    language: string;
  };
  appearance: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string;
    faviconUrl: string;
    enableDarkMode: boolean;
  };
  features: {
    enableEvents: boolean;
    enableCoupons: boolean;
    enableReviews: boolean;
    enableChat: boolean;
    enableWallet: boolean;
    enableNotifications: boolean;
  };
  payments: {
    enablePix: boolean;
    enableCreditCard: boolean;
    enableWallet: boolean;
    pixKey: string;
    stripePublishableKey: string;
    paymentTimeout: number;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    reservationReminders: boolean;
    paymentAlerts: boolean;
    marketingEmails: boolean;
  };
  security: {
    requireEmailVerification: boolean;
    enableTwoFactor: boolean;
    passwordMinLength: number;
    sessionTimeout: number;
    maxLoginAttempts: number;
  };
}

const SystemSettings = () => {
  const [config, setConfig] = useState<SystemConfig>({
    general: {
      siteName: 'Mato Grosso Guide',
      siteDescription: 'Descubra as belezas naturais de Mato Grosso',
      contactEmail: 'contato@matogrossoguide.com',
      supportPhone: '+55 65 99999-9999',
      currency: 'BRL',
      timezone: 'America/Cuiaba',
      language: 'pt-BR'
    },
    appearance: {
      primaryColor: '#059669',
      secondaryColor: '#0891b2',
      logoUrl: '',
      faviconUrl: '',
      enableDarkMode: false
    },
    features: {
      enableEvents: true,
      enableCoupons: true,
      enableReviews: true,
      enableChat: true,
      enableWallet: true,
      enableNotifications: true
    },
    payments: {
      enablePix: true,
      enableCreditCard: true,
      enableWallet: true,
      pixKey: '',
      stripePublishableKey: '',
      paymentTimeout: 30
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      reservationReminders: true,
      paymentAlerts: true,
      marketingEmails: false
    },
    security: {
      requireEmailVerification: true,
      enableTwoFactor: false,
      passwordMinLength: 8,
      sessionTimeout: 60,
      maxLoginAttempts: 5
    }
  });

  const { toast } = useToast();

  const handleSave = () => {
    // Aqui seria feita a persistência das configurações
    localStorage.setItem('systemConfig', JSON.stringify(config));
    
    toast({
      title: "Configurações salvas",
      description: "As configurações do sistema foram atualizadas com sucesso."
    });
  };

  const updateConfig = (section: keyof SystemConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Configurações do Sistema</h1>
          <p className="text-gray-600">Gerencie todas as configurações da plataforma</p>
        </div>
        <Button onClick={handleSave} className="flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Salvar Configurações</span>
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Geral</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span>Aparência</span>
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Funcionalidades</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Pagamentos</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Segurança</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Nome do Site</Label>
                  <Input
                    id="siteName"
                    value={config.general.siteName}
                    onChange={(e) => updateConfig('general', 'siteName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Email de Contato</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={config.general.contactEmail}
                    onChange={(e) => updateConfig('general', 'contactEmail', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="supportPhone">Telefone de Suporte</Label>
                  <Input
                    id="supportPhone"
                    value={config.general.supportPhone}
                    onChange={(e) => updateConfig('general', 'supportPhone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Moeda</Label>
                  <Select value={config.general.currency} onValueChange={(value) => updateConfig('general', 'currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real (BRL)</SelectItem>
                      <SelectItem value="USD">Dólar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="siteDescription">Descrição do Site</Label>
                <Textarea
                  id="siteDescription"
                  value={config.general.siteDescription}
                  onChange={(e) => updateConfig('general', 'siteDescription', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Aparência</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Cor Primária</Label>
                  <Input
                    id="primaryColor"
                    type="color"
                    value={config.appearance.primaryColor}
                    onChange={(e) => updateConfig('appearance', 'primaryColor', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="secondaryColor">Cor Secundária</Label>
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={config.appearance.secondaryColor}
                    onChange={(e) => updateConfig('appearance', 'secondaryColor', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="logoUrl">URL do Logo</Label>
                  <Input
                    id="logoUrl"
                    value={config.appearance.logoUrl}
                    onChange={(e) => updateConfig('appearance', 'logoUrl', e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div>
                  <Label htmlFor="faviconUrl">URL do Favicon</Label>
                  <Input
                    id="faviconUrl"
                    value={config.appearance.faviconUrl}
                    onChange={(e) => updateConfig('appearance', 'faviconUrl', e.target.value)}
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableDarkMode"
                  checked={config.appearance.enableDarkMode}
                  onCheckedChange={(checked) => updateConfig('appearance', 'enableDarkMode', checked)}
                />
                <Label htmlFor="enableDarkMode">Habilitar modo escuro</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Funcionalidades da Plataforma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(config.features).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Switch
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) => updateConfig('features', key, checked)}
                    />
                    <Label htmlFor={key}>
                      {key === 'enableEvents' && 'Habilitar Eventos'}
                      {key === 'enableCoupons' && 'Habilitar Cupons'}
                      {key === 'enableReviews' && 'Habilitar Avaliações'}
                      {key === 'enableChat' && 'Habilitar Chat'}
                      {key === 'enableWallet' && 'Habilitar Carteira'}
                      {key === 'enableNotifications' && 'Habilitar Notificações'}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enablePix"
                    checked={config.payments.enablePix}
                    onCheckedChange={(checked) => updateConfig('payments', 'enablePix', checked)}
                  />
                  <Label htmlFor="enablePix">Habilitar PIX</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableCreditCard"
                    checked={config.payments.enableCreditCard}
                    onCheckedChange={(checked) => updateConfig('payments', 'enableCreditCard', checked)}
                  />
                  <Label htmlFor="enableCreditCard">Habilitar Cartão de Crédito</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableWalletPayment"
                    checked={config.payments.enableWallet}
                    onCheckedChange={(checked) => updateConfig('payments', 'enableWallet', checked)}
                  />
                  <Label htmlFor="enableWalletPayment">Habilitar Pagamento via Carteira</Label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pixKey">Chave PIX</Label>
                  <Input
                    id="pixKey"
                    value={config.payments.pixKey}
                    onChange={(e) => updateConfig('payments', 'pixKey', e.target.value)}
                    placeholder="sua-chave-pix@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="stripeKey">Chave Pública Stripe</Label>
                  <Input
                    id="stripeKey"
                    value={config.payments.stripePublishableKey}
                    onChange={(e) => updateConfig('payments', 'stripePublishableKey', e.target.value)}
                    placeholder="pk_test_..."
                  />
                </div>
                <div>
                  <Label htmlFor="paymentTimeout">Timeout de Pagamento (minutos)</Label>
                  <Input
                    id="paymentTimeout"
                    type="number"
                    value={config.payments.paymentTimeout}
                    onChange={(e) => updateConfig('payments', 'paymentTimeout', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(config.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Switch
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) => updateConfig('notifications', key, checked)}
                    />
                    <Label htmlFor={key}>
                      {key === 'emailEnabled' && 'Notificações por Email'}
                      {key === 'smsEnabled' && 'Notificações por SMS'}
                      {key === 'pushEnabled' && 'Notificações Push'}
                      {key === 'reservationReminders' && 'Lembretes de Reserva'}
                      {key === 'paymentAlerts' && 'Alertas de Pagamento'}
                      {key === 'marketingEmails' && 'Emails de Marketing'}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="passwordMinLength">Tamanho mínimo da senha</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={config.security.passwordMinLength}
                    onChange={(e) => updateConfig('security', 'passwordMinLength', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="sessionTimeout">Timeout de sessão (minutos)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={config.security.sessionTimeout}
                    onChange={(e) => updateConfig('security', 'sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxLoginAttempts">Máximo de tentativas de login</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={config.security.maxLoginAttempts}
                    onChange={(e) => updateConfig('security', 'maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="requireEmailVerification"
                    checked={config.security.requireEmailVerification}
                    onCheckedChange={(checked) => updateConfig('security', 'requireEmailVerification', checked)}
                  />
                  <Label htmlFor="requireEmailVerification">Requerer verificação de email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableTwoFactor"
                    checked={config.security.enableTwoFactor}
                    onCheckedChange={(checked) => updateConfig('security', 'enableTwoFactor', checked)}
                  />
                  <Label htmlFor="enableTwoFactor">Habilitar autenticação de dois fatores</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;
