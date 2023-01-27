import { DaysOfWeekType } from 'app-helpers'
import { create } from 'zustand'

export interface ScheduleStore {
  daysOfTheWeek: {
    [key in DaysOfWeekType]: {
      isOpen: boolean
      openHour?: string
      closeHour?: string
    }
  }
}

const initialState = (): ScheduleStore => ({
  daysOfTheWeek: {
    Monday: {
      isOpen: false,
    },
    Tuesday: {
      isOpen: false,
    },
    Wednesday: {
      isOpen: false,
    },
    Thursday: {
      isOpen: false,
    },
    Friday: {
      isOpen: false,
    },
    Saturday: {
      isOpen: false,
    },
    Sunday: {
      isOpen: false,
    }
  }
})

// create interface for store actions
export interface ScheduleStoreActions extends ScheduleStore {
  toggleDay: (day: DaysOfWeekType) => void
  setOpenHour: (day: DaysOfWeekType, hour: string) => void
  setCloseHour: (day: DaysOfWeekType, hour: string) => void
}

export const useScheduleStore = create<ScheduleStoreActions>((set) => ({
  ...initialState(),
  toggleDay: (day: DaysOfWeekType) => set(state => {
    return { ...state, daysOfTheWeek: { ...state.daysOfTheWeek, [day]: { ...state.daysOfTheWeek[day], isOpen: !state.daysOfTheWeek[day].isOpen } } }
  }),
  setOpenHour: (day: DaysOfWeekType, hour) => set(state => {
    console.log('setOpenHour', day, hour)
    return { ...state, daysOfTheWeek: { ...state.daysOfTheWeek, [day]: { ...state.daysOfTheWeek[day], openHour: hour } } }
  }),
  setCloseHour: (day: DaysOfWeekType, hour) => set(state => {
    return { ...state, daysOfTheWeek: { ...state.daysOfTheWeek, [day]: { ...state.daysOfTheWeek[day], closeHour: hour } } }
  })
}))