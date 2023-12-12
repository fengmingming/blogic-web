<script setup>
import {ref} from 'vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn.js'

const props = defineProps({
    content: {
        type:String,
        default: ''
    },
    config: {
        type: Object,
        default: {
            language: 'zh-cn'
        }
    }
})
const emit = defineEmits(['blur'])
const editor = ClassicEditor
const editorContent = ref(props.content)
function blurFun() {
    emit('blur', editorContent.value)
}
</script>
<template>
    <ckeditor :editor="editor" v-model="editorContent" :config="props.config" @blur="blurFun"></ckeditor>
</template>
<style scoped>
</style>