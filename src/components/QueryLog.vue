<template>
  <div>
    <div class="header">
        <tab :line-width=2 active-color='green' v-model="index" style="margin-bottom:20x;">
        <tab-item class="vux-center" :selected="lessonlog === item" v-for="(item, index) in list" @click="lessonlog = item" :key="index">{{item}}</tab-item>
      </tab>
    </div>
    <div v-if="index==0">
      <div class="serachstyle">
        <search :auto-fixed="false"
          v-model="lessonvalue" placeholder="输入场次号"
          ref="search" @on-submit="onSubmit" @on-cancel="onCancel">
        </search>
      </div>
      <div v-if="lessonlogs.length>0" class="info">
        <flexbox :gutter="0">
          <flexbox-item :span="6"><div class="flex-demo">{{lessonDetail.experimentName}}</div></flexbox-item>
          <flexbox-item><div class="flex-demo">{{lessonstatus}}</div></flexbox-item>
          <flexbox-item><div class="flex-demo">{{lessonDetail.addressName}}</div></flexbox-item>
        </flexbox>
        <flexbox :gutter="0">
          <flexbox-item><div class="flex-demo">上课日期：{{lessonDetail.date}}</div></flexbox-item>
          <flexbox-item><div class="flex-demo">选课人数：{{lessonDetail.currentStudent+'/'+lessonDetail.maxStudent}}</div></flexbox-item>
        </flexbox>
      </div>
      <div class="content">
        <group v-if="lessonlogs.length>0" gutter="0">
          <cell v-for="lesson in lessonlogs"
            :key="lesson.recordId" :title="`${lesson.studentId ? lesson.studentId:''} ${lesson.studentName ? lesson.studentName:''}`">
            <div slot="inline-desc" v-if="lesson.recordId!='undefined'" class="cells">
            <div>日期：{{lesson.createtime}} </div>
            <span style="color:red">操作：{{lesson.action }}</span>
            </div>
          </cell>
          <divider>我是有底线的</divider>
        </group>
        <div v-else class="noConent">无记录</div>
      </div>
    </div>
    <div v-else>
        <div class="serachstyle">
          <search :auto-fixed="false" placeholder="输入学号" v-model="value" 
            ref="search" @on-submit="searchEvent" @on-cancel="clear">
          </search>
        </div>
        <div class="info" v-if="stulogs.length>0">
          <flexbox :gutter="0">
            <flexbox-item><div class="flex-demo">{{students.id}}</div></flexbox-item>
            <flexbox-item><div class="flex-demo">{{students.name}}</div></flexbox-item>
          </flexbox>
        </div>
        <div class="Stucontent">
          <group v-if="stulogs.length>0" gutter="0">
            <cell v-for="stulog in stulogs"
                :key="stulog.recordId">
                <div slot="inline-desc" v-if="stulog.recordId!='undefined'" class="cells">
                <span>日期：{{stulog.createtime}} </span></br>
                <span>地点：{{stulog.address}} </span></br>
                <span>节次：{{stulog.period}}</span></br>
                <span>上课日期：{{stulog.expdate}}</span></br>
                <span>教师：{{stulog.teacher}}</span></br>
                <span style="color:red">操作：{{stulog.action }}</span>
                </div>
              </cell>
            <divider>我是有底线的</divider>
          </group>
           <div v-else class="noConent">无记录</div>
        </div>
    </div> 
  </div>
</template>

<script>
import { Cell, Tab, TabItem,Divider,Group,Search,Flexbox, FlexboxItem,TransferDomDirective as TransferDom } from 'vux'
import { mapGetters, mapActions } from 'vuex'
import store from '../store'
export default {
  data() {
    return {
      index: 0,
      list: ['场次日志', '学生日志'],
      lessonlog: '场次日志',
      value: '',
      lessonvalue:'',
      students:'',
      stulogs:[],
      lessonlogs:[],
      lessonDetail:'',
      lessonstatus:'',
      statusData: [
        {
            id: 'draft',
            value: '草稿'
        },
        {
            id: 'release',
            value: '发布'
        },
        {
            id: 'closed',
            value: '关闭'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([ 'currentlessons','lessonsDate','requestError']),
},
  components: {
    Cell,
    Tab,
    TabItem,
    Divider,
    Group,
    Search,
    Flexbox, 
    FlexboxItem
  },
  methods: {
    onSubmit () {
      this.$refs.search.setBlur();
      let _this=this;
      this.axios.get(`/electlogs`,{
      params:{
        lessonId:this.lessonvalue
      }}).then(function(response){
        _this.axios.get('lessons/'+_this.lessonvalue,{
          handleAs: 'json'
        }).then(function(response){
          if(response.data!=''){
            _this.lessonDetail=response.data;
            _this.statusData.forEach(function(item){
              if(response.data.status==item.id){
                _this.lessonstatus=item.value;
              } else if(typeof(response.data.status)=='undefined'){
                _this.lessonstatus='';
              }
            })
          }else{
             store.commit('toast','未找到该场次！');
          }
         
        }).catch(function(err){
          console.log(err);
      });
       _this.lessonlogs = response.data;
      }).catch(function(err){
          console.log(err);
      });

    
    },
    searchEvent(){
      this.$refs.search.setBlur();
      let _this=this;
      this.axios.get('/users',{
        params:{
          id:_this.value
        }
      }).then(function(response){
        console.log(response.data);
        _this.students=response.data;
        _this.axios.get(`/electlogs`,{
        params:{
          studentId:response.data.recordId
        }}).then(function(response){
            _this.stulogs = response.data;
        }).catch(function(err){
            console.log(err);
        })
      }).catch(function(err){
        store.commit('toast',err);
        _this.stulogs=[];
      })
    },
    clear(){
      this.value='';
      this.stulogs=[];
    },  
    onCancel () {
      this.lessonlogs=[];
      this.lessonvalue='';
    }
  }
}
</script>

<style scoped>
  .header{
    position:fixed;
    /*top:30px;*/
     top:40px;
    z-index:10000;
  }
  .flex-demo {
    text-align: center;
    color: #666;
    border-radius: 0px;
    background-clip: padding-box;
    border-bottom:1px solid #B2B2B2;
    border-right:1px solid #B2B2B2;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size:14px;
    }
  .noConent{
    text-align: center;
    margin-top:10px;
    color: #666;
    font-size:14px;
  }
  .serachstyle{
    width:100%;
    position:fixed;
    /*top:74px;*/
     top:84px;
    z-index:10000
  }
  .info{
    width:100%;
    position:fixed;
    background-color:white;
    /*top:118px;*/
     top:128px;
    z-index:10000;
  }
  .content{
    width:100%;
    margin-top:134px;
  }
  .Stucontent{
    width:100%;
    margin-top:134px;
  }
</style>
