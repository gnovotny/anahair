import create from 'zustand'

type State = {
  displayMenu: boolean
  closeMenu: () => void
  openMenu: () => void
  toggleMenu: () => void

  displayInfo: boolean
  closeInfo: () => void
  openInfo: () => void
  toggleInfo: () => void

  addendumActive: boolean
  setAddendumActive: (active: boolean) => void

  thresholds: Record<string, any>
  addThreshold: (threshold: { id: string; value: any }) => void
}
export const useStore = create<State>((set, get) => ({
  displayMenu: false,
  closeMenu: () => set({ displayMenu: false }),
  openMenu: () => set({ displayMenu: true }),
  toggleMenu: () => set({ displayMenu: !get().displayMenu, displayInfo: false }),

  displayInfo: false,
  closeInfo: () => set({ displayInfo: false }),
  openInfo: () => set({ displayInfo: true }),
  toggleInfo: () => set({ displayInfo: !get().displayInfo, displayMenu: false }),

  addendumActive: false,
  setAddendumActive: (addendumActive) => set({ addendumActive }),

  thresholds: {},
  addThreshold: ({ id, value }) => {
    let thresholds = { ...get().thresholds }
    thresholds[id] = value
    set({ thresholds })
  },
}))
