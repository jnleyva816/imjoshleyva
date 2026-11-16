import { createContext, useContext } from "react";

export const PhotoViewerContext = createContext(() => {});

export function usePhotoViewer() {
  return useContext(PhotoViewerContext);
}
