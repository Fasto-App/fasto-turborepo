import { typedKeys } from 'app-helpers';
import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'

const percentagesAndValues = {
  "0%": 0,
  "10%": 0.1,
  "15%": 0.15,
  "18%": 0.18,
  "20%": 0.2,
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

// @ts-ignore
export const useCheckoutStore = create<CheckoutStore>(devtools(((set) => ({
  tip: 0.1,
  discount: 0,
  customTip: 0,
  customDiscount: 0,
  selectedTip: "10%",
  selectedDiscount: "0%",
  setCustomTip: (customTip, total) => {
    if (total && customTip) {
      const tip = customTip / total
      set({ customTip, tip })
    }
  },
  setCustomDiscount: (customDiscount, total) => {
    console.log("customDiscount", customDiscount)
    if (total && customDiscount) {
      const discount = customDiscount / total
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