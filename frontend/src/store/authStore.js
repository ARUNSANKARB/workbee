import {create} from 'zustand';
import {authAPI} from "../services/api"

const useAuthStore = create((set)=>({
  token:localStorage.getItem("token"),
  user:JSON.parse(localStorage.getItem("user")),
  role:JSON.parse(localStorage.getItem("user"))?.role,
  login: async(data) => {
    const res = await authAPI.login(data)
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user",JSON.stringify(res.data.user));
    set({token:res.data.token,
      user:res.data.user,
      role:res.data.user?.role
    })
  },
  logout:()=>{
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("role")
    set({token:null,
      user:null,
      role:null
    })
  },
  register:async(data)=>{
    const res=await authAPI.register(data);
    localStorage.setItem("user",JSON.stringify(res.data.user));
    localStorage.setItem("role",JSON.stringify(res.data.user?.role))
    set({
      user:res.data.user,
      role:res.data.user?.role
    })
  }
}))

export default useAuthStore;