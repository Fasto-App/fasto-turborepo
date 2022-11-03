import React from "react";
// import { MenuScreen } from './MenuScreen'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import MenuScreen from "./MenuScreen";
import { useMenuMutationHook } from "../../graphQL/MenuQL";

// PRODUCT FORM STATE
const menuSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name Required" })
    .max(50, { message: "Name too long" }),
});

export function Menu() {
  const { allMenusByBusiness, createMenu } = useMenuMutationHook();

  const {
    setError,
    reset,
    setValue,
    control,
    handleSubmit,
    formState,
    register,
  } = useForm<{ name: string }>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(menuSchema),
  });

  const onMenuSubmit = (values) => {
    // if error, set error and display to the user
    // and return false to prevent the form from submitting
    // if (formState.errors) {
    //   setError(formState.errors);
    //   return false;
    // }

    createMenu({
      variables: {
        input: {
          name: values.name,
        },
      },
    });
  };

  return (
    <MenuScreen
      menusData={allMenusByBusiness}
      menuController={control}
      onMenuSubmit={handleSubmit(onMenuSubmit)}
    />
  );
}
