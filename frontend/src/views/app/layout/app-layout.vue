<script setup lang="ts">
import './app-layout.css'
import Header from '@/components/header/header.vue'
import Menu from '@/components/menu/menu.vue'
</script>

<template>
  <div class="app-layout">
    <div class="menu-container">
      <Menu />
    </div>
    <div class="main-container">
      <Header />
      <div class="viewer-container hide-scroll">
        <RouterView />
      </div>
    </div>
  </div>
</template>
