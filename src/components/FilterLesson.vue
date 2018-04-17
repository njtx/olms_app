<template>
    <div>
        <div class="filterlesson">
            <div class="no-teachers" >
                <span @click="back"><img src="../assets/icon_back.png" class="Img">返回</span>
                <div>
                    <div @click="noteachers(noTeachers)">
                        <icon type="success" v-show="type === 'default' && noTeachers"></icon>
                        <icon type="circle" v-show="!noTeachers"></icon>
                        <span>显示无教师场次</span>
                    </div>
                </div>
            </div>
            <flexbox :gutter="0">
                <flexbox-item>
                    <div class="flex-demo" @click="show(showSemesters)">
                        <div id="triangle-bottomright"></div>
                        {{sem!='' ? sem.name :'学期选项'}}
                    </div>
                </flexbox-item>
                <flexbox-item>
                    <div class="flex-demo" @click="show(showTeachers)">
                        <div id="triangle-bottomright"></div>
                        {{teacher!='' ? teacher.name : "教师选项"}}
                    </div>
                </flexbox-item>
                <flexbox-item>
                    <div class="flex-demo" @click="show(showExperiments)">
                        <div id="triangle-bottomright"></div>
                        {{experiment!='' ? experiment.name:'实验选项'}}
                    </div>
                </flexbox-item>
                <flexbox-item>
                    <div class="flex-demo" @click="show(showAddresses)">
                        <div id="triangle-bottomright"></div>
                        {{address!='' ? address.name:'地点选项'}}
                    </div>
                </flexbox-item>
            </flexbox>
            <flexbox :gutter="0" class="date-selected" > 
                <flexbox-item :span="5/11" > 
                    <datetime format="YYYY-MM-DD" title="" v-model="beginDate" confirm-text="确认" placeholder="开始日期"
                    cancel-text="取消" :start-date="sem.startTime" :end-date="sem.endTime" clear-text="清除" @on-clear="clearStartValue"
                    @on-change="onChange"></datetime> 
                </flexbox-item>
                <flexbox-item :span="1/11" class="spans">
                    <span class="label-title">---</span>
                </flexbox-item> 
                <flexbox-item :span="5/11"> 
                    <datetime format="YYYY-MM-DD" title="" v-model="endDate" confirm-text="确认" placeholder="结束日期"
                    cancel-text="取消" :start-date="beginDate!=''?beginDate:sem.startTime" :end-date="sem.endTime" clear-text="清除" @on-clear="clearEndValue"
                    @on-change="onChange"></datetime> 
                </flexbox-item> 
            </flexbox>
        </div>
        <div v-transfer-dom >
            <popup v-model="showSemesters.status" >
                <checker v-model="demo3" radio-required default-item-class="demo1-item" selected-item-class="demo1-item-selected"
                    class="checkerclass">
                    <checker-item :value="item" v-for="(item, index) in semesters" :key="index">{{item.name}}</checker-item>
                </checker>
                <div class="Itemstyle">
                    <!--<x-button mini type="warn" class="Itemstyle-repeat" @click.native="initParams(demo3)">重置</x-button>-->
                    <x-button mini type="primary"  class="Itemstyle-finished" @click.native="filtersemester(showSemesters)">完成</x-button>
                </div>
            </popup>
        </div>
        <div v-transfer-dom>
            <popup v-model="showTeachers.status">
                <checker v-model="selectedTeacher" default-item-class="demo1-item" selected-item-class="demo1-item-selected"
                    class="checkerclass">
                    <checker-item :value="item" v-for="(item, index) in teachers" :key="index">{{item.name}}</checker-item>
                </checker>
                <div class="Itemstyle">
                    <x-button mini type="warn" class="Itemstyle-repeat" @click.native="initParams(selectedTeacher)">重置</x-button>
                    <x-button mini type="primary"  class="Itemstyle-finished" @click.native="filtertea(showTeachers)">完成</x-button>
                </div>
            </popup>
        </div>
        <div v-transfer-dom>
            <popup v-model="showExperiments.status" >
                <checker v-model="demo2" default-item-class="demo1-item" selected-item-class="demo1-item-selected"
                class="checkerclass">
                    <checker-item :value="item" v-for="(item, index) in experiments" :key="index">{{item.name}}</checker-item>
                </checker>
                <div class="Itemstyle">
                    <x-button mini type="warn" class="Itemstyle-repeat" @click.native="initParams(demo2)">重置</x-button>
                    <x-button mini type="primary"  class="Itemstyle-finished" @click.native="filterexp(showExperiments)">完成</x-button>
                </div>
            </popup>
        </div>
        <div v-transfer-dom>
            <popup v-model="showAddresses.status" >
                <checker v-model="demo4" default-item-class="demo1-item" selected-item-class="demo1-item-selected"
                class="checkerclass">
                    <checker-item :value="item" v-for="(item, index) in addresses" :key="index">{{item.name}}</checker-item>
                </checker>
                <div class="Itemstyle">
                    <x-button mini type="warn" class="Itemstyle-repeat" @click.native="initParams(demo4)">重置</x-button>
                    <x-button mini type="primary" class="Itemstyle-finished" @click.native="filteraddress(showAddresses)">完成</x-button>
                </div>
            </popup>
        </div>
            <lesson-teacher class="lesson-content"></lesson-teacher>
    </div>

