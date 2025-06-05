
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FileUploadArea from './FileUploadArea';

interface GuideData {
  fullName: string;
  cpf: string;
  birthDate: string;
  gender: string;
  email: string;
  phone: string;
  cadastur: string;
  cadasturValidity: string;
  languages: string[];
  serviceArea: string;
  serviceDescription: string;
}

interface GuideFormProps {
  data: GuideData;
  onChange: (data: GuideData) => void;
}

const GuideForm = ({ data, onChange }: GuideFormProps) => {
  const updateData = (field: keyof GuideData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6 border-t pt-6">
      <h3 className="text-lg font-semibold text-cerrado-800">Dados do Guia Turístico</h3>
      
      {/* Personal Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Nome completo *</Label>
          <Input
            id="fullName"
            value={data.fullName}
            onChange={(e) => updateData('fullName', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="cpf">CPF *</Label>
          <Input
            id="cpf"
            value={data.cpf}
            onChange={(e) => updateData('cpf', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="birthDate">Data de nascimento *</Label>
          <Input
            id="birthDate"
            type="date"
            value={data.birthDate}
            onChange={(e) => updateData('birthDate', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="gender">Gênero</Label>
          <Select onValueChange={(value) => updateData('gender', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="masculino">Masculino</SelectItem>
              <SelectItem value="feminino">Feminino</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
              <SelectItem value="prefiro-nao-informar">Prefiro não informar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="guideEmail">E-mail *</Label>
          <Input
            id="guideEmail"
            type="email"
            value={data.email}
            onChange={(e) => updateData('email', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="guidePhone">Telefone com DDD *</Label>
          <Input
            id="guidePhone"
            value={data.phone}
            onChange={(e) => updateData('phone', e.target.value)}
            placeholder="(65) 99999-9999"
            required
          />
        </div>
      </div>

      {/* Professional Registration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cadastur">Número do Cadastur *</Label>
          <Input
            id="cadastur"
            value={data.cadastur}
            onChange={(e) => updateData('cadastur', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="cadasturValidity">Validade do Cadastur *</Label>
          <Input
            id="cadasturValidity"
            type="date"
            value={data.cadasturValidity}
            onChange={(e) => updateData('cadasturValidity', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Services */}
      <div>
        <Label htmlFor="serviceArea">Cidade(s) ou região de atuação *</Label>
        <Input
          id="serviceArea"
          value={data.serviceArea}
          onChange={(e) => updateData('serviceArea', e.target.value)}
          placeholder="Ex: Cuiabá, Chapada dos Guimarães, Pantanal"
          required
        />
      </div>

      <div>
        <Label htmlFor="serviceDescription">Descrição dos serviços *</Label>
        <Textarea
          id="serviceDescription"
          value={data.serviceDescription}
          onChange={(e) => updateData('serviceDescription', e.target.value)}
          placeholder="Descreva os tipos de passeios e serviços que você oferece..."
          required
          className="min-h-[100px]"
        />
      </div>

      {/* File Uploads */}
      <div className="space-y-4">
        <FileUploadArea
          label="Comprovante do Cadastur"
          description="Clique para enviar PDF ou imagem"
          required
        />
        
        <FileUploadArea
          label="Foto de perfil"
          description="Clique para enviar foto"
        />
      </div>
    </div>
  );
};

export default GuideForm;
