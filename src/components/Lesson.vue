<template>
<div>
    <div v-for="lesson in validLessons">
      <cell class="vux-1px-b" :key="lesson.recordId" :title="`${lesson.date} ${lesson.startTime} `" :border-intent="false">
        <div slot="inline-desc">
          <div v-if="lesson.hasChildren" class="childlesson-tag">
            <label  @click="showOrhide(lesson)">关联场次</label>
            <p class="slide" :class="currentcell.recordId==lesson.recordId?'animate':''">
              <span v-for="childlesson in lesson.children" :key="childlesson.recordId">
                <cell :title="`${childlesson.experimentName}`">
                  <div slot="inline-desc" class="childlesson-tag">
                    上课时间：{{childlesson.date}} {{childlesson.startTime}}</br>
                    上课地点：{{`${childlesson.addressName}`}}</br>
                    已选人数：{{`${childlesson.currentStudent}/${childlesson.maxStudent}`}}</br>
                  </div>
                </cell>
              </span>
            </p>
          </div>
          <div v-if="flag===true" class="childlesson-tag">
            <label  @click="showOrhide(lesson)">前置实验</label>
            <p class="slide" :class="currentcell.recordId==lesson.recordId ?'animate':''">
              <span v-for="child in preNames" :key="child">
                <cell :title="`${child}`">
                </cell>
              </span>
            </p>
          </div>
          <div>
            <span>{{ lesson.addressName }}</span>
            <span class="lesson-tag">{{ `${lesson.currentStudent}/${lesson.maxStudent}` }}</span>
          </div>
          <div class="action-wrapper">
            <x-button v-if="isElected(lesson)" mini type="warn" @click.native="cancel(lesson)">取消</x-button>
            <x-button v-else-if="rule(lesson)" mini type="primary" @click.native="showPreexp(lesson)">选课</x-button>
          </div>
        </div>
      </cell>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showConfirm" @on-cancel="onCancel" @on-confirm="onConfirm">
        <p style="text-align:center;">{{ tip }}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <toast v-model="showToast" :text="toastText"></toast>
    </div>
    <divider>我是有底线的</divider>
</div>
</template>



