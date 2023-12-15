<script setup>
import {ref, onMounted} from 'vue'
import ClassicEditor from 'ckeditor-custom-build'
import '@ckeditor/ckeditor5-build-classic/build/translations/zh.js'

const props = defineProps({
    content: {
        type: String,
        requird: true
    },
    config: {
        type: Object,
        default: {
            language: 'zh-cn'
        }
    }
})
const emit = defineEmits(['update:content'])
const editor = ClassicEditor
const editorContent = ref(props.content)
function blurFun() {
    emit('update:content', editorContent.value)
}
onMounted(() => {
})
</script>
<template>
    <ckeditor :editor="editor" v-model="editorContent" :config="props.config" @blur="blurFun"></ckeditor>
</template>