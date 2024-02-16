import { zodResolver } from "@hookform/resolvers/zod";
import { menuSchema, menuSchemaInput } from "app-helpers";
import { useForm } from "react-hook-form";
import { RegularInputConfig } from "../../components/ControlledForm";

export const MenuConfig: RegularInputConfig = {
  name: {
    name: "name",
    label: "Menu Name",
    type: "text",
    placeholder: "Weekends",
    isRequired: true,
  },
}

export const useMenuHook = () => {

  const {
    control,
    handleSubmit,
    formState
  } = useForm<menuSchemaInput>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(menuSchema),
  });

  return {
    control,
    handleSubmit,
    formState
  }
}