<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Paginator from 'primevue/paginator'
import { useToast } from 'primevue'
import { onMounted, ref } from 'vue'
import './sale.css'
import { backendService } from '@/core/config'
import type { IPurchase } from '@/core/interfaces/purchase.interface'
import type { IPagination } from '@/core/interfaces/pagination.interface'
import type { IIngredientStock } from '@/core/interfaces/ingredient-stock.interface'

const purchases = ref<IPurchase[]>([])
const loading = ref(false)
const pagination = ref<IPagination>({
  currentPage: 1,
  itemsPerPage: 5,
  totalItems: 0,
  totalPages: 1,
})

const toast = useToast()

const getSales = async () => {
  try {
    loading.value = true
    const promises = []

    promises.push(
      fetch(
        `${backendService.MARKET_API_BASE_URL}/api/purchases?limit=${pagination.value.itemsPerPage}&pageNumber=${pagination.value.currentPage}`,
      ),
    )
    promises.push(fetch(`${backendService.WAREHOUSE_API_BASE_URL}/api/ingredients`))

    const resolvedPromises = await Promise.all(promises)

    for (const res of resolvedPromises) {
      if (!res.ok) {
        throw new Error('Network response was not ok')
      }
    }

    const purchasesData = await resolvedPromises[0].json()
    const ingredientsData = await resolvedPromises[1].json()
    const marketPurchases = purchasesData.data.map((purchase: IPurchase) => {
      return {
        ...purchase,
        ingredient:
          ingredientsData.data.find(
            (ingredient: IIngredientStock) => ingredient.id === purchase.ingredient_id,
          ).name || 'Unknown',
      }
    })
    purchases.value = marketPurchases
    pagination.value.totalItems = Number(purchasesData.pagination.totalItems)
    pagination.value.totalPages = Number(purchasesData.pagination.totalPages)
  } catch (error) {
    console.error('Error fetching purchases:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to retrieve purchases. Please try again.',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getSales()
})

const onPageChange = (event: any) => {
  pagination.value.currentPage = event.page + 1
  getSales()
}
</script>
<template>
  <div>
    <h2 class="text-2xl font-bold mb-4 description">Historial de compras</h2>
    <Toast />

    <div class="card">
      <DataTable
        stripedRows
        :loading="loading"
        :value="purchases"
        tableStyle="min-width: 15rem"
        dataKey="id"
      >
        <Column field="id" header="ID"></Column>
        <Column field="qty" header="Cantidad"></Column>
        <Column field="ingredient" header="Ingrediente"></Column>
        <Column field="created_at" header="Fecha">
          <template #body="slotProps">
            {{ new Date(slotProps.data.created_at).toLocaleString() }}
          </template>
        </Column>
        <template #empty> No se encontraron compras. </template>
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
  </div>
</template>
