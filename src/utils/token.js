// 存储token
export const setToken = (token)=>{
    localStorage.setItem('TOKEN',token)
}
// 引入token
export const getToken=()=>{
    return localStorage.getItem("TOKEN")
}
export const removeToken = ()=>{
    localStorage.removeItem("TOKEN")
}