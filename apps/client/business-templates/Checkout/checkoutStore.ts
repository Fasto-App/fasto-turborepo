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

// have an object with keys that point to custom subtotal values
// at first these values are 0 or null, but at users onChange event
// update the values in the object

interface CheckoutStore {
  tip: number;
  discount: number;
  customTip: number;
  customDiscount: number;
  customSubTotals: Record<string, number>;
  selectedTip: typeof percentages[number];
  selectedDiscount: typeof percentages[number];
  setTip: (tip: number) => void;
  setDiscount: (discount: number) => void;
  setSelectedTip: (selectedTip: typeof percentages[number]) => void;
  setSelectedDiscount: (selectedDiscount: typeof percentages[number]) => void;
  setCustomTip: (customTip: number, total?: number) => void;
  setCustomDiscount: (customDiscount: number, total?: number) => void;
  setCustomSubTotal: (key: string, value: string) => void;
  clearCustomSubTotals: () => void;
}

// TODO: add getters https://github.com/pmndrs/zustand/discussions/1166
// @ts-ignore
export const useCheckoutStore = create<CheckoutStore>(devtools(((set) => ({
  tip: 1000,
  discount: 0,
  customTip: 0,
  customDiscount: 0,
  customSubTotals: {},
  selectedTip: "10%",
  selectedDiscount: "0%",
  setCustomTip: (customTip, total) => {
    if (total && customTip) {
      const tip = getFixedPointPercentage(customTip / total)
      set({ customTip, tip })
    }
  },
  setCustomDiscount: (customDiscount, total) => {
    if (total && customDiscount) {
      const discount = getFixedPointPercentage(customDiscount / total)
      set({ customDiscount, discount })
    }
  },
  setCustomSubTotal: (key: string, value: string) => {
    const text = value.replace(/[$,.]/g, '')
    const convertedValue = Number(text)

    if (Number.isInteger(convertedValue)) {
      set(state => ({
        customSubTotals: {
          ...state.customSubTotals,
          [key]: convertedValue
        }
      }))
    }
  },
  clearCustomSubTotals: () => set({ customSubTotals: {} }),
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