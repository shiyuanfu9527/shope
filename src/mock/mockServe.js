// 先引入mockjs模块
import  Mock  from "mockjs";
// 把JSON数据格式引入进来
// webpack 默认对外暴露的：图片、JSON数据格式
import banner from './banner'
import floor from './floor'

// mock数据:第一个参数请求地址 第二个参数：请求数据
Mock.mock("/mock/banner",{code:200,data:banner}) //模拟首页大的轮播图的数据
Mock.mock("/mock/floor",{code:200,data:floor})