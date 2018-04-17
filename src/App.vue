<template>
  <div id="app" style="height:100%;">
    <div v-transfer-dom>
      <loading v-model="isLoading" :text="loadingText"></loading>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showRaterDialog" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', height: '50%','padding-bottom':'30px'}">
        <p style="color:#fff;text-align:center;">
          <div>
            <div>教学态度</div>
            <rater v-model="currentEvaluation.attitude" slot="value"></rater>
          </div>
          <div>
            <div>教学方法</div>
            <rater v-model="currentEvaluation.method" slot="value"></rater>
          </div>
          <div>
            <div>教学技能</div>
            <rater v-model="currentEvaluation.skill" slot="value"></rater>
          </div>
          <div>
            <div>治学精神</div>
            <rater v-model="currentEvaluation.spirit" slot="value"></rater>
          </div>
          <div>
            <div>教学效果</div>
            <rater v-model="currentEvaluation.effect" slot="value"></rater>
          </div>
        </p>
        <div v-if="currentEvaluation.status === 'N'">
          <x-button mini type="warn" @click.native="close">取消</x-button>
          <x-button mini type="primary" @click.native="evaluate(currentEvaluation)">提交</x-button>
        </div>
        <div v-else>
          <x-button mini type="primary" @click.native="close">关闭</x-button>
        </div>
      </x-dialog>
    </div>
    <view-box :body-padding-top="top" body-padding-bottom="55px">
      <div class="header">
          <!--<div v-if="this.$route.path==='/teacher/lesson'">
            <div class="date" v-show="!moreSelected">
              <flexbox :gutter="0"> 
                <flexbox-item :span="8/12" class="flex-demo"> 
                  <datetime class="center"
                    v-model="value"
                    title="开始日期"
                    @on-change="change"
                    format="YYYY-MM-DD" 
                    cancel-text="取消"
                    confirm-text="确定">
                  </datetime>
                </flexbox-item>
                <flexbox-item class="flex-demo">
                  <x-button mini type="primary" @click.native="more">更多选项</x-button>
                </flexbox-item>
              </flexbox>
            </div>
            <filter-lesson v-show="moreSelected" @child-back="moreback" ref="lessons"></filter-lesson>
          </div>-->
          <div v-if="this.$route.path==='/teacher/lesson'">
            <div class="date">
              <flexbox :gutter="0"> 
                <flexbox-item :span="8/12" class="flex-demo"> 
                  <datetime class="center"
                    v-model="value"
                    title="开始日期"
                    @on-change="change"
                    format="YYYY-MM-DD" 
                    cancel-text="取消"
                    confirm-text="确定">
                  </datetime>
                </flexbox-item>
                <flexbox-item class="flex-demo">
                  <x-button mini type="primary" @click.native="more">更多选项</x-button>
                </flexbox-item>
              </flexbox>
            </div>
          </div>
          <span v-else-if="selectedlesson != null && this.$route.path===`/teacher/${selectedlesson.recordId}/lessondetails`">
            <span @click="reback"><img src="./assets/icon_back.png" class="Img">返回</span>
            <span class="title">实验:{{selectedlesson.experimentName}}</span>
            <div class="title">
                <span>时间:{{selectedlesson.date}}</span>&nbsp;
                <span>地点:{{selectedlesson.addressName}}</span>
                <span>当前选课人数:{{lessonDetails.length}}</span>  
            </div>  
          </span>
          <span v-else-if="selectedlesson != null && this.$route.path===`/teacher/${selectedlesson.recordId}/lessondetails/attstatus`">
            <span class="title">实验:{{selectedlesson.experimentName}}</span>
            <div class="title">
                <span>时间:{{selectedlesson.date}}</span>&nbsp;
                <span>地点:{{selectedlesson.addressName}}</span>
                <span>当前选课人数:{{lessonDetails.length}}</span>  
            </div>  
          </span>
          <div v-else-if="this.$route.path==='/teacher/querylog' || this.$route.path==='/teacher/search' 
            || this.$route.path==='/teacher/search/detail'|| this.$route.path==='/teacher/test'"
            @click="reback" class="rebackStyle"><img src="./assets/icon_back.png" class="Img">返回
          </div>
        </div>
      <router-view class="router-view" ></router-view> 
      <tabbar v-if="isLogin && !showModel">
        <tabbar-item show-dot link="/message">
          <img slot="icon" src="./assets/icon_news.png">
          <span slot="label">消息</span>
        </tabbar-item>
        <tabbar-item v-if="user.role==='student'" selected link="/course">
          <img slot="icon" src="./assets/icon_course.png">
          <span slot="label">选课</span>
        </tabbar-item>
        <tabbar-item v-if="user.role==='teacher'" selected 
         :link="`${'/teacher/lesson'}`">
          <img slot="icon" src="./assets/icon_course.png">
          <span slot="label">场次</span>
        </tabbar-item>
        <tabbar-item link="/mine">
          <img slot="icon" src="./assets/icon_user.png">
          <span slot="label">我的</span>
        </tabbar-item>
      </tabbar>
    </view-box>
    <div v-transfer-dom>
      <toast type="warn" v-model="requestError.status" :text="requestError.text"></toast>
    </div>
  </div>
