
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAdminSystem } from '@/hooks/useAdminSystem';

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'spot' | 'itinerary' | 'event';
}

const CreateItemModal = ({ isOpen, onClose, type }: CreateItemModalProps) => {
  const { createSpot, createItinerary, createEvent, users } = useAdminSystem();
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    location: '',
    price: '',
    category: '',
    duration: '',
    date: '',
    time: '',
    maxParticipants: '',
    guideId: '',
    featured: false
  });

  const guides = users.filter(user => user.type === 'guide');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const baseData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      maxParticipants: parseInt(formData.maxParticipants) || 10
    };

    if (type === 'spot') {
      createSpot({
        name: formData.name,
        description: formData.description,
        location: formData.location,
        price: baseData.price,
        category: formData.category || 'Natureza',
        featured: formData.featured
      });
    } else if (type === 'itinerary') {
      const guide = guides.find(g => g.id === formData.guideId);
      createItinerary({
        name: formData.name,
        description: formData.description,
        duration: formData.duration,
        price: baseData.price,
        guideId: formData.guideId,
        guideName: guide?.name || '',
        maxParticipants: baseData.maxParticipants,
        featured: formData.featured
      });
    } else if (type === 'event') {
      createEvent({
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        price: baseData.price,
        maxParticipants: baseData.maxParticipants,
        category: formData.category || 'Cultural',
        featured: formData.featured
      });
    }
    
    setFormData({
      name: '',
      title: '',
      description: '',
      location: '',
      price: '',
      category: '',
      duration: '',
      date: '',
      time: '',
      maxParticipants: '',
      guideId: '',
      featured: false
    });
    
    onClose();
  };

  const getTitle = () => {
    switch (type) {
      case 'spot': return 'Criar Ponto Turístico';
      case 'itinerary': return 'Criar Roteiro';
      case 'event': return 'Criar Evento';
      default: return 'Criar Item';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor={type === 'event' ? 'title' : 'name'}>
              {type === 'event' ? 'Título' : 'Nome'}
            </Label>
            <Input
              id={type === 'event' ? 'title' : 'name'}
              value={type === 'event' ? formData.title : formData.name}
              onChange={(e) => setFormData({ 
                ...formData, 
                [type === 'event' ? 'title' : 'name']: e.target.value 
              })}
              placeholder={`Digite o ${type === 'event' ? 'título' : 'nome'}`}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição detalhada"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Cidade, Estado"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
            
            {type !== 'spot' && (
              <div>
                <Label htmlFor="maxParticipants">Máx. Participantes</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                  placeholder="10"
                  min="1"
                  required
                />
              </div>
            )}
          </div>
          
          {type === 'itinerary' && (
            <>
              <div>
                <Label htmlFor="duration">Duração</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="3 dias, 2 horas, etc."
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="guideId">Guia Responsável</Label>
                <Select value={formData.guideId} onValueChange={(value) => setFormData({ ...formData, guideId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um guia" />
                  </SelectTrigger>
                  <SelectContent>
                    {guides.map((guide) => (
                      <SelectItem key={guide.id} value={guide.id}>
                        {guide.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          
          {type === 'event' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="time">Horário</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>
            </div>
          )}
          
          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {type === 'spot' && (
                  <>
                    <SelectItem value="Natureza">Natureza</SelectItem>
                    <SelectItem value="Cultural">Cultural</SelectItem>
                    <SelectItem value="Aventura">Aventura</SelectItem>
                    <SelectItem value="Histórico">Histórico</SelectItem>
                  </>
                )}
                {(type === 'event' || type === 'itinerary') && (
                  <>
                    <SelectItem value="Cultural">Cultural</SelectItem>
                    <SelectItem value="Aventura">Aventura</SelectItem>
                    <SelectItem value="Gastronomia">Gastronomia</SelectItem>
                    <SelectItem value="Música">Música</SelectItem>
                    <SelectItem value="Esportes">Esportes</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
            />
            <Label htmlFor="featured">Destacar na página inicial</Label>
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Criar {type === 'spot' ? 'Ponto Turístico' : type === 'itinerary' ? 'Roteiro' : 'Evento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateItemModal;
