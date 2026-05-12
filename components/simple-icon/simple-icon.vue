<template>
  <text :style="iconStyle">{{ iconText }}</text>
</template>

<script>
const iconMap = {
  'home': '🏠', 'home-filled': '🏠',
  'videocam': '🎬', 'videocam-filled': '🎬',
  'list': '📋', 'list-filled': '📋',
  'star': '☆', 'star-filled': '★',
  'gift': '🎁', 'gift-filled': '🎁',
  'download': '⬇️', 'right': '➡️',
  'paperclip': '📎', 'upload': '⬆️',
  'folder-add': '📁', 'redo': '🔄',
  'color': '🎨', 'trash': '🗑️',
  'plus': '➕', 'calendar': '📅',
  'refresh': '🔁', 'chat': '💬',
  'compose': '✏️', 'book-open': '📖',
  'trophy': '🏆', 'news': '📰',
  'users': '👥', 'bar-chart': '📊',
  'settings': '⚙️', 'cloud-download': '☁️',
  'search': '🔍', 'info': 'ℹ️',
  'arrowright': '→'
};

export default {
  name: 'SimpleIcon',
  props: {
    type: {
      type: String,
      default: 'home'
    },
    size: {
      type: [Number, String],
      default: 24
    },
    color: {
      type: String,
      default: '#333333'
    }
  },
  data() {
    return {};
  },
  computed: {
    iconStyle() {
      const s = typeof this.size === 'number' ? this.size : parseInt(this.size) || 24;
      return {
        fontSize: s + 'px',
        color: this.color,
        display: 'inline-block',
        lineHeight: '1'
      };
    },
    iconText() {
      return iconMap[this.type] || '❓';
    }
  }
};
</script>
