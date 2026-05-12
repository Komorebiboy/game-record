<template>
  <view class="container">
    <!-- 头部统计卡片 -->
    <view class="header-section">
      <view class="header-bg"></view>
      <view class="header-content">
        <text class="welcome-text">游戏时光</text>
        <text class="sub-text">记录每一份游戏感动</text>
      </view>
    </view>

    <!-- 统计卡片 -->
    <view class="stats-section">
      <view class="stats-grid">
        <view class="stat-card total" @click="navigateToGames">
          <text class="stat-number">{{ stats.total }}</text>
          <text class="stat-label">游戏总数</text>
        </view>
        <view class="stat-card playing" @click="navigateToGames('playing')">
          <text class="stat-number">{{ stats.playing }}</text>
          <text class="stat-label">正在玩</text>
        </view>
        <view class="stat-card completed" @click="navigateToGames('completed')">
          <text class="stat-number">{{ stats.completed }}</text>
          <text class="stat-label">已通关</text>
        </view>
        <view class="stat-card hours">
          <text class="stat-number">{{ stats.totalPlayTime }}h</text>
          <text class="stat-label">游戏时长</text>
        </view>
      </view>
    </view>

    <!-- 快速操作 -->
    <view class="quick-actions">
      <view class="action-btn add" @click="navigateToAddGame">
        <text class="action-icon">+</text>
        <text class="action-text">添加游戏</text>
      </view>
      <view class="action-btn favorite" @click="navigateToFavorites">
        <text class="action-icon">★</text>
        <text class="action-text">我的收藏</text>
      </view>
      <view class="action-btn search" @click="navigateToSearch">
        <text class="action-icon">🔍</text>
        <text class="action-text">搜索游戏</text>
      </view>
    </view>

    <!-- 状态分布 -->
    <view class="status-section">
      <view class="section-header">
        <text class="section-title">游戏状态</text>
      </view>
      <view class="status-list">
        <view class="status-item" @click="navigateToGames('want_to_play')">
          <view class="status-icon" style="background: #F3E5F5;">
            <text style="color: #9B59B6;">📋</text>
          </view>
          <view class="status-info">
            <text class="status-name">想玩</text>
            <text class="status-count">{{ stats.wantToPlay }} 款游戏</text>
          </view>
          <text class="status-arrow">></text>
        </view>
        <view class="status-item" @click="navigateToGames('playing')">
          <view class="status-icon" style="background: #E3F2FD;">
            <text style="color: #3498DB;">🎮</text>
          </view>
          <view class="status-info">
            <text class="status-name">在玩</text>
            <text class="status-count">{{ stats.playing }} 款游戏</text>
          </view>
          <text class="status-arrow">></text>
        </view>
        <view class="status-item" @click="navigateToGames('completed')">
          <view class="status-icon" style="background: #E8F5E9;">
            <text style="color: #27AE60;">✓</text>
          </view>
          <view class="status-info">
            <text class="status-name">已通关</text>
            <text class="status-count">{{ stats.completed }} 款游戏</text>
          </view>
          <text class="status-arrow">></text>
        </view>
        <view class="status-item" @click="navigateToGames('dropped')">
          <view class="status-icon" style="background: #ECEFF1;">
            <text style="color: #95A5A6;">✕</text>
          </view>
          <view class="status-info">
            <text class="status-name">弃坑</text>
            <text class="status-count">{{ stats.dropped }} 款游戏</text>
          </view>
          <text class="status-arrow">></text>
        </view>
      </view>
    </view>

    <!-- 最近在玩 -->
    <view class="recent-section" v-if="recentGames.length > 0">
      <view class="section-header">
        <text class="section-title">最近在玩</text>
        <text class="view-all" @click="navigateToGames">查看全部 ></text>
      </view>
      <scroll-view scroll-x class="recent-scroll">
        <view class="recent-list">
          <view 
            v-for="game in recentGames" 
            :key="game.id"
            class="recent-item"
            @click="navigateToGameDetail(game.id)"
          >
            <image class="recent-cover" :src="game.cover" mode="aspectFill" />
            <view class="recent-info">
              <text class="recent-name">{{ game.name }}</text>
              <view class="recent-meta">
                <text class="recent-status" :style="getStatusStyle(game.myStatus)">
                  {{ getStatusLabel(game.myStatus) }}
                </text>
                <text v-if="game.myRating" class="recent-rating">★ {{ game.myRating }}</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 空状态 -->
    <view class="empty-section" v-if="stats.total === 0">
      <image class="empty-icon" src="/static/logo.png" mode="aspectFit" />
      <text class="empty-text">还没有记录任何游戏</text>
      <text class="empty-subtext">点击上方"添加游戏"开始记录吧</text>
    </view>
    
    <!-- 自定义 TabBar -->
    <custom-tabbar />
  </view>