<script>
import { Cell, CellBox, Group, FormPreview, XButton, Toast, Confirm,Divider,TransferDomDirective as TransferDom } from 'vux'
import { mapGetters, mapActions } from 'vuex'
import qs from 'qs'
import store from '../store'
export default {
  data() {
    return {
      validLessons: [],
      electedLessonId: '',
      requestedLesson: {},
      confirmAction: function () { },
      showConfirm: false,
      showToast: false,
      tip: '',
      toastText: '',
      currentcell:{},
      experiMents:[],
      flag:false,
      exp:{},
      preNames:[]
    }
  },
  mounted() {
    this.loadLessons();
    this.electedLessonId = this.$route.query.current;
    this.initexperiments();
  },
  computed: {
    ...mapGetters(['experiments', 'semester', 'selectedCourse', 'user']),
    experiment: function () {
      return this.$route.params.experimentId;
    },
    lessons: function () {
      return this.validLessons;
    }
  },
  directives: {
    TransferDom
  },
  components: {
    Group,
    Cell,
    CellBox,
    FormPreview,
    XButton,
    Toast,
    Confirm,
    Divider
  },
  methods: {
    ...mapActions([

    ]),
    isElected(lesson) {
      if (lesson.recordId === this.electedLessonId) {
        return true;
      } else {
        return false;
      }
    },
    rule(lesson) {
      const currentStudent = parseInt(lesson.currentStudent);
      const maxStudent = parseInt(lesson.maxStudent);
      if (currentStudent >= maxStudent) {
        return false;
      }
      return true;
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
    elect(lesson) {
      const _this = this;
      this.requestedLesson = lesson;  
      if (lesson.hasChildren) {
        this.setTip('选择该场次将选择其关联场次，确认继续？');
      } else {
        this.setTip(`上课日期：${lesson.date}, 确认继续？`);
      }
      this.confirmAction = function () {
        store.state.isLoading = true;
        _this.axios.post(`electives`, qs.stringify({
          lesson: this.requestedLesson.recordId,
          course: this.selectedCourse.recordId,
          student: this.user.recordId,
          semester: this.semester.recordId
        }))
          .then(function (response) {
            store.state.isLoading = false;
            _this.electedLessonId = _this.requestedLesson.recordId;
            _this.toastText = '选课成功';
            _this.showToast = true;
            _this.loadLessons();
          }, function (error) {
            store.state.isLoading = false;
            _this.toastText = '选课失败';
            _this.showToast = true;
          })
          .catch(function (error) {
            store.state.isLoading = false;
            _this.toastText = '选课失败';
            _this.showToast = true;
            console.log(error);
          });
      }
      this.showConfirm = true;
    },
    cancel(lesson) {
      const _this = this;
      this.requestedLesson = lesson;
      if (lesson.hasChildren) {
        this.setTip('取消该场次将取消其关联场次，确认继续？');
      } else {
        this.setTip(`确认取消？`);
      }
      this.confirmAction = function () {
        store.state.isLoading = true;
        _this.axios.put(`electives`, qs.stringify({
          lesson: this.requestedLesson.recordId,
          course: this.selectedCourse.recordId,
          student: this.user.recordId,
          semester: this.semester.recordId
        }))
          .then(function (response) {
            store.state.isLoading = false;
            _this.electedLessonId = '';
            _this.toastText = '取消成功';
            _this.showToast = true;
            _this.loadLessons();
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
    loadLessons(done) {
      var _this = this;
      const date = new Date();
      this.axios.get(`lessons?experiment=${this.experiment}&start=${`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`}&end=${this.semester.endTime}`)
        .then(function (response) {
          _this.sortLessons(response.data);
          if (typeof (done) === 'function') {
            done();
          }
        }, function (error) {
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    sortLessons(lessons) {
      const selectedIndex = lessons.findIndex(lesson => lesson.recordId === this.electedLessonId);
      let electedLesson = [];
      if (selectedIndex !== -1) {
        electedLesson = lessons.splice(selectedIndex, 1);
      }
      this.validLessons = lessons.sort(function (a, b) {
        if (Date.parse(`${a.date.replace('-', '/')} ${a.startTime}`).valueOf() >
          Date.parse(`${b.date.replace('-', '/')} ${b.startTime}`).valueOf()) {
          return 1;
        }

        if (Date.parse(`${a.date.replace('-', '/')} ${a.startTime}`).valueOf() <
          Date.parse(`${b.date.replace('-', '/')} ${b.startTime}`).valueOf()) {
          return -1;
        }

        return 0;
      });
      this.validLessons = electedLesson.concat(this.validLessons);
    },
    showPreexp(lesson){
      let _this=this;
      let count=0;
      let expcount=[];
      //交集数组// 使用方式Array.intersect([1,2,3,4], [3,4,5,6]); // [3,4]
        Array.intersect = function(arr1, arr2) {
          if(Object.prototype.toString.call(arr1) === "[object Array]" && Object.prototype.toString.call(arr2) === "[object Array]") {
              return arr1.filter(function(v){  
                return arr2.indexOf(v)!==-1  
              })  
          }
        }
        //差集数组// 使用方式var arr = [1,2,3,4];arr.minus([2,4]); // [1,3]
        Array.prototype.minus = function(arr) {
          if(Object.prototype.toString.call(arr) === "[object Array]") {
              var interArr = Array.intersect(this, arr);// 交集数组
              return this.filter(function(v){
                  return interArr.indexOf(v) === -1
              })
          }
        }
      this.experiments.forEach(function(item){
        _this.preNames.forEach(function(pre){
          if(item.address && item.experiment==pre){
            count+=1;
            expcount.push(item.experiment);
          }
        });
      })
      if(this.preNames.length!=count){
          this.setTip(`请先完成前置实验：${this.preNames.minus(expcount)}`);
          this.showConfirm = true;
      } else {
        this.elect(lesson);
      }
    },
    initexperiments(){
      let _this=this;
      this.axios.get(`experiments`)
      .then(function(response){
        _this.experiMents=response.data;
         _this.initcurrentexp();
      })
      .catch(
        function(err){
          console.log(err);
      })
    },
    initcurrentexp(){
      let _this=this;
      let experiments=this.experiMents;
      let prenames=[];
      this.axios.get(`experiments/${this.experiment}`)
      .then(function(response){
        console.log(response.data);
        _this.exp=response.data;
        if(response.data.preexp && response.data.preexp != ""){
          _this.flag=true;
          let pre= response.data.preexp?response.data.preexp.split(','):[];
          experiments.forEach(function(experiment){
            pre.forEach(function(item){
              if(experiment.recordId==item){
                prenames.push(experiment.name);
              }
            });
           });
           console.log(prenames);
          _this.preNames=prenames;
        } else {
           _this.flag=false;
        }
      })
      .catch(function(err){
        console.log(err);
      })
    },
    showOrhide(lesson){
   
      if(this.currentcell.recordId &&lesson.recordId==this.currentcell.recordId){
        this.currentcell={};
      }else{
        this.currentcell=lesson;
      }
    }
  }
}
</script>
<style scoped>
.icon-wrapper {
  text-align: center;
}

.weui-form-preview em {
  font-size: 1em;
}

.weui-form-preview__bd {
  display: none!important;
}

.lesson-tag {
  float: right;
  font-weight: bold;
  color: #f43530;
}

.childlesson-tag{
  color: #EE4000;
}
.slide {
  padding: 0 20px;
  overflow: hidden;
  max-height: 0;
  transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
}

.animate {
  max-height: 9999px;
  transition-timing-function: cubic-bezier(0.5, 0, 1, 0);/*规定速度效果的速度曲线。*/
  transition-delay: 0s;/*定义过渡效果何时开始。*/
}
</style>
