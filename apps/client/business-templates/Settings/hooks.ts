import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const businessInfoSchema = z.object({
  businessName: z.string().trim().min(3, { message: 'Name Required' })
    .max(50, { message: 'Name too long' }),
  addressLine1: z.string().trim().min(4, { message: 'Street Required' }),
  zipCode: z.string().trim().min(4, { message: 'Zip/Postal Code Required' }),
  city: z.string().trim().min(2, { message: 'City Required' }),
  state: z.string().trim().min(2, { message: 'State Required' }),
  country: z.string().trim().min(2, { message: 'Country Required' }),
  hours: z.string().trim().optional(),
  days: z.string().trim().optional(),
})

export type BusinessInfo = z.infer<typeof businessInfoSchema>

export const useManageBusinessFormHook = () => {
  const {
    control,
    formState,
    handleSubmit
  } = useForm<BusinessInfo>({
    defaultValues: {
      businessName: "",
      addressLine1: "",
      zipCode: "",
      city: "",
      state: "",
      country: "",
      hours: "",
      days: ""
    },
    resolver: zodResolver(businessInfoSchema)
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
  phone: z.string().optional(),
  picture: z.string().optional(),
})

type EmployeeInfo = z.infer<typeof employeeFormSchema>

export const useManageEmployeeFormHook = () => {
  const {
    control,
    formState,
    handleSubmit
  } = useForm<EmployeeInfo>({
    defaultValues: {
      name: "",
      role: "",
      phone: "",
      picture: ""
    },
    resolver: zodResolver(employeeFormSchema)
  })

  return {
    control,
    formState,
    handleSubmit
  }
}