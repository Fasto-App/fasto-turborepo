import { useBreakpointValue } from "native-base";
import { useEffect, useState } from "react";

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
  const [imageFile, setImageFile] = useState<File>(null)


  const handleFileOnChange = (evt: any) => {
    const file = evt.target.files[0]

    if (!file) {
      setImageUrl("")
      setImageFile(null)
      return
    }

    const reader = new FileReader()

    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const url = e.target.result
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