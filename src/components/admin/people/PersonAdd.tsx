import { ErrorItem, getErrorFromZod } from '@/utils/getErrorFromZod'
import { useState } from 'react'
import { InputField } from '../InputField'
import { escapeCPF } from '@/utils/escapeCPF'
import { Button } from '../Button'
import { z } from 'zod'
import * as api from '@/api/admin'

type PersonAddProps = {
  eventId: number
  groupId: number
  refreshAction: () => void
}

export const PersonAdd = ({
  eventId,
  groupId,
  refreshAction,
}: PersonAddProps) => {
  const [nameField, setNameField] = useState<string>('')
  const [cpfField, setCpfField] = useState<string>('')
  const [errors, setErrors] = useState<ErrorItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const personSchema = z.object({
    nameField: z.string().min(1, 'Preencha o nome'),
    cpfField: z.string().length(11, 'CPF inválido'),
  })

  async function handleSaveButton() {
    setErrors([])
    const data = personSchema.safeParse({ nameField, cpfField })
    if (!data.success) return setErrors(getErrorFromZod(data.error))

    setLoading(true)

    const newPerson = await api.addPerson(eventId, groupId, {
      name: nameField,
      cpf: cpfField,
    })

    setLoading(false)

    if (newPerson) {
      setNameField('')
      setCpfField('')
      refreshAction()
    } else {
      alert('Ocorreu um erro!')
    }
  }

  return (
    <div>
      <h4 className="text-xl">Nova Pessoa</h4>
      <InputField
        value={nameField}
        onChange={(e) => setNameField(e.target.value)}
        placeholder="Digite o nome da pessoa"
        errorMessage={
          errors.find((error) => error.field === 'nameField')?.message
        }
        disabled={loading}
      />
      <InputField
        value={cpfField}
        onChange={(e) => setCpfField(escapeCPF(e.target.value))}
        placeholder="Digite o CPF da pessoa"
        errorMessage={
          errors.find((error) => error.field === 'cpfField')?.message
        }
        disabled={loading}
      />
      <div>
        <Button
          value={loading ? 'Adicionando...' : 'Adicionar'}
          onClick={handleSaveButton}
          disabled={loading}
        />
      </div>
    </div>
  )
}
