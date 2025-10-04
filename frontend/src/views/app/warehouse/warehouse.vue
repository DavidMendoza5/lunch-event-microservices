<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useToast } from 'primevue'
import { onMounted, ref } from 'vue'
import './warehouse.css'
import { backendService } from '@/core/config'
import type { IIngredientStock } from '@/core/interfaces/ingredient-stock.interface'

const ingredients = ref<IIngredientStock[]>([])
const loading = ref(false)

const toast = useToast()

const getIngredients = async () => {
  try {
    loading.value = true
    const response = await fetch(`${backendService.WAREHOUSE_API_BASE_URL}/api/ingredients`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    ingredients.value = data.data
  } catch (error) {
    console.error('Error fetching ingredients:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to retrieve ingredients. Please try again.',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getIngredients()
})
</script>
<template>
  <div>
    <h2 class="text-2xl font-bold mb-4 description">Inventario de ingredientes</h2>
    <Toast />

    <div class="card">
      <DataTable :loading="loading" :value="ingredients" tableStyle="min-width: 15rem" dataKey="id">
        <Column field="id" header="ID"></Column>
        <Column field="name" header="Name"></Column>
        <Column field="stock" header="Stock"></Column>
      </DataTable>
    </div>
  </div>
</template>
