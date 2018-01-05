<template>
  <div>
    <ul>
      <li v-for="item in navData" @click="gotoUrl.bind(this, item)()">
        {{item.name}}
      </li>
    </ul>
  </div>
</template>

<script>
  export default{
    data(){
      return {
        navData: [
          {
            name: 'page1',
            url: ''
          },
          {
            name: 'page2',
            url: ''
          }
        ]
      }
    },
    methods: {
      gotoUrl(item) {
        this.$router.push({ name: 'test', params: { userId: 123 }});//等同于 router-link ,在目标页面通过this.$route.params 获取参数
      }
    }
  }
</script>

<style scope>
li{
  text-align:center;
  padding: 5px 10px;
}
</style>
