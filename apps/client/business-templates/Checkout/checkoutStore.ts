import { getFixedPointPercentage, typedKeys } from 'app-helpers';
import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'

const percentagesAndValues = {
  "0%": 0,
  "10%": 1000,
  "15%": 1500,
  "18%": 1800,
  "20%": 2000,
  "Custom": 0,
}

export type Percentages = keyof typeof percentagesAndValues
export const percentages = typedKeys(percentagesAndValues)

interface CheckoutStore {
  tip: number;
  discount: number;
  customTip: number;
  customDiscount: number;
  selectedTip: typeof percentages[number];
  selectedDiscount: typeof percentages[number];
  setTip: (tip: number) => void;
  setDiscount: (discount: number) => void;
  setSelectedTip: (selectedTip: typeof percentages[number]) => void;
  setSelectedDiscount: (selectedDiscount: typeof percentages[number]) => void;
  setCustomTip: (customTip: number, total?: number) => void;
  setCustomDiscount: (customDiscount: number, total?: number) => void;
}

// TODO: add getters https://github.com/pmndrs/zustand/discussions/1166
// @ts-ignore
export const useCheckoutStore = create<CheckoutStore>(devtools(((set) => ({
  tip: 1000,
  discount: 0,
  customTip: 0,
  customDiscount: 0,
  selectedTip: "10%",
  selectedDiscount: "0%",
  setCustomTip: (customTip, total) => {
    if (total && customTip) {
      const tip = getFixedPointPercentage(customTip / total)
      set({ customTip, tip })
    }
  },
  setCustomDiscount: (customDiscount, total) => {
    console.log("customDiscount", customDiscount)
    if (total && customDiscount) {
      const discount = getFixedPointPercentage(customDiscount / total)
      set({ customDiscount, discount })
    }
  },
  setTip: (tip: number) => set({ tip }),
  setDiscount: (discount: number) => set({ discount }),
  setSelectedTip: (selectedTip: typeof percentages[number]) => {
    if (selectedTip === "Custom") {
      return set({ selectedTip, tip: 0 })
    }
    set({
      tip: percentagesAndValues[selectedTip],
      selectedTip
    })
  },
  setSelectedDiscount: (selectedDiscount: typeof percentages[number]) => {
    if (selectedDiscount === "Custom") {
      return set({ selectedDiscount, discount: 0 })
    }
    set({
      discount: percentagesAndValues[selectedDiscount],
      selectedDiscount
    })
  }
}))))