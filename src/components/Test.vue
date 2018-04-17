
<template>
  <div>

    <!--对于scroller默认高度总是占满父容器，虽然可以使用属性设置高度-->
    <!--但在用一个div包住4会更简单点-->
    <!--<div style="height:600px;">-->
      <!--scroller组件定位方式用relative 否则会溢出父容器-->
      <scroller 
        class="content-wrapper"
        :on-refresh="refresh"
        :on-infinite="infinite"
        ref="my_scroller">
        <!--<div v-for="(item, index) in items" @click="onItemClick(index, item)"
             class="row">
          {{ item }}
        </div>-->
        <cell v-for="lesson in lessons"
            :key="lesson.recordId" :title="lesson.experimentName"
            >
            <div slot="inline-desc">
              <div> 
                <span>{{lesson.teacherName}} 
                  {{lesson.currentStudent +'/'+lesson.maxStudent}} {{lesson.addressName}} {{lesson.date}}  {{lesson.periodName}}</span></br>
              </div>
              <div class="action-wrapper">
                <x-button mini type="primary" v-if="!lesson.teacherName && lesson.status=='release' && user.recordId == params.teacher" 
                  @click.native="clickClaim(lesson)">认领场次</x-button>
                <x-button v-else-if="user.recordId == lesson.teacher && lesson.status == 'release'" 
                  mini type="warn" @click.native="onCancel(lesson)">取消认领</x-button>
              </div>
            </div>
          </cell>
      </scroller>
  </div>

</template>

<script>
import { Cell,XButton } from 'vux'
import { mapGetters, mapActions } from 'vuex'
import store from '../store'
  export default {

    data() {
      return {
        items: [],
        validLessons:[],
        lessons:[]
      }
    },
    computed: {
    ...mapGetters(['selectedlesson','lessonsDate','user','params','moreSelected'])
  },
    components:{Cell,XButton},
    mounted() {
      // for (let i = 0; i < 9; i++) {
      //   this.items.push(i)
      // }
      // console.log(this.items)
       this.sortLessons();
      
    },
    methods: {
      refresh(done) {
        // this.items = [1, 2, 3, 4, 5, 6]
        // setTimeout(() => {
        //     done()
        //   }, 1500)

        let _this=this;
        if(this.lessons.length <= 10){
          setTimeout(() => {
           done()
          }, 1500)
          return;
        }
        setTimeout(() => {
          let  start = _this.lessons.length;
          for (let i = start; i > start - 10; i--) {
            // if(i<=_this.lessons.length-1){
              _this.lessons.splice(i-1);
            // }
            console.log(i);
          }
          done()
        }, 1500)
       
      },
      infinite(done) {
        let _this=this;
        // if(this.items.length > 30){
        //   setTimeout(() => {
        //     done(true)
        //     this.infinite = undefined
        //   }, 1500)
        //   return;
        // }
        //  setTimeout(() => {
        //    this.items = this.items.concat([7, 8, 9, 10,])
        //    done()
        //   }, 1500)
        //排序
      if(this.lessons.length >= this.validLessons.length){
      setTimeout(() => {
        done(true)
        this.infinite = undefined
      }, 1500)
      return;
      }
      setTimeout(() => {
        let  start = _this.lessons.length;
        for (let i = start; i < start + 10; i++) {
          if(i<=_this.validLessons.length-1){
            _this.lessons.push(_this.validLessons[i]);
          }
          console.log(i);
        }
        setTimeout(() => {
          done()
        })
        }, 1500)
      
      },
    sortLessons() {
      this.validLessons = this.lessonsDate.sort(function (a, b) {
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
      for (let i = 0; i <this.validLessons.slice(0,10).length; i++) {
        this.lessons.push(this.validLessons[i])
      }
      console.log(this.lessons)
    },
      onItemClick(index, item) {
        console.log(index)
      }
    }
  }
</script>


<style scoped>
  /*.container {
    height: 100vh;
    overflow-y: scroll;
  }*/
   .action-wrapper {
    float: right;
  }
  .row {
    height: 100px;
    width: 100px;
    background: deepskyblue;
    margin: 10px;
  }

  .scroller {
    /*position: relative;*/
    padding-top: 40px;
    padding-bottom: 53px;
    box-sizing: border-box;
    height: 100%;
    overflow: scroll;
  }

  .content-wrapper{
    padding-top: 113px;
    padding-bottom: 53px;
    box-sizing: border-box;
    height: 100%;
    overflow: scroll;
  }
  .content-wrapper >._v-content{
    padding-bottom: 166px;
  }

</style>