import {create} from 'zustand'

const useStore = create((set) => ({
  name: 'hsads', 
  setName: (newName:any) => set({ name: newName }), 
}));

export default useStore;
