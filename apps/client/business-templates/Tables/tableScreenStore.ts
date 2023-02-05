import { create } from 'zustand'
import { SelectedTable } from './types'

interface TableScreenStore {
  tableChoosen?: SelectedTable
  selectedSpaceId?: string
  isSpaceModalOpen: boolean
  isNewTableModalOpen: boolean
}

interface TableScreenStoreActions extends TableScreenStore {
  setSelectedSpace: (spaceId?: string) => void
  setSpaceIsModalOpen: (isOpen: boolean) => void
  setTableChoosen: (table?: SelectedTable) => void
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
  setTableChoosen: (table?: SelectedTable) => set({ tableChoosen: table }),
  setSelectedSpace: (spaceId?: string) => set({ selectedSpaceId: spaceId }),
  setSpaceIsModalOpen: (isOpen: boolean) => set({ isSpaceModalOpen: isOpen }),
  setIsNewTableModalOpen: (isOpen: boolean) => set({ isNewTableModalOpen: isOpen })
}))
