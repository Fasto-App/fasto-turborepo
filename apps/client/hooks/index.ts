import { useBreakpointValue } from "native-base";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { clearClientCookies, getClientCookies } from "../cookies";
import {
  RequestStatus,
  TabStatus,
  useGetBusinessByIdQuery,
  useGetClientSessionQuery,
} from "../gen/generated";
import { customerRoute } from "fasto-route";
import { showToast } from "../components/showToast";
import { texts } from "./texts";
import { getCause } from "../apollo-client/ErrorLink";
import { useTranslation } from "next-i18next";
import { resizeFile } from "./helper";


export const useIsSsr = () => {
  const [isSsr, setIsSsr] = useState(true);
  useEffect(() => setIsSsr(false), []);
  return isSsr;
};

export const useNumOfColumns = (showTilesList: boolean) => {
  const numColumns: number = useBreakpointValue({
    base: 1,
    sm: 1,
    md: showTilesList ? 1 : 2,
    lg: showTilesList ? 2 : 3,
    xl: showTilesList ? 2 : 3,
    "2xl": showTilesList ? 3 : 4,
  });

  return numColumns;
};

export const useUploadFileHook = () => {
  const [imageSrc, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | undefined>();

  const handleFileOnChange = async (evt: React.ChangeEvent<HTMLInputElement> | null) => {
    const file = evt?.target?.files?.[0];

    if (!file) {
      setImageUrl('');
      setImageFile(undefined);
      return;
    }

    try {
      const { base64String, resizedFile } = await resizeFile(file);

      setImageUrl(base64String);
      setImageFile(new File([resizedFile], 'resized.webp', { type: 'image/webp' }));
    } catch (err) {
      console.log('Error resizing image:', err);
    }
  };

  return {
    imageSrc,
    imageFile,
    handleFileOnChange,
  };
};



export const useGetClientSession = () => {
  const route = useRouter();
  const { businessId, checkoutId } = route.query;

  const token = getClientCookies(businessId as string);

  return useGetClientSessionQuery({
    skip: !token,
    pollInterval: 1000 * 60, // 1 minute
    onCompleted: (data) => {
      // if the data has the request is successfull but the tab is not there
      // then we need to get a new token
      if (data.getClientSession.request.status === RequestStatus.Rejected) {
        if (businessId) {
          const business =
            typeof businessId === "string" ? businessId : businessId[0];

          clearClientCookies(business);
          return route.push({
            pathname: customerRoute["/customer/[businessId]"],
            query: {
              businessId: business,
            },
          });
        }
      }

      if (
        !checkoutId &&
        data.getClientSession.tab?.status === TabStatus.Pendent &&
        data.getClientSession.tab.checkout &&
        route.pathname !== customerRoute["/customer/[businessId]/payment"] &&
        // todo: should Trust the user that navigate to this page?
        route.pathname !== customerRoute["/customer/[businessId]/success"]
      ) {
        return route.push({
          pathname:
            customerRoute["/customer/[businessId]/checkout/[checkoutId]"],
          query: {
            businessId: businessId,
            checkoutId: data.getClientSession.tab.checkout,
          },
        });
      }
    },
  });
};

export const useGetBusinessInformation = () => {
  const route = useRouter();
  const { businessId } = route.query;

  const { t } = useTranslation("common");

  const data = useGetBusinessByIdQuery({
    skip: !businessId,
    variables: {
      input: {
        _id: businessId as string,
      },
    },
    onCompleted: (data) => {
      console.log("data", data);
    },
    onError: (error) => {
      showToast({
        message: t("thereWasAnError"),
        subMessage: getCause(error),
        status: "error",
      });
    },
  });

  return data;
};
