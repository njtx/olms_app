
<template>
    <div>
        <grid :cols="1" :show-lr-borders="false">
            <grid-item class="grid-item">
                <!--<group gutter="0">
                    <selector placeholder="请选择班级" v-model="key" :value-map="['recordId', 'name']" :options="list" @on-change="onChange"></selector>
                </group>-->
                 <search v-model="info" @on-submit="onSubmit" :auto-fixed="false" ref="search"
                    @on-cancel="onCancel" placeholder="请输入学号或姓名"></search>
            </grid-item>
             <grid-item class="grid-item2">
               <group v-if="students.length > 0" gutter="0">
                   <cell v-for="(item,index) in students" :key="index" :title="`姓名：${item.name}`"
                    @click.native="stuGrade(item)">
                       <div slot="inline-desc">
                           <span>{{item.id}} {{item.departmentName}} {{item.semestername}}</span>
                           
                       </div>
                   </cell>
                   <divider>我是有底线的</divider>
               </group>
               <div v-else class="noConent">无学生记录</div>
            </grid-item>
        </grid>
    </div> 
</template>

<script>
import { Grid,GridItem,GroupTitle, Group,Cell,Selector,Search,Divider} from 'vux'
import { mapGetters, mapActions } from 'vuex'
import store from '../store'
export default {
  data(){
      return {
        // key: '',
        // list: [],
        students:[],
        info:''
      }
  },
  computed:{
       ...mapGetters(['semester','studented'])
  },
  components:{
    Grid,
    GridItem,
    GroupTitle, 
    Group,
    Cell,
    Selector,
    Search,
    Divider
  },
  mounted(){
    //   this.getClass();
    this.info=this.studented.id;
    this.onSubmit();
  },

  methods:{
    //   onChange(){
    //       this.getStuByClass();
    //   },
      getValue(){
      },
     getClass(){
         let _this=this;
         this.axios.get('/departments?semester='+this.semester.recordId).then(
             function(response){
                 _this.list=response.data
                 _this.key=typeof(_this.studented.department)=='undefined' ? '': _this.studented.department;
             }
         ).catch(function(err){
             console.log(err);
        });
     },
     getStuByClass(){
        let _this=this;
         this.axios.get('/users?',{
             params:{
                 role:'student',
                 department:this.key
             }
         }).then(
             function(response){
                 _this.students=response.data
             }
         ).catch(function(err){
             console.log(err);
        });
     },
     onSubmit(){
        this.$refs.search.setBlur();
        let _this=this;
        this.axios.get('/users?info='+this.info).then(
            function(response){
                _this.students=response.data
            }
        ).catch(function(err){
             console.log(err);
        });
     },
     onCancel(){
         this.students=[];
         this.getStuByClass();
          store.commit('studented',{});
     },
     stuGrade(item){
         let _this=this;
         store.commit('studented',item);
         this.axios.get(`/courses/student?semester=${item.semester}&student=${item.recordId}`)
         .then(function(response){
            store.commit('updateCourses',response.data);
            _this.$router.push('/teacher/search/detail');
         }).catch(function(err){
             console.log(err);
         });
     }
  }
}
</script>


<style scoped>
    .grid-item{
         /*top:30px;*/
         top:40px;
         position:fixed;
         z-index:100;
         padding:0px;
         color:#666;
    }
    .grid-item2{
        /*margin-top:112px;带有班级item*/
        /*margin-top:74px;*/
        margin-top:44px;
        padding:0px;
        color:#666;
    }
    .noConent{
        text-align: center;
        margin-top:10px;
        color: #666;
        font-size:14px;
        }
</style>

