<template>
  <div id="app">
    <Transfer
      :leftList="leftList"
      :rightList="rightList"
      leftHeader="可选区"
      rightHeader="已选区"
      :level="2"
      checkedName="isSelected"
      @syncList="handleSyncListData"
    />
  </div>
</template>

<script>
import { leftList, rightList } from 'src/data';

export default {
  name: 'app',
  data () {
    return {
      leftList,
      rightList
    }
  },
  methods: {
    handleSyncListData({ leftList, rightList }) {
      this.leftList = Object.assign(this.leftList, leftList)
      this.rightList = Object.assign(this.rightList, rightList)
    },
  }
}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
