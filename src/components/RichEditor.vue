<script setup>
import {ref, onMounted} from 'vue'
import Editor from 'ckeditor5-custom'
import 'ckeditor5-custom/build/translations/zh.js'

const props = defineProps({
    content: {
        type: String,
        requird: true
    },
    disabled: {
        type: Boolean,
        default: false
    },
    config: {
        type: Object,
        default: {
            toolbar: {
                items: [
                    'undo',
                    'redo',
                    'heading',
                    'bold',
                    'italic',
                    'link',
                    'bulletedList',
                    'numberedList',
                    'outdent',
                    'indent',
                    'imageUpload',
                    'blockQuote',
                    'insertTable',
                    'mediaEmbed',
                    'alignment',
                    'code',
                    'codeBlock',
                    '|',
                    {
                        "label":"others",
                        "items":[
                            'findAndReplace',
                            'fontBackgroundColor',
                            'fontSize',
                            'fontFamily',
                            'fontColor',
                            'highlight',
                            'horizontalLine',
                            'htmlEmbed',
                            'imageInsert',
                            'pageBreak',
                            'removeFormat',
                            'selectAll',
                            'sourceEditing',
                            'showBlocks',
                            'specialCharacters',
                            'restrictedEditingException',
                            'strikethrough',
                            'style',
                            'subscript',
                            'superscript',
                            'textPartLanguage',
                            'todoList',
                            'underline'
                        ]
                    }
                ]
            },
            language: 'zh-cn',
            image: {
                toolbar: [
                    'imageTextAlternative',
                    'toggleImageCaption',
                    'imageStyle:inline',
                    'imageStyle:block',
                    'imageStyle:side',
                    'linkImage'
                ]
            },
            table: {
                contentToolbar: [
                    'tableColumn',
                    'tableRow',
                    'mergeTableCells',
                    'tableCellProperties',
                    'tableProperties'
                ]
            }
        }
    }
})
let disableConfig = {
    toolbar: {
        items: [
        ]
    }
}
const emit = defineEmits(['update:content'])
const editor = Editor
const editorContent = ref(props.content)
const editorConfig = ref(props.disabled?disableConfig:props.config)
const disabled = ref(props.disabled)
function blurFun() {
    emit('update:content', editorContent.value)
}
onMounted(() => {
    
})
</script>
<template>
    <ckeditor :editor="editor" v-model="editorContent" :config="editorConfig" @blur="blurFun" :disabled="disabled" />
</template>