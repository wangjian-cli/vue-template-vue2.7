<template>
  <div class="app" :key="key">
    <router-view></router-view>
  </div>
</template>
<script setup lang="ts">
const key = ref(0);
// 安卓机型无法使用location.reload
const reload = () => {
  key.value++;
};

provide('reload', reload);
</script>
<style lang="less">
html,
body {
  margin: 0;
  color: #323232;
}
</style>
