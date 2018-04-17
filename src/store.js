import Vue from 'vue'
import Vuex from 'vuex'
import axios from './http'
import {
  MD5
} from 'crypto-js'
import {
  cookie
} from 'vux'
import router from './router'

Vue.use(Vuex)

//从localStorage初始化数据
let state = {
  isLogin: localStorage.getItem('isLogin') === 'true',
  isLoading: false,
  showRaterDialog: false,
  singleCourse: false,
  selectedCourse: JSON.parse(localStorage.getItem('selectedcourse')) || {},//防止刷新数据丢失
  currentEvaluation: {
    attitude: 5,
    effect: 5,
    method: 5,
    skill: 5,
    spirit: 5,
    status: 'Y'
  },
  requestError: {
    status: false,
    text: ''
  },
  defaultCourse: JSON.parse(localStorage.getItem('defaultCourse')) || {},
  user: JSON.parse(localStorage.getItem('user')) || {},
  messages: JSON.parse(localStorage.getItem('messages')) || [],
  courses: JSON.parse(localStorage.getItem('courses')) || [],
  experiments: JSON.parse(localStorage.getItem('experiments')) || [],
  lessons: JSON.parse(localStorage.getItem('lessons')) || [],
  electives: JSON.parse(localStorage.getItem('electives')) || [],
  report: JSON.parse(localStorage.getItem('report')) || [],
  evaluation: JSON.parse(localStorage.getItem('evaluation')) || {},
  semester: JSON.parse(localStorage.getItem('semester')) || {},
  semesters: JSON.parse(localStorage.getItem('semesters')) || [],
  currentlessons:JSON.parse(localStorage.getItem('currentlessons')) || [],
  lessonsDate:JSON.parse(localStorage.getItem('lessonsDate')) || [],
  lessonDetails:JSON.parse(localStorage.getItem('lessonDetails')) || [],
  selectedlesson:JSON.parse(localStorage.getItem('selectedlesson')) || {},
  currentTime:JSON.parse(localStorage.getItem('currentTime')) || [],
  showModel:false,
  selecteddate:localStorage.getItem('selecteddate') || '',
  params:JSON.parse(localStorage.getItem('params')) || {},
  studented:JSON.parse(localStorage.getItem('studented')) || {},
  enableEvaluation:false,
  enableClaims:false
};

const mutations = {
  //20180208==重置store
  resetStates(states, payload) {
    for (var state in states) {
      if (typeof (states[state])=== 'object') {
          states[state]={};
      }
    }
  },
  loading(context) {
    context.isLoading = true;
  },
  login(context, user) {
    context.isLogin = true;
    localStorage.setItem('isLogin', 'true');
    context.user = user;
    localStorage.setItem('user', JSON.stringify(user));
    user.role=='teacher'?router.push('/teacher/lesson'):router.push('/');
  },
  logout(context) {
    context.isLogin = false;
    localStorage.setItem('isLogin', 'false');
    router.push('/login');
  },
  toast(context, text) {
    context.requestError = {
      status: true,
      text: text
    };
  },
 
  updateSemester(context, semester) {
    context.semester = semester;
    context.isLoading = false;
    localStorage.setItem('semester', JSON.stringify(semester));
  },
  updateSemesters(context, semesters) {
    context.semesters = semesters;
    context.isLoading = false;
    localStorage.setItem('semesters', JSON.stringify(semesters));
  },
  updateCourses(context, courses) {
    context.courses = courses;
    if (courses.length === 1) {
      context.singleCourse = true;
      context.defaultCourse = courses[0];
    }
    context.isLoading = false;
    localStorage.setItem('courses', JSON.stringify(courses));
  },
  setCourse(context, course) {
    context.selectedCourse = course;
    localStorage.setItem('selectedcourse', JSON.stringify(course));
  },
  setCurrentEvaluation(context, evaluation) {
    context.currentEvaluation = evaluation;
    context.showRaterDialog = true;
  },
  updateExperiments(context, experiments) {
    context.experiments = experiments;
    context.isLoading = false;
    localStorage.setItem('experiments', JSON.stringify(experiments));
  },
  updateMessages(context, messages) {
    context.messages = messages;
    context.isLoading = false;
    localStorage.setItem('messages', JSON.stringify(messages));
  },
  updateUsers(context, users) {
    context.users = users;
    router.push('/user');
    context.isLoading = false;
  },
  //TODO
  currentLessons(context,currentlessons){
    context.currentlessons=currentlessons;
    context.isLoading = false;
    localStorage.setItem('currentlessons',JSON.stringify(currentlessons));
  },
  //20180202
  LessonDate(context,Lessons){
    context.lessonsDate=Lessons;
    context.isLoading = false;
    localStorage.setItem('lessonsDate',JSON.stringify(Lessons));
  },
  //20180206
  expLessonDetails(context,lessonDetails){
    context.lessonDetails=lessonDetails;
    context.isLoading = false;
    localStorage.setItem('lessonDetails',JSON.stringify(lessonDetails));
  },
  //20180206
  selectlesson(context,selectedlesson){
    context.selectedlesson=selectedlesson;
    localStorage.setItem('selectedlesson',JSON.stringify(selectedlesson));
  },
  //20180206
  currentTime(context,currentTime){
    context.currentTime=currentTime;
    context.isLoading=false;
    localStorage.setItem('currentTime',JSON.stringify(currentTime));
  },
  //20180209 
  showmodel(context,status){
    context.showModel=status;
  },
  //20180307
  selecteddate(context,date){
    context.selecteddate=date;
    localStorage.setItem('selecteddate',date);
  },
  params(context,date){
    context.params=date;
    localStorage.setItem('params',JSON.stringify(date))
  },
  //20180327
  studented(context,data){
    context.studented=data;
    localStorage.setItem('studented',JSON.stringify(data))
  }
};

