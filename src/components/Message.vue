<template>
    <group gutter="0">
    <cell v-for="message in Messages" 
    :title="message.title"
    :key="message.recordId" 
     link=""
     :inline-desc="message.recordId ? message.content.replace(/<[^>]+>/g,''):'无通知'" 
    >
     </cell>
    </group>
</template>

<script>
import { Cell, Group } from 'vux'
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
    }
  },
  computed:{
    ...mapGetters(['messages']),
    Messages:function(){
      return this.messages.length>0?this.messages:'无';
    }
  },
  components: {
    Group,
    Cell
  }
}
</script>

<style>

</style>
