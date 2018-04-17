<template>
  <div>
    <div>
      <cell :title="user.name" :border-intent="false">
        <div slot="inline-desc">
          <span>{{ user.id }}</span>
        </div>
      </cell>
    </div>
    <div v-if="user.role=='student'">
      <cell title="历史选课" is-link link="/history" :border-intent="false">
  
      </cell>
      <cell title="当前选课" is-link link="/mine/course" :border-intent="false">
    
      </cell>
    </div>
      <div v-else-if="user.role=='teacher'">
      <cell title="成绩查询" is-link link="/teacher/search" :border-intent="false">
    
      </cell>
      <cell title="选课日志" is-link link="/teacher/querylog" :border-intent="false">
    
      </cell>
      <cell title="测试" is-link link="/teacher/test" :border-intent="false">
    
      </cell>
    </div>
     <cell title="退出登录" @click.native="logout" :border-intent="false">
  
    </cell>
  </div>
</template>

<script>
import Elective from './Elective'
import { Panel, Group, Card, Cell, CellBox, CellFormPreview, Badge } from 'vux'
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {

    }
  },
  computed: mapGetters(['messages', 'user', 'courses', 'experiments', 'singleCourse']),
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
    ...mapActions([
      'logout'
    ])
  }
}
</script>

<style>

</style>
