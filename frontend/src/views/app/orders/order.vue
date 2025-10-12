<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import './order.css'
import { backendService } from '@/core/config'
import { onMounted, ref } from 'vue'
import type { IGetOrder } from '@/core/interfaces/get-order.interface'
import type { IPagination } from '@/core/interfaces/pagination.interface'
import OrderTable from '@/components/orders-table/order.vue'

const toast = useToast()
const loading = ref(false)
const orders = ref<IGetOrder[]>([])
const pagination = ref<IPagination>({
  currentPage: 1,
  itemsPerPage: 5,
  totalItems: 0,
  totalPages: 1,
  startItem: 0,
  endItem: 0,
})

onMounted(async () => {
  await getOrders()
})

const getOrders = async () => {
  loading.value = true
  try {
    const response = await fetch(
      `${backendService.KITCHEN_API_BASE}/api/orders?limit=${pagination.value.itemsPerPage}&pageNumber=${pagination.value.currentPage}`,
    )
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    orders.value = data.data
    pagination.value.totalItems = Number(data.pagination.totalItems)
    pagination.value.totalPages = Number(data.pagination.totalPages)
    pagination.value.startItem = Number(data.pagination.startItem)
    pagination.value.endItem = Number(data.pagination.endItem)
  } catch (error) {
    console.error('Error fetching orders:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to retrieve orders. Please try again.',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

const onPageChange = (event: any) => {
  pagination.value.currentPage = event.page + 1
  getOrders()
}
</script>

<template>
  <h2 class="text-2xl font-bold mb-4 description">Historial de Órdenes</h2>
  <OrderTable
    :orders="orders"
    :loading="loading"
    :pagination="pagination"
    v-on:page-change="onPageChange"
  />
</template>
