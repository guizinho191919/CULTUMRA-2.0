
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminSystem } from '@/hooks/useAdminSystem';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'tourist' | 'guide';
  status: 'active' | 'pending' | 'suspended';
  phone?: string;
  location?: string;
  specialties?: string[];
  cadastur?: string;
}

interface EditUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const EditUserModal = ({ user, isOpen, onClose }: EditUserModalProps) => {
  const { updateUser } = useAdminSystem();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'tourist' as 'tourist' | 'guide',
    phone: '',
    location: '',
    specialties: '',
    cadastur: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        type: user.type || 'tourist',
        phone: user.phone || '',
        location: user.location || '',
        specialties: user.specialties ? user.specialties.join(', ') : '',
        cadastur: user.cadastur || ''
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    const userData = {
      ...formData,
      specialties: formData.type === 'guide' && formData.specialties 
        ? formData.specialties.split(',').map(s => s.trim()) 
        : undefined,
      cadastur: formData.type === 'guide' ? formData.cadastur : undefined
    };
    
    updateUser(user.id, userData);
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Digite o nome completo"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@exemplo.com"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="type">Tipo de Usuário</Label>
            <Select value={formData.type} onValueChange={(value: 'tourist' | 'guide') => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tourist">Turista</SelectItem>
                <SelectItem value="guide">Guia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(65) 99999-9999"
            />
          </div>
          
          <div>
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Cidade, Estado"
            />
          </div>
          
          {formData.type === 'guide' && (
            <>
              <div>
                <Label htmlFor="cadastur">Número CADASTUR</Label>
                <Input
                  id="cadastur"
                  value={formData.cadastur}
                  onChange={(e) => setFormData({ ...formData, cadastur: e.target.value })}
                  placeholder="12.345.678.90-1"
                />
              </div>
              
              <div>
                <Label htmlFor="specialties">Especialidades (separadas por vírgula)</Label>
                <Input
                  id="specialties"
                  value={formData.specialties}
                  onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                  placeholder="Pantanal, Pesca, Observação de aves"
                />
              </div>
            </>
          )}
          
          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
