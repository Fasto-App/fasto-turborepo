import { SplitType, getFixedPointPercentage, getPercentageOfValue, typedKeys, typedValues } from 'app-helpers';
import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { SelectData } from '../../components/FDSSelect';
import { shallow } from 'zustand/shallow';

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

export const percentageSelectData: SelectData[] = percentages.map(percentage => ({
  _id: percentage,
  value: percentage,
}))

type Order = {
  subTotal: number;
  user?: string | null;
  [key: string]: any;
}

type SPlitByPatron = { [key: string]: { subTotal: number }, tab: { subTotal: number } }

interface CheckoutStore {
  tip: number;
  discount: number;
  customTip: number;
  customDiscount: number;
  customSubTotals: Record<string, number>;
  selectedTip: typeof percentages[number];
  selectedDiscount: typeof percentages[number];
  total: number;
  selectedSplitType: SplitType;
  selectedUsers: { [key: string]: boolean };
  splitByPatron: SPlitByPatron;
  setSelectedUsers: (selectedUsers: { [key: string]: boolean }) => void;
  setSelectedSplitType: (selectedSplitType: SplitType) => void;
  setTotal: (total: number) => void;
  setTip: (tip: number) => void;
  setDiscount: (discount: number) => void;
  setSelectedTip: (selectedTip: typeof percentages[number]) => void;
  setSelectedDiscount: (selectedDiscount: typeof percentages[number]) => void;
  setCustomTip: (customTip: number) => void;
  setCustomDiscount: (customDiscount: number, total?: number) => void;
  setCustomSubTotal: (key: string, value: string) => void;
  clearCustomSubTotals: () => void;
  setSplitByPatron: (orders: Order[]) => void;
}

// TODO: add getters https://github.com/pmndrs/zustand/discussions/1166
// @ts-ignore
export const useCheckoutStore = create<CheckoutStore>(devtools(subscribeWithSelector(((set, get) => ({
  total: 0,
  tip: 1000,
  discount: 0,
  customTip: 0,
  customDiscount: 0,
  customSubTotals: {},
  selectedTip: "10%",
  selectedDiscount: "0%",
  selectedSplitType: "ByPatron",
  selectedUsers: {},
  splitByPatron: { tab: { subTotal: 0 } },
  setSplitByPatron: (orders: Order[]) => {
    const splitByPatron = orders.reduce((acc, order) => {
      const { user, subTotal } = order

      if (!user) {
        return {
          ...acc,
          tab: {
            subTotal: (acc.tab?.subTotal || 0) + subTotal
          }
        }
      }

      return ({
        ...acc,
        [user]: {
          subTotal: (acc[user]?.subTotal || 0) + subTotal
        }
      })
    }, { tab: { subTotal: 0 } } as SPlitByPatron)

    set({ splitByPatron })

  },
  setSelectedUsers: (selectedUsers: { [key: string]: boolean }) => set({ selectedUsers }),
  setSelectedSplitType: (selectedSplitType: SplitType) => set({ selectedSplitType }),
  setTotal: (total: number) => set({ total }),
  setCustomTip: (customTip) => {
    const { total } = get()
    const tip = getFixedPointPercentage(customTip, total)

    set({ customTip, tip, })

  },
  setCustomDiscount: (customDiscount) => {
    const { total } = get()

    const discount = getFixedPointPercentage(customDiscount, total)
    set({ customDiscount, discount })
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
})))))

export const useComputedChekoutStore = () => {
  const store = useCheckoutStore(state => ({
    total: state.total,
    tip: state.tip,
    selectedTip: state.selectedTip,
    customTip: state.customTip,
    selectedDiscount: state.selectedDiscount,
    customDiscount: state.customDiscount,
    discount: state.discount,
    selectedUsers: state.selectedUsers,
    splitByPatron: state.splitByPatron,
  }),
    shallow
  )

  const percentageOfDiscount = getPercentageOfValue(store.total, store.discount)
  const percentageOfTip = getPercentageOfValue(store.total, store.tip)
  const valueOfDiscount = store.selectedDiscount === "Custom" ? store.customDiscount : percentageOfDiscount
  const valueOfTip = store.selectedTip === "Custom" ? store.customTip : percentageOfTip
  const absoluteTotal = store.total - valueOfDiscount + valueOfTip
  const numberOfSelectedUsers = typedValues(store.selectedUsers).filter(Boolean).length
  const splitEqually = numberOfSelectedUsers > 0 ? absoluteTotal / numberOfSelectedUsers : 0
  let amountPerUser = 0

  const computedSplitByPatron = typedKeys(store.splitByPatron).reduce((acc, key) => {
    const { subTotal } = store.splitByPatron[key]

    if (store.selectedUsers[key] && store.selectedUsers[key] === true) {
      return {
        ...acc,
        [key]: {
          subTotal
        }
      }
    }

    return {
      ...acc,
      tab: {
        subTotal: (acc.tab?.subTotal || 0) + subTotal
      }
    }
  }, { tab: { subTotal: valueOfTip } } as SPlitByPatron)

  // if there is a subtotal, add the amount per user to each user
  if (computedSplitByPatron.tab.subTotal) {
    amountPerUser = computedSplitByPatron.tab.subTotal / numberOfSelectedUsers
    const users = typedKeys(computedSplitByPatron)

    users.forEach(user => {
      if (user !== "tab") {
        computedSplitByPatron[user].subTotal += amountPerUser
      }
    })
  }

  return ({
    amountPerUser,
    computedSplitByPatron,
    absoluteTotal,
    tipCalculation: getPercentageOfValue(store.total, store.tip),
    discountCalculation: getPercentageOfValue(store.total, store.discount),
    splitEqually,
  })
}