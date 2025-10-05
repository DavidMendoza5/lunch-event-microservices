<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import './menu.css'

const router = useRouter()
const route = useRoute()

const isCollapsed = ref(false)

let mediaQuery: MediaQueryList | null = null

onMounted(() => {
  mediaQuery = window.matchMedia('(max-width: 768px)')
  isCollapsed.value = mediaQuery.matches
})

const collapseIcon = computed(() =>
  isCollapsed.value ? '/icons/right-arrow.svg' : '/icons/left-arrow.svg',
)
const menuItems = [
  { name: 'home', label: 'Home', route: '/home', icon: 'home.svg' },
  { name: 'orders', label: 'Órdenes', route: '/orders', icon: 'orders.svg' },
  { name: 'inventory', label: 'Inventario', route: '/inventory', icon: 'inventory.svg' },
  { name: 'Sales', label: 'Compras', route: '/sales', icon: 'market.svg' },
]

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const navigateTo = (route: string) => {
  router.push(route)
}

const isActive = (router: string) => {
  const regex = new RegExp(`^${router}(/|$)`)
  return regex.test(route.path)
}
</script>

<template>
  <aside :class="['sidebar hide-scroll', { 'is-collapsed': isCollapsed }]">
    <button class="toggle-btn" @click="toggleSidebar">
      <img :src="collapseIcon" alt="Collapse icon" />
    </button>
    <ul class="menu-list">
      <li
        v-for="item in menuItems"
        :key="item.name"
        :class="{ active: isActive(item.route), 'li-centered': isCollapsed }"
        @click="navigateTo(item.route)"
      >
        <img :src="`/icons/${item.icon}`" :alt="item.label" />
        <span v-if="!isCollapsed">{{ item.label }}</span>
      </li>
    </ul>
  </aside>
</template>