</template>

<script>
import { getStatistics, getRecentGames, StatusConfig } from '@/utils/gameData.js';

export default {
  data() {
    return {
      stats: {
        total: 0,
        wantToPlay: 0,
        playing: 0,
        completed: 0,
        dropped: 0,
        favorites: 0,
        totalPlayTime: 0
      },
      recentGames: []
    };
  },
  
  onShow() {
    this.loadData();
  },
  
  onPullDownRefresh() {
    this.loadData();
    uni.stopPullDownRefresh();
  },
  
  methods: {
    loadData() {
      this.stats = getStatistics();
      this.recentGames = getRecentGames(5);
    },
    
    getStatusLabel(status) {
      return StatusConfig[status]?.label || status;
    },
    
    getStatusStyle(status) {
      const config = StatusConfig[status];
      if (config) {
        return `color: ${config.color}; background: ${config.bgColor};`;
      }
      return '';
    },
    
    navigateToGames(status) {
      let url = '/pages/games/games';
      if (status) {
        url += `?status=${status}`;
      }
      uni.navigateTo({ url });
    },
    
    navigateToAddGame() {
      uni.navigateTo({
        url: '/pages/add-game/add-game'
      });
    },
    
    navigateToFavorites() {
      uni.switchTab({
        url: '/pages/favorites/favorites'
      });
    },
    
    navigateToSearch() {
      uni.switchTab({
        url: '/pages/search/search'
      });
    },
    
    navigateToGameDetail(id) {
      uni.navigateTo({
        url: `/pages/game-detail/game-detail?id=${id}`
      });
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

/* 头部区域 */
.header-section {
  position: relative;
  height: 280rpx;
  overflow: hidden;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0 0 40rpx 40rpx;
}

.header-content {
  position: relative;
  z-index: 1;
  padding: 60rpx 40rpx;
}

.welcome-text {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: #FFFFFF;
  margin-bottom: 16rpx;
}

.sub-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
}

/* 统计卡片 */
.stats-section {
  margin: -60rpx 30rpx 30rpx;
  position: relative;
  z-index: 2;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 30rpx 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 0;
}

.stat-number {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 22rpx;
  color: #999;
}

.stat-card.total .stat-number {
  color: #667eea;
}

.stat-card.playing .stat-number {
  color: #3498DB;
}

.stat-card.completed .stat-number {
  color: #27AE60;
}

.stat-card.hours .stat-number {
  color: #E74C3C;
}

/* 快速操作 */
.quick-actions {
  display: flex;
  justify-content: space-around;
  margin: 0 30rpx 40rpx;
  padding: 0 20rpx;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 40rpx;
  background: #FFFFFF;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.action-icon {
  font-size: 40rpx;
  margin-bottom: 12rpx;
}

.action-text {
  font-size: 24rpx;
  color: #666;
}

.action-btn.add .action-icon {
  color: #667eea;
}

.action-btn.favorite .action-icon {
  color: #E74C3C;
}

.action-btn.search .action-icon {
  color: #3498DB;
}

/* 状态分布 */
.status-section {
  margin: 0 30rpx 40rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.view-all {
  font-size: 26rpx;
  color: #667eea;
}

.status-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.status-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #F8F9FA;
  border-radius: 16rpx;
}

.status-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  margin-right: 24rpx;
}

.status-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.status-name {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 8rpx;
}

.status-count {
  font-size: 24rpx;
  color: #999;
}

.status-arrow {
  font-size: 32rpx;
  color: #CCC;
}

/* 最近在玩 */
.recent-section {
  margin: 0 30rpx;
}

.recent-scroll {
  width: 100%;
}

.recent-list {
  display: flex;
  gap: 24rpx;
  padding: 10rpx 0;
}

.recent-item {
  flex-shrink: 0;
  width: 240rpx;
  background: #FFFFFF;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.recent-cover {
  width: 100%;
  height: 320rpx;
}

.recent-info {
  padding: 20rpx;
}

.recent-name {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 12rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recent-meta {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.recent-status {
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.recent-rating {
  font-size: 22rpx;
  color: #F39C12;
}

/* 空状态 */
.empty-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 60rpx;
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 40rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 32rpx;
  color: #999;
  margin-bottom: 16rpx;
}

.empty-subtext {
  font-size: 26rpx;
  color: #BBB;
}
</style>
