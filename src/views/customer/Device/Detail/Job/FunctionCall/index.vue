<template>
  <j-form-item label="调用功能">
    <j-input
      v-model:value="model.functionId"
      placeholder="请输入物模型功能ID，例如 reweb、restart、ping_config"
    />
  </j-form-item>
  <j-form-item label="调用参数(JSON)">
    <j-textarea v-model:value="model.inputs" :rows="4" placeholder='例如 {"param": "value"}' />
  </j-form-item>
</template>

<script setup lang="ts">
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
