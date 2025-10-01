<script setup lang="ts">
import './loading.css'
const props = defineProps<{
  centered?: boolean;
}>();
</script>
<template>
  <div class="loader" :class="{ 'loader-centered': props.centered }">
  </div>
</template>
