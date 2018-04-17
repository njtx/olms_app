<template>
    <div>
        <grid :cols="1" :show-lr-borders="false">
            <grid-item class="grid-item">
                <group gutter="0">
                    <selector placeholder="请选择课程" v-model="key" :value-map="['recordId', 'name']" :options="courses" @on-change="onChange"></selector>
                </group>
                <group gutter="0">
                    <cell v-for="(course,index) in courses" :key="index"  v-show="course.recordId==key">
                        <div slot="inline-desc" class="cell-item"> 
                            <span>{{studented.name}} {{studented.semestername}} </span></br>
                            <span  class="tag is-info taginfo" v-show="courseGrade.grade">成绩：{{courseGrade.grade}} </span>
                             <span class="tag is-info taginfo" v-show="courseGrade.status">{{getGradeStatus()}}</span>
                            <span>已选实验：{{courseGrade.selectedLessonCount ? courseGrade.selectedLessonCount+'/'+course.expcountlimit : 0+'/'+course.expcountlimit}} </span>
                        </div>
                    </cell>
                </group>
            </grid-item>
            <grid-item class="grid-item2">
                <group :gutter="0" v-if="experiments.length > 0">
                    <cell v-for="(exp,index) in experiments" :key="index" :title="`${exp.experiment}`">
                        <div slot="inline-desc">
                            <span>{{exp.teacher}} {{exp.date}} {{exp.address}}</span></br>
                            <div v-show="exp.attTime">出勤：{{exp.attTime}}</div>
                            <x-button  class="taginfo"  v-if="exp.rpt_status === 'Y'" mini type="primary" @click.native="report(exp)">查看报告</x-button>
                            <span class="tag is-info taginfo" v-if="exp.rpt_status === 'Y'">成绩：{{exp.grade}}</span>
                            <span :class="exp.att_status === 'Y' ? 'tag is-info taginfo':'tag is-warn taginfo'">{{getstatus(exp)}}</span>
                            <span class="tag is-info taginfo ">{{enableEvaluation===true && exp.teval_status == 'Y' ? '已评教':
                                (exp.rpt_status == 'Y' ? '已录入报告' :'已选课')}}
                            </span>
                        </div>
                    </cell>
                    <divider>我是有底线的</divider>
                </group>
            <div v-else class="noConent">无记录</div>
            </grid-item>
        </grid>
    </div> 
</template>

<script>
import { Grid,GridItem,GroupTitle, Group,Cell,Selector,XButton,Divider} from 'vux'
import { mapGetters, mapActions } from 'vuex'
import store from '../store'
export default {
    data(){
        return {
            key: '',
            students:[],
            info:'',
            courseGrade:{}
        }
    },
    created(){
         store.dispatch('currentTime');
         this.getCourse();
    },
    computed:{
        ...mapGetters(['courses','studented','experiments','enableEvaluation','currentTime']),
    },
    components:{
        Grid,
        GridItem,
        GroupTitle, 
        Group,
        Cell,
        Selector,
        XButton,
        Divider
    },
    methods:{
        ...mapActions([
        ]),
        getCourse(){
            if(this.courses.length>=0){
            this.key=this.courses[0].recordId;
            }
        },
        onChange(){
            let _this=this;
            this.axios.get(`courses/${this.key}/grade?semester=${this.studented.semester}&student=${this.studented.recordId}`)
            .then(function (response) {
                _this.courseGrade = response.data;
                _this.loadElectives();
            }, function (error) {
                
            })
            .catch(function (error) {
                console.log(error);
            });
        },
    
        getGradeStatus(){
            return this.courseGrade.status=='fail' ? '失败':
                (this.courseGrade.status=='pass' ?'通过':
                (this.courseGrade.status=='going' ? '进行中':
                (this.courseGrade.status=='reelect' ? '重修' :'')
                ))
        },
        loadElectives(){
            this.axios.get(`electives?semester=${this.studented.semester}&student=${this.studented.recordId}&course=${this.key}`)
            .then(function (response) {
                store.commit('updateExperiments', response.data);
            }, function (error) {
                
            })
            .catch(function (error) {
                console.log(error);
            });
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
        report(lesson) {
            this.$router.push(`/report/${lesson.recordId}`);
        }
    }
}
</script>

<style scoped>
    .cell-item{
        color:#3273dc;
    }
    .taginfo{
        display: block;
        float:right;
    }
     .tag.is-warn {
        background-color: #E64340;
        color: #fff;
    }
    .grid-item{
        /*top:30px;*/
         top:40px;
        position:fixed;
        z-index:100;
        padding:0px;
        color:#666;
    }
    .grid-item2{
        margin-top:110px;
        padding:0px;
        color:#666;
    }
    .noConent{
        text-align: center;
        padding-top:10px;
        color: #666;
        font-size:14px;
    }

</style>
