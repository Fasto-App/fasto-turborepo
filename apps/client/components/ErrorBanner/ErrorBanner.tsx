import { Slide, Text, Alert } from 'native-base';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next';

export const ErrorBanner = () => {
  const [isOnline, setIsOnline] = useState(true);
  const { t } = useTranslation("common");

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
          {t("noInternetConnection")}
        </Text>
      </Alert>
    </Slide>
  )
}
