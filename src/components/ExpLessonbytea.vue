<template>
  <scroller>
    <cell v-for="lesByexp in showlessons"
    :key="lesByexp.experiment":title="lesByexp.experimentName"
    :inline-desc="content(lesByexp)">
    </cell>
  </scroller>
</template>

<script>
import { Cell, Group, TransferDomDirective as TransferDom } from 'vux'
import { mapGetters, mapActions } from 'vuex'
import store from '../store'
export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([ 'user','showlessons'])
  },
  directives: {
    TransferDom
  },
  components: {
    Group,
    Cell
  },
  methods: {
    ...mapActions([

    ]),
    content(lesson){
      return  `日期：${lesson.date} 地点：${lesson.addressName} 节次：${lesson.periodName} 
        容纳人数：${lesson.maxStudent} 选课人数：${lesson.currentStudent} 考勤人数：${lesson.att_count}`;
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

</style>
