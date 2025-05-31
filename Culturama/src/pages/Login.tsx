
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AUTH_EVENT } from '../App';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Obter o estado de redirecionamento, se existir
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    // Simular login
    setTimeout(() => {
      if (email && password) {
        localStorage.setItem('user', JSON.stringify({ email, name: 'Usuário', photoUrl: null }));
        
        // Disparar evento de autenticação
        window.dispatchEvent(new Event(AUTH_EVENT));
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao Mato Grosso Guide",
        });
        
        // Redirecionar para a página anterior ou para a página inicial
        navigate(from, { replace: true });
      } else {
        toast({
          title: "Erro no login",
          description: "Verifique suas credenciais",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cerrado-50 to-pantanal-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cerrado-500 to-pantanal-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">MT</span>
          </div>
          <CardTitle className="text-2xl gradient-text">Bem-vindo</CardTitle>
          <CardDescription>
            Entre na sua conta para explorar o melhor de Mato Grosso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Não tem uma conta? </span>
            <Link to="/register" className="text-cerrado-600 hover:underline font-medium">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
