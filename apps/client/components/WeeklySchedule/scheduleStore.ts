import { DaysOfWeekType, HoursOfOperationType } from 'app-helpers'
import { create } from 'zustand'

export interface ScheduleStore {
  daysOfTheWeek: HoursOfOperationType
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

export interface ScheduleStoreActions extends ScheduleStore {
  toggleDay: (day: DaysOfWeekType) => void
  setOpenHour: (day: DaysOfWeekType, hour: string) => void
  setCloseHour: (day: DaysOfWeekType, hour: string) => void
}

export const useScheduleStore = create<ScheduleStoreActions>((set) => ({
  ...initialState(),
  toggleDay: (day: DaysOfWeekType) => set(state => {
    return {
      daysOfTheWeek: {
        ...state.daysOfTheWeek,
        [day]: {
          ...state.daysOfTheWeek[day],
          isOpen: !state.daysOfTheWeek[day]?.isOpen
        }
      }
    }
  }),
  setOpenHour: (day: DaysOfWeekType, hour) => set(state => {
    return {
      daysOfTheWeek: {
        ...state.daysOfTheWeek,
        [day]: {
          ...state.daysOfTheWeek[day],
          hours: {
            ...state.daysOfTheWeek[day]?.hours,
            open: hour
          }
        }
      }
    }
  }),
  setCloseHour: (day: DaysOfWeekType, hour) => set(state => {
    return {
      daysOfTheWeek: {
        ...state.daysOfTheWeek,
        [day]: {
          ...state.daysOfTheWeek[day],
          hours: {
            ...state.daysOfTheWeek[day]?.hours,
            close: hour
          }
        }
      }
    }
  })
}))