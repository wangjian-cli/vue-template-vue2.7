<template>
  <div>
    <HelloWorld />
    <atom-button @click="reload">刷新</atom-button>
  </div>
</template>

<script setup lang="ts">
const reload = inject('reload');
</script>

<style scoped lang="less"></style>
