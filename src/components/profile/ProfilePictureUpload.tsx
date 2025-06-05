
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Camera } from 'lucide-react';

const ProfilePictureUpload = () => {
  const { user, updateProfilePicture } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // Converter para base64 para demonstração (em produção seria upload real)
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      updateProfilePicture(dataUrl);
      setIsUploading(false);
      toast({
        title: "Sucesso!",
        description: "Foto de perfil atualizada com sucesso.",
      });
    };
    reader.onerror = () => {
      setIsUploading(false);
      toast({
        title: "Erro",
        description: "Erro ao processar a imagem.",
        variant: "destructive",
      });
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeProfilePicture = () => {
    updateProfilePicture('');
    toast({
      title: "Foto removida",
      description: "Foto de perfil removida com sucesso.",
    });
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="w-24 h-24">
          {user?.profilePicture ? (
            <AvatarImage src={user.profilePicture} alt={user.name} />
          ) : null}
          <AvatarFallback className="bg-gradient-to-br from-cerrado-400 to-pantanal-400 text-white font-bold text-2xl">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        
        {/* Ícone de câmera no canto direito */}
        <button
          onClick={triggerFileSelect}
          disabled={isUploading}
          className="absolute -bottom-1 -right-1 w-8 h-8 bg-cerrado-500 hover:bg-cerrado-600 rounded-full flex items-center justify-center transition-colors shadow-lg disabled:opacity-50"
        >
          <Camera className="w-4 h-4 text-white" />
        </button>
      </div>

      {user?.profilePicture && (
        <Button 
          variant="outline" 
          onClick={removeProfilePicture}
          disabled={isUploading}
          size="sm"
        >
          Remover foto
        </Button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ProfilePictureUpload;
