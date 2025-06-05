import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import FileUploadArea from './FileUploadArea';
import EstablishmentSchedule from './EstablishmentSchedule';

interface EstablishmentData {
  tradeName: string;
  cnpj: string;
  stateRegistration: string;
  category: string;
  description: string;
  email: string;
  phone: string;
  website: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  schedule: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  observations: string;
}

interface EstablishmentFormProps {
  data: EstablishmentData;
  onChange: (data: EstablishmentData) => void;
}

const EstablishmentForm = ({ data, onChange }: EstablishmentFormProps) => {
  const categories = [
    {
      value: 'centro-cultural-espaco-multicultural',
      label: 'Centro Cultural / Espaço Multicultural',
      description: 'Espaços que oferecem múltiplas atividades culturais, como exposições, oficinas, apresentações artísticas e eventos comunitários.'
    },
    {
      value: 'museu-memorial-regional',
      label: 'Museu / Memorial Regional',
      description: 'Instituições que preservam e exibem o patrimônio histórico e cultural da região.'
    },
    {
      value: 'biblioteca-comunitaria-popular',
      label: 'Biblioteca Comunitária / Popular',
      description: 'Locais que promovem o acesso à leitura e atividades culturais.'
    },
    {
      value: 'cineclube-cinema-cultural',
      label: 'Cineclube / Cinema Cultural',
      description: 'Espaços dedicados à exibição de filmes com enfoque cultural e educativo.'
    },
    {
      value: 'patrimonio-historico-visitacao',
      label: 'Patrimônio Histórico com Visitação',
      description: 'Edificações ou locais tombados que estão abertos à visitação pública.'
    },
    {
      value: 'mercado-cultural-feira-tradicional',
      label: 'Mercado Cultural / Feira Tradicional Regional',
      description: 'Locais que combinam comércio e manifestações culturais, como a Feira do Porto.'
    },
    {
      value: 'restaurante-comida-tipica-regional',
      label: 'Restaurante de Comida Típica / Regional',
      description: 'Estabelecimentos que servem pratos tradicionais da região, promovendo a culinária local.'
    },
    {
      value: 'restaurante-tematico-cultural',
      label: 'Restaurante Temático Cultural',
      description: 'Restaurantes com decoração e cardápio inspirados em temas culturais específicos.'
    },
    {
      value: 'associacao-instituto-cultural',
      label: 'Associação ou Instituto Cultural Local',
      description: 'Organizações que desenvolvem projetos culturais contínuos na comunidade.'
    },
    {
      value: 'hotel-pousada-atividades-culturais',
      label: 'Hotel / Pousada com Atividades Culturais e Ambientais',
      description: 'Estabelecimentos que oferecem hospedagem integrada a experiências culturais e ambientais, como trilhas, passeios ecológicos e oficinas culturais.'
    },
    {
      value: 'espaco-lazer-tematica-cultural',
      label: 'Espaço de Lazer com Temática Cultural',
      description: 'Locais que combinam lazer e cultura, proporcionando experiências educativas e recreativas.'
    },
    {
      value: 'outro',
      label: 'Outro (especifique)',
      description: 'Categoria para espaços que não se enquadram nas anteriores, permitindo especificação adicional.'
    }
  ];

  const updateData = (field: keyof EstablishmentData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6 border-t pt-6">
      <h3 className="text-lg font-semibold text-cerrado-800">Dados do Estabelecimento</h3>
      
      {/* Business Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tradeName">Nome comercial *</Label>
          <Input
            id="tradeName"
            value={data.tradeName}
            onChange={(e) => updateData('tradeName', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="cnpj">CNPJ *</Label>
          <Input
            id="cnpj"
            value={data.cnpj}
            onChange={(e) => updateData('cnpj', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="stateRegistration">Inscrição estadual/municipal</Label>
          <Input
            id="stateRegistration"
            value={data.stateRegistration}
            onChange={(e) => updateData('stateRegistration', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="category">Categoria *</Label>
          <TooltipProvider>
            <Select value={data.category} onValueChange={(value) => updateData('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <Tooltip key={category.value}>
                    <TooltipTrigger asChild>
                      <SelectItem value={category.value}>
                        {category.label}
                      </SelectItem>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p>{category.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </SelectContent>
            </Select>
          </TooltipProvider>
        </div>
      </div>

      <div>
        <Label htmlFor="establishmentDescription">Descrição da empresa *</Label>
        <Textarea
          id="establishmentDescription"
          value={data.description}
          onChange={(e) => updateData('description', e.target.value)}
          placeholder="Descreva seu estabelecimento, serviços oferecidos, diferenciais..."
          required
          className="min-h-[100px]"
        />
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="establishmentEmail">E-mail *</Label>
          <Input
            id="establishmentEmail"
            type="email"
            value={data.email}
            onChange={(e) => updateData('email', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="establishmentPhone">Telefone comercial *</Label>
          <Input
            id="establishmentPhone"
            value={data.phone}
            onChange={(e) => updateData('phone', e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="website">Website ou rede social</Label>
        <Input
          id="website"
          value={data.website}
          onChange={(e) => updateData('website', e.target.value)}
          placeholder="https://"
        />
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h4 className="font-semibold text-cerrado-700">Localização</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="cep">CEP *</Label>
            <Input
              id="cep"
              value={data.cep}
              onChange={(e) => updateData('cep', e.target.value)}
              required
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="street">Rua *</Label>
            <Input
              id="street"
              value={data.street}
              onChange={(e) => updateData('street', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="number">Número *</Label>
            <Input
              id="number"
              value={data.number}
              onChange={(e) => updateData('number', e.target.value)}
              required
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="complement">Complemento</Label>
            <Input
              id="complement"
              value={data.complement}
              onChange={(e) => updateData('complement', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="neighborhood">Bairro *</Label>
            <Input
              id="neighborhood"
              value={data.neighborhood}
              onChange={(e) => updateData('neighborhood', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="city">Cidade *</Label>
            <Input
              id="city"
              value={data.city}
              onChange={(e) => updateData('city', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="state">Estado *</Label>
            <Input
              id="state"
              value={data.state}
              onChange={(e) => updateData('state', e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Schedule */}
      <EstablishmentSchedule
        schedule={data.schedule}
        onScheduleChange={(schedule) => updateData('schedule', schedule)}
      />

      <div>
        <Label htmlFor="observations">Observações</Label>
        <Textarea
          id="observations"
          value={data.observations}
          onChange={(e) => updateData('observations', e.target.value)}
          placeholder="Ex: Fechado em feriados, atendimento apenas com reserva, etc."
          className="min-h-[80px]"
        />
      </div>

      {/* File Uploads */}
      <div className="space-y-4">
        <FileUploadArea
          label="Alvará de funcionamento"
          description="Clique para enviar PDF ou imagem"
          required
        />
        
        <FileUploadArea
          label="Logo da empresa"
          description="Clique para enviar logo"
        />
        
        <FileUploadArea
          label="Fotos do local"
          description="Clique para enviar fotos (múltiplas)"
        />
      </div>
    </div>
  );
};

export default EstablishmentForm;
