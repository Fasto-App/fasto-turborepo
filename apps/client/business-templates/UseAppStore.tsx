import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface AppState {
  networkState: "idle" | "error" | "success";
  category: null | string;
  product: null | string;
  menu: null | string;
  sectionMap: Map<any, any>;
  isEditingMenu: boolean;
  setNetworkState: (state: "idle" | "error" | "success") => void;
  setCategory: (category: null | string) => void;
  setProduct: (product: null | string) => void;
  setMenu: (menu: undefined | string) => void;
  setSectionMap: (newSection: any) => void;
  seIsEditingMenu: (isEditingMenu: boolean) => void;
  resetEditingAndSectionMap: () => void;
}

const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      networkState: "idle",
      category: null,
      product: null,
      menu: null,
      isEditingMenu: false,
      sectionMap: new Map(),
      setNetworkState: (string) => set(() => ({ networkState: string })),
      setCategory: (category) => set(() => ({ category })),
      setProduct: (product) => set(() => ({ product })),
      setSectionMap: (newSectionMap) => set(() => ({ sectionMap: newSectionMap })),
      setMenu: (menu) => set(() => ({ menu })),
      seIsEditingMenu: (isEditingMenu) => {
        return set(() => ({ isEditingMenu }))
      },
      resetEditingAndSectionMap: () => set(() => ({
        sectionMap: new Map(),
        isEditingMenu: false
      }))
    })
  )
)

export { useAppStore }