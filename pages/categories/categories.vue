<template>
  <view class="container">
    <!-- 头部 -->
    <view class="header">
      <text class="header-title">分类浏览</text>
      <text class="header-subtitle">按平台、类型筛选游戏</text>
    </view>

    <!-- 按平台分类 -->
    <view class="category-section">
      <view class="section-header">
        <text class="section-title">游戏平台</text>
      </view>
      <view class="platform-grid">
        <view 
          v-for="platform in Platforms" 
          :key="platform.id"
          class="platform-card"
          :style="`background: ${platform.color}15; border-color: ${platform.color}30;`"
          @click="navigateToGames('platform', platform.id)"
        >
          <text class="platform-icon" :style="`color: ${platform.color};`">{{ platform.icon }}</text>
          <text class="platform-name">{{ platform.name }}</text>
          <text class="platform-count">{{ getPlatformCount(platform.id) }} 款</text>
        </view>
      </view>
    </view>

    <!-- 按状态分类 -->
    <view class="category-section">
      <view class="section-header">
        <text class="section-title">游戏状态</text>
      </view>
      <view class="status-list">
        <view 
          v-for="(config, status) in StatusConfig" 
          :key="status"
          class="status-card"
          :style="`background: ${config.bgColor};`"
          @click="navigateToGames('status', status)"
        >
          <view class="status-info">
            <text class="status-name" :style="`color: ${config.color};`">{{ config.label }}</text>
            <text class="status-count">{{ getStatusCount(status) }} 款游戏</text>
          </view>
          <text class="status-arrow">></text>
        </view>
      </view>
    </view>

    <!-- 按类型分类 -->
    <view class="category-section">
      <view class="section-header">
        <text class="section-title">游戏类型</text>
      </view>
      <view class="genre-grid">
        <view 
          v-for="genre in Genres" 
          :key="genre"
          class="genre-card"
          @click="navigateToGames('genre', genre)"
        >
          <text class="genre-name">{{ genre }}</text>
          <text class="genre-count">{{ getGenreCount(genre) }} 款</text>
        </view>
      </view>
    </view>

    <!-- 统计概览 -->
    <view class="stats-section">
      <view class="section-header">
        <text class="section-title">数据概览</text>
      </view>
      <view class="stats-grid">
        <view class="stat-card">
          <text class="stat-number">{{ stats.total }}</text>
          <text class="stat-label">游戏总数</text>
        </view>
        <view class="stat-card">
          <text class="stat-number">{{ stats.completed }}</text>
          <text class="stat-label">已通关</text>
        </view>
        <view class="stat-card">
          <text class="stat-number">{{ stats.totalPlayTime }}h</text>
          <text class="stat-label">总时长</text>
        </view>
        <view class="stat-card">
          <text class="stat-number">{{ averageRating }}</text>
          <text class="stat-label">平均评分</text>
        </view>
      </view>
    </view>
    
    <!-- 自定义 TabBar -->
    <custom-tabbar />
  </view>
</template>

<script>
import { getGames, getStatistics, StatusConfig, Platforms, Genres } from '@/utils/gameData.js';

export default {
  data() {
    return {
      games: [],
      stats: {
        total: 0,
        wantToPlay: 0,
        playing: 0,
        completed: 0,
        dropped: 0,
        favorites: 0,
        totalPlayTime: 0
      },
      StatusConfig,
      Platforms,
      Genres
    };
  },
  
  computed: {
    averageRating() {
      const ratedGames = this.games.filter(g => g.myRating > 0);
      if (ratedGames.length === 0) return '0.0';
      const total = ratedGames.reduce((sum, g) => sum + g.myRating, 0);
      return (total / ratedGames.length).toFixed(1);
    }
  },
  
  onShow() {
    this.loadData();
  },
  
  methods: {
    loadData() {
      this.games = getGames();
      this.stats = getStatistics();
    },
    
    getPlatformCount(platformId) {
      return this.games.filter(g => g.platforms.includes(platformId)).length;
    },
    
    getStatusCount(status) {
      return this.games.filter(g => g.myStatus === status).length;
    },
    
    getGenreCount(genre) {
      return this.games.filter(g => g.genres.includes(genre)).length;
    },
    
    navigateToGames(type, value) {
      if (type === 'status') {
        uni.navigateTo({
          url: `/pages/games/games?status=${value}`
        });
      } else if (type === 'platform') {
        uni.navigateTo({
          url: `/pages/games/games?platform=${value}`
        });
      } else if (type === 'genre') {
        // 类型筛选通过搜索实现
        uni.navigateTo({
          url: `/pages/games/games?genre=${encodeURIComponent(value)}`
        });
      }
    }
  }
};
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background: #F5F7FA;
  padding-bottom: 140rpx;
}

/* 头部 */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60rpx 40rpx;
}

.header-title {
  display: block;
  font-size: 44rpx;
  font-weight: bold;
  color: #FFFFFF;
  margin-bottom: 12rpx;
}

.header-subtitle {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

/* 分类区域 */
.category-section {
  margin: 30rpx;
  padding: 30rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.section-header {
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

/* 平台网格 */
.platform-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.platform-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx 20rpx;
  border-radius: 16rpx;
  border: 2rpx solid transparent;
}

.platform-icon {
  font-size: 48rpx;
  margin-bottom: 12rpx;
}

.platform-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 8rpx;
}

.platform-count {
  font-size: 22rpx;
  color: #999;
}

/* 状态列表 */
.status-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.status-card {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border-radius: 16rpx;
}

.status-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.status-name {
  font-size: 30rpx;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.status-count {
  font-size: 24rpx;
  color: #666;
}

.status-arrow {
  font-size: 32rpx;
  color: #CCC;
}

/* 类型网格 */
.genre-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.genre-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 16rpx;
  background: #F8F9FA;
  border-radius: 12rpx;
}

.genre-name {
  font-size: 26rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 8rpx;
}

.genre-count {
  font-size: 22rpx;
  color: #999;
}

/* 统计区域 */
.stats-section {
  margin: 30rpx;
  padding: 30rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
}

.stat-number {
  font-size: 40rpx;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 22rpx;
  color: #999;
}
</style>
