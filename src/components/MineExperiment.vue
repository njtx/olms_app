<template>
<div>
    <card :header="{title: selectedCourse.name}">
      <div slot="content" class="card-demo-flex card-demo-content01" v-bind="grade">
        <div class="vux-1px-l vux-1px-r">
          <span>{{grade.grade === '无成绩' ? '课程未结束' : grade.grade}}</span>
          <br/> 成绩
        </div>
        <div class="vux-1px-r">
          <span>{{grade.selectedLessonCount ? grade.selectedLessonCount : 0}}</span>
          <br/> 已选
        </div>
        <div class="vux-1px-r">
          <!--<span>{{grade.absentCount ? parseInt(grade.absentCount)+parseInt(countHooky):parseInt(countHooky)}}</span>-->
          <span>{{grade.absentCount}}</span>
          <br/> 重选未完成实验
        </div>
        <!--<div>
              <span>{{grade.grade}}</span>
              <br/> 迟到
            </div>-->
      </div>
    </card>
    <div>
      <cell v-for="exp in selectedExperiments" :key="exp.recordId" :title="exp.experiment" :border-intent="false">
        <div slot="inline-desc">
          <div>
            <span v-if="hookyed(exp) === true" class="hooky">已旷课</span>
            <span>{{ exp.date }}</span>
            <span>{{ exp.period }}</span>
          </div>
          <div v-if="enableEvaluation===true">
            <span v-if="exp.rpt_status === 'Y'">成绩：{{ exp.grade }}</span>
          </div>
           <div v-else>
            <span v-if="exp.rpt_status === 'Y'">成绩：{{ exp.grade }}</span>
          </div>
          <div class="action-wrapper">
            <x-button v-if="lessonOver(exp) === false" mini type="warn" @click.native="cancel(exp)">取消</x-button>
            <x-button v-if="exp.rpt_status === 'Y'" mini type="primary" @click.native="report(exp)">报告</x-button>
            <x-button v-else-if="exp.rpt_status === 'N'" mini type="primary" @click.native="download(exp)">下载</x-button>
            <x-button v-if="enableEvaluation===true" mini type="primary" @click.native="evaluate(exp)">评教</x-button>
           <!--<x-button v-else mini type="primary" @click.native="evaluate(exp)">评教</x-button>-->
          </div>
        </div>
      </cell>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showConfirm" @on-cancel="onCancel" @on-confirm="onConfirm">
        <p style="text-align:center;">{{ tip }}</p>
      </confirm>
    </div>
  <divider>我是有底线的</divider>
  </div>
</template>

<script>
import { Card, Cell, CellBox, Group, XButton, Confirm, CellFormPreview, Badge, Toast, Divider,TransferDomDirective as TransferDom } from 'vux'
import { mapGetters, mapActions } from 'vuex'
import qs from 'qs'
import store from '../store'

