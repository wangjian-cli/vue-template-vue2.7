<template>
  <div>{{ msg }}</div>
</template>

<script setup lang="ts">
interface Props {
  msg?: string;
}
withDefaults(defineProps<Props>(), {
  msg: '你好'
});
</script>

<style scoped lang="less"></style>
