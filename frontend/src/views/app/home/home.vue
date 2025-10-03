<script setup lang="ts">
import './home.css'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import Message from 'primevue/message'
import { ref, reactive } from 'vue'
import { useToast } from 'primevue/usetoast'
import { kitchenService } from '@/core/config'
import Dish from '@/components/dishes/dish.vue'

const toast = useToast()

const form = reactive({
  plates: null as number | null,
})

const isTouched = ref(false)
const loading = ref(false)
const hasError = ref(false)
const errorMessage = ref('')

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

    const response = await fetch(`${kitchenService.API_BASE}/api/orders`, {
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
    </section>
  </div>
</template>
