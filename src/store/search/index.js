import { reqGetSearchInfo } from "@/api"
export default ({
    namespaced:true,
    state:{
        searchList:{}
    },
    actions:{
          // 获取search模块数据
        async getSearchList({commit},params={}){
        //   params形参：是当用户派发action的时候，第二个参数传递过来的，至少是一个空对象
          let result = await reqGetSearchInfo(params)
          if(result.code==200){
              commit("GETSEARCHINFO",result.data)
          }
        }},
    mutations:{
        GETSEARCHINFO(state,searchList){
        state.searchList = searchList
    }},
    
        // 计算属性，在项目中简化仓库中的数据
        // 可以把我们将来在组件当中需要用的的数据简化一下【将来组件在获取数据的时候就方便了】
    getters:{
        // 当前形参state，当前仓库中的state，并非大仓库中的那个state
        goodsList(state){
            return state.searchList.goodsList || []
        },
        trademarkList(state){
            return state.searchList.trademarkList ||[]
        },
        attrsList(state){
            return state.searchList.attrsList ||[]
        }
    }
})