export default {
  data() {
    return {
      confirmAction: function () { },
      showConfirm: false,
      showToast: false,
      toastText: '',
      grade: {},
      tip: '',
      // countHooky:0,
      selectedExperiments:[]
    }
  },
  created(){
    store.dispatch('currentTime');
  },
  mounted() {
    if(this.selectedCourse.recordId){
      this.initCourse(this.selectedCourse);
    }
  },
  computed: {
    ...mapGetters(['selectedCourse', 'experiments', 'semester', 'user','enableEvaluation','currentTime'])
  },
  watch:{
    experiments:function(val){
        this.selectedExperiments=val.filter(exp => exp.recordId !== undefined);
    },
    selectedCourse(val){
      this.initCourse(val);
    }
  },
  directives: {
    TransferDom
  },
  components: {
    Card,
    Group,
    Cell,
    CellBox,
    XButton,
    Toast,
    CellFormPreview,
    Badge,
    Confirm,
    Divider
  },
  methods: {
    ...mapActions([
      'loadExperiments'
    ]),
    initCourse(course){
      const _this = this;
      store.state.isLoading = true;
      if(course.recordId){
        this.axios.get(`courses/${course.recordId}/grade?semester=${this.semester.recordId}`)
        .then(function (response) {
          store.state.isLoading = false;
          _this.grade = response.data;
        }, function (error) {
          console.log(error);
        })
        .catch(function (error) {
          console.log(error);
        });
        // this.countHooky=this.experiments.filter(exp=>exp.att_status==='N' && 
        // Date.parse(exp.date.replace(/-/g, '/')+' '+exp.endTime).valueOf() < 
        // Date.parse(this.currentTime.replace(/-/g, '/')).valueOf()).length;
      }
      
    },
    gradeToScore (value) {
      switch (value) {
        case '5+':
          return '95';
          break;
        case '5':
          return '90';
          break;
        case '5-':
          return '85';
          break;
        case '4+':
          return '80';
          break;
        case '4':
          return '75';
          break;
        case '4-':
          return '70';
          break;
        case '3+':
          return '65';
          break;
        case '3':
          return '60';
          break;
        case '3-':
          return '55';
          break;
        case '2+':
          return '50';
          break;
        case '2':
          return '45';
          break;
        case '2-':
          return '40';
          break;
        case '1+':
          return '35';
          break;
        case '1':
          return '30';
          break;
        case '1-':
          return '25';
          break;
        default:
          return '0';
          break;
      }
    },
    getValue(value) {
      if (value === 1) {
        return 5;
      } else if (value === 0.8) {
        return 4;
      } else if (value === 0.6) {
        return 3;
      } else if (value === 0.4) {
        return 2;
      } else if (value === 0.2) {
        return 1;
      } else {
        return 0;
      }
    },
    setTip(text) {
      this.tip = text;
    },
    onConfirm() {
      this.showConfirm = false;
      this.confirmAction();
    },
    onCancel() {
      // do nothing
    },
    download(lesson) {
      window.open(`/olms_api_v2/report_paper/${lesson.recordId}`, '_blank')
    },
    report(lesson) {
      this.$router.push(`/report/${lesson.recordId}`);
    },
    cancel(lesson) {
      const _this = this;
      if (lesson.hasChildren) {
        this.setTip('取消该场次将取消其关联场次，确认继续？');
      } else {
        this.setTip(`确认取消？`);
      }
      this.confirmAction = function () {
        store.state.isLoading = true;
        _this.axios.put(`electives`, qs.stringify({
          lesson: lesson.lessonId,
          course: this.selectedCourse.recordId,
          student: this.user.recordId,
          semester: this.semester.recordId
        }))
          .then(function (response) {
            store.state.isLoading = false;
            _this.toastText = '取消成功';
            _this.showToast = true;
            _this.loadExperiments(_this.selectedCourse.recordId);
          }, function (error) {
            store.state.isLoading = false;
            _this.toastText = '取消失败';
            _this.showToast = true;
          })
          .catch(function (error) {
            store.state.isLoading = false;
            _this.toastText = '取消失败';
            _this.showToast = true;
            console.log(error);
          });
      }
      this.showConfirm = true;
    },
    evaluate(elect) {
      
      const _this = this;
      store.state.isLoading = true;
      this.axios.get(`evaluation?elective=${elect.recordId}`)
        .then(function (response) {
          var data = {
            attitude: _this.getValue(response.data.attitude),
            effect: _this.getValue(response.data.effect),
            method: _this.getValue(response.data.method),
            skill: _this.getValue(response.data.skill),
            spirit: _this.getValue(response.data.spirit),
            status: response.data.status,
            id: elect.recordId
          };
          store.commit('setCurrentEvaluation', data);
          store.state.isLoading = false;
        }, function (error) {
          store.state.isLoading = false;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    lessonOver(lesson) {
       let cTime = Date.parse(this.currentTime.replace(/-/g, '/'));
      if (Date.parse(lesson.date.replace('-', '/') + ' ' + lesson.startTime).valueOf() < cTime.valueOf()) {
        return true;
      } else {
        return false;
      }
    },
    hookyed(lesson){
      if(lesson.att_status=='N' && Date.parse(lesson.date.replace(/-/g, '/')+' '+lesson.endTime).valueOf() < 
        Date.parse(this.currentTime.replace(/-/g, '/')).valueOf()){
          return true;
        }
    }
  }
}
</script>
<style>

.experiment-content {
  padding-top: 70px;
}

.sub-item {
  color: #888;
}

.card-demo-flex {
  display: flex;
}

.card-demo-content01 {
  padding: 10px 0;
}

.card-padding {
  padding: 15px;
}

.card-demo-flex>div {
  flex: 1;
  text-align: center;
  font-size: 12px;
}

.card-demo-flex span {
  color: #f74c31;
}
.hooky{
   color: #f74c31;
}
</style>
