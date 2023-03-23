import { AspectRatio, Box, CheckIcon, FormControl, Hidden, HStack, IInputProps, Input, Select, Switch, TextArea, Text } from 'native-base'
import React, { SyntheticEvent } from 'react'
import { Control, Controller, UseControllerProps } from 'react-hook-form'
import { AiOutlineCloudDownload } from 'react-icons/ai';
import Image from 'next/image'

type CustomInputProps = {
  src?: string | null;
  name: string;
  label: string;
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

type InputType = "Input" | "TextArea" | "Select" | "File" | "Date"

export type InputProps = IInputProps & CustomInputProps
export type ControlledFormInput<T extends Record<string, string>> = Omit<UseControllerProps, "control"> & InputProps &
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
        {inputType !== "Date" ? (
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
                    h={16}
                    fontSize="lg"
                    autoCompleteType={undefined}
                    placeholder={placeholder} />)
              case "Select":
                return (
                  <Select
                    selectedValue={field.value}
                    // minWidth="200"
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
                  <label tabIndex={0} style={{ cursor: "pointer" }}>
                    <Box borderStyle={"dashed"} mt={2} borderWidth={1} padding={'4'} borderRadius={"md"}>
                      <input type="file" style={{ display: "none" }} onChange={handleOnChange} accept="image/*" />
                      <span>
                        <AspectRatio maxHeight={300} borderRadius={"lg"} overflow={"hidden"}>
                          {!src ?
                            <Box mr={2} alignItems={"center"} justifyContent={"center"}>
                              <AiOutlineCloudDownload color={"gray"} size={"3.5em"} />
                            </Box>
                            :
                            <Image
                              src={src}
                              alt="alt"
                              layout={'fill'}
                              objectFit={'cover'}
                              style={{ borderRadius: "10", borderWidth: 1 }}
                            />
                          }
                        </AspectRatio>
                      </span>
                    </Box>
                  </label>
                )
              case "Input":
              default:
                return (
                  <Input
                    {...rest}
                    {...field}
                    type={type}
                    fontSize={"lg"}
                    value={formatValue ? formatValue(field.value) : field.value ?? ""}
                    placeholder={placeholder}
                    InputRightElement={rightElement}
                    onChangeText={(value) => {
                      console.log("value", value)
                      if (formatOnChange) {
                        formatOnChange(value, field.onChange)
                        return
                      }

                      field.onChange(value)
                    }}
                  />
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
