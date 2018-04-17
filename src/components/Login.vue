<template>
  <div>
    <div class="weui-cells_form">
      <x-input placeholder="用户名" class="weui-cell" v-model="user.username">
  
      </x-input>
      <x-input placeholder="密码" class="weui-cell" type="password" v-model="user.password">
  
      </x-input>
      <div class="weui-cell" :style="showorhideRem">
      <input class="checks" type="checkbox" v-model="checkedarr">记住我
      </div>
      <x-button type="primary" class="btn-login" v-on:click.native="login(user)">登录</x-button>
    </div>
  
    <div v-transfer-dom>
      <toast type="warn" v-model="showToast" :text="toastText"></toast>
    </div>
  </div>
</template>

<script>
import { XInput, Group, XButton, Toast,base64 ,dateFormat, TransferDomDirective as TransferDom } from 'vux'
import { mapGetters, mapActions } from 'vuex'
import store from '../store'
export default {
  data() {
    return {
      user: {
        username: '',
        password: ''
      },
      showToast: false,
      toastText: '',
      checkedarr:false
    }
  },
  mounted() {
    this.loadAccountInfo();
  },
  computed:{
    showorhideRem(){
      return /Android|webOS|iPhone|iPad|BlackBerry/i.test(navigator.userAgent) ? "display:block" :  "display:none";
    }
  },
  directives: {
    TransferDom
  },
  components: {
    XInput,
    XButton,
    Toast,
    Group,
    base64,
    dateFormat
  },
  methods: {
    login(user){
      store.commit('selecteddate',dateFormat(new Date(), 'YYYY-MM-DD'));
      if (user.username.trim() === '') {
          this.toastText = '用户名不能为空';
          this.showToast = true;
          return;
        }
        if(user.password.trim() === '') {
          this.toastText = '密码不能为空';
          this.showToast = true;
           return;
        }
      if(this.checkedarr){
        //设置cookie,有效期一个月
        this.setCookie('remenberMe',user.username + "&" + user.password,60*24*30);
      }else{  
          this.delCookie('remenberMe');  
          store.dispatch('resetStates');
          localStorage.clear();
      }  
      store.dispatch('login', user);

    },
    setCookie(c_name,uinfo,expiremMinutes){
      var exdate = new Date();  
      exdate.setTime(exdate.getTime() + expiremMinutes * 60 * 1000);  
      document.cookie= c_name + "=" +  base64.encode(uinfo)+((expiremMinutes==null) ? "" : ";expires="+exdate.toGMTString());  
    },
    // 读取cookie  
    getCookie(c_name){  
        if (document.cookie.length>0)  
        {  
            var c_start=document.cookie.indexOf(c_name + "=");  
            if (c_start!=-1)  
            {   
            c_start=c_start + c_name.length+1;  
            var c_end=document.cookie.indexOf(";",c_start);  
            if (c_end==-1)   
                c_end = document.cookie.length  
                return base64.decode(document.cookie.substring(c_start, c_end))  
            }  
        }  
        return ""     
    },  
    // 删除cookie  
    delCookie(c_name){  
        var exp = new Date();  
        exp.setTime(exp.getTime() - 1);  
        var cval = this.getCookie(c_name);  
        if(cval!=null){  
            document.cookie = c_name + "=" + cval + ";expires=" + exp.toGMTString();  
        }  
    }, 
  
    loadAccountInfo(){  
        let mySelf = this;  
        //zhaopeng&A15hOsu8YeGnCsjb  
        let remenberMe = this.getCookie('remenberMe');  
        console.log(remenberMe);
        //如果cookie里没有账号信息  
        if(Boolean(remenberMe) == false){  
            store.dispatch('resetStates');
            localStorage.clear();
            return false;  
        }  
        else{  
        //如果cookie里有账号信息  
            let userName = "";  
            let passWord = "";  
            let index = remenberMe.indexOf("&");  

            userName = remenberMe.substring(0,index);  
            passWord = remenberMe.substring(index+1);  

            mySelf.user.username = userName;  
            mySelf.user.password = passWord;  
            mySelf.checkedarr = true;  
        }  
    }       
  }
}
</script>

<style scoped>
.weui-cells_form {
  width: 90%;
  margin: 10rem auto 0 auto;
}

.btn-login {
  margin-top: 1rem;
} 

.checks{
   width:15px;
   height:15px;
   margin-right:5px;
}
</style>
