<template>
  <div>
    <div v-for="src in list" style="text-align:center;">
      <x-img :src="src" :webp-src="`${src}?type=webp`" class="ximg-demo" error-class="ximg-error" :offset="-100" container="#vux_view_box_body"></x-img>
    </div>
  </div>
</template>

<script>
import { XImg } from 'vux'
export default {
  components: {
    XImg
  },
  methods: {
    load() {
      var _this = this;
      this.axios.get(`reports/${this.$route.params.id}`)
        .then(function (response) {
          if(response.data.startsWith('[')) {
            _this.list = response.data.replace('[', '').replace(']','').split(',')
          }
        }, function (error) {
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  },
  computed: {},
  mounted() {
    this.load();
  },
  data() {
    return {
      list: [

      ]
    }
  }
}
</script>

<style>
.ximg-demo {
  width: 100%;
  height: auto;
}

.ximg-error {
  background-color: yellow;
}

.ximg-error:after {
  content: '加载失败';
  color: red;
}
</style>