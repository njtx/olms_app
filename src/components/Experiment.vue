<template>
 <div>
    <card :header="{title: selectedCourse.name}">
      <div slot="content">{{ selectedCourse.description }}</div>
    </card>
    <group :title="`必修(${essentialExperiments.length})`">
      <cell v-for="exp in essentialExperiments" :key="exp.recordId" :title="exp.experiment" @click.native="elect(exp)" :border-intent="false">
        <div slot="inline-desc">
          <div>
            <span>{{ exp.date }}</span>
            <span>{{ exp.address }}</span>
          </div>
          <div class="action-wrapper" v-if="isElected(exp)">
            <span class="tag is-info">已选</span>
            <span class="tag is-info">{{getStatus(exp)}}</span>
            <span v-if="enableEvaluation===true">
            <span v-if="exp.teval_status === 'Y'" class="tag is-info">已评教</span>
            </span>
            <span v-if="exp.rpt_status === 'Y'" class="tag is-info">已录入报告</span>
          </div>
        </div>
      </cell>
    </group>
    <group :title="`选修(${optionalExperiments.length})`">
      <cell v-for="exp in optionalExperiments" :key="exp.recordId" :title="exp.experiment" @click.native="elect(exp)" :border-intent="false">
        <div slot="inline-desc">
          <div>
            <span>{{ exp.date }}</span>
            <span>{{ exp.address }}</span>
          </div>
          <div class="action-wrapper" v-if="isElected(exp)">
            <span class="tag is-info">已选</span>
            <span class="tag is-info">{{getStatus(exp)}}</span>
             <span v-if="enableEvaluation===true">
            <span v-if="exp.teval_status === 'Y'" class="tag is-info">已评教</span>
            </span>
            <span v-if="exp.rpt_status === 'Y'" class="tag is-info">已录入报告</span>
          </div>
        </div>
      </cell>
    </group>
  <divider>我是有底线的</divider>
 </div>
</template>

<script>
import { Card, Cell, CellBox, Group, XButton, Divider} from 'vux'
import { mapGetters, mapActions } from 'vuex'
import store from '../store'
export default {
  data() {
    return {
      experiMents:[]
     
    }
  },
 watch:{
  experiments:function(val){
    this.experiMents=val;
  }
 },
  created(){
    store.dispatch('currentTime');
  },
  computed: {
    ...mapGetters(['selectedCourse', 'experiments','enableEvaluation','currentTime']),
    essentialExperiments: function (params) {
      return this.experiMents.filter(exp => exp.essential === 'Y');
    },
    optionalExperiments: function () {
      return this.experiMents.filter(exp => exp.essential === 'N');
    }
  },
  components: {
    Card,
    Group,
    Cell,
    CellBox,
    XButton,
    Divider
  },
  methods: {
    ...mapActions([

    ]),
    isElected(lesson) {
      return lesson.recordId !== undefined;
    },
    getStatus(lesson) {
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
          return '未完成';//南航规定HOOKY为未完成状态
        } else if (lesson.att_status == 'UNFINISH') {
          return '器材未整理';
        }
      }
    },
    isLessonover(lesson){
      var cTime = Date.parse(this.currentTime.replace(/-/g, '/'));
      var start=Date.parse(lesson.date.replace(/-/g, '/') + ' ' + lesson.startTime);
      var end=Date.parse(lesson.date.replace(/-/g, '/')+' '+lesson.endTime);
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
    elect(lesson) {
      if (!this.isElected(lesson)) {
        this.$router.push(`/experiment/${lesson.experimentId}/lessons`);
      } else {
        var cTime = Date.parse(this.currentTime.replace(/-/g, '/'));
        if(Date.parse(lesson.date.replace('-', '/') + ' ' + lesson.startTime).valueOf() < cTime.valueOf()) {
            if(lesson.att_status === 'N' || lesson.att_status === 'HOOKY' || lesson.att_status === 'ABSENT') {
              this.$router.push(`/experiment/${lesson.experimentId}/lessons?current=${lesson.lessonId}`);
            }
        } else {
            this.$router.push(`/experiment/${lesson.experimentId}/lessons?current=${lesson.lessonId}`);
        }
      }
    }
  }
}
</script>
<style>
.experiment-content {
  padding-top: 70px;
}
</style>
