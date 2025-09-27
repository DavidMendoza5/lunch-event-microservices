<script setup lang="ts">
import './app-layout.css'
import Header from '@/components/header/header.vue';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import Message from 'primevue/message';
import { ref, reactive, computed } from 'vue';
import { useToast } from "primevue/usetoast"

const toast = useToast();

const form = reactive({
  plates: null as number | null
});

const isTouched = ref(false);

const hasError = computed(() => {
  return isTouched.value && (form.plates === null || form.plates < 1 || form.plates > 10);
});

const errorMessage = computed(() => {
  if (form.plates === null) return 'Number of plates is required';
  if (form.plates < 1) return 'Number must be at least 1';
  if (form.plates > 10) return 'Number cannot exceed 10';
  return '';
});

const validatePlates = () => {
  isTouched.value = true;
  return !hasError.value;
};

const submitForm = async () => {
  validatePlates();
  
  if (hasError.value) {
    toast.add({ 
      severity: 'error', 
      summary: 'Validation Error', 
      detail: errorMessage.value, 
      life: 3000 
    });
    return;
  }

  try {
    const requestData = {
      plates: Number(form.plates)
    };

    const response = await fetch('http://localhost:3001/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    toast.add({ 
      severity: 'success', 
      summary: 'Success', 
      detail: `Order for ${form.plates} plates created successfully!`, 
      life: 3000 
    });
    
    form.plates = null;
    isTouched.value = false;
    
  } catch (error) {
    console.error('Error submitting form:', error);
    
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Failed to create order. Please try again.', 
      life: 3000 
    });
  }
}
</script>

<template>
  <div class="app-layout">
    <div class="main-container">
      <Header />
      <div class="viewer-container hide-scroll">
        <section class="p-4">
          <Toast />
          <h3 class="text-2xl font-bold mb-4">Generate order:</h3>
          
          <form @submit.prevent="submitForm" class="flex flex-column gap-3" style="max-width: 400px;">
            <div class="field">
              <label for="plates" class="block text-900 font-medium mb-2">Number of Plates</label>
              
              <InputNumber 
                v-model="form.plates"
                inputId="plates"
                mode="decimal" 
                :min="1" 
                :max="10" 
                showButtons 
                :step="1" 
                placeholder="Enter a number between 1 and 10"
                class="w-full"
                :class="{'p-invalid': hasError}"
                @blur="validatePlates"
              />
              
              <Message 
                v-if="hasError" 
                severity="error" 
                size="small"
                class="mt-1"
              >
                {{ errorMessage }}
              </Message>
            </div>
            
            <Button 
              type="submit" 
              label="Generate Order" 
              :disabled="hasError || form.plates === null"
              class="w-full"
              icon="pi pi-send"
            />
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.field {
  margin-bottom: 1.5rem;
}

:deep(.p-inputnumber) {
  width: 100%;
}

:deep(.p-inputnumber-input) {
  width: 100%;
  padding: 0.75rem;
}

:deep(.p-inputnumber-button) {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

:deep(.p-inputnumber-button:hover) {
  background-color: var(--primary-dark-color);
}

:deep(.p-message) {
  margin-top: 0.25rem;
}

.viewer-container {
  padding: 2rem;
}

section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>