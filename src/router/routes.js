// 路由配置信息
//引入路由组件
import Login from '@/views/Login'
import Register from '@/views/Register'
import Detail from '@/views/Detail'
import AddCartSuccess from '@/views/AddCartSuccess'
import ShopCart from '@/views/ShopCart'
import Trade from '@/views/Trade'
import Pay from '@/views/Pay'
import PaySuccess from '@/views/PaySuccess'
import Center from '@/views/Center'
// 引入二级路由组件
import MyOrder from '@/views/Center/myOrder'
import GroupOrder from '@/views/Center/groupOrder'


/* 
    当打包构建应用时，javaScript包会变得非常大，影响页面加载
    如果我们能把不同路由对应的组件分隔成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了
*/
export default [
    {
        path: "/home",
        // 路由懒加载
        component:()=>import("@/views/MyHome"),
        // component: MyHome,
        meta: { show: true }
    },
    {
        path: "/center",
        component: Center,
        meta: { show: true },
        // 二级路由组件
        children:[
            {
                path:'myorder',
                component:MyOrder
            },
            {
                path:'grouporder',
                component:GroupOrder
            },
            {
                path:'/center',
                redirect:'/center/myorder'
            }
        ]
    },
    {
        path: "/paysuccess",
        component: PaySuccess,
        meta: { show: true }
    },
    {
        path: "/trade",
        component: Trade,
        meta: { show: true },
        // 路由独享守卫
        beforeEnter: (to, from, next) => {
            // ...
            if(from.toPath=='/shopcart'){
                next()
            }else{
                next(false)
            }
        }
    },
    {
        path: "/pay",
        component: Pay,
        meta: { show: true },
        beforeEnter: (to, from, next) => {
            if(from.path=='/trade'){
                next()
            }else{
                next(false)
            }
        }
    },
    {
        path: "/detail/:skuId",
        component: Detail,
        meta: { show: true }
    },
    {
        path: "/shopcart",
        component: ShopCart,
        meta: { show: true }
    },
    {
        path: "/addcartsuccess",
        name:'addcartsuccess',
        component: AddCartSuccess,
        meta: { show: true }
    },
    {
        path: "/search/:keyword?",
        component: ()=>import('@/views/MySearch'),
        meta: { show: true },
        name: 'search',
        //路由组件能不能传递props数据？
        //布尔值写法：params
        // props:true
        //对象写法：额外的给路由组件传递一些props
        //props：{a:1,b:2},
        //函数写法：可以params参数、query参数，通过props传递给路由组件
        // props:(route =>{
        // //函数体
        // return {keyword:$route.params.keyword,k:$route.query.k}
        // })
    },
    {
        path: "/login",
        component: Login,
        meta: { show: false }
    },
    {
        path: "/register",
        component: Register,
        meta: { show: false }
    },
    //重定向在项目跑起来的时候，访问/,立马让他定向到首页
    {
        path: '*',
        redirect: '/home'
    }
]