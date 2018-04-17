<template>
  <div class="view-wrapper">
    <card class="view-header" :header="{title:'历史选课'}">
      <div v-if="historySemesters.length == 0" slot="content">无历史记录</div>
      <popup-radio slot="content" title="学期" :options="options" v-model="selectedSemester.key"></popup-radio>
    </card>
    <elective v-if="selectedSemester.key!=''" class="elective-content" :semester="selectedSemester.key"></elective>
  </div>
</template>

<script>
import { Card, Cell, CellBox, Group, PopupRadio } from 'vux'
import { mapGetters, mapActions } from 'vuex'
import Elective from './Elective';
export default {
  data() {
    return {
      selectedSemester:{key:'',value:''},
      historySemesters: []
    }
  },
  computed: {
    ...mapGetters(['courses', 'semester', 'semesters', 'singleCourse', 'loading']),
    options: function () {
      const _this = this;
      this.semesters.map(function (item, index) {
        //不显示当前学期
        if (_this.semester.recordId !== item.recordId) {
          _this.historySemesters.push({
            key: item.recordId,
            value: item.name
          });
        }
      });
      if (_this.historySemesters.length > 0) {
        //this.selectedSemester.push(this.historySemesters[0]);
       this.selectedSemester.key = this.historySemesters[0].key;
       this.selectedSemester.value = this.historySemesters[0].value;
      }
      return this.historySemesters;
    }
  },
  mounted() {
    this.loading = true;
  },
  components: {
    Card,
    Group,
    Cell,
    CellBox,
    PopupRadio,
    Elective
  },
  methods: {
    ...mapActions([
      'loadExperiments'
    ])
  }
}
</script>

<style scoped>
.sub-item {
  color: #888;
}

.slide {
  padding: 0 20px;
  overflow: hidden;
  max-height: 0;
  transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
}

.animate {
  max-height: 9999px;
  transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
  transition-delay: 0s;
}

.view-header {
  z-index: 100;
}

.elective-content {
  padding-top: 89px;
  padding-bottom: 53px;
  box-sizing: border-box;
  height: 100%;
  overflow: scroll;
}
</style>
