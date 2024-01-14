import { Group } from '@/types/Group'
import { ErrorItem, getErrorFromZod } from '@/utils/getErrorFromZod'
import { useEffect, useState } from 'react'
import { InputField } from '../InputField'
import { Button } from '../Button'
import { z } from 'zod'
import * as api from '@/api/admin'

type GroupEditProps = {
  group: Group
  refreshAction: () => void
}

export const GroupEdit = ({ group, refreshAction }: GroupEditProps) => {
  const [nameField, setNameField] = useState<string>(group.name)
  const [errors, setErrors] = useState<ErrorItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const groupSchema = z.object({
    nameField: z.string().min(1, 'Preencha o nome'),
  })

  useEffect(() => {
    setErrors([])
    const data = groupSchema.safeParse({ nameField })
    if (!data.success) setErrors(getErrorFromZod(data.error))
  }, [nameField])

  async function handleSaveButton() {
    if (errors.length > 0) return

    setLoading(true)
    const updateGroup = await api.updateGroup(group.id_event, group.id, {
      name: nameField,
    })
    setLoading(false)
    if (updateGroup) {
      refreshAction()
    } else {
      alert('Ocorreu um erro!')
    }
  }

  return (
    <div>
      <h4 className="text-xl">Editar Grupo</h4>
      <InputField
        value={nameField}
        onChange={(e) => setNameField(e.target.value)}
        placeholder="Digite o nome do grupo"
        errorMessage={
          errors.find((error) => error.field === 'nameField')?.message
        }
        disabled={loading}
      />
      <div className="flex gap-3">
        <Button
          value="Cancelar"
          onClick={() => refreshAction()}
          disabled={loading}
        />
        <Button
          value={loading ? 'Salvando...' : 'Salvar'}
          onClick={handleSaveButton}
          disabled={loading}
        />
      </div>
    </div>
  )
}
