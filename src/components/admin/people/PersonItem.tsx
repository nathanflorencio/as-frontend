import { PersonComplete } from '@/types/PersonComplete'
import { ItemButton } from '../ItemButton'
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa'
import * as api from '@/api/admin'

type PersonItemProps = {
  person: PersonComplete
  refreshAction: () => void
  onEdit: (person: PersonComplete) => void
}

export const PersonItem = ({
  person,
  refreshAction,
  onEdit,
}: PersonItemProps) => {
  async function handleDeleteButton() {
    if (confirm('Tem certeza que deseja excluir esta pessoa?')) {
      await api.deletePerson(person.id_event, person.id_group, person.id)
      refreshAction()
    }
  }

  return (
    <div className="border border-gray-700 bg-gray-900 rounded p-3 mb-3 flex items-center">
      <div className="flex-1">
        {person.name} (CPF: {person.cpf})
      </div>
      <ItemButton IconElement={FaRegEdit} onClick={() => onEdit(person)} />
      <ItemButton IconElement={FaRegTrashAlt} onClick={handleDeleteButton} />
    </div>
  )
}

export const PersonItemPlaceholder = () => {
  return (
    <div className="w-full h-16 border border-gray-700 rounded mb-3 bg-gradient-to-r from-gray-900 to-gray-950 animate-pulse"></div>
  )
}

export const PersonItemNotFound = () => {
  return (
    <div className="text-center py-4 text-gray-500">
      Não há pessoas neste grupo.
    </div>
  )
}
