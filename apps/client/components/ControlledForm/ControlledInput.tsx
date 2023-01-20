import { Box, CheckIcon, FormControl, Hidden, HStack, IInputProps, Input, Select, TextArea, } from 'native-base'
import React, { SyntheticEvent } from 'react'
import { Control, Controller, UseControllerProps } from 'react-hook-form'
import { AiOutlineCloudDownload } from 'react-icons/ai';

type CustomInputProps = {
  name: string;
  label: string;
  errorMessage?: string;
  helperText?: string;
  inputType?: InputType;
  array?: { name: string, _id: string }[];
  formatValue?: (value: string) => string;
  formatOnChange?: (value: string, cb: (number) => void) => void;
  handleOnChange?: (e: SyntheticEvent) => void;
}

type InputType = "Input" | "TextArea" | "Select" | "File"

export type InputProps = IInputProps & CustomInputProps
export type ControlledFormInput<T extends Record<string, string>> = Omit<UseControllerProps, "control"> & InputProps &
{ control: Control<T> }

export const ControlledInput = <T extends Record<string, string>>({
  control,
  errorMessage,
  label,
  name,
  helperText,
  placeholder,
  rightElement,
  inputType = "Input",
  array,
  isRequired,
  formatValue,
  formatOnChange,
  handleOnChange,
}: ControlledFormInput<T>) => {
  return (
    <>
      <FormControl isInvalid={!!errorMessage}>
        <FormControl.Label isRequired={isRequired}>{label}</FormControl.Label>
        <Controller
          control={control}
          // @ts-ignore
          name={name}
          render={({ field }) => {

            switch (inputType) {
              case "Input":
                return (
                  <Input
                    value={formatValue ? formatValue(field.value) : field.value ?? ""}
                    placeholder={placeholder}
                    InputRightElement={rightElement}
                    onChangeText={(value) => {
                      if (formatOnChange) {
                        formatOnChange(value, field.onChange)
                        return
                      }

                      field.onChange(value)
                    }}
                  />
                )
              case "TextArea":
                return (
                  <TextArea
                    {...field}
                    h={16}
                    autoCompleteType={undefined}
                    placeholder={placeholder} />)
              case "Select":
                return (
                  <Select selectedValue={field.value} minWidth="200" accessibilityLabel="Choose Category" placeholder="Choose Category" _selectedItem={{
                    endIcon: <CheckIcon size="5" />
                  }} mt={1} onValueChange={field.onChange}>

                    {array.map(category => (
                      <Select.Item key={category._id} label={category.name} value={category._id} />))
                    }
                  </Select>)
              case "File":
                return (
                  <label tabIndex={0}>
                    <input type="file" style={{ display: "none" }} onChange={handleOnChange} accept="image/*" />
                    <span>
                      <HStack borderWidth={1} flex={1} h={"32"} justifyContent={"center"}>
                        <Box mr={2} alignSelf={"center"}>
                          <AiOutlineCloudDownload color={"gray"} size={"3.5em"} />
                        </Box>
                      </HStack>
                    </span>
                  </label>
                )
            }
          }}
        />
        {errorMessage ?
          <FormControl.ErrorMessage>
            {errorMessage}
          </FormControl.ErrorMessage> :
          <FormControl.HelperText
            _text={{
              fontSize: 'xs'
            }}>
            {helperText}
          </FormControl.HelperText>}
      </FormControl>
    </>
  )
}
