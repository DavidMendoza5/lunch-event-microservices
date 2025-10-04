<script setup lang="ts">
import './home.css'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import Message from 'primevue/message'
import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { backendService } from '@/core/config'
import Dish from '@/components/dishes/dish.vue'
import OrderTable from '@/components/orders-table/order.vue'
import type { IGetOrder } from '@/core/interfaces/get-order.interface'
import type { IPagination } from '@/core/interfaces/pagination.interface'

const toast = useToast()

const form = reactive({
  plates: null as number | null,
})

const isTouched = ref(false)
const loading = ref(false)
const hasError = ref(false)
const errorMessage = ref('')
const loadingOrders = ref(false)
const orders = ref<IGetOrder[]>([])
const pagination = ref<IPagination>({
  currentPage: 1,
  itemsPerPage: 5,
  totalItems: 0,
  totalPages: 1,
})

const validatePlates = () => {
  isTouched.value = true
  return !hasError.value
}

const handleInput = (event: any) => {
  const value = event.value

  if (value === null || value === undefined) {
    hasError.value = true
    errorMessage.value = 'Este campo es requerido'
  } else if (value < 1 || value > 10) {
    hasError.value = true
    errorMessage.value = 'El valor debe estar entre 1 y 10'
  } else {
    hasError.value = false
    errorMessage.value = ''
  }
}

const submitForm = async () => {
  loading.value = true

  if (hasError.value) {
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: errorMessage.value,
      life: 3000,
    })
    return
  }

  try {
    const requestData = {
      plates: Number(form.plates),
    }

    const response = await fetch(`${backendService.KITCHEN_API_BASE}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    await response.json()

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `Order for ${form.plates} plates created successfully!`,
      life: 3000,
    })

    form.plates = null
    isTouched.value = false
  } catch (error) {
    console.error('Error submitting form:', error)

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to create order. Please try again.',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getOrders()
})

const getOrders = async () => {
  loadingOrders.value = true
  try {
    const response = await fetch(
      `${backendService.KITCHEN_API_BASE}/api/orders?limit=${pagination.value.itemsPerPage}&pageNumber=${pagination.value.currentPage}&status=pending`,
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
    loadingOrders.value = false
  }
}

const onPageChange = (event: any) => {
  pagination.value.currentPage = event.page + 1
  getOrders()
}
</script>

<template>
  <Toast />
  <div class="main-home-container">
    <h2 class="text-2xl font-bold mb-4">Generación de órdenes</h2>

    <section class="section-container">
      <form @submit.prevent="submitForm">
        <div class="field">
          <label for="plates" class="block text-900 font-medium">Número de platos:</label>
          <div class="flex flex-col gap-1">
            <InputNumber
              v-model="form.plates"
              inputId="plates"
              mode="decimal"
              placeholder="Ingresa un valor entre 1 y 10"
              @blur="validatePlates"
              @input="handleInput"
            />
            <Message v-if="hasError" severity="error" size="small" class="mt-1">
              {{ errorMessage }}
            </Message>
          </div>
        </div>

        <Button
          type="submit"
          label="Generate Order"
          :disabled="hasError || form.plates === null"
          class="w-full sumit-order-btn"
          icon="pi pi-send"
          :loading="loading"
        />
      </form>

      <Dish />

      <div class="card card-component">
        <h4>Órdenes pendientes</h4>
        <OrderTable
          :orders="orders"
          :loading="loadingOrders"
          :pagination="pagination"
          v-on:page-change="onPageChange"
        />
      </div>
    </section>
  </div>
</template>
