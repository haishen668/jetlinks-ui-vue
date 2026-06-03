<template>
  <j-form-item label="执行条件">
    <j-textarea v-model:value="text" :rows="3" placeholder="可选，填写条件配置 JSON" />
  </j-form-item>
</template>

<script setup lang="ts">
const props = defineProps<{ value?: any }>()
const emit = defineEmits(['update:value'])
const text = ref('')

watch(
  () => props.value,
  (value) => {
    text.value = typeof value === 'string' ? value : value ? JSON.stringify(value) : ''
  },
  { immediate: true },
)

watch(text, () => emit('update:value', text.value))
</script>
