import { zodResolver } from "@hookform/resolvers/zod";
import { menuSchema, menuSchemaInput } from "app-helpers";
import { useForm } from "react-hook-form";
import { RegularInputConfig } from "../../components/ControlledForm";
import { customerRoute } from "fasto-route";

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

type ShareMenuProps = {
  businessId?: string;
  menuId?: string;
  locale?: string;
};
export const copyMenuLinkToClipboard = ({
  businessId,
  menuId,
  locale = "en",
}: ShareMenuProps) => {
  if (!businessId || !menuId) throw new Error("No business id nor menu id");

  const customerPath = `${process.env.FRONTEND_URL}/${locale}${customerRoute['/customer/[businessId]'].replace("[businessId]", businessId)}`

  const menuIdQuery = `${customerPath}?menuId=${menuId}`
  navigator.clipboard.writeText(menuIdQuery)
}
