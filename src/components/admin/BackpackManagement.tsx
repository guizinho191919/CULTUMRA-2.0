
import { useToast } from '@/hooks/use-toast';
import BackpackStats from './backpack/BackpackStats';
import BackpackFilters from './backpack/BackpackFilters';
import BackpackItem from './backpack/BackpackItem';
import { useBackpackData } from '@/hooks/useBackpackData';
import { useAdminSystem } from '@/hooks/useAdminSystem';

const BackpackManagement = () => {
  const { toast } = useToast();
  const { loadAllData } = useAdminSystem();
  const {
    backpacks,
    filteredBackpacks,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    deleteBackpack
  } = useBackpackData();

  const handleDeleteBackpack = (backpackId: string) => {
    deleteBackpack(backpackId);
    loadAllData(); // Atualiza todos os dados do sistema
    toast({
      title: "Mochila removida",
      description: "A mochila foi removida com sucesso."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Gestão de Mochilas</h1>
          <p className="text-gray-600">Visualize e gerencie todas as mochilas dos usuários</p>
        </div>
      </div>

      <BackpackStats backpacks={backpacks} />

      <BackpackFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <div className="grid grid-cols-1 gap-4">
        {filteredBackpacks.map((backpack) => (
          <BackpackItem
            key={backpack.id}
            backpack={backpack}
            onDelete={handleDeleteBackpack}
          />
        ))}
      </div>
    </div>
  );
};

export default BackpackManagement;
