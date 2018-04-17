<template>
  <scroller class="content-wrapper">
    <!-- content goes here -->
    <div v-for="elect in electives" class="vux-1px-b">
      <cell :key="elect.recordId" :title="`${elect.experiment}`" :border-intent="false">
        <div slot="inline-desc">
          <div>
            <span>{{ elect.date }}</span>
            <span>{{ elect.period }}</span>
          </div>
          <div class="action-wrapper">
            <x-button mini type="primary" @click.native="report(elect)">报告</x-button>
            <x-button v-if="enableEvaluation===true" mini type="primary" @click.native="evaluate(elect)">评教</x-button>
          </div>
        </div>
      </cell>
    </div>
  </scroller>
</template>
<script>
import { Cell, XButton } from 'vux'
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      electives: []
    }
  },
  watch:{
    semester:function(val){
      this.loadElectives();
    }
  },
  props: ['semester'],
  mounted() {
    this.loadElectives();
  },
  computed: {
    ...mapGetters(['user', 'courses', 'experiments', 'singleCourse', 'showRaterDialog','enableEvaluation'])
  },
  components: {
    Cell,
    XButton
  },
  methods: {
    ...mapActions([

    ]),
    refresh() {
      this.loadElectives();
    },
    getRate() {
      this.showRaterDialog = true;
    },
    report(lesson) {
        this.$router.push(`/report/${lesson.recordId}`);
    },
    evaluate(elect) { 
      console.log(elect);
      this.showRaterDialog = true;
    },
    loadElectives() {
      var _this = this;
      this.axios.get(`users/${this.user.recordId}/electives?semester=${this.$props.semester}`)
        .then(function (response) {
          /* TODO: 
          * 1.已选、未选分组
          * 2.下拉刷新
          * 3.切换TAB时保存当前TAB状态
          **/
          _this.electives = response.data;
          // _this.validLessons = response.data;
        }, function (error) {
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
}
</script>
<style>
.content-wrapper>._v-content{
  padding-bottom: 142px;
}
.action-wrapper {
  float: right;
}
</style>
