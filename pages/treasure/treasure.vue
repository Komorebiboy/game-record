<template>
  <view class="treasure-container">
    <view class="treasure-header">
      <text class="title">百宝箱</text>
      <text class="subtitle">发现更多有趣的内容</text>
    </view>
    
    <view class="treasure-grid">
      <view class="treasure-item" v-for="item in treasureItems" :key="item.id" @click="handleItemClick(item)">
        <view class="icon-wrapper" :style="{ background: item.bgColor }">
          <text class="grid-icon">{{ item.icon }}</text>
        </view>
        <text class="item-name">{{ item.name }}</text>
      </view>
    </view>
    
    <view class="section">
      <view class="section-header">
        <text class="section-title">实用工具</text>
      </view>
      <view class="tools-list">
        <view class="tool-item" v-for="tool in tools" :key="tool.id" @click="handleToolClick(tool)">
          <view class="tool-icon" :style="{ background: tool.bgColor }">
            <text class="tool-emoji">{{ tool.icon }}</text>
          </view>
          <view class="tool-info">
            <text class="tool-name">{{ tool.name }}</text>
            <text class="tool-desc">{{ tool.desc }}</text>
          </view>
          <text class="arrow-icon">→</text>
        </view>
      </view>
    </view>
    
    <custom-tabbar />
  </view>
</template>

<script>
export default {
  name: 'Treasure',
  data() {
    return {
      treasureItems: [
        { id: 1, name: '游戏攻略', icon: '📖', bgColor: '#667eea' },
        { id: 2, name: '成就系统', icon: '🏆', bgColor: '#f093fb' },
        { id: 3, name: '游戏资讯', icon: '📰', bgColor: '#4facfe' },
        { id: 4, name: '玩家社区', icon: '👥', bgColor: '#43e97b' },
        { id: 5, name: '数据统计', icon: '📊', bgColor: '#fa709a' },
        { id: 6, name: '设置', icon: '⚙️', bgColor: '#fee140' }
      ],
      tools: [
        { id: 1, name: '本地备份', icon: '☁️', desc: '备份和恢复游戏数据', bgColor: '#667eea' },
        { id: 2, name: '数据统计', icon: '📊', desc: '查看游戏时长统计', bgColor: '#43e97b' },
        { id: 3, name: '游戏搜索', icon: '🔍', desc: '快速查找游戏', bgColor: '#fa709a' },
        { id: 4, name: '关于我们', icon: 'ℹ️', desc: '了解更多', bgColor: '#4facfe' }
      ]
    };
  },
  
  methods: {
    handleItemClick(item) {
      uni.showToast({
        title: `点击了${item.name}`,
        icon: 'none'
      });
    },
    
    handleToolClick(tool) {
      if (tool.name === '本地备份') {
        uni.navigateTo({
          url: '/pages/backups/backups'
        });
      } else if (tool.name === '数据统计') {
        uni.navigateTo({
          url: '/pages/statistics/statistics'
        });
      } else if (tool.name === '游戏搜索') {
        uni.navigateTo({
          url: '/pages/search/search'
        });
      } else {
        uni.showToast({
          title: `点击了${tool.name}`,
          icon: 'none'
        });
      }
    }
  }
};
</script>

<style lang="scss">
.treasure-container {
  min-height: 100vh;
  background: #F5F7FA;
  padding-bottom: 140rpx;
}

.treasure-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60rpx 40rpx 80rpx;
  border-radius: 0 0 40rpx 40rpx;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #FFFFFF;
  display: block;
}

.subtitle {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 12rpx;
  display: block;
}

.treasure-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 0 30rpx;
  margin-top: -40rpx;
}

.treasure-item {
  width: calc(33.33% - 20rpx);
  margin: 10rpx;
  background: #FFFFFF;
  border-radius: 20rpx;
  padding: 30rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.icon-wrapper {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.grid-icon {
  font-size: 48rpx;
}

.item-name {
  font-size: 26rpx;
  color: #333333;
  margin-top: 16rpx;
}

.section {
  margin-top: 30rpx;
  padding: 0 30rpx;
}

.section-header {
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.tools-list {
  background: #FFFFFF;
  border-radius: 20rpx;
  overflow: hidden;
}

.tool-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #F0F0F0;
  
  &:last-child {
    border-bottom: none;
  }
}

.tool-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tool-emoji {
  font-size: 32rpx;
}

.tool-info {
  flex: 1;
  margin-left: 24rpx;
}

.tool-name {
  font-size: 30rpx;
  color: #333333;
  display: block;
}

.tool-desc {
  font-size: 24rpx;
  color: #999999;
  margin-top: 8rpx;
  display: block;
}

.arrow-icon {
  font-size: 24rpx;
  color: #CCCCCC;
}
</style>
