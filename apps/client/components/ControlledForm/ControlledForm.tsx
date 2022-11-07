
import React from "react";
import { Box, HStack, ScrollView } from "native-base";
import { typedKeys } from "../../authUtilities/utils";
import { ControlledInput, InputProps } from "./ControlledInput";
import { FormState, Control } from "react-hook-form";


type ControlledFormType<T extends Record<string, string>> = {
  formState: FormState<T>;
  control: Control<T>;
  Config: SideBySideInputConfig
}

function isConfigArray(config: InputProps | RegularInputConfig[]): config is RegularInputConfig[] {
  return Array.isArray(config as RegularInputConfig[])
}

export const ControlledForm = <T extends Record<string, string>>({
  control,
  formState,
  Config
}: ControlledFormType<T>) => {

  return (<ScrollView>
    {
      typedKeys(Config).map((key) => {
        const config = Config[key];

        if (isConfigArray(config)) {

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
                      errorMessage={formState?.errors?.[keyName]?.message as string}
                    />
                  </Box>
                )
              })}
            </HStack>
          )
        }

        return (
          <ControlledInput
            {...config}
            helperText={config.helperText}
            key={key as string}
            name={key as string}
            control={control}
            label={config.label}
            errorMessage={formState.errors?.[key]?.message as string}
          />
        )
      })
    }
  </ScrollView>)
}

type RegularInputConfig = Record<string, InputProps>;
type SideBySideInputConfig = Record<string, InputProps | RegularInputConfig[]>;

export type {
  RegularInputConfig,
  SideBySideInputConfig
}