import Vue from 'vue'
import VueRouter from 'vue-router'
import Course from '@/components/Course'
import Message from '@/components/Message'
import User from '@/components/User'
import Login from '@/components/Login'
import Experiment from '@/components/Experiment'
import MineExperiment from '@/components/MineExperiment'
import Lesson from '@/components/Lesson'
import History from '@/components/History'
import Report from '@/components/Report'
import LessonByTeacher from'@/components/LessonByTeacher'
import ExpLessonbytea from'@/components/ExpLessonbytea'
import QueryLog from'@/components/QueryLog'
import LessonDetails from'@/components/LessonDetails'
import Attexperiment from'@/components/Attexperiment'
import filterLesson from'@/components/FilterLesson'
import SearchPlugin from'@/components/StuGrade'
import SearchDetail from'@/components/StuGradeDetail'
import Test from'@/components/Test'
Vue.use(VueRouter);

export default new VueRouter({
  mode: "history",
  base: 'wechat',
  routes: [{
    path: '/',
    name: 'OLMS',
    component: Course
  }, {
    path: '/course',
    name: 'OLMS',
    component: Course
  }, {
    path: '/message',
    name: 'OLMS',
    component: Message
  }, {
    path: '/mine/experiment',
    component: MineExperiment
  }, {
    path: '/mine',
    name: 'OLMS',
    component: User
  }, {
    path: '/login',
    name: 'OLMS Login',
    component: Login
  }, {
    path: '/experiment',
    name: 'OLMS',
    component: Experiment
  }, {
    path: '/experiment/:experimentId/lessons',
    name: 'OLMS',
    component: Lesson
  }, {
    path: '/history',
    name: 'OLMS',
    component: History
  }, {
    path: '/report/:id',
    component: Report
  }, {
    path: '/mine/course',
    component: Course
  },{
    path: '/teacher/lesson',
    component: LessonByTeacher
  },
  {
    path: '/teacher/lesson/filter',
    component: filterLesson
  },
  {
    path: '/teacher/experiment/lessons',
    component: ExpLessonbytea
  },{
    path:'/teacher/querylog',
    component: QueryLog
  },{
    path:'/teacher/:recordId/lessondetails',
    component: LessonDetails
  },{
    path:'/teacher/:recordId/lessondetails/attstatus',
    component: Attexperiment
  },{
    path:'/teacher/search',
    component: SearchPlugin
  },{
    path:'/teacher/search/detail',
    component:SearchDetail
  },{
    path:'/teacher/test',
    component:Test
  }
  ]
});
