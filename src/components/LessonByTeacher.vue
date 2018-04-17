<template>
    <div >
      <!--<group  v-if="lessonsDate.length > 0" gutter="0">
        <cell v-for="lesson in lessonsDate"
          :key="lesson.recordId" :title="lesson.experimentName"
          >
          <div slot="inline-desc">
            <div @click="lessonDetails(lesson)"> 
              <span>{{typeof(lesson.teacherName)!='undefined'?lesson.teacherName:'无'}} 
                {{lesson.currentStudent +'/'+lesson.maxStudent}} {{lesson.addressName}} {{lesson.date}} </span></br>
            </div>
            <div class="action-wrapper">
              <x-button mini type="primary" v-if="!lesson.teacherName && lesson.status=='release' && user.recordId == params.teacher" 
                @click.native="clickClaim(lesson)">认领场次</x-button>
              <x-button v-else-if="user.recordId == lesson.teacher && lesson.status == 'release'" 
                mini type="warn" @click.native="onCancel(lesson)">取消认领</x-button>
            </div>
          </div>
        </cell>
        <divider>我是有底线的</divider>
      </group>
      <div v-else class="noContent">无记录</div>-->
      <scroller  v-if="changeLesson.length > 0"  :class="this.$route.path==='/teacher/lesson/filter'? 'content-wrapper':'scroller-wrapper' " 
        :on-refresh="refresh" :on-infinite="infinite"  ref="my_scroller">
        <cell v-for="lesson in lessons"
          :key="lesson.recordId" :title="lesson.experimentName "
          >
          <div slot="inline-desc">
            <div @click="lessonDetails(lesson)"> 
              <span>{{typeof(lesson.teacherName)!='undefined'?lesson.teacherName:'无'}} 
                {{lesson.currentStudent +'/'+lesson.maxStudent}} {{lesson.addressName}} {{lesson.date}} {{lesson.periodName}}</span></br>
            </div>
            <div class="action-wrapper" v-if="enableClaims">
              <x-button mini type="primary" v-if="!lesson.teacherName && lesson.status=='release' && user.recordId == params.teacher" 
                @click.native="clickClaim(lesson)">认领场次</x-button>
              <x-button v-else-if="user.recordId == lesson.teacher && lesson.status == 'release'" 
                mini type="warn" @click.native="onCancel(lesson)">取消认领</x-button>
            </div>
          </div>
        </cell>
      </scroller>
      <div v-else class="noContent">无记录</div>
  </div>
</template>

<script>
import { Datetime,Cell, CellBox, Group,TransferDom,dateFormat,XButton,Divider } from 'vux'
import { mapGetters, mapActions } from 'vuex'
import store from '../store'
import qs from 'qs'
export default {
  directives: {
    TransferDom
  },
  data() {
    return {
      changeLesson:[],
      lessons:[]
    }

  },
  computed: {
    ...mapGetters(['selectedlesson','lessonsDate','user','params','selecteddate','enableClaims'])
  },
  watch:{
    lessonsDate:function(val){
      this.changeLesson=val;
      this.initData();
    }
  },
  components: {
    Datetime,
    Group,
    Cell,
    CellBox,
    Divider,
    XButton
  },
  created(){
    if(this.$route.path==='/teacher/lesson/filter'){
      this.changeLesson=this.lessonsDate;
      this.initData();
    } else if(this.$route.path==='/teacher/lesson'){
       store.dispatch('getLessondate',{start:this.selecteddate,end:this.selecteddate,teacher:this.user.recordId});
    }
  },
  methods: {
    ...mapActions(['showLessonsByteacher']),
    lessonDetails(lesson){
      this.$router.push(`/teacher/${lesson.recordId}/lessondetails`);
      store.commit('selectlesson',lesson)
      store.dispatch('expLesson',lesson);
    },
 
  clickClaim(lesson){
    let _this=this;
    var data = qs.parse({
      teacher: this.user.recordId
    })
    this.axios.put('/lessons/' + lesson.recordId,data, 
    {
      handleAs: 'json',
      headers: {
          'Content-Type': 'application/json'
      }
    }
    ).then(function(response) {
       store.dispatch('getLessondate',_this.params);
    }).catch(function(err) {
        console.log(err);
    });
  },
  onCancel(lesson){
    let _this=this;
    var data = qs.parse({
      teacher: ''
    })
    this.axios.put('/lessons/' + lesson.recordId,data, 
    {
      handleAs: 'json',
      headers: {
          'Content-Type': 'application/json'
      }
    }
    ).then(function(response) {
      store.dispatch('getLessondate',_this.params);
    }).catch(function(err) {
        console.log(err);
    });
  },
  initData(){
    this.lessons=[];
    for (let i = 0; i <this.changeLesson.slice(0,10).length; i++) {
      this.lessons.push(this.changeLesson[i])
    };
  },
  refresh(done) {
    setTimeout(() => {
        done();
      }, 1500)
  },
  infinite(done) {
    let _this=this;
    if(this.lessons.length >= this.changeLesson.length){
      setTimeout(() => {
        _this.$refs.my_scroller.finishInfinite({isNoMoreData :false});
      }, 1500)
      return;
    }
    setTimeout(() => {
      let  start = _this.lessons.length;
      for (let i = start; i < start + 10; i++) {
        if(i<=_this.changeLesson.length-1){
          _this.lessons.push(_this.changeLesson[i]);
        }
      }
      setTimeout(() => {
        done();
      })
      }, 1500)
  },
  
  }
}
</script>

<style scoped>
  .weui-cells{
    margin-top:0;
  }
  .action-wrapper {
    float: right;
  }
  .noContent{
    text-align: center;
    margin-top:10px;
    color: #666;
    font-size:14px;
    }
    .scroller-wrapper{
       padding-top: 40px;
      padding-bottom: 53px;
      box-sizing: border-box;
      height: 100%;
      overflow: scroll;
    }
  .content-wrapper{
    padding-top: 113px;
    padding-bottom: 53px;
    box-sizing: border-box;
    height: 100%;
    overflow: scroll;
  }
  .content-wrapper >._v-content{
    padding-bottom: 166px;
  }
 
</style>
