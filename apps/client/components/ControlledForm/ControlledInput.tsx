import { Radio, Box, CheckIcon, FormControl, Hidden, HStack, IInputProps, Input, Select, Switch, TextArea, Text } from 'native-base'
import React, { SyntheticEvent } from 'react'
import { Control, Controller, UseControllerProps } from 'react-hook-form'
import { AiOutlineCloudDownload } from 'react-icons/ai';
import Image from 'next/image'
import { isInteger } from 'lodash';
import { useCheckoutStore } from '../../business-templates/Checkout/checkoutStore';

type CustomInputProps = {
  src?: string | null;
  name: string;
  label?: string;
  errorMessage?: string;
  helperText?: string;
  inputType?: InputType;
  array?: { name: string, _id: string }[];
  formatValue?: (value: string) => string;
  formatOnChange?: (value: string, cb: (num: number) => void) => void;
  handleOnChange?: (e: SyntheticEvent) => void;
  isDisabled?: boolean;
  accessibilityLabel?: string;
}

type InputType = "Input" | "TextArea" | "Select" | "File" | "Date" | "Currency" | "Number" | "Radio"

export type InputProps = IInputProps & CustomInputProps
export type ControlledFormInput<T extends Record<string, string | number>> = Omit<UseControllerProps, "control"> & InputProps &
{ control: Control<T> }

export const ControlledInput = <T extends Record<string, string>>({
  src,
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
  type,
  ...rest
}: ControlledFormInput<T>) => {
  return (
    <>
      <FormControl isInvalid={!!errorMessage}>

        {/* dont show for type Date */}
        {inputType !== "Date" && label ? (
          <FormControl.Label isRequired={isRequired}>
            {label}
          </FormControl.Label>) : null}

        <Controller
          control={control}
          // @ts-ignore
          name={name}
          render={({ field }) => {

            switch (inputType) {
              case "TextArea":
                return (
                  <TextArea
                    {...field}
                    h={"24"}
                    fontSize="lg"
                    autoCompleteType={undefined}
                    placeholder={placeholder} />)
              case "Select":
                return (
                  <Select
                    isDisabled={rest.isDisabled}
                    selectedValue={field.value}
                    fontSize="lg"
                    accessibilityLabel={rest.accessibilityLabel}
                    placeholder={placeholder}
                    onValueChange={field.onChange}
                    _selectedItem={{ endIcon: <CheckIcon size="5" /> }}
                  >
                    {array?.map(item => (
                      <Select.Item key={item._id} label={item.name} value={item._id} />))
                    }
                  </Select>
                )
              case "Radio":
                const { ref, ...noRef } = field

                return (
                  <Radio.Group
                    {...noRef}
                    accessibilityLabel='group options'
                    value={field.value}>
                    {array?.map(item => (
                      <Radio
                        accessibilityLabel={item.name}
                        size="lg"
                        my={2}
                        key={item._id}
                        value={item._id}>
                        {item.name}
                      </Radio>
                    ))}
                  </Radio.Group>
                )
              case "Date":
                return (
                  <HStack w={"100%"} justifyContent={"flex-end"} space={"2"}>

                    <HStack
                      alignItems={"center"}
                      space={"4"}
                      flex={1}
                      borderWidth={1}>
                      <FormControl.Label isRequired={isRequired} flex={1}>
                        {label}
                      </FormControl.Label>
                      <Switch size="lg" />
                      <Text>
                        {"Open"}
                      </Text>
                    </HStack>

                    <HStack alignItems={"center"} space={"4"}>
                      <Select
                        onValueChange={field.onChange}
                        selectedValue={field.value}
                        accessibilityLabel="Choose Category"
                        placeholder="Choose Category"
                        _selectedItem={{
                          endIcon: <CheckIcon size="5" />
                        }}
                      >
                        {["1", "2", "3"].map((category, index) => (
                          <Select.Item key={index} label={category} value={category} />))
                        }
                      </Select>
                      <Text alignSelf={"center"}>
                        {"To"}
                      </Text>
                      <Select
                        onValueChange={field.onChange}
                        selectedValue={field.value}
                        accessibilityLabel="Choose Category"
                        placeholder="Choose Category"
                        _selectedItem={{
                          endIcon: <CheckIcon size="5" />
                        }}
                      >
                        {["1", "2", "3"].map((category, index) => (
                          <Select.Item key={index} label={category} value={category} />))
                        }
                      </Select>
                    </HStack>

                  </HStack>)
              case "File":
                // If we have a valid url or source, we render the image
                // otherwise we render the upload button
                // use aspect Ratio component to keep the image ratio
                return (
                  <Box w={"64"} pb={2}>
                    <label tabIndex={0} style={{ cursor: "pointer" }}>
                      <Box borderStyle={"dashed"} mt={2} borderWidth={1} borderRadius={"md"}>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleOnChange}
                        />
                        <span>
                          {!src && !field.value ?
                            <Box mr={2}
                              alignItems={"center"} justifyContent={"center"} w={"full"} h={"20"}>
                              <AiOutlineCloudDownload color={"gray"} size={"3.5em"} />
                            </Box>
                            :
                            <Box h={"40"}>
                              <Image
                                src={src || field.value}
                                alt="alt"
                                layout={'fill'}
                                objectFit={'cover'}
                                style={{ borderRadius: "10", borderWidth: 1 }}
                              />
                            </Box>
                          }
                        </span>
                      </Box>
                    </label>
                  </Box>
                )
              case "Input":
              case "Number":
              case "Currency":
              default:
                return (
                  <Input
                    {...rest}
                    {...field}
                    type={type}
                    fontSize={"lg"}
                    value={inputType === "Currency" && isNumber(field.value) ?
                      (Number(field.value) / 100)
                        .toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                      : field.value || ""}
                    placeholder={placeholder}
                    InputRightElement={rightElement}
                    onChangeText={(value) => {
                      switch (inputType) {
                        case "Currency":
                          const text = value.replace(/[$,.]/g, '');
                          const convertedValue = Number(text);

                          if (isNaN(convertedValue)) {
                            return field.onChange(0);
                          }

                          return field.onChange(convertedValue)

                        case "Number":
                          const number = Number(value);
                          if (isNaN(number)) {
                            return field.onChange(0);
                          }

                          return field.onChange(number)

                        default:
                          return field.onChange(value);
                      }
                    }}
                  />
                )
            }
          }}
        />
        {errorMessage ?
          <FormControl.ErrorMessage>
            {errorMessage}
          </FormControl.ErrorMessage> : helperText ?
            <FormControl.HelperText
              _text={{
                fontSize: 'xs'
              }}>
              {helperText}
            </FormControl.HelperText> : null}
      </FormControl>
    </>
  )
}

const isNumber = (value: any) => {
  return isInteger(Number(value))
}
