import { zodResolver } from '@hookform/resolvers/zod';
import { AccountInformation, accountInformationFormSchema, businessInformationSchema, businessLocationSchema, businessLocationSchemaInput, employeeFormSchema, EmployeeInfo } from 'app-helpers';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { GetBusinessLocationQuery, GetUserInformationQuery, GetBusinessInformationQuery } from '../../gen/generated';

export const useManageBusinessFormHook = (data?: GetBusinessInformationQuery["getBusinessInformation"] | null) => {

  const {
    control,
    formState,
    handleSubmit,
    reset,
    setValue
  } = useForm({
    resolver: zodResolver(businessInformationSchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
      // website: data?.website ?? "",
      // phone: data?.phone ?? "",
      picture: data?.picture ?? "",
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