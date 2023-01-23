import { zodResolver } from '@hookform/resolvers/zod';
import { businessLocationSchema, businessLocationSchemaInput } from 'app-helpers';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export const useManageBusinessFormHook = () => {
  const {
    control,
    formState,
    handleSubmit
  } = useForm<businessLocationSchemaInput>({
    defaultValues: {
      streetAddress: "",
      complement: "",
      postalCode: "",
      city: "",
      stateOrProvince: "",
      country: "",
    },
    resolver: zodResolver(businessLocationSchema)
  })

  return {
    control,
    formState,
    handleSubmit
  }
}

const accountFormSchema = z.object({
  name: z.string().trim().min(3, { message: 'Name Required' })
    .max(50, { message: 'Name too long' }),
  email: z.string().trim().min(4, { message: 'Email Required' }),
})

export type AccountInfo = z.infer<typeof accountFormSchema>

export const useManageAccountFormHook = () => {
  const {
    control,
    formState,
    handleSubmit
  } = useForm<AccountInfo>({
    defaultValues: {
      name: "",
      email: "",
    },
    resolver: zodResolver(accountFormSchema)
  })

  return {
    control,
    formState,
    handleSubmit
  }
}


const employeeFormSchema = z.object({
  name: z.string().trim().min(3, { message: 'Name Required' })
    .max(50, { message: 'Name too long' }),
  role: z.string().trim().min(4, { message: 'Role Required' }),
  email: z.string().email().min(4, { message: 'Email Required' }),
  phone: z.string().optional(),
  picture: z.string().optional(),
})

export type EmployeeInfo = z.infer<typeof employeeFormSchema>

export const useManageEmployeeFormHook = () => {
  const {
    control,
    formState,
    handleSubmit,
    reset
  } = useForm<EmployeeInfo>({
    defaultValues: {
      role: "",
      email: "",
      phone: "",
      picture: ""
    },
    resolver: zodResolver(employeeFormSchema)
  })

  return {
    control,
    formState,
    handleSubmit,
    reset
  }
}