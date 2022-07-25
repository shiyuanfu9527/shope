// vue插件一定暴露一个对象
let myPlugins = {}

myPlugins.install = function(Vue,options){
    // Vue.prototype.$bus:任何组件都可以使用

    Vue.directive(options.name, function (el, params ) {
        el.innerHtml = params.value.toUpperCase()
        
    });
}

export default myPlugins