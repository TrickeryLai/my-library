<template>
  <div>
    <ul>
      <li v-for="item in sliderData">{{item.name}}
        <ul v-if="item.children && item.children.length > 0">
          <li></li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>

  export default {
    data(){
      return {
        sliderData:[
          {
            name: 'slider1',
            url: "",
            children: [

            ]
          },
          {
            name: 'slider2',
            url: ""
          },
          {
            name: 'slider3',
            url: ""
          },
        ]
      }
    }
  }
</script>

<style scoped>
  ul>li {
    display:block;
    padding: 8px 0;
    border:1px solid #f5f5f5;
    text-align:center;
    cursor:pointer;
  }
</style>
