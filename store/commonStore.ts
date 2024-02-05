import { create } from 'zustand';


export interface BasketState {
  userInfo:any;
  setUserInfo: (token:any) => void;
  geoPoint:any;
  setGeoPoint: (data:any) => void;
}


const useCommonStore = create<BasketState>()((set) => ({
    userInfo:null,
    setUserInfo:(userInfo:any)=> {
    set({userInfo})
  },
  geoPoint:{ lat:0, lon:0},
  setGeoPoint:(geoPoint:any)=>{
    set({geoPoint})
  }
}));

export default useCommonStore;
