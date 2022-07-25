<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread:面包屑-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 分类的面包屑 -->
            <li class="with-x" v-if="searchParams.categoryName">{{searchParams.categoryName}}<i @click="removeCategoryName">x</i></li>
            <!-- 关键字的面包屑 -->
            <li class="with-x" v-if="searchParams.keyword">{{searchParams.keyword}}<i @click="removeKeyword">x</i></li>
            <!-- 品牌的面包屑 -->
            <li class="with-x" v-if="searchParams.trademark">{{searchParams.trademark.split(":")[1]}}<i @click="removeTrademark">x</i></li>
            <!-- 平台的售卖的属性值展示 -->
            <li class="with-x" v-for="(attrValue,index) in searchParams.props" :key="index">{{attrValue.split(":")[1]}}<i @click="removeAttr(index)">x</i></li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector @trademarkInfo="trademarkInfo" @attrInfo="attrInfo" />
        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li :class="{active: isOne}" @click="changeOrder('1')">
                  <a>综合 <span v-show="isOne"  ></span><div style="display:inline-block" v-show="isOne"><span v-if="isAsc">↑</span><span v-if="isDesc">↓</span></div></a>
                </li>
                <li :class="{active: isTwo} "@click="changeOrder('2')">
                  <a>价格<span v-show="isTwo" ></span><div style="display:inline-block" v-show="isTwo"><span v-if="isAsc">↑</span><span v-if="isDesc">↓</span></div></a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 销售产品列表 -->
          <div class="goods-list" v-show="goodsList">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="good in goodsList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <router-link :to="`/detail/${good.id}`">
                      <img v-lazy="good.defaultImg" />
                    </router-link> 
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{good.price}}</i>
                    </strong> 
                  </div>
                  <div class="attr">
                    <a target="_blank" href="item.html" title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】">{{good.title}}</a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a href="success-cart.html" target="_blank" class="sui-btn btn-bordered btn-danger">加入购物车</a>
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器 -->
          <Pagination :pageNo="searchParams.pageNo" :pageSize="searchParams.pageSize" :total="total" :continues="5" @getPageNo="getPageNo"></Pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import SearchSelector from './SearchSelector/SearchSelector'
  import {mapGetters,mapState} from 'vuex'

  export default {
    name: 'MySearch',
    components: {
      SearchSelector
    },
    data() {
      return {
        searchParams:{
          // 一级分类id
          category1Id: "",
          category3Id: "",
          categoryName:"",
          keyword: "",
          // 排序的初始状态应该是综合|降序
          order: "1:asc",
          pageNo: 1,
          pageSize: 3,
          // 筛选带的参数
          props: [],
          trademark: ""

        }
      }
    },
    beforeMount() {
      // 在发请求之前，把接口需要的传递参数，进行整理
      Object.assign(this.searchParams,this.$route.query,this.$route.params)
    },
    mounted(){
      // 在发请求之前带给服务器参数【searchParms参数发生变化的数值带给服务器】
      this.getData()
    },
    computed:{
      
      ...mapGetters('search',['goodsList']),
      isOne(){
        return this.searchParams.order.indexOf('1')!=-1
      },
      isTwo(){
         return this.searchParams.order.indexOf('2')!=-1
      },
      isAsc(){
         return this.searchParams.order.indexOf('asc')!=-1
      },
      isDesc(){
        return this.searchParams.order.indexOf('desc')!=-1
      },
      // 获取search模块展示产品一共多少数据
      ...mapState({
        total:state=>state.search.searchList.total
      })
    },
    methods: {
      // 向服务器发请求获取search模块数据【根据参数不同返回不同的数据进行展示】
      // 把这次请求封装为一个函数：当你需要在调用的时候调用即可
      getData(){
          this.$store.dispatch("search/getSearchList",this.searchParams)
      },
      // 删除分类的名字
      removeCategoryName(){
        // 把带给服务器的参数置空了，还需要向服务器发起请求
        // 带给服务器参数说明可有可无的：如果属性值为空的字符串还是会把相应的字段带给服务器
        // 但是你把相应的字段变为undefined，当前这个字段不会带给服务器
        this.searchParams.categoryName= undefined
         this.searchParams.category1Id = undefined
        this.searchParams.category2Id = undefined
        this.searchParams.category3Id = undefined
        this.getData()
        // 地址栏也需要修改：进行路由跳转(现在的路由跳转只是跳转到自己这里)
        // 严谨：本意是删除query，如果路径当中出现params不应该删除，路由跳转的时候应该带着
        if(this.$route.params){
        this.$router.push({name:'search',params:this.$route.params})
        }

      },
      removeKeyword(){
        this.searchParams.keyword = undefined
        this.getData()
        // 通知兄弟组件header清除关键字
        this.$bus.$emit("clear")
        this.$router.push({name:'search',query:this.$route.query})
      },
      trademarkInfo(trademark){
          // 整理品牌字段的参数 
          this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`
          this.getData();
      },
      removeTrademark(){
        this.searchParams.trademark = undefined
        this.getData()
      },
      attrInfo(attr,attrValue){
        // ["属性ID：属性值：属性名"]
        // 参数格式整理好
        let props = `${attr.attrId}:${attrValue}:${attr.attrName}`
        // 数组去重

       if (this.searchParams.props.indexOf(props)==-1){
         this.searchParams.props.push(props)
       }
        // 再次发请求
        this.getData()
      },
      // 删除售卖的属性
      removeAttr(index){
        // 再次整理参数
        this.searchParams.props.splice(index,1)
        this.getData()
      },
      changeOrder(flag){
        // flag形参：它是一个标记，代表用户点击的是综合（1）价格（2）
        let originOrder = this.searchParams.order
        // 这里获取到的是最开始的状态
        let originFlag =  originOrder.split(":")[0]
        let orginSort = originOrder.split(":")[1]
        let newOrder = ''
        // 这个语句我能确定点击的的一定是综合
        if(flag==originFlag){
          newOrder = `${originFlag}:${orginSort=="desc"?"asc":"desc"}`
        }else{
          // 点击的是价格
          newOrder =  `${flag}:${'desc'}`
        }
        // 将新的order赋予searchParams
        this.searchParams.order = newOrder
        // 再次发请求
        this.getData()
      },
      getPageNo(PageNo){
        // 整理带给服务器参数
        this.searchParams.pageNo = PageNo
        // 再次发起请求
        this.getData()
      }
    },
    watch: {
      $route(newValue,oldValue){
        // 再次发请求之前整理带给服务器参数
        Object.assign(this.searchParams,this.$route.query,this.$route.params)
        // 再次发起ajax请求
        this.getData()
        // 每一次请求完毕，应该把相应的123级分类的id置空，让他接受下一次的相应i
        this.searchParams.category1Id = undefined
        this.searchParams.category2Id = undefined
        this.searchParams.category3Id = undefined
      }
    },

  }
</script>

<style scoped>
 .main {
  margin: 10px 0;
}
 .main .py-container {
  width: 1200px;
  margin: 0 auto;
}
 .main .py-container .bread {
  margin-bottom: 5px;
  overflow: hidden;
}
 .main .py-container .bread .sui-breadcrumb {
  padding: 3px 15px;
  margin: 0;
  font-weight: 400;
  border-radius: 3px;
  float: left;
}
 .main .py-container .bread .sui-breadcrumb li {
  display: inline-block;
  line-height: 18px;
}
 .main .py-container .bread .sui-breadcrumb li a {
  color: #666;
  text-decoration: none;
}
 .main .py-container .bread .sui-breadcrumb li a:hover {
  color: #4cb9fc;
}
 .main .py-container .bread .sui-tag {
  margin-top: -5px;
  list-style: none;
  font-size: 0;
  line-height: 0;
  padding: 5px 0 0;
  margin-bottom: 18px;
  float: left;
}
 .main .py-container .bread .sui-tag .with-x {
  font-size: 12px;
  margin: 0 5px 5px 0;
  display: inline-block;
  overflow: hidden;
  color: #000;
  background: #f7f7f7;
  padding: 0 7px;
  height: 20px;
  line-height: 20px;
  border: 1px solid #dedede;
  white-space: nowrap;
  transition: color 400ms;
  cursor: pointer;
}
 .main .py-container .bread .sui-tag .with-x i {
  margin-left: 10px;
  cursor: pointer;
  font: 400 14px tahoma;
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}
 .main .py-container .bread .sui-tag .with-x:hover {
  color: #28a3ef;
}
 .main .py-container .selector {
  border: 1px solid #ddd;
  margin-bottom: 5px;
  overflow: hidden;
}
 .main .py-container .selector .logo {
  border-top: 0;
  margin: 0;
  position: relative;
  overflow: hidden;
}
 .main .py-container .selector .logo .key {
  padding-bottom: 87px!important;
}
 .main .py-container .selector .type-wrap {
  margin: 0;
  position: relative;
  border-top: 1px solid #ddd;
  overflow: hidden;
}
 .main .py-container .selector .type-wrap .key {
  width: 100px;
  background: #f1f1f1;
  line-height: 26px;
  text-align: right;
  padding: 10px 10px 0 15px;
  float: left;
}
 .main .py-container .selector .type-wrap .value {
  overflow: hidden;
  padding: 10px 0 0 15px;
  color: #333;
  margin-left: 120px;
  padding-right: 90px;
}
 .main .py-container .selector .type-wrap .value .logo-list li {
  float: left;
  border: 1px solid #e4e4e4;
  margin: -1px -1px 0 0;
  width: 105px;
  height: 52px;
  text-align: center;
  line-height: 52px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 700;
  color: #e1251b;
  font-style: italic;
  font-size: 14px;
}
 .main .py-container .selector .type-wrap .value .logo-list li img {
  max-width: 100%;
  vertical-align: middle;
}
 .main .py-container .selector .type-wrap .value .type-list li {
  float: left;
  display: block;
  margin-right: 30px;
  line-height: 26px;
}
 .main .py-container .selector .type-wrap .value .type-list li a {
  text-decoration: none;
  color: #666;
}
 .main .py-container .selector .type-wrap .ext {
  position: absolute;
  top: 10px;
  right: 10px;
}
 .main .py-container .selector .type-wrap .ext .sui-btn {
  display: inline-block;
  padding: 2px 14px;
  box-sizing: border-box;
  margin-bottom: 0;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  padding: 0 10px;
  background: #fff;
  border: 1px solid #d5d5d5;
}
 .main .py-container .selector .type-wrap .ext a {
  color: #666;
}
 .main .py-container .details {
  margin-bottom: 5px;
}
 .main .py-container .details .sui-navbar {
  overflow: visible;
  margin-bottom: 0;
}
 .main .py-container .details .sui-navbar .filter {
  min-height: 40px;
  padding-right: 20px;
  background: #fbfbfb;
  border: 1px solid #e2e2e2;
  padding-left: 0;
  border-radius: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);
}
 .main .py-container .details .sui-navbar .filter .sui-nav {
  position: relative;
  left: 0;
  display: block;
  float: left;
  margin: 0 10px 0 0;
}
 .main .py-container .details .sui-navbar .filter .sui-nav li {
  float: left;
  line-height: 18px;
}
 .main .py-container .details .sui-navbar .filter .sui-nav li a {
  display: block;
  cursor: pointer;
  padding: 11px 15px;
  color: #777;
  text-decoration: none;
}
 .main .py-container .details .sui-navbar .filter .sui-nav li.active a {
  background: #e1251b;
  color: #fff;
}
 .main .py-container .details .goods-list {
  margin: 20px 0;
}
 .main .py-container .details .goods-list ul {
  display: flex;
  flex-wrap: wrap;
}
 .main .py-container .details .goods-list ul li {
  height: 100%;
  width: 20%;
  margin-top: 10px;
  line-height: 28px;
}
 .main .py-container .details .goods-list ul li .list-wrap .p-img {
  padding-left: 15px;
  width: 215px;
  height: 255px;
}
 .main .py-container .details .goods-list ul li .list-wrap .p-img a {
  color: #666;
}
 .main .py-container .details .goods-list ul li .list-wrap .p-img a img {
  max-width: 100%;
  height: auto;
  vertical-align: middle;
}
 .main .py-container .details .goods-list ul li .list-wrap .price {
  padding-left: 15px;
  font-size: 18px;
  color: #c81623;
}
 .main .py-container .details .goods-list ul li .list-wrap .price strong {
  font-weight: 700;
}
 .main .py-container .details .goods-list ul li .list-wrap .price strong i {
  margin-left: -5px;
}
 .main .py-container .details .goods-list ul li .list-wrap .attr {
  padding-left: 15px;
  width: 85%;
  overflow: hidden;
  margin-bottom: 8px;
  min-height: 38px;
  cursor: pointer;
  line-height: 1.8;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
 .main .py-container .details .goods-list ul li .list-wrap .attr a {
  color: #333;
  text-decoration: none;
}
 .main .py-container .details .goods-list ul li .list-wrap .commit {
  padding-left: 15px;
  height: 22px;
  font-size: 13px;
  color: #a7a7a7;
}
 .main .py-container .details .goods-list ul li .list-wrap .commit span {
  font-weight: 700;
  color: #646fb0;
}
 .main .py-container .details .goods-list ul li .list-wrap .operate {
  padding: 12px 15px;
}
 .main .py-container .details .goods-list ul li .list-wrap .operate .sui-btn {
  display: inline-block;
  padding: 2px 14px;
  box-sizing: border-box;
  margin-bottom: 0;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  border-radius: 0;
  background-color: transparent;
  margin-right: 15px;
}
 .main .py-container .details .goods-list ul li .list-wrap .operate .btn-bordered {
  min-width: 85px;
  background-color: transparent;
  border: 1px solid #8c8c8c;
  color: #8c8c8c;
}
 .main .py-container .details .goods-list ul li .list-wrap .operate .btn-bordered:hover {
  border: 1px solid #666;
  color: #fff !important;
  background-color: #666;
  text-decoration: none;
}
 .main .py-container .details .goods-list ul li .list-wrap .operate .btn-danger {
  border: 1px solid #e1251b;
  color: #e1251b;
}
 .main .py-container .details .goods-list ul li .list-wrap .operate .btn-danger:hover {
  border: 1px solid #e1251b;
  background-color: #e1251b;
  color: white!important;
  text-decoration: none;
}
 .main .py-container .details .page {
  width: 733px;
  height: 66px;
  overflow: hidden;
  float: right;
}
 .main .py-container .details .page .sui-pagination {
  margin: 18px 0;
}
 .main .py-container .details .page .sui-pagination ul {
  margin-left: 0;
  margin-bottom: 0;
  vertical-align: middle;
  width: 490px;
  float: left;
}
 .main .py-container .details .page .sui-pagination ul li {
  line-height: 18px;
  display: inline-block;
}
 .main .py-container .details .page .sui-pagination ul li a {
  position: relative;
  float: left;
  line-height: 18px;
  text-decoration: none;
  background-color: #fff;
  border: 1px solid #e0e9ee;
  margin-left: -1px;
  font-size: 14px;
  padding: 9px 18px;
  color: #333;
}
 .main .py-container .details .page .sui-pagination ul li.active a {
  background-color: #fff;
  color: #e1251b;
  border-color: #fff;
  cursor: default;
}
 .main .py-container .details .page .sui-pagination ul li.prev a {
  background-color: #fafafa;
}
 .main .py-container .details .page .sui-pagination ul li.disabled a {
  color: #999;
  cursor: default;
}
 .main .py-container .details .page .sui-pagination ul li.dotted span {
  margin-left: -1px;
  position: relative;
  float: left;
  line-height: 18px;
  text-decoration: none;
  background-color: #fff;
  font-size: 14px;
  border: 0;
  padding: 9px 18px;
  color: #333;
}
 .main .py-container .details .page .sui-pagination ul li.next a {
  background-color: #fafafa;
}
 .main .py-container .details .page .sui-pagination div {
  color: #333;
  font-size: 14px;
  float: right;
  width: 241px;
}
 .main .py-container .hot-sale {
  margin-bottom: 5px;
  border: 1px solid #ddd;
}
 .main .py-container .hot-sale .title {
  font-weight: 700;
  font-size: 14px;
  line-height: 21px;
  border-bottom: 1px solid #ddd;
  background: #f1f1f1;
  color: #333;
  margin: 0;
  padding: 5px 0 5px 15px;
}
 .main .py-container .hot-sale .hot-list {
  padding: 15px;
}
 .main .py-container .hot-sale .hot-list ul {
  display: flex;
}
 .main .py-container .hot-sale .hot-list ul li {
  width: 25%;
  height: 100%;
}
 .main .py-container .hot-sale .hot-list ul li .list-wrap .p-img,
 .main .py-container .hot-sale .hot-list ul li .list-wrap .price,
 .main .py-container .hot-sale .hot-list ul li .list-wrap .attr,
 .main .py-container .hot-sale .hot-list ul li .list-wrap .commit {
  padding-left: 15px;
}
 .main .py-container .hot-sale .hot-list ul li .list-wrap .p-img img {
  max-width: 100%;
  vertical-align: middle;
  border: 0;
}
 .main .py-container .hot-sale .hot-list ul li .list-wrap .attr {
  width: 85%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin-bottom: 8px;
  min-height: 38px;
  cursor: pointer;
  line-height: 1.8;
}
 .main .py-container .hot-sale .hot-list ul li .list-wrap .price {
  font-size: 18px;
  color: #c81623;
}
 .main .py-container .hot-sale .hot-list ul li .list-wrap .price strong {
  font-weight: 700;
}
 .main .py-container .hot-sale .hot-list ul li .list-wrap .price strong i {
  margin-left: -5px;
}
 .main .py-container .hot-sale .hot-list ul li .list-wrap .commit {
  height: 22px;
  font-size: 13px;
  color: #a7a7a7;
}
</style>