import { useCallback, useState } from "react";

export const setSideBarOpen = () => {
  const currentState = !getSideBarOpen();
  localStorage.setItem("sidebarOpen", currentState.toString());
}

export const getSideBarOpen = () => {
  return localStorage.getItem("sidebarOpen") === "true";
}

export const useSideBarOpen = () => {
  const [open, setOpen] = useState(getSideBarOpen());

  const toggleOpen = useCallback(() => {
    setOpen(!open);
    setSideBarOpen();
  }, [open])

  return {
    open,
    setOpen: toggleOpen,
  }
}