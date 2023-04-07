import { Slide, Text, Alert } from 'native-base';
import React, { useEffect, useState } from 'react'

const texts = {
  noInternetConnection: "No Internet Connection"
}

export const ErrorBanner = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Running on the server, assume online by default
    if (typeof window === "undefined") return

    if (window.navigator.onLine !== isOnline) {
      setIsOnline(window.navigator.onLine);
    }

  }, [isOnline]);

  return (
    <Slide in={!isOnline} placement="top">
      <Alert justifyContent="center" status="error" safeAreaTop={8}>
        <Alert.Icon />
        <Text color="error.600" fontWeight="medium">
          {texts.noInternetConnection}
        </Text>
      </Alert>
    </Slide>
  )
}
