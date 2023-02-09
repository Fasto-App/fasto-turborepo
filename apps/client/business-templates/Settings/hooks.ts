import { zodResolver } from '@hookform/resolvers/zod';
import { AccountInformation, accountInformationFormSchema, businessLocationSchema, businessLocationSchemaInput } from 'app-helpers';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { GetBusinessLocationQuery, GetUserInformationQuery } from '../../gen/generated';

export const useManageLocationFormHook = (data?: GetBusinessLocationQuery["getBusinessLocation"] | null) => {
  const {
    control,
    formState,
    handleSubmit,
    reset,
    setValue
  } = useForm<businessLocationSchemaInput>({
    resolver: zodResolver(businessLocationSchema),
    defaultValues: {
      streetAddress: data?.streetAddress ?? "",
      complement: data?.complement ?? "",
      postalCode: data?.postalCode ?? "",
      city: data?.city ?? "",
      stateOrProvince: data?.stateOrProvince ?? "",
      country: data?.country ?? "",
    },
  })

  return {
    control,
    formState,
    handleSubmit,
    reset,
    setValue
  }
}

export const useManageAccountFormHook = (data?: GetUserInformationQuery["getUserInformation"] | null) => {
  const {
    control,
    formState,
    handleSubmit,
    setValue
  } = useForm<AccountInformation>({
    resolver: zodResolver(accountInformationFormSchema),
    defaultValues: {
      name: data?.name ?? "",
      email: data?.name ?? "",
      newPassword: "",
      newPasswordConfirmation: "",
      oldPassword: "",
    },
  })

  return {
    control,
    formState,
    handleSubmit,
    setValue
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