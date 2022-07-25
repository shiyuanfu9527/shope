<template>
  <div class="type-nav">
    <div class="container">
      <!-- 事件委派||事件委托 -->
      <div @mouseleave="leaveShow" @mouseenter="enterShow">
        <h2 class="all">全部商品分类</h2>
        <!-- 三级联动 -->
        <!-- 过渡动画 -->
        <transition name="sort">
          <div class="sort" v-show="show">
            <!-- 利用事件委派+编程式导航实现路由的跳转与传递参数 -->
            <div class="all-sort-list2" @click="goSearch">
              <div
                class="item"
                v-for="(c1, index) in categoryList"
                :key="c1.categoryId"
                :class="{ cur: currentIndex == index }"
              >
                <h3 @mouseenter="changeIndex(index)">
                  <a
                    :data-categoryName="c1.categoryName"
                    :data-category1Id="c1.categoryId"
                    >{{ c1.categoryName }}</a
                  >
                </h3>
                <!-- 二、三级分类 -->
                <div
                  class="item-list clearfix"
                  :style="{ display: currentIndex == index ? 'block' : 'none' }"
                >
                  <div
                    class="subitem"
                    v-for="(c2, index) in c1.categoryChild"
                    :key="c2.categoryId"
                  >
                    <dl class="fore">
                      <dt>
                        <a
                          :data-categoryName="c2.categoryName"
                          :data-category2Id="c2.categoryId"
                          >{{ c2.categoryName }}</a
                        >
                      </dt>
                      <dd>
                        <em
                          v-for="(c3, index) in c2.categoryChild"
                          :key="c3.categoryId"
                        >
                          <a
                            :data-categoryName="c3.categoryName"
                            :data-category3Id="c3.categoryId"
                            >{{ c3.categoryName }}</a
                          >
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
//引入方式：是把lodash全部功能函数引入
import throttle from "lodash/throttle";
export default {
  name: "TypeNav",
  data() {
    return {
      //存储用户鼠标移上哪一个分类
      currentIndex: -1,
      show: true,
    };
  },
  //组件挂载完毕，可以向服务器发送请求
  mounted() {
    
    //当组件挂载完毕，让show属性变为false
    //如果不说home路由组件，将typeNav进行隐藏
    if (this.$route.path != "/home") {
      this.show = false;
    }
  },
  computed: {
    ...mapState({
      categoryList: (state) => state.home.categoryList,
    }),
  },
  methods: {
    //throttle回调函数别用箭头函数，可能出现上下文this
    changeIndex: throttle(function (index) {
      //  index:鼠标移上某一个一级分类的索引值
      //正常情况（用户慢慢操作）：鼠标进入，每一个一级分类h3，都会触发鼠标进入事件
      //非正常情况（操作很卡）：本身全部的一级分类都应该触发鼠标进入事件，但是经过测试，只有部分h3触发了
      //就是由于用户行为过快，导致浏览器反应不过来。如果当前回调函数中有一些大量业务，也有可能出现卡顿现象
      this.currentIndex = index;
    }, 20),

    goSearch(event) {
      //最好的解决方案：编程式导航+事件委派
      //存在一些问题：事件委派，是把全部的子节点【h3,dt,dl,em】的事件委派给父节点
      // 点击a标签的时候，才会进行路由跳转【怎么能确定点击的内容是a标签】
      // 存在另外一个问题：即使你能确定点击的是a标签，如何区分是一级、二级、三级分类的标签

      //第一个问题：把子节点当中a标签，我加上自定义属性:data-categoryName，其余的子节点是没有的
      let element = event.target;
      let { categoryname, category1id, category2id, category3id } =
        element.dataset;
      if (categoryname) {
        //整理路由跳转的参数
        let location = { name: "search" };
        let query = { categoryName: categoryname };
        // 一级分类、二级分类、三级分类的a标签
        if (category1id) {
          query.category1Id = category1id;
        } else if (category2id) {
          query.category2Id = category2id;
        } else if (category3id) {
          query.category3Id = category3id;
        }
        //判断：如果路由跳转的时候，带有params参数，捎带脚传递过去
        if(this.$route.params){
        location.params = this.$route.params
        location.query = query;
        // 路由跳转
        this.$router.push(location);
        }
      }
    },
    // 当鼠标移入的时候，让商品分类列表进行显示
    enterShow() {
      if (this.$route.path != "/home") {
        this.show = true;
      }
    },
    leaveShow() {
      this.currentIndex = -1;
      if (this.$route.path != "/home") {
        this.show = false;
      }
    },
  },
};
</script>

