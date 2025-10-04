<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Paginator from 'primevue/paginator'
import Tag from 'primevue/tag'
import './order.css'
import { kitchenService } from '@/core/config'
import { onMounted, ref } from 'vue'
import type { IGetOrder } from '@/core/interfaces/get-order.interface'

const toast = useToast()
const loading = ref(false)
const orders = ref<IGetOrder[]>([])
const pagination = ref({
  currentPage: 1,
  itemsPerPage: 5,
  totalItems: 0,
  totalPages: 1,
})
const expandedRows = ref({})

onMounted(async () => {
  await getOrders()
})

const getOrders = async () => {
  loading.value = true
  try {
    const response = await fetch(
      `${kitchenService.API_BASE}/api/orders?limit=${pagination.value.itemsPerPage}&pageNumber=${pagination.value.currentPage}`,
    )
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    orders.value = data.data
    pagination.value.totalItems = Number(data.pagination.totalItems)
    pagination.value.totalPages = Number(data.pagination.totalPages)
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

const getOrderStatus = (status: string) => {
  if (status === 'done') {
    return 'success'
  }
  if (status === 'pending') {
    return 'warn'
  }
  if (status === 'preparing') {
    return 'info'
  }
  return 'contrast'
}
</script>

<template>
  <div class="card">
    <DataTable
      :value="orders"
      :loading="loading"
      tableStyle="min-width: 50rem"
      v-model:expandedRows="expandedRows"
      dataKey="id"
    >
      <Column expander style="width: 5rem" />
      <Column field="id" header="ID" style="width: 25%"></Column>
      <Column field="plates" header="No. Platillos" style="width: 25%"></Column>
      <Column field="status" header="Estado" style="width: 25%">
        <template #body="slotProps">
          <Tag :value="slotProps.data.status" :severity="getOrderStatus(slotProps.data.status)" />
        </template>
      </Column>
      <template #expansion="slotProps">
        <div class="p-4">
          <h4>Platillos</h4>
          <DataTable :value="slotProps.data.orders_dishes">
            <Column field="recipe_name" header="Receta"></Column>
            <Column field="status" header="Estatus">
              <template #body="slotProps">
                <Tag
                  :value="slotProps.data.status.toLowerCase()"
                  :severity="getOrderStatus(slotProps.data.status)"
                />
              </template>
            </Column>
          </DataTable>
        </div>
      </template>

      <template #empty>
        <tr class="center">
          <td colspan="11">No data available</td>
        </tr>
      </template>
    </DataTable>

    <div class="pagination-footer">
      <Paginator
        :first="(pagination.currentPage - 1) * pagination.itemsPerPage"
        :rows="pagination.itemsPerPage"
        :totalRecords="pagination.totalItems"
        @page="onPageChange"
      ></Paginator>
      <div class="pagination-info">
        {{ pagination.itemsPerPage }} de {{ pagination.totalItems }}
      </div>
    </div>
  </div>
</template>
