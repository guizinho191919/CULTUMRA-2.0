
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAdminSystem } from '@/hooks/useAdminSystem';
import CreateUserModal from './modals/CreateUserModal';
import UserDetailsModal from './modals/UserDetailsModal';
import EditUserModal from './modals/EditUserModal';
import UserStatistics from './users/UserStatistics';
import UserFilters from './users/UserFilters';
import UserCard from './users/UserCard';
import { UserPlus } from 'lucide-react';

const UsersManagement = () => {
  const { users, deleteUser, updateUser } = useAdminSystem();
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, typeFilter, statusFilter]);

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(user => user.type === typeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleViewDetails = (user: any) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      deleteUser(userId);
    }
  };

  const handleStatusChange = (userId: string, newStatus: 'active' | 'pending' | 'suspended') => {
    updateUser(userId, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Gestão de Usuários</h1>
          <p className="text-gray-600">Gerencie turistas e guias cadastrados</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <UserPlus className="h-4 w-4" />
          <span>Novo Usuário</span>
        </Button>
      </div>

      <UserStatistics users={users} />

      <UserFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onViewDetails={handleViewDetails}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      <CreateUserModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      
      <UserDetailsModal 
        user={selectedUser}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedUser(null);
        }}
      />

      <EditUserModal 
        user={selectedUser}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
};

export default UsersManagement;
