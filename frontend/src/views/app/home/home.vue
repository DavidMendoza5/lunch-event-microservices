<script setup lang="ts">
import './home.css'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import Message from 'primevue/message'
import { ref, reactive, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { kitchenService } from '@/core/config'
import Dish from '@/components/dishes/dish.vue'

const toast = useToast()

const form = reactive({
  plates: null as number | null,
})

const isTouched = ref(false)
const loading = ref(false)

const hasError = computed(() => {
  return isTouched.value && (form.plates === null || form.plates < 1 || form.plates > 10)
})

const errorMessage = computed(() => {
  if (form.plates === null) return 'Number of plates is required'
  if (form.plates < 1) return 'Number must be at least 1'
  if (form.plates > 10) return 'Number cannot exceed 10'
  return ''
})

const validatePlates = () => {
  isTouched.value = true
  return !hasError.value
}

const submitForm = async () => {
  loading.value = true
  validatePlates()

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

          <InputNumber
            v-model="form.plates"
            inputId="plates"
            mode="decimal"
            :min="1"
            :max="10"
            showButtons
            :step="1"
            placeholder="Ingresa un valor entre 1 y 10"
            :class="{ 'p-invalid': hasError }"
            @blur="validatePlates"
          />

          <Message v-if="hasError" severity="error" size="small" class="mt-1">
            {{ errorMessage }}
          </Message>
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
