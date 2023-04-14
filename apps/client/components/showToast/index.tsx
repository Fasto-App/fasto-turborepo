import React from "react";
import { Toast, Box, Alert, CloseIcon, HStack, IconButton, VStack, Text } from "native-base";

type ToastProps = {
  message: string;
  subMessage?: string | unknown;
  status?: 'info' | 'warning' | 'success' | 'error'
}

export const showToast = (props: ToastProps) => {
  const { status = "success" } = props;

  Toast.show({
    placement: "top",
    id: props.message,
    render: () => {
      return <Alert maxW="400" status={status}>
        <VStack space={1} flexShrink={1} w="100%">
          <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
            <HStack flexShrink={1} space={2} alignItems="center">
              <Alert.Icon />
              <Text fontSize="md" fontWeight="medium" _dark={{
                color: "coolGray.800"
              }}>
                {props.message}
              </Text>
            </HStack>
            <IconButton variant="unstyled" _focus={{
              borderWidth: 0
            }} icon={<CloseIcon size="3" />} _icon={{
              color: "coolGray.600"
            }} onPress={() => Toast.close(props.message)} />
          </HStack>
          {props.subMessage ? <Box pl="6" _dark={{
            _text: {
              color: "coolGray.600"
            }
          }}>
            {props.subMessage}
          </Box> : null}
        </VStack>
      </Alert>
    }
  });
}