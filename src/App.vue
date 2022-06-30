<template>
  <div>
    <keep-alive :include="$store.state.cachePages">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
.box {
  width: 750px;
  height: 100px;
  background-color: skyblue;
}
</style>
