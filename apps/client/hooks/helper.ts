import Resizer from 'react-image-file-resizer';
import { format } from 'date-fns'
import { getLocale } from '../authUtilities/utils';

const dataURLtoBlob = (dataurl: string) => {
  const arr = dataurl.split(',');
  const match = arr[0].match(/:(.*?);/);

  if (match) {
    const mime = match[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  }

  throw new Error('Invalid data URL');
};


export const resizeFile = (file: File) =>
  new Promise<{ base64String: string; resizedFile: Blob }>((resolve) => {
    Resizer.imageFileResizer(
      file,
      800,
      600,
      'WEBP',
      100,
      0,
      (value) => {
        if (value instanceof Blob) {
          const base64String = URL.createObjectURL(value);
          resolve({ base64String, resizedFile: value });
        } else {
          resolve({ base64String: value as string, resizedFile: dataURLtoBlob(value as string) });
        }
      },
      'base64'
    );
  });

export const formatDate = (date?: string, locale?: string) => format(Number(date || 0), "E, MMM d, p", getLocale(locale))