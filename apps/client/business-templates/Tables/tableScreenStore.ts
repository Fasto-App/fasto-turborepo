import { create } from 'zustand'

interface TableScreenStore {
  tableChoosen?: string
  selectedSpaceId?: string
  isSpaceModalOpen: boolean
  isNewTableModalOpen: boolean
}

interface TableScreenStoreActions extends TableScreenStore {
  setSelectedSpace: (spaceId?: string) => void
  setSpaceIsModalOpen: (isOpen: boolean) => void
  setTableChoosen: (table?: string) => void
  setIsNewTableModalOpen: (isOpen: boolean) => void
}

const getInitialState = (): TableScreenStore => ({
  isNewTableModalOpen: false,
  isSpaceModalOpen: false,
  selectedSpaceId: undefined,
  tableChoosen: undefined
})


export const useTableScreenStore = create<TableScreenStoreActions>((set) => ({
  ...getInitialState(),
  setTableChoosen: (tableId?: string) => set({ tableChoosen: tableId }),
  setSelectedSpace: (spaceId?: string) => set({ selectedSpaceId: spaceId }),
  setSpaceIsModalOpen: (isOpen: boolean) => set({ isSpaceModalOpen: isOpen }),
  setIsNewTableModalOpen: (isOpen: boolean) => set({ isNewTableModalOpen: isOpen })
}))
