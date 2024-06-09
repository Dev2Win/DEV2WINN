import {create} from 'zustand'

const useStore = create((set:any) => ({
  name: '', 
  setName: (newName:any) => set({ name: newName }), 

  userDetails: {}, 
  setUserDetails: (newDetails: any) => set({ userDetails: newDetails }),
}));

export default useStore;
