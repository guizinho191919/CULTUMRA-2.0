import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const GuideDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Estado para formulário de perfil
  const [profile, setProfile] = useState({
    name: user?.name || '',
    description: '',
    languages: [],
    specialties: [],
    pricePerHour: 0,
    location: '',
    cadasturId: ''
  });
  
  // Estado para disponibilidade no calendário
  const [availability, setAvailability] = useState([]);
  
  // Estado para regiões atendidas
  const [regions, setRegions] = useState([]);
  
  // Dados mockados para demonstração
  const mockStats = {
    totalServices: 24,
    averageRating: 4.8,
    upcomingAppointments: 3,
    pendingRequests: 2
  };
  
  const mockReviews = [
    { id: '1', userName: 'Maria Silva', rating: 5, comment: 'Excelente guia! Conhece muito bem a região do Pantanal.', date: '2023-10-15' },
    { id: '2', userName: 'João Pereira', rating: 4, comment: 'Ótima experiência na Chapada dos Guimarães.', date: '2023-09-22' }
  ];
  
  const mockChats = [
    { id: '1', userName: 'Carlos Mendes', lastMessage: 'Olá, gostaria de saber sobre disponibilidade para o próximo final de semana.', time: '14:30' },
    { id: '2', userName: 'Ana Beatriz', lastMessage: 'Obrigada pelas informações!', time: '09:15' }
  ];
  
  const handleSaveProfile = () => {
    toast({
      title: 'Perfil atualizado',
      description: 'Suas informações foram salvas com sucesso!',
      variant: 'default',
    });
  };
  
  const handleAddRegion = (region) => {
    setRegions([...regions, region]);
  };
  
  const handleRemoveRegion = (regionId) => {
    setRegions(regions.filter(r => r.id !== regionId));
  };
  
  // Adicionar estas funções
  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
    navigate('/');
  };

  const handleGoHome = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-24">
        {/* Cabeçalho de Boas-vindas */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-pantanal-600 flex items-center justify-center text-white text-xl font-bold">
              {user?.name?.charAt(0) || 'G'}
            </div>
            <div>
              <h1 className="text-2xl font-bold">Olá, {user?.name || 'Guia'}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-200">
                  CADASTUR Verificado
                </Badge>
                <span className="text-sm text-gray-500">ID: {profile.cadasturId || 'MT-12345678'}</span>
              </div>
            </div>
          </div>
          

          <div className="flex gap-2">
            {/* Os botões de Mensagens e Agenda foram removidos */}
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-cerrado-50 hover:bg-cerrado-100 text-cerrado-700"
              onClick={handleGoHome}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              Página Inicial
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700"
              onClick={handleLogout}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Sair
            </Button>
          </div>
        </div>
        
        {/* Resumo Rápido (Dashboard Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total de Atendimentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalServices}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Avaliação Média</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <span className="text-2xl font-bold mr-2">{mockStats.averageRating}</span>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={i < Math.floor(mockStats.averageRating) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Próximos Agendamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.upcomingAppointments}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pedidos Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.pendingRequests}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Abas para diferentes seções */}
        <Tabs defaultValue="profile" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mb-4">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="regions">Regiões Atendidas</TabsTrigger>
            <TabsTrigger value="calendar">Agenda</TabsTrigger>
            <TabsTrigger value="reviews">Avaliações</TabsTrigger>
            <TabsTrigger value="chats">Conversas</TabsTrigger>
          </TabsList>
          
          {/* Conteúdo da aba Perfil */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nome Completo</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-md" 
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Número CADASTUR</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-md" 
                        value={profile.cadasturId}
                        onChange={(e) => setProfile({...profile, cadasturId: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Descrição/Bio</label>
                      <textarea 
                        className="w-full p-2 border rounded-md min-h-[100px]" 
                        value={profile.description}
                        onChange={(e) => setProfile({...profile, description: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Idiomas</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Português</option>
                        <option>Inglês</option>
                        <option>Espanhol</option>
                        <option>Francês</option>
                      </select>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge>Português</Badge>
                        <Badge>Inglês</Badge>
                        <Button variant="outline" size="sm" className="h-6">+ Adicionar</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Especialidades</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Ecoturismo</option>
                        <option>Turismo Cultural</option>
                        <option>Turismo de Aventura</option>
                        <option>Observação de Fauna</option>
                      </select>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge>Ecoturismo</Badge>
                        <Badge>Observação de Fauna</Badge>
                        <Button variant="outline" size="sm" className="h-6">+ Adicionar</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Preço por Hora (R$)</label>
                      <input 
                        type="number" 
                        className="w-full p-2 border rounded-md" 
                        value={profile.pricePerHour}
                        onChange={(e) => setProfile({...profile, pricePerHour: Number(e.target.value)})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Localização Principal</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-md" 
                        value={profile.location}
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                        placeholder="Ex: Cuiabá, MT"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Foto de Perfil</label>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-full bg-pantanal-600 flex items-center justify-center text-white text-3xl font-bold">
                          {user?.name?.charAt(0) || 'G'}
                        </div>
                        <Button variant="outline">Alterar Imagem</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancelar</Button>
                    <Button type="submit" className="bg-pantanal-600 hover:bg-pantanal-700">Salvar Alterações</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Conteúdo da aba Regiões Atendidas */}
          <TabsContent value="regions">
            <Card>
              <CardHeader>
                <CardTitle>Regiões e Pontos Turísticos Atendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-md" 
                        placeholder="Buscar pontos turísticos..."
                      />
                    </div>
                    <div>
                      <select className="w-full p-2 border rounded-md">
                        <option value="">Todas as categorias</option>
                        <option value="natureza">Natureza</option>
                        <option value="aventura">Aventura</option>
                        <option value="cultura">Cultura</option>
                        <option value="historia">História</option>
                      </select>
                    </div>
                    <Button className="bg-pantanal-600 hover:bg-pantanal-700">Adicionar</Button>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Pontos Turísticos Selecionados</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">Pantanal Norte</span>
                          <div className="flex gap-1 mt-1">
                            <Badge variant="outline" className="text-xs">Natureza</Badge>
                            <Badge variant="outline" className="text-xs">Aventura</Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">Chapada dos Guimarães</span>
                          <div className="flex gap-1 mt-1">
                            <Badge variant="outline" className="text-xs">Natureza</Badge>
                            <Badge variant="outline" className="text-xs">Aventura</Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Conteúdo da aba Agenda */}
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Agenda</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-4">Disponibilidade</h3>
                    <Calendar 
                      mode="single"
                      className="rounded-md border"
                    />
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                        <span className="text-sm">Disponível</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-red-500"></div>
                        <span className="text-sm">Indisponível</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                        <span className="text-sm">Agendado</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4">Próximos Agendamentos</h3>
                    <div className="space-y-3">
                      <div className="border rounded-md p-3">
                        <div className="flex justify-between">
                          <span className="font-medium">Visita ao Pantanal</span>
                          <Badge>Confirmado</Badge>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Cliente: Maria Silva</div>
                        <div className="flex items-center gap-2 text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                          <span>15/11/2023</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                          <span>08:00 - 12:00</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm">Ver Detalhes</Button>
                          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">Cancelar</Button>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <div className="flex justify-between">
                          <span className="font-medium">Chapada dos Guimarães</span>
                          <Badge variant="outline">Pendente</Badge>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Cliente: João Pereira</div>
                        <div className="flex items-center gap-2 text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                          <span>20/11/2023</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                          <span>09:00 - 15:00</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" className="bg-pantanal-600 hover:bg-pantanal-700">Confirmar</Button>
                          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">Recusar</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Conteúdo da aba Avaliações */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Avaliações Recebidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReviews.map(review => (
                    <div key={review.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{review.userName}</div>
                          <div className="text-sm text-gray-500">{review.date}</div>
                        </div>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Conteúdo da aba Conversas */}
          <TabsContent value="chats">
            <Card>
              <CardHeader>
                <CardTitle>Conversas com Turistas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockChats.map(chat => (
                    <div key={chat.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div className="font-medium">{chat.userName}</div>
                        <div className="text-sm text-gray-500">{chat.time}</div>
                      </div>
                      <p className="mt-2 text-gray-700 truncate">{chat.lastMessage}</p>
                      <Button 
                        className="mt-3 bg-pantanal-600 hover:bg-pantanal-700"
                        onClick={() => navigate(`/chat/${chat.id}`)}
                      >
                        Responder
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Navigation />
    </div>
  );
};

export default GuideDashboard;