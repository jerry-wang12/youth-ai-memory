<template>
  <view class="markdown-view">
    <rich-text :nodes="parsedNodes" />
  </view>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import './index.scss'

export default defineComponent({
  name: 'MarkdownView',
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const parsedNodes = computed(() => {
      if (!props.content) return ''
      
      // 检测是否为 HTML 内容
      const trimmedContent = props.content.trim()
      const isHtml = trimmedContent.startsWith('<') || 
        /<(p|div|h[1-6]|img|br|ul|ol|li|strong|em|span|a|table)\b/i.test(trimmedContent)
      
      if (isHtml) {
        return `<div class="html-content">${props.content}</div>`
      }
      
      // 按行处理 Markdown
      const lines = props.content.split('\n')
      const htmlParts: string[] = []
      let inList = false
      
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i]
        
        if (!line.trim()) {
          if (inList) {
            htmlParts.push('</div>')
            inList = false
          }
          continue
        }
        
        // 转义 HTML
        line = line
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
        
        // 二级标题 ##
        if (line.startsWith('## ')) {
          if (inList) {
            htmlParts.push('</div>')
            inList = false
          }
          const title = line.slice(3)
          htmlParts.push(`<div class="md-h2">${title}</div>`)
          continue
        }
        
        // 三级标题 ###
        if (line.startsWith('### ')) {
          if (inList) {
            htmlParts.push('</div>')
            inList = false
          }
          const title = line.slice(4)
          htmlParts.push(`<div class="md-h3">${title}</div>`)
          continue
        }
        
        // 一级标题 #
        if (line.startsWith('# ')) {
          if (inList) {
            htmlParts.push('</div>')
            inList = false
          }
          const title = line.slice(2)
          htmlParts.push(`<div class="md-h1">${title}</div>`)
          continue
        }
        
        // 分隔线
        if (line === '---') {
          if (inList) {
            htmlParts.push('</div>')
            inList = false
          }
          htmlParts.push('<hr class="md-hr"/>')
          continue
        }
        
        // 无序列表 - xxx
        if (line.startsWith('- ')) {
          if (!inList) {
            htmlParts.push('<div class="md-list">')
            inList = true
          }
          const item = formatInline(line.slice(2))
          htmlParts.push(`<div class="md-li"><span class="md-bullet">•</span><span class="md-li-text">${item}</span></div>`)
          continue
        }
        
        // 普通段落
        if (inList) {
          htmlParts.push('</div>')
          inList = false
        }
        const text = formatInline(line)
        htmlParts.push(`<div class="md-p">${text}</div>`)
      }
      
      if (inList) {
        htmlParts.push('</div>')
      }
      
      return `<div class="md-container">${htmlParts.join('')}</div>`
    })

    // 内联格式处理
    function formatInline(text: string): string {
      return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<span class="md-link">$1</span>')
        .replace(/`([^`]+)`/g, '<code class="md-code">$1</code>')
    }

    return {
      parsedNodes
    }
  }
})
</script>

