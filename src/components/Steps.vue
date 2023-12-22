<template>

</template>
<script setup>
import {ref} from 'vue'

const props = defineProps({
    modelValue: {
        type: Object,
        default: null
    }
})
const emits = defineEmits(['update:modelValue'])
const steps = ref(props.modelValue?props.modelValue:[])

</script>