<script setup lang="ts">
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import { useToast } from "primevue/usetoast"
  import { ref, onMounted } from 'vue';
  import type { Dish } from '@/core/interfaces/dish.interface';
  import { kitchenService } from '@/core/config';

  const dishes = ref<Dish[]>([]);
  const loading = ref(false);
  const toast = useToast();

  onMounted(async () => {
    await getDishes()
  });

  const getDishes = async () => {
    try {
      loading.value = true;
      const response = await fetch(`${kitchenService.API_BASE}/api/recipes`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      dishes.value = data.data;
    } catch (error) {
      console.error('Error fetching dishes:', error);
      toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Failed to retrieve dishes. Please try again.', 
        life: 3000 
      });
    } finally {
      loading.value = false;
    }
  }
</script>
<template>
  <Toast />
  
  <div class="card">
    <DataTable :loading="loading" :value="dishes" tableStyle="min-width: 15rem" dataKey="id">
      <Column field="id" header="ID"></Column>
      <Column field="name" header="Name"></Column>
    </DataTable>
  </div>
</template>