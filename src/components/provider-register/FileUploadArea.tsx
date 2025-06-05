
import { Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface FileUploadAreaProps {
  label: string;
  description: string;
  required?: boolean;
}

const FileUploadArea = ({ label, description, required = false }: FileUploadAreaProps) => {
  return (
    <div>
      <Label>{label} {required && '*'}</Label>
      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-6 text-center hover:border-gray-400 transition-colors">
        <Upload className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-xs md:text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default FileUploadArea;
