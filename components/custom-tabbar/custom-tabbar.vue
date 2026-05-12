<template>
  <view class="custom-tabbar" v-if="isTabPage">
    <view 
      v-for="(item, index) in tabList" 
      :key="index"
      class="tab-item"
      :class="{ active: currentIndex === index }"
      @click="switchTab(item, index)"
    >
      <text class="tab-icon" :style="{ color: currentIndex === index ? selectedColor : color, fontSize: '24px' }">
        {{ item.icon }}
      </text>
      <text class="tab-text" :style="{ color: currentIndex === index ? selectedColor : color }">
        {{ item.text }}
      </text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CustomTabbar',
  data() {
    return {
      color: '#999999',
      selectedColor: '#667eea',
      currentIndex: 0,
      tabList: [
        {
          pagePath: '/pages/index/index',
          text: '首页',
          icon: '🏠'
        },
        {
          pagePath: '/pages/games/games',
          text: '游戏',
          icon: '🎬'
        },
        {
          pagePath: '/pages/categories/categories',
          text: '分类',
          icon: '📋'
        },
        {
          pagePath: '/pages/favorites/favorites',
          text: '收藏',
          icon: '⭐'
        },
        {
          pagePath: '/pages/treasure/treasure',
          text: '百宝箱',
          icon: '🎁'
        }
      ]
    };
  },
  
  computed: {
    isTabPage() {
      const pages = ['/pages/index/index', '/pages/games/games', '/pages/categories/categories', '/pages/favorites/favorites', '/pages/treasure/treasure'];
      const currentPage = this.getCurrentPage();
      return pages.includes(currentPage);
    }
  },
  
  watch: {
    $route: {
      immediate: true,
      handler() {
        this.updateCurrentIndex();
      }
    }
  },
  
  mounted() {
    this.updateCurrentIndex();
  },
  
  methods: {
    getCurrentPage() {
      const pages = getCurrentPages();
      if (pages.length > 0) {
        const currentPage = pages[pages.length - 1];
        return '/' + currentPage.route;
      }
      return '';
    },
    
    updateCurrentIndex() {
      const currentPage = this.getCurrentPage();
      const index = this.tabList.findIndex(item => item.pagePath === currentPage);
      if (index !== -1) {
        this.currentIndex = index;
      }
    },
    
    switchTab(item, index) {
      if (this.currentIndex === index) return;
      
      uni.switchTab({
        url: item.pagePath
      });
    }
  }
};
</script>

<style lang="scss">
.custom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background: #FFFFFF;
  border-top: 1rpx solid #E5E5E5;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 999;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 40rpx;
}

.tab-icon {
  line-height: 1;
}

.tab-text {
  font-size: 22rpx;
  margin-top: 6rpx;
}
</style>
