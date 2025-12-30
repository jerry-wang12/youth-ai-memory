<template>
  <view class="dynamic-form-wrapper">
    <view class="dynamic-form">
      <view v-for="(field, index) in config" :key="field.key || index" class="form-item">
        <!-- TEXT 和 SELECT 类型 -->
        <view v-if="field.type !== 'BOOLEAN'" class="form-row-inline">
          <view class="form-label-inline">
            <text class="label-text">{{ field.label }}</text>
            <text v-if="field.required" class="required">*</text>
          </view>
          
          <!-- TEXT类型 -->
          <input
            v-if="field.type === 'TEXT'"
            v-model="formData[field.key]"
            :placeholder="field.placeholder || localeStore.t('请输入', 'Please enter')"
            class="form-input-inline"
            :class="{ 'has-error': errors[field.key] }"
          />
          
          <!-- SELECT类型 -->
          <picker
            v-else-if="field.type === 'SELECT'"
            :range="field.options || []"
            :value="getPickerIndex(field.key, field.options)"
            @change="handleSelectChange(field.key, field.options, $event)"
            class="picker-inline"
          >
            <view class="picker-view-inline" :class="{ 'has-error': errors[field.key], 'placeholder': !formData[field.key] }">
              <text>{{ formData[field.key] || localeStore.t('请选择', 'Please select') }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>
        
        <!-- BOOLEAN类型 -->
        <view v-else-if="field.type === 'BOOLEAN'" class="form-row-inline">
          <view class="form-label-inline">
            <text class="label-text">{{ field.label }}</text>
            <text v-if="field.required" class="required">*</text>
          </view>
          <switch
            :checked="formData[field.key] || false"
            @change="handleSwitchChange(field.key, $event)"
            class="form-switch"
            color="#007AFF"
          />
        </view>
        
        <!-- 错误提示 -->
        <view v-if="errors[field.key]" class="error-text">
          <text class="error-icon">⚠</text>
          <text>{{ errors[field.key] }}</text>
        </view>
      </view>
      
      <!-- 空状态提示 -->
      <view v-if="!config || config.length === 0" class="empty-form">
        <text>{{ localeStore.t('暂无需要填写的信息', 'No additional information required') }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import type { FormField } from './types'
import { useLocaleStore } from '@/stores/locale'

interface Props {
  config: FormField[]
  loading?: boolean
  initialData?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  initialData: undefined
})

const emit = defineEmits<{
  submit: [extraData: Record<string, any>]
}>()

const localeStore = useLocaleStore()
const formData = reactive<Record<string, any>>({})
const errors = reactive<Record<string, string>>({})

// 初始化表单数据
const initFormData = () => {
  Object.keys(formData).forEach(key => delete formData[key])
  
  if (props.initialData) {
    Object.keys(props.initialData).forEach(key => {
      formData[key] = props.initialData[key]
    })
  }
}

watch(() => props.initialData, () => {
  initFormData()
}, { immediate: true, deep: true })

watch(() => props.config, () => {
  initFormData()
}, { immediate: true })

// 验证表单
const validate = (): boolean => {
  Object.keys(errors).forEach(key => delete errors[key])
  
  let isValid = true
  
  props.config.forEach(field => {
    const value = formData[field.key]
    
    if (field.required) {
      if (value === undefined || value === null || value === '') {
        errors[field.key] = localeStore.t(`${field.label}为必填项`, `${field.label} is required`)
        isValid = false
      }
    }
  })
  
  return isValid
}

const canSubmit = computed(() => {
  if (props.loading) return false
  
  return props.config
    .filter(f => f.required)
    .every(f => {
      const value = formData[f.key]
      return value !== undefined && value !== null && value !== ''
    })
})

const getPickerIndex = (key: string, options?: string[]): number => {
  if (!options) return 0
  const value = formData[key]
  const index = options.indexOf(value)
  return index >= 0 ? index : 0
}

const handleSelectChange = (key: string, options: string[] | undefined, event: any) => {
  if (!options) return
  const index = event.detail.value
  formData[key] = options[index]
  if (errors[key]) {
    delete errors[key]
  }
}

const handleSwitchChange = (key: string, event: any) => {
  formData[key] = event.detail.value
}

const handleSubmit = () => {
  if (!validate()) {
    return
  }
  
  emit('submit', { ...formData })
}

const resetForm = () => {
  Object.keys(formData).forEach(key => delete formData[key])
  Object.keys(errors).forEach(key => delete errors[key])
}

defineExpose({ handleSubmit, validate, resetForm, canSubmit })
</script>

<style lang="scss">
@import './index.scss';
</style>