<style scoped>
.type-nav {
  border-bottom: 2px solid #e1251b;
}
.type-nav .container {
  width: 1200px;
  margin: 0 auto;
  display: flex;
  position: relative;
}
.type-nav .container .all {
  width: 210px;
  height: 45px;
  background-color: #e1251b;
  line-height: 45px;
  text-align: center;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
}
.type-nav .container .nav a {
  height: 45px;
  margin: 0 22px;
  line-height: 45px;
  font-size: 16px;
  color: #333;
}
.type-nav .container .sort {
  left: 0;
  top: 45px;
  width: 210px;
  height: 461px;
  position: absolute;
  background: #fafafa;
  z-index: 999;
}
/* 过渡动画的样式 */
/* 过渡动画开始状态（进入） */
.type-nav .container .sort-enter {
  height: 0px;
}
.type-nav .container .sort-enter-to {
  height: 461px;
}
.type-nav .container .sort-enter-active {
  transition: all .5s linear;
}
.type-nav .container .sort-leave {
  height: 461px;
}
.type-nav .container .sort-leave-to {
  height: 0px;
}
.type-nav .container .sort-leave-active {
  transition: all .5s linear;
}
.type-nav .container .sort .all-sort-list2 .item h3 {
  line-height: 28px;
  font-size: 14px;
  font-weight: 400;
  overflow: hidden;
  padding: 0 20px;
  margin: 0;
}
/* 添加鼠标悬浮背景色 */
/* .type-nav .container .sort .all-sort-list2 .item:hover {
  background-color: skyblue;
} */
.type-nav .container .sort .all-sort-list2 .cur {
  background-color: skyblue;
}
.type-nav .container .sort .all-sort-list2 .item h3 a {
  color: #333;
}
.type-nav .container .sort .all-sort-list2 .item .item-list {
  display: none;
  position: absolute;
  width: 734px;
  min-height: 460px;
  background: #f7f7f7;
  left: 210px;
  border: 1px solid #ddd;
  top: 0;
  z-index: 9999 !important;
}
.type-nav .container .sort .all-sort-list2 .item .item-list .subitem {
  float: left;
  width: 650px;
  padding: 0 4px 0 8px;
}
.type-nav .container .sort .all-sort-list2 .item .item-list .subitem dl {
  border-top: 1px solid #eee;
  padding: 6px 0;
  overflow: hidden;
  zoom: 1;
}
.type-nav .container .sort .all-sort-list2 .item .item-list .subitem dl.fore {
  border-top: 0;
}
.type-nav .container .sort .all-sort-list2 .item .item-list .subitem dl dt {
  float: left;
  width: 54px;
  line-height: 22px;
  text-align: right;
  padding: 3px 6px 0 0;
  font-weight: 700;
}
.type-nav .container .sort .all-sort-list2 .item .item-list .subitem dl dd {
  float: left;
  width: 415px;
  padding: 3px 0 0;
  overflow: hidden;
}
.type-nav .container .sort .all-sort-list2 .item .item-list .subitem dl dd em {
  float: left;
  height: 14px;
  line-height: 14px;
  padding: 0 8px;
  margin-top: 5px;
  border-left: 1px solid #ccc;
}
/* .type-nav .container .sort .all-sort-list2 .item:hover .item-list {
  display: block;
} */
</style>