import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type NetworkState = 'idle' | 'error' | 'success'
interface AppState {
  networkState: NetworkState;
  category: null | string;
  product: null | string;
  menu: null | string;
  sectionMap: Map<any, any>;
  isEditingMenu: boolean;
  setNetworkState: (state: NetworkState) => void;
  setCategory: (category: null | string) => void;
  setProduct: (product: null | string) => void;
  setMenu: (menu: undefined | string) => void;
  setSectionMap: (newSection: any) => void;
  seIsEditingMenu: (isEditingMenu: boolean) => void;
  resetEditingAndSectionMap: () => void;
}

const useAppStore = create<AppState>()(
  (
    (set, get) => ({
      networkState: "idle",
      category: null,
      product: null,
      menu: null,
      isEditingMenu: false,
      sectionMap: new Map(),
      setNetworkState: (networkState) => set(() => ({ networkState })),
      setCategory: (category) => set(() => ({ category })),
      setProduct: (product) => set(() => ({ product })),
      setSectionMap: (newSectionMap) => set(() => ({ sectionMap: newSectionMap })),
      setMenu: (menu) => set(() => ({ menu })),
      seIsEditingMenu: (isEditingMenu) => set(() => ({ isEditingMenu })),
      resetEditingAndSectionMap: () => set(() => ({
        sectionMap: new Map(),
        isEditingMenu: false
      }))
    })
  )
)

export { useAppStore }