// 事件触发后的逻辑操作
// 参数为事件函数
const actions = {
  // rest state action
    resetStates:function (context, payLoad) {
        context.commit('resetStates', payLoad);
    },
  login(context, user) {
    axios.get(`security/login?username=${user.username}&password=${MD5(user.password)}`)
      .then(function (response) {
        document.cookie = `JSESSIONID=${response.data.session};Path=/`;
        context.commit('login', response.data);
        if(response.data.role=='student'||response.data.role=='teacher'){
          //登录时进行加载
          context.dispatch('getSemester', response.data);
          context.dispatch('getMessages');
          context.dispatch('getSemesters');
        }else{
          context.dispatch('logout');
          context.commit('toast','非学生、非教师角色不能登录！');
        }
      }, function (error) {
        
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  validate(context) {
    axios.get(`users/current`)
      .then(function (response) {
        console.log(response);
      }, function (error) {
        
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  logout(context) {
    context.commit('logout');
  },
  getSemester(context, user) {
    context.commit('loading');
    axios.get(`configs/name/defaultSemester?department=${user.department}`)
      .then(function (response) {
        axios.get(`semesters/${response.data}`)
          .then(function (response) {
            context.commit('updateSemester', response.data);
          }, function (error) { })
          .catch(function (error) {
            console.log(error);
          });
        if(user.role=='student'){
          context.dispatch('getCourses', response.data);
        }else if(user.role=='teacher'){
          context.dispatch('getCurrentLessons',{
            user:user,
            semester:response.data
          });
        }else{
          console.log('非学生、非教师角色不能登录！');
        }
      }, function (error) {
        
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  getSemesters(context, user) {
    context.commit('loading');
    axios.get(`semesters`)
      .then(function (response) {
        context.commit('updateSemesters', response.data);
      }, function (error) {
        
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  getCourses(context, semester) {
    axios.get(`courses?semester=${semester}`)
      .then(function (response) {
        context.commit('updateCourses', response.data);
      }, function (error) {
        
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  setCourse(context, course) {
    context.dispatch('loadExperiments', course);
  },
  loadExperiments(context, course) {
    context.commit('loading');
    axios.get(`electives/student?semester=${context.state.semester.recordId}&student=${context.state.user.recordId}&course=${course.recordId}`)
      .then(function (response) {
        context.commit('setCourse', course);
        context.commit('updateExperiments', response.data);
      }, function (error) {
        
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  getMessages(context) {
    axios.get(`announcements`)
      .then(function (response) {
        context.commit('updateMessages', response.data);
      }, function (error) {
        
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  getLessons(context) {
    axios.get(`announcements`)
      .then(function (response) {
        context.commit('updateMessages', response.data);
      }, function (error) {
        
      })
      .catch(function (error) {
        console.log(error);
      });
  },

  getUsers(context) {
    axios.get(`users/current`)
      .then(function (response) {
        context.commit('updateUser', response.data);
      }, function (error) {
        
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  
  //TODO
  getCurrentLessons(context,object){
    axios.get(`until/time`)
    .then(function(response){
      var time=response.data.time.substring(0,10);
      axios.get(`lessons?start=${time}&&end=${time}&&teacher=${object.user.recordId}`)
      .then(function(response){
        context.commit('currentLessons',response.data);
      },function(err){

      }).catch(function(err){
        console.log(err);
      });
    })
    .catch(function(err){
        console.log(err);
    });
    
  },

  //20180202
  getLessondate(context,object){
    context.commit('loading');
    axios.get(`lessons`,{
        params:{
          start:object.start,
          end:object.end,
          experiment:object.experiment,
          address:object.address,
          semester:object.semester
        }
    })
    .then(function(response){
        var filterd=response.data.filter(function(item,index){
          if((object.noteacherChecked && item.teacher==null) || (item.teacher==object.teacher) ||(object.teacher=='' && item.teacher)){
              return item;
          } 
        });
        context.dispatch('sortLessons',filterd);
      },function(err){
      }).catch(function(err){
        console.log(err);
      });
  },
  sortLessons(context,alllessons) {
    var lessons = alllessons.sort(function (a, b) {
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
    var filtered=[];
    var sortlessons=[];
    lessons.forEach(function(item) {
      if(item.teacher){
        filtered.push(item);
      } else {
        sortlessons.push(item);
      }
    });
    context.commit('LessonDate',filtered.concat(sortlessons));
  },
  //20180206
  expLesson(context,lesson){
    context.commit('loading');
    axios.get(`lessons/${lesson.recordId}/electives`).then(function(response){
      context.commit('expLessonDetails',response.data);
    }).catch(function(err){
      console.log(err);
    });
  },
  //20180206
  currentTime(context){
    context.commit('loading');
    axios.get(`until/time`).then(function(response){
      context.commit('currentTime',response.data.time);
    }).catch(function(err){
      console.log(err);
    });
  }
}

// 返回改变后的数值
const getters = {
  isLogin(context) {
    return context.isLogin;
  },
  isLoading(context) {
    return context.isLoading;
  },
  user(context) {
    return context.user;
  },
  singleCourse(context) {
    return context.singleCourse;
  },
  selectedCourse(context) {
    return context.selectedCourse;
  },
  defaultCourse(context) {
    return context.defaultCourse;
  },
  courses(context) {
    return context.courses;
  },
  experiments(context) {
    return context.experiments;
  },
  messages(context) {
    return context.messages;
  },
  semester(context) {
    return context.semester;
  },
  semesters(context) {
    return context.semesters;
  },
  showRaterDialog(context) {
    return context.showRaterDialog;
  },
  currentEvaluation(context) {
    return context.currentEvaluation;
  },
  requestError(context) {
    return context.requestError;
  },
  //TODO
  currentlessons(context){
    return context.currentlessons;
  },
  //20180202
  lessonsDate(context){
    return context.lessonsDate;
  },
  //20180206
  lessonDetails(context){
    return context.lessonDetails;
  },
  //20180206
  selectedlesson(context){
     return context.selectedlesson;
  },
  //20180206
  currentTime(context){
    return context.currentTime;
  },
  //20180209 显示另一种模式
  showModel(context){
    return context.showModel;
  },
  //20180307
  selecteddate(context){
    return context.selecteddate;
  },

  params(context){
    return context.params;
  },
  //20170327
  studented(context){
    return context.studented;
  },
  //南航默认评教功能为false
  enableEvaluation(context){
    return context.enableEvaluation;
  },
  //南航默认认领场次功能为false
  enableClaims(context){
    return context.enableClaims;
  }
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
});
