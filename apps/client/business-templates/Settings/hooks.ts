import { zodResolver } from '@hookform/resolvers/zod';
import { businessLocationSchema, businessLocationSchemaInput } from 'app-helpers';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { GetBusinessLocationQuery, UpdateBusinessLocationMutation } from '../../gen/generated';

type R = NonNullable<UpdateBusinessLocationMutation["updateBusinessLocation"]>["address"]

export const useManageBusinessFormHook = (data?: GetBusinessLocationQuery["getBusinessLocation"] | null) => {
  const {
    control,
    formState,
    handleSubmit,
    reset
  } = useForm<businessLocationSchemaInput>({
    defaultValues: {
      streetAddress: data?.streetAddress ?? "",
      complement: data?.complement ?? "",
      postalCode: data?.postalCode ?? "",
      city: data?.city ?? "",
      stateOrProvince: data?.stateOrProvince ?? "",
      country: data?.country ?? "",
    },
    resolver: zodResolver(businessLocationSchema)
  })

  return {
    control,
    formState,
    handleSubmit,
    reset
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