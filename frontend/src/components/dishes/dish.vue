<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useToast } from 'primevue/usetoast'
import { ref, onMounted } from 'vue'
import type { Dish } from '@/core/interfaces/dish.interface'
import { backendService } from '@/core/config'

const dishes = ref<Dish[]>([])
const loading = ref(false)
const expandedRows = ref({})

const toast = useToast()

onMounted(async () => {
  await getDishes()
})

const getDishes = async () => {
  try {
    loading.value = true
    const response = await fetch(`${backendService.KITCHEN_API_BASE}/api/recipes`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    dishes.value = data.data
  } catch (error) {
    console.error('Error fetching dishes:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to retrieve dishes. Please try again.',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <Toast />

  <div class="card">
    <DataTable
      v-model:expandedRows="expandedRows"
      :loading="loading"
      :value="dishes"
      tableStyle="min-width: 15rem"
      dataKey="id"
    >
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h3 class="text-xl font-bold">Recetas</h3>
        </div>
      </template>
      <Column expander style="width: 5rem" />
      <Column field="id" header="ID"></Column>
      <Column field="name" header="Name"></Column>
      <template #expansion="slotProps">
        <div class="p-4">
          <h4>Ingredientes para {{ slotProps.data.name }}</h4>
          <DataTable :value="slotProps.data.recipe_ingredients">
            <Column field="ingredient_name" header="Ingrediente"></Column>
            <Column field="qty" header="Cantidad"></Column>
          </DataTable>
        </div>
      </template>
    </DataTable>
  </div>
</template>
