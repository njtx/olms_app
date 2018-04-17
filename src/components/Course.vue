<template>
    <group gutter="0">
      <cell v-for="course in Courses" 
      :key="course.recordId" :title="course.name" 
      is-link :link="course.recordId ? isMine:''" 
      :border-intent="false" 
      :arrow-direction="singleCourse ? 'down' : 'up'" 
      :inline-desc="course.recordId ? course.description:'尚未关联课程'" 
      @click.native="course.recordId ? setCourses(course):''"></cell>
    </group>
</template>

<script>
import { Cell, CellBox, Group } from 'vux'
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters(['courses', 'singleCourse','semester','user']),
    Courses:function(){
      return this.courses.length>0?this.courses:'无'
    },
    isMine: function() {
      return this.$route.path.indexOf('mine') !== -1 ? `/mine/experiment` : `/experiment`;
    }
    
  },
  components: {
    Group,
    Cell,
    CellBox
  },
  methods: {
    ...mapActions(['setCourse']),
    setCourses(course){
      const _this=this;
      this.axios.get(`courses/${course.recordId}/grade?semester=${_this.semester.recordId}`)
      .then(function(grade){
          if(!grade.data.recordId){
            _this.$vux.confirm.show({
              content: '该学期课程尚未开始选课，是否初始化？',
              // 组件除show外的属性
              onCancel () {
                return _this.$router.push({path:'/course'});
              },
              onConfirm () {
                _this.axios.post(`grade`,{              
                    semester: _this.semester.recordId,
                    course: course.recordId,
                    user:  _this.user.recordId
                  }).then(function(response){
                    console.log(response);
                    _this.setCourse(course);
                  }).catch(function (error){
                    console.log(error);
                });
              }
            })
          } else if (grade.data.recordId){
            _this.setCourse(course);
          }
      }).catch(function (error){
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
</style>
