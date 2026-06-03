<template>
  <j-form-item label="执行周期">
    <j-input v-model:value="model.cron" placeholder="请输入 cron 表达式" />
  </j-form-item>
  <WhenOption v-model:value="model.when" />
</template>

<script setup lang="ts">
import WhenOption from './WhenOption.vue'

const props = defineProps<{ value?: Record<string, any> }>()
const emit = defineEmits(['update:value'])
const model = reactive<Record<string, any>>({})

watch(
  () => props.value,
  (value) => Object.assign(model, value || {}),
  { immediate: true },
)

watch(model, () => emit('update:value', { ...model }), { deep: true })
</script>
