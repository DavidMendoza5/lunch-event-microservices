<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Paginator from 'primevue/paginator'
import Tag from 'primevue/tag'
import './order.css'
import { ref } from 'vue'
import type { IPagination } from '@/core/interfaces/pagination.interface'
import type { IGetOrder } from '@/core/interfaces/get-order.interface'

const props = defineProps<{
  pagination: IPagination
  orders: IGetOrder[]
  loading: boolean
  onPageChange: (event: any) => void
}>()
const expandedRows = ref({})

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
      stripedRows
      :value="orders"
      :loading="loading"
      tableStyle="min-width: 50rem"
      v-model:expandedRows="expandedRows"
      dataKey="id"
    >
      <Column expander style="width: 5rem" />
      <Column field="id" header="ID" style="width: 25%"></Column>
      <Column field="plates" header="No. Platillos" style="width: 25%"></Column>
      <Column field="updated_at" header="Actualización" style="width: 25%">
        <template #body="slotProps">
          {{ new Date(slotProps.data.updated_at).toLocaleString() }}
        </template>
      </Column>
      <Column field="created_at" header="Creación">
        <template #body="slotProps">
          {{ new Date(slotProps.data.created_at).toLocaleString() }}
        </template>
      </Column>
      <Column field="status" header="Estatus" style="width: 25%">
        <template #body="slotProps">
          <Tag :value="slotProps.data.status" :severity="getOrderStatus(slotProps.data.status)" />
        </template>
      </Column>
      <template #expansion="slotProps">
        <div class="p-4">
          <h4>Platillos</h4>
          <DataTable :value="slotProps.data.orders_dishes">
            <Column field="recipe_name" header="Receta"></Column>
            <Column field="updated_at" header="Actualización" style="width: 25%">
              <template #body="slotProps">
                {{ new Date(slotProps.data.updated_at).toLocaleString() }}
              </template>
            </Column>
            <Column field="created_at" header="Creación">
              <template #body="slotProps">
                {{ new Date(slotProps.data.created_at).toLocaleString() }}
              </template>
            </Column>
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
      <template #empty> No se encontraron órdenes. </template>
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
