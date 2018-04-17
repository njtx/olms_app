<template>
  <group>
    <card :header="{title:'我的成绩'}">
      <div slot="content" class="card-demo-flex card-demo-content01">
  
        <div class="vux-1px-l vux-1px-r">
          <span>10</span>
          <br/>已完成
        </div>
  
        <div class="vux-1px-r">
          <span>8</span>
          <br/>迟到
        </div>
  
        <div class="vux-1px-r">
          <span>1</span>
          <br/> 旷课
        </div>
  
        <div>
          <span>2</span>
          <br/>器材未整理
        </div>
      </div>
    </card>
  </group>
  <elective></elective>
</template>

<script>
import { Panel, Group, Card, Cell, CellBox, CellFormPreview, Badge } from 'vux'
import { mapGetters, mapActions } from 'vuex'
import Elective from './Elective';
export default {
  data() {
    return {
      electives: [],
      buttons: [{
        style: 'primary',
        text: '选课'
      }],
      expanding: false
    }
  },
  mounted() {
    this.loadElectives();
  },
  computed: {
    ...mapGetters(['semester', 'user', 'courses', 'experiments', 'singleCourse']),
    filterElectives: function() {
      return this.electives;
    }
  },
  components: {
    Panel,
    Group,
    Card,
    Cell,
    CellBox,
    CellFormPreview,
    Badge,
    Elective
  },
  methods: {
    methods: {
      ...mapActions([

      ])
    },
    loadElectives() {
      var _this = this;
      this.axios.get(`users/${this.user.recordId}/electives?semester=${this.semester.recordId}`)
        .then(function (response) {
          /* TODO: 
          * 1.已选、未选分组
          * 2.下拉刷新
          * 3.切换TAB时保存当前TAB状态
          **/
          _this.electives = response.data;
          _this.electives.map(function (item, intex) {
            Object.assign(item, { expanding: false });
          });
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
<style scoped>

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
</style>
