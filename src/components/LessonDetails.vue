<template>
<div>
    <group gutter="0">
        <cell v-for="expdetail in lessonDetails"
            :key="expdetail.recordId" :title="title(expdetail)">
            <div slot="inline-desc" v-if="isElected(expdetail)">
                <div class="action-wrapper">
                    <span class="tag is-info" v-if="expdetail.rpt_status === 'Y'">成绩：{{expdetail.grade}}</span>
                    <span :class="expdetail.att_status === 'Y' ? 'tag is-info':'tag is-warn'" 
                    @click="editAtt(expdetail)" >{{getstatus(expdetail)}}</span>
                    
                    <span v-if="enableEvaluation===true">
                        <span v-if="expdetail.teval_status === 'Y'" class="tag is-info">已评教</span>
                    </span>
                    <x-button v-if="expdetail.rpt_status === 'Y'" mini type="primary" @click.native="report(expdetail)">查看报告</x-button>
                </div>
            </div>
        </cell>
    </group>
    <divider>我是有底线的</divider>
    <div v-transfer-dom>
      <actionsheet v-model="showMenus" :menus="menu" theme="android"  @on-click-menu="changeAtt" 
        @on-click-menu-more="changeMore">
      </actionsheet>
    </div>
</div>
    
</template>
<script>
import {Cell,Group,Actionsheet,XButton,Divider,TransferDom} from 'vux'
import { mapGetters, mapActions } from 'vuex'
import store from '../store'
export default {
    directives: {
        TransferDom
    },
    data(){
        return {
            title(expdetail){
                return expdetail.studentName+' '+expdetail.studentId;
            },
            singleAtt:{},
            menu: [
                { label: '<span style="font-size:14px;">签到</span>', value: 'Y' },
                { label: '<span style="font-size:14px;">迟到</span>', value: 'LATE' },
                { label: '<span style="font-size:14px;">器材未整理</span>', value: 'UNFINISH' },
                { label: '<span style="font-size:14px;">请假</span>', value: 'ABSENT' },
                { label: '<span style="font-size:14px;">未完成</span>', value: 'HOOKY' },
                { label: '<span style="font-size:14px;">初始状态</span>', value: 'N' },
                { label: '<span style="font-size:14px;">更多</span>',value:'more'}
            ],
            showMenus: false
           
        }
        
    },
    created(){
        store.dispatch('currentTime');
    },
    computed:{
        ...mapGetters(['lessonDetails','selectedlesson','enableEvaluation','currentTime','showModel']),
    },
    components:{
        Cell,
        Group,
        Actionsheet,
        XButton,
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
            let cTime = Date.parse(this.currentTime.replace(/-/g, '/'));
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
        changeAtt(key){
            console.log(key)
            console.log(this.singleAtt);
            let _this=this;
            if(key!='more'){
                this.axios.put(`attendances/${this.singleAtt.recordId}?att_status=${key}`)
                .then(function (response) {
                    console.log(response.data);
                    store.dispatch('expLesson',_this.selectedlesson);
                }).catch(function(err){
                    console.log(err);
                    store.commit('toast',err.message);
                });
            }   
        },
        //more切换模式
        changeMore(){
            store.commit('showmodel',true);
            this.$router.push(`/teacher/${this.selectedlesson.recordId}/lessondetails/attstatus`);
        },
        
        reback(){
            this.$router.go(-1);
        },
        editAtt(expdetail){
            if(this.menu.length>7){
                this.menu.shift();
            }
            this.singleAtt=expdetail;
            this.menu.unshift(
                { label: `<span style="font-size:14px;">
                    为学生<strong>${expdetail.studentName}</strong>进行考勤</span>`,
                    type:'info' 
                });
            this.showMenus=true;
        },
        report(lesson) {
            this.$router.push(`/report/${lesson.recordId}`);
        },
    }
}
</script>
<style scoped>
    .box2-wrap {
        height: 300px;
        overflow: hidden;
    }
    
    .tag.is-warn {
        background-color: #E64340;
        color: #fff;
    }
</style>
   

