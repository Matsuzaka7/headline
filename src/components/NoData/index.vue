<template>
  <div class="error-wrap">
    <van-image
      class="img"
      src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.soutu123.cn%2Felement_origin_min_pic%2F17%2F02%2F28%2F8e959816807d2a8b3796c76270ace890.jpg%21%2Ffw%2F700%2Fquality%2F90%2Funsharp%2Ftrue%2Fcompress%2Ftrue&refer=http%3A%2F%2Fpic.soutu123.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1659079604&t=2842b0d4ce5043d9e3c96c369d0eb77f"
      fit="contain"
    />
  </div>
</template>

<script>
export default {
  name: 'NoData'
}
</script>

<style lang="less" scoped>
.error-wrap {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  .img {
    width: 600px;
    height: 600px;
  }
}
</style>