</template>
<script>
import { Datetime,TransferDom,XButton,Flexbox, FlexboxItem,Icon,
Checker, CheckerItem,Popup } from 'vux'
import { mapGetters, mapActions } from 'vuex'
import LessonTeacher from './LessonByTeacher'
import store from '../store'
export default {
      directives: {
        TransferDom
    },
    data(){
        return{
            noTeachers:this.checkicon=false,//无教师场次标志
            beginDate: '',
            endDate:'',
            address:'',
            addresses:[],
            experiment:'',
            experiments:[],
            teachers:[],
            teacher:'',
            sem:'',
            showSemesters:{
                status: false,
                text: 'semesters'
            },
            showTeachers: {
                status: false,
                text: 'teachers'
            },
            showExperiments:{
                status: false,
                text: 'experiments'
            },
            showAddresses:{
                status: false,
                text: 'addresses'
            },
            selectedTeacher:'',
            demo2:'',
            demo3:'',
            demo4:''
        } 
    },
    props: {
        checkicon: Boolean,
        type: {
            type: String,
            default: 'default'
        }
    },
    created(){
        this.initall();
    },
    components: {
        Datetime,
        XButton,
        Flexbox, 
        FlexboxItem,
        Checker, 
        CheckerItem,
        Popup,Icon,
        LessonTeacher
    },
    computed: {
        ...mapGetters(['user', 'semester', 'semesters','params','selecteddate'])
    },
    watch: {
        // semester(val) {
        //     this.sem=this.demo3=val;
        // },
        semester:{
        handler: 'initSemester',
        //声明immediate:true表示创建组件时立马执行一次。
        immediate: true  
    }
    },
    methods:{
        initall(){
            var _this=this;
            this.axios.all([
                this.initAddresses(),
                this.initExperiments(),
                this.initTeachers()
            ]).then(this.axios.spread(function (address,exp,teacher) {
                //请求现已完成
                _this.addresses=address.data;
                address.data.forEach(function(item) {
                    if(_this.params.address==item.recordId){
                        _this.address=_this.demo4=item;
                    }
                });
                _this.experiments=exp.data;
                exp.data.forEach(function(item) {
                    if(_this.params.experiment==item.recordId){
                        _this.experiment=_this.demo2=item;
                    }
                });
                _this.teachers=teacher.data;
                teacher.data.forEach(function(item) {
                    if(_this.user.recordId==item.recordId){
                        _this.teacher=_this.selectedTeacher=item;
                    }
                });
                _this.initSemester();
                _this.noTeachers = _this.params.noteacherChecked;
                _this.onChange();
            })).catch(function(err){
                console.log(err);
            });
        },
        initSemester(){
            if(!this.params.semester){
                this.sem=this.demo3=this.semester;
            } else{
                var seme=this.semesters.filter(item => this.params.semester==item.recordId);
                this.sem=this.demo3=seme[0];
            }
        },
        initAddresses(){
            return this.axios.get(`/addresses`)
        },
        initExperiments(){
            return this.axios.get(`/experiments`)
        },
        initTeachers(){
            var _this=this;
            return this.axios.get(`/users`,{
                params:{
                    role: 'teacher',
                    department: _this.user.department
                }
            });
        },
        filtersemester(param){
            var _this=this;
            this.sem=this.demo3;
            this.beginDate='';
            this.endDate='';
            this.address=this.demo4='';
            this.experiment=this.demo2='';
            this.teachers.forEach(function(item) {
                if(_this.user.recordId==item.recordId){
                    _this.teacher=_this.selectedTeacher=item;
                }
            });
            this.onChange();
            this.hide(param);
        },
        filtertea(param){
            this.teacher=this.selectedTeacher;
            this.onChange();
            this.hide(param);
        },
        filterexp(param){
            this.experiment=this.demo2;
            this.onChange();
            this.hide(param);
        },
        filteraddress(param){
            this.address=this.demo4;
            this.onChange();
            this.hide(param);
        },
        initParams(param){
            if(param==this.selectedTeacher){
                this.selectedTeacher='';
            } else if(param==this.demo2){
                this.demo2='';
            } else if (param==this.demo3){
                this.demo3='';
            } else if (param==this.demo4){
                this.demo4='';
            }
        },
        noteachers(noTeachers){
            noTeachers==true ? this.noTeachers=false : this.noTeachers=true;
            // this.$nextTick(function(){
                // if(this.noTeachers){
                //     this.teacher='';
                // }
                this.onChange();
            // });
           
        },
        
        onChange(){
            var _this=this;
            var param;
                param={
                    start: this.beginDate!=''?this.beginDate:this.endDate,
                    end: this.endDate!=''?this.endDate:this.beginDate,
                    experiment: this.experiment == '' ? '' : this.experiment.recordId,
                    address: this.address == '' ? '' : this.address.recordId,
                    noteacherChecked:this.noTeachers,
                    teacher:this.teacher == '' ? '':this.teacher.recordId
                };
                if(this.sem!=''){
                    param.semester=this.sem.recordId;
                } 
                store.commit('params',param);
                store.dispatch('getLessondate',param);
        },
        back(){
            store.dispatch('getLessondate',{start:this.selecteddate,end:this.selecteddate,teacher:this.user.recordId});
            this.$router.go(-1);
        },
        show (param) {
            if(param.text=='teachers'){
                this.showTeachers.status=true;
            } else if(param.text=='experiments'){
                this.showExperiments.status=true;
            } else if (param.text=='semesters'){
                this.showSemesters.status=true;
            } else if(param.text=='addresses'){
                this.showAddresses.status=true;
            }
        },
        hide (param) {
           if(param.text=='teachers'){
                this.showTeachers.status=false;
            } else if(param.text=='experiments'){
                this.showExperiments.status=false;
            } else if (param.text=='semesters'){
                this.showSemesters.status=false;
            } else if(param.text=='addresses'){
                this.showAddresses.status=false;
            }
        },
        clearStartValue(){
            this.beginDate='';
        },
        clearEndValue(){
            this.endDate='';
        }
    }
}
</script>
<style scoped>
.filterlesson{
    z-index:100;
    position:fixed;
    width:100%;
    top:0;
}
    .title{
        margin-left:5px;
    }
   
    .flex-demo {
        text-align: center;
        color: #666;
        border-radius: 0px;
        background-clip: padding-box;
        border-top:1px solid #09BB07;
        border-bottom:1px solid #09BB07;
        border-right:1px solid #09BB07;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        background-color: white;
    }
    #triangle-bottomright {
        width: 0;
        height: 0;
        border-bottom: 8px solid #09BB07;
        border-left: 8px solid transparent;
        float: right;
        margin-top: 17px;
    }
    .demo1-item {
        border: 1px solid #ececec;
        padding: 5px 15px;
    }
    .demo1-item-selected {
        background-color: #1AAD19;
        color: white;
         border-radius: 5px;
    }
    .checkerclass{
        background-color:#fff;
        height:200px;
        overflow: scroll;
        padding:10px;
    }
    .date-selected{
        border-bottom:1px solid #09BB07;
        color:#666;
        background-color:white;
    }
    .spans{
        text-align: center;
        font-size:12px;
    }
    .no-teachers{
        padding:5px;
        background-color:#DEDEDE;
    }
    .no-teachers > div{
         float:right;
         padding-right:5px;
    }
    .Itemstyle{
        margin:5px;
    }
    .Itemstyle-repeat{
        float:left;
        margin:5px;
        }
    .Itemstyle-finished{
        float:right;
        margin:5px;
    }
</style>
