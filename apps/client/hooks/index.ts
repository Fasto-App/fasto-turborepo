import { useBreakpointValue } from "native-base";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { clearClientCookies, getClientCookies } from "../cookies";
import { RequestStatus, TabStatus, useGetBusinessByIdQuery, useGetClientSessionQuery } from "../gen/generated";
import { customerRoute } from "../routes";
import { showToast } from "../components/showToast";
import { texts } from "./texts";
import { getCause } from "../apollo-client/ErrorLink";

export const useIsSsr = () => {
  const [isSsr, setIsSsr] = useState(true);
  useEffect(() => setIsSsr(false), []);
  return isSsr;
}

export const useNumOfColumns = (showTilesList: boolean) => {
  const numColumns: number = useBreakpointValue({
    base: 1,
    sm: 1,
    md: showTilesList ? 1 : 2,
    lg: showTilesList ? 2 : 3,
    xl: showTilesList ? 2 : 3,
    "2xl": showTilesList ? 3 : 4
  });

  return numColumns;
}


export const useUploadFileHook = () => {
  const [imageSrc, setImageUrl] = useState("")
  const [imageFile, setImageFile] = useState<File>()


  const handleFileOnChange = (evt: any) => {
    const file = evt?.target?.files?.[0]

    console.log("handleFileOnChange")
    console.log("file", file)

    if (!file) {
      setImageUrl("")
      setImageFile(undefined)
      return
    }

    const reader = new FileReader()

    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const url = e.target?.result
      setImageUrl(url as string)
      setImageFile(file)
    }
  }

  return {
    imageSrc,
    imageFile,
    handleFileOnChange
  }
}

export const useGetClientSession = () => {
  const route = useRouter()
  const { businessId, checkoutId } = route.query

  const token = getClientCookies(businessId as string)


  return useGetClientSessionQuery({
    skip: !token,
    pollInterval: 1000 * 60, // 1 minute
    onCompleted: (data) => {
      // if the data has the request is successfull but the tab is not there
      // then we need to get a new token
      if (data.getClientSession.request.status === RequestStatus.Rejected) {
        if (businessId) {
          const business = typeof businessId === "string" ? businessId : businessId[0]
          clearClientCookies(business)
          route.push(customerRoute.home(business))
          return
        }
      }

      if (!checkoutId && data.getClientSession.tab?.status === TabStatus.Pendent &&
        data.getClientSession.tab.checkout) {
        route.push(customerRoute.checkout(businessId as string, data.getClientSession.tab.checkout))
        return
      }
    },
  })
}

export const useGetBusinessInformation = () => {
  const route = useRouter()
  const { businessId } = route.query

  const data = useGetBusinessByIdQuery({
    skip: !businessId,
    variables: {
      input: {
        _id: businessId as string
      }
    },
    onCompleted: (data) => {
      console.log("data", data)
    },
    onError: (error) => {
      showToast({
        message: texts.thereWasAnError,
        subMessage: getCause(error),
        status: "error"
      })
    }
  })

  return data
}