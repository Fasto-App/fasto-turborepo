
import React from "react";
import { Box, HStack, ScrollView, VStack } from "native-base";
import { typedKeys } from "../../authUtilities/utils";
import { ConfigType, ControlledFormInput, ControlledInput, InputProps } from "./ControlledInput";
import { FormState, UseControllerProps } from "react-hook-form";


type ControlledFormType<T extends Record<string, string>> = {
  formState: FormState<T>;
  control: UseControllerProps<T>;
  Config: ConfigType
}

export function ControlledForm({
  control,
  formState,
  Config
}) {
  return (<ScrollView>
    {
      typedKeys(Config).map((key) => {
        const config = Config[key];

        if (Array.isArray(config)) {

          return (
            <HStack key={key as string}>
              {config.map((subKeyConfig, index) => {
                const keyName = typedKeys(subKeyConfig)[0]

                return (
                  <Box
                    key={keyName as string}
                    flex={1}
                    ml={index % 2 !== 0 ? 16 : 0}
                  >
                    <ControlledInput
                      {...subKeyConfig[keyName]}
                      control={control}
                      name={keyName as string}
                      label={subKeyConfig[keyName].label}
                      errorMessage={formState?.errors?.[keyName]?.message}
                    />
                  </Box>
                )
              })}
            </HStack>
          )
        }

        return (
          <ControlledInput
            {...Config[key]}
            helperText={Config[key].helperText}
            key={key as string}
            name={key as string}
            control={control}
            label={Config[key].label}
            errorMessage={formState.errors?.[key]?.message}

          />
        )
      })
    }
  </ScrollView>)
}