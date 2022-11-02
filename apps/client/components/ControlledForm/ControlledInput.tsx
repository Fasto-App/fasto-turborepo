import { Box, CheckIcon, FormControl, HStack, IInputProps, Input, Select, TextArea, } from 'native-base'
import React from 'react'
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
  handleFileUpload?: (e: any) => void;
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
  handleFileUpload,
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
                  <HStack justifyContent={""}>
                    <Box mr={2} >
                      <AiOutlineCloudDownload color={"gray"} size={"1.5em"} />
                    </Box>
                    <input type="file" onChange={handleFileUpload} accept="image/*" />
                  </HStack>

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
