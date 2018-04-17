<template>
<div>
    <div>
        <group gutter="0">
            <cell v-for="expdetail in lessonDetails"
                :key="expdetail.recordId">
                <div slot="inline-desc" v-if="isElected(expdetail)" class="cells">
                    <div>
                        <div class="info">
                            <span><input class="checks" type="checkbox" style="width:15px;height:15px;" 
                            :value="expdetail.recordId" v-model="checkedarr"></span>
                            <span>{{expdetail.studentName}} {{expdetail.studentId}}</span>
                        </div>
                        <div class="taginfo">
                            <span class="tag is-info" v-if="expdetail.rpt_status === 'Y'">成绩：{{expdetail.grade}}</span>
                            <span :class="expdetail.att_status === 'Y' ? 'tag is-info':'tag is-warn'">{{getstatus(expdetail)}}</span>
                            <span v-if="enableEvaluation===true">
                                <span v-if="expdetail.teval_status === 'Y'" class="tag is-info">已评教</span>
                            </span>
                            <x-button v-if="expdetail.rpt_status === 'Y'" mini type="primary" >查看报告</x-button>
                        </div>
                    </div>
                </div>
            </cell>
        </group>
        <divider>到底了</divider>
    </div>
    <tabbar  v-if="showModel" >
      <tabbar-item @on-item-click="reback">
        <img slot="icon" src="../assets/icon_reback.png">
        <span slot="label">返回</span>
      </tabbar-item>
      <tabbar-item @on-item-click="handleAtt">
        <img slot="icon" src="../assets/icon_att.png">
        <span slot="label">考勤</span>
      </tabbar-item> 
      <tabbar-item @on-item-click="handleCheckAllChange">
        <img slot="icon" src="../assets/icon_allchecked.png">
        <span slot="label">全选</span>
      </tabbar-item> 
    </tabbar>
    <div v-transfer-dom>
      <actionsheet v-model="showMenus" :menus="menu" @on-click-menu="changeAtt">
      </actionsheet>
    </div>
</div>
</template>
<script>
import {Cell,Group,XButton,Tabbar, TabbarItem,Actionsheet,Divider,TransferDom} from 'vux'
import { mapGetters, mapActions } from 'vuex'
import store from '../store'
export default {
    directives: {
    TransferDom
  },
    data(){
        return {
            checkedarr:[],
            checkedall:[],
            showMenus:false,
            menu:[
                { label: '<span style="font-size:14px;">签到</span>', value: 'Y' },
                { label: '<span style="font-size:14px;">迟到</span>', value: 'LATE' },
                { label: '<span style="font-size:14px;">器材未整理</span>', value: 'UNFINISH' },
                { label: '<span style="font-size:14px;">请假</span>', value: 'ABSENT' },
                { label: '<span style="font-size:14px;">未完成</span>', value: 'HOOKY' },
                { label: '<span style="font-size:14px;">初始状态</span>', value: 'N' }    
            ],
        }
    },
    mounted(){
        store.commit('showmodel',true);  
    },
     
    computed:{
        ...mapGetters(['lessonDetails','selectedlesson','enableEvaluation','currentTime','showModel']),
    },
   
    components:{
        Cell,
        Group,
        XButton,
        Tabbar, 
        TabbarItem,
        Actionsheet,
        Divider
    },
    methods:{
        isElected(elected) {
            return elected.lesson.recordId !== undefined;
        },
        getstatus(lesson){
            if (lesson.att_status === 'Y') {
                return '已签到';
            } else {
                if (lesson.att_status == 'N') {
                    return this.isLessonover(lesson);
                } else if (lesson.att_status == 'LATE') {
                    return '迟到';
                } else if (lesson.att_status == 'ABSENT') {
                    
                    return '请假';
                } else if (lesson.att_status == 'HOOKY') {
                    
                    return '未完成';
                } else if (lesson.att_status == 'UNFINISH') {
                    
                    return '器材未整理';
                }
            }
        },
        isLessonover(lesson){
            let cTime =  Date.parse(this.currentTime.replace(/-/g, '/'));;
            let start=Date.parse(lesson.date.replace(/-/g, '/') + ' ' + lesson.startTime);
            let end=Date.parse(lesson.date.replace(/-/g, '/')+' '+lesson.endTime);
            if(start.valueOf()>cTime.valueOf()){
                return '未开始';
            }
            else if(end.valueOf() < cTime.valueOf()){
                return '旷课'
            }            
            else if(start.valueOf()<cTime.valueOf()&&end.valueOf()>cTime.valueOf()){
                return '实验中';
            }
        },
        reback(){
            this.$router.go(-1);
             store.commit('showmodel',false);
        },
        handleCheckAllChange(val) {
            var _this=this;
            if(this.checkedarr.length==this.lessonDetails.length){//取消全选
                this.checkedall=[];
                this.checkedarr=[];
            } else {
                this.lessonDetails.forEach(function(item) {
            
                _this.checkedall.push(item.recordId);
                    
                }, this);
                this.checkedarr=[];
                this.checkedarr = this.checkedall;
            }
        },
        handleAtt(){
            this.showMenus=true;
        },
        changeAtt(key){
            let _this=this;
            if(this.checkedarr.length!=0){
                this.axios.put(`attendances/${this.checkedarr}?att_status=${key}`)
                .then(function (response) {
                    store.dispatch('expLesson',_this.selectedlesson);
                    _this.checkedarr=[];
                }).catch(function(err){
                    console.log(err);
                    store.commit('toast',err.message);
                });
            } else {
                store.commit('toast','请先选择修改考勤状态的学生!');
                this.selected = 'Att';
            }
        }
    }
}
</script>
<style scoped>

    .tag.is-warn {
        background-color: #E64340;
        color: #fff;
    }
    .info{
        float:left;
    }
    .taginfo{
        display: block;
        float:right;
    }
</style>
   

