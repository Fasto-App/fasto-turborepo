import { useBreakpointValue } from "native-base";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getClientCookies, setClientCookies } from "../cookies/businessCookies";
import { OnTabRequestResponseDocument, useGetBusinessByIdQuery, useGetClientInformationQuery, useGetTabByIdQuery, useGetTabRequestQuery, useSubscriptionSubscription } from "../gen/generated";

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
    const file = evt.target.files[0]

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

export const useGetTabRequest = () => {
  const clientToken = getClientCookies("token")

  // const { data: subData } = useSubscriptionSubscription()

  // console.group({ subData })

  const { subscribeToMore, ...data } = useGetTabRequestQuery({
    skip: !clientToken,
    onCompleted: (data) => {
      if (data.getTabRequest.status === "Accepted" && data.getTabRequest.tab) {
        setClientCookies("tab", data.getTabRequest.tab)
      }
    },
    onError: (error) => {
      console.log("error", error)
      // clear cache
    },
  })

  useEffect(() => {
    const unsubscribe = () => subscribeToMore({
      document: OnTabRequestResponseDocument,
      updateQuery: (prev, { subscriptionData }) => {

        console.log("subscriptionData", subscriptionData)
        console.log("prev", prev)

        if (!subscriptionData.data) return prev;
        // @ts-ignore
        const newTabRequest = subscriptionData.data.onTabRequestResponse;

        if (newTabRequest.tab) {
          setClientCookies("tab", newTabRequest.tab)
        }

        return {
          ...prev,
          getTabRequest: newTabRequest
        }
      }
    })

    unsubscribe()

  }, [subscribeToMore])


  return data
}

export const useGetTabInformation = () => {
  const tab = getClientCookies("tab")
  const clientToken = getClientCookies("token")
  // get the information of the tab and make a request
  const data = useGetTabByIdQuery({
    skip: !tab || !clientToken,
    variables: {
      input: {
        _id: tab as string
      },
    },
    onCompleted: (data) => {
      console.log("data", data)
    },
    onError: (error) => {
      console.log("error", error)
      // clear cache
    }
  })

  return data
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
      console.log("error", error)
      // clear cache
    }
  })

  return data
}

export const useGetClientInformation = () => {
  const data = useGetClientInformationQuery({
    skip: !getClientCookies("token"),
    onCompleted: (data) => {
      console.log("data", data)
    },
    onError: (error) => {
      console.log("error", error)
      // clear cache
    }
  })

  return data
}