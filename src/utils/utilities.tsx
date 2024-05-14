import { useEffect } from "react";

// convert json into url params
export const jsonToUrlParams = (json: any) => {
  return Object.keys(json)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(json[key]))
    .join("&");
};

export const stringToTimestamp = (date: string) => {
  const stamp = new Date(date).getTime();
  return stamp; 
}

// convert avatar to base64
export const avatarToBase64 = async (file: any) => {
  return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
          const img = new Image();
          img.src = reader.result as string;
          img.onload = () => {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");
              const MAX_SIZE = 100 * 1024; // 100K
              const width = img.width;
              const height = img.height;
              const scale = 1;
              const imgSizes = img.sizes;

              canvas.width = width;
              canvas.height = height;

              ctx!.drawImage(img, 0, 0, width, height);

              resolve(canvas.toDataURL("image/jpeg"));
          };
          img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
  });
};