</template>

<script>
import { Tabbar, TabbarItem, Loading, XDialog, XButton, Rater, Toast,ViewBox,Datetime,dateFormat,Flexbox, FlexboxItem,
 TransferDomDirective as TransferDom } from 'vux'
import { mapGetters, mapActions } from 'vuex'
import qs from 'qs'
import store from './store'
import FilterLesson from '././components/FilterLesson'
export default {
  name: 'app',
  data() {
    return {
      loadingText: '加载中',
      data3: 5,
      property:''
    }
  },
  computed: {
    ...mapGetters(['user', 'isLogin', 'isLoading', 'showRaterDialog', 'currentEvaluation', 'requestError','showModel','selectedlesson',
   'selecteddate','lessonDetails']),
    value:function(){
      return this.selecteddate;
    },
    top:{
        get:function(){
          return this.property;
        },
        set:function(newValue){
          this.property=newValue;
        }
    }
  },
  mounted() {
    this.property=this.$el.getElementsByClassName('header')[0].offsetHeight+'px';
    var _this = this;
    if (!this.isLogin) {
      store.commit('logout');
    } else {
      this.change(this.value);
    }
    this.axios.get(`users/current`)
    .then(function (response) {

    }, function (error) {
    })
    .catch(function (error) {
      console.log(error);
    });
  },
  updated(){
    this.property=this.$el.getElementsByClassName('header')[0].offsetHeight+'px';
  },
  directives: {
    TransferDom
  },
  components: {
    Loading,
    XDialog,
    Rater,
    Tabbar,
    TabbarItem,
    Toast,
    XButton,
    ViewBox,Datetime,
    dateFormat,
    Flexbox, 
    FlexboxItem,
    FilterLesson
  },
  methods: {
    ...mapActions(['log']),
    getValue(value) {
      if (value === 5) {
        return 1;
      } else if (value === 4) {
        return 0.8;
      } else if (value === 3) {
        return 0.6;
      } else if (value === 2) {
        return 0.4;
      } else if (value === 1) {
        return 0.2;
      } else {
        return 0;
      }
    },
    evaluate(data) {
      this.axios.put(`evaluation/${data.id}`, qs.stringify({
        attitude: this.getValue(data.attitude),
        skill: data.skill,
        method: data.method,
        spirit: data.spirit,
        effect: data.effect,
        ip: '',
        studentId: this.user.recordId
      })).then(function () {
        store.state.showRaterDialog = false;
      })
        .catch(function (error) {

        })
    },
    close() {
      store.state.showRaterDialog = false;
    },
    change (value) {
      store.commit('selecteddate',value);
     //通过时间和教师获取场次信息
     store.dispatch('getLessondate',{start:value,end:value,teacher:this.user.recordId});
    },
    reback(){
      this.$router.go(-1);
    },
    more(){
      this.$router.push('/teacher/lesson/filter');
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
body,
html {
  height: 100%;
  width: 100%;
  // overflow:hidden;
  overflow-x: hidden;
}

body {
  background-color: #fbf9fe;
}

#app {
  // height: 100%;
}

.vux-close {
  margin-top: 8px;
  margin-bottom: 8px;
}

.tag.is-info {
  background-color: #3273dc;
  color: #fff;
}

.tag {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: whitesmoke;
  border-radius: 290486px;
  color: #4a4a4a;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  font-size: 0.75rem;
  height: 2em;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  line-height: 1.5;
  padding-left: 0.875em;
  padding-right: 0.875em;
  white-space: nowrap;
}

.vux-label-desc div {
  padding: 5px 0;
}

.header{
  width:100%;
  position:absolute;
  left:0;top:0;
  z-index:100;
  background-color:#DEDEDE;
}
.date{
  // width: 70%;
  width: 100%;
  float: left;
  color: forestgreen;
}
.router-view {
 width: 100%;
}
.Img{
  height:30px;
  width:30px;
  vertical-align:middle;
}

.title{
  font-size: 14px;
  margin-left: 14px;
  color: #666;
}
 .flex-demo {
  text-align: center;
  color: #666;
  border-radius: 4px;
  background-clip: padding-box;
  border-right:1px solid #dddddd
}
.rebackStyle{
   width:100%;
   height:40px;
   font-size:18px;
}
</style>
