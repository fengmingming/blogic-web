<script setup>
import {ref, nextTick, provide} from 'vue'
import { RouterView } from 'vue-router'

const showRouterView = ref(true)

const reload = () => {
  showRouterView.value = false
  nextTick(() => {
    showRouterView.value = true
  })
}

provide('reload', reload)
</script>

<template>
  <RouterView v-if="showRouterView"/>
</template>
