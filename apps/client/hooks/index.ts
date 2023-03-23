import { useBreakpointValue } from "native-base";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getClientCookies, setClientCookies } from "../cookies/businessCookies";
import { useGetBusinessByIdQuery, useGetClientInformationQuery, useGetTabByIdQuery, useGetTabRequestQuery } from "../gen/generated";

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

  const data = useGetTabRequestQuery({
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

  return data
}

export const useGetTabInformation = () => {
  const tab = getClientCookies("tab")

  // get the information of the tab and make a request
  const data = useGetTabByIdQuery({
    skip: !tab,
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