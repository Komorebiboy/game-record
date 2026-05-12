<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-section">
      <view class="search-box">
        <text class="search-icon">🔍</text>
        <input 
          class="search-input" 
          type="text" 
          placeholder="搜索游戏名称、开发商..."
          v-model="searchKeyword"
          @confirm="handleSearch"
        />
        <text v-if="searchKeyword" class="clear-icon" @click="clearSearch">✕</text>
      </view>
    </view>

    <!-- 筛选标签 -->
    <view class="filter-section">
      <scroll-view scroll-x class="filter-scroll">
        <view class="filter-list">
          <view 
            class="filter-item"
            :class="{ active: currentStatus === '' }"
            @click="filterByStatus('')"
          >
            <text>全部</text>
          </view>
          <view 
            v-for="(config, status) in StatusConfig" 
            :key="status"
            class="filter-item"
            :class="{ active: currentStatus === status }"
            :style="currentStatus === status ? `background: ${config.bgColor}; color: ${config.color};` : ''"
            @click="filterByStatus(status)"
          >
            <text>{{ config.label }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 平台筛选 -->
    <view class="platform-section">
      <scroll-view scroll-x class="platform-scroll">
        <view class="platform-list">
          <view 
            class="platform-item"
            :class="{ active: currentPlatform === '' }"
            @click="filterByPlatform('')"
          >
            <text>全部平台</text>
          </view>
          <view 
            v-for="platform in Platforms" 
            :key="platform.id"
            class="platform-item"
            :class="{ active: currentPlatform === platform.id }"
            :style="currentPlatform === platform.id ? `background: ${platform.color}20; color: ${platform.color}; border-color: ${platform.color};` : ''"
            @click="filterByPlatform(platform.id)"
          >
            <text>{{ platform.icon }} {{ platform.name }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 游戏列表 -->
    <view class="games-section">
      <view class="games-list">
        <view 
          v-for="game in filteredGames" 
          :key="game.id"
          class="game-card"
          @click="navigateToDetail(game.id)"
        >
          <image class="game-cover" :src="game.cover" mode="aspectFill" />
          <view class="game-info">
            <view class="game-header">
              <text class="game-name">{{ game.name }}</text>
              <view class="game-platforms">
                <text 
                  v-for="platform in game.platforms.slice(0, 2)" 
                  :key="platform"
                  class="platform-tag"
                >
                  {{ getPlatformIcon(platform) }}
                </text>
              </view>
            </view>
            <view class="game-genres">
              <text v-for="(genre, index) in game.genres.slice(0, 3)" :key="genre" class="genre-tag">
                {{ genre }}{{ index < game.genres.slice(0, 3).length - 1 ? ' · ' : '' }}
              </text>
            </view>
            <view class="game-meta">
              <text class="status-badge" :style="getStatusStyle(game.myStatus)">
                {{ getStatusLabel(game.myStatus) }}
              </text>
              <view class="game-stats">
                <text v-if="game.myRating" class="rating">
                  <text class="star">★</text> {{ game.myRating }}
                </text>
                <text v-if="game.playTime" class="playtime">{{ game.playTime }}</text>
              </view>
            </view>
          </view>
          <view class="favorite-btn" @click.stop="toggleFavorite(game.id)">
            <text :class="['favorite-icon', { active: game.isFavorite }]">★</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-section" v-if="filteredGames.length === 0">
      <text class="empty-icon">🎮</text>
      <text class="empty-text">没有找到相关游戏</text>
      <text class="empty-subtext">试试其他搜索条件</text>
    </view>

    <!-- 添加按钮 -->
    <view class="fab-btn" @click="navigateToAddGame">
      <text class="fab-icon">+</text>
    </view>
    
    <!-- 自定义 TabBar -->
    <custom-tabbar />
  </view>
</template>

<script>
import { 
  getGames, 
  filterByStatus, 
  filterByPlatform, 
  searchGames,
  toggleFavorite,
  StatusConfig,
  Platforms 
} from '@/utils/gameData.js';

export default {
  data() {
    return {
      games: [],
      filteredGames: [],
      searchKeyword: '',
      currentStatus: '',
      currentPlatform: '',
      StatusConfig,
      Platforms
    };
  },
  
  onLoad(options) {
    if (options.status) {
      this.currentStatus = options.status;
    }
    this.loadGames();
  },
  
  onShow() {
    this.loadGames();
  },
  
  onPullDownRefresh() {
    this.loadGames();
    uni.stopPullDownRefresh();
  },
  
  watch: {
    searchKeyword() {
      this.applyFilters();
    }
  },
  
  methods: {
    loadGames() {
      this.games = getGames();
      this.applyFilters();
    },
    
    applyFilters() {
      let result = this.games;
      
      // 状态筛选
      if (this.currentStatus) {
        result = result.filter(g => g.myStatus === this.currentStatus);
      }
      
      // 平台筛选
      if (this.currentPlatform) {
        result = result.filter(g => g.platforms.includes(this.currentPlatform));
      }
      
      // 搜索筛选
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase();
        result = result.filter(g => 
          g.name.toLowerCase().includes(keyword) ||
          g.nameEn.toLowerCase().includes(keyword) ||
          g.developer.toLowerCase().includes(keyword)
        );
      }
      
      this.filteredGames = result;
    },
    
    filterByStatus(status) {
      this.currentStatus = status;
      this.applyFilters();
    },
    
    filterByPlatform(platform) {
      this.currentPlatform = platform;
      this.applyFilters();
    },
    
    handleSearch() {
      this.applyFilters();
    },
    
    clearSearch() {
      this.searchKeyword = '';
      this.applyFilters();
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
    
    getPlatformIcon(platformId) {
      const platform = Platforms.find(p => p.id === platformId);
      return platform ? platform.icon : '🎮';
    },
    
    toggleFavorite(gameId) {
      const isFavorite = toggleFavorite(gameId);
      const game = this.games.find(g => g.id === gameId);
      if (game) {
        game.isFavorite = isFavorite;
      }
      uni.showToast({
        title: isFavorite ? '已收藏' : '已取消收藏',
        icon: 'none'
      });
    },
    
    navigateToDetail(id) {
      uni.navigateTo({
        url: `/pages/game-detail/game-detail?id=${id}`
      });
    },
    
    navigateToAddGame() {
      uni.navigateTo({
        url: '/pages/add-game/add-game'
      });
    }
  }
};
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background: #F5F7FA;
  padding-bottom: 240rpx;
}

/* 搜索栏 */
.search-section {
  padding: 20rpx 30rpx;
  background: #FFFFFF;
}

.search-box {
  display: flex;
  align-items: center;
  background: #F5F7FA;
  border-radius: 16rpx;
  padding: 16rpx 24rpx;
}

.search-icon {
  font-size: 28rpx;
  margin-right: 16rpx;
  color: #999;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.clear-icon {
  font-size: 24rpx;
  color: #999;
  padding: 8rpx;
}

/* 筛选标签 */
.filter-section {
  background: #FFFFFF;
  padding: 0 30rpx 20rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.filter-scroll {
  white-space: nowrap;
}

.filter-list {
  display: flex;
  gap: 16rpx;
}

.filter-item {
  padding: 12rpx 28rpx;
  background: #F5F7FA;
  border-radius: 28rpx;
  font-size: 26rpx;
  color: #666;
  transition: all 0.3s;
}

.filter-item.active {
  background: #667eea;
  color: #FFFFFF;
}

/* 平台筛选 */
.platform-section {
  background: #FFFFFF;
  padding: 20rpx 30rpx;
  margin-bottom: 20rpx;
}

.platform-scroll {
  white-space: nowrap;
}

.platform-list {
  display: flex;
  gap: 16rpx;
}

.platform-item {
  padding: 12rpx 24rpx;
  background: #F5F7FA;
  border: 2rpx solid transparent;
  border-radius: 28rpx;
  font-size: 24rpx;
  color: #666;
  transition: all 0.3s;
}

.platform-item.active {
  border-color: #667eea;
}

/* 游戏列表 */
.games-section {
  padding: 20rpx 30rpx;
}

.games-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.game-card {
  display: flex;
  background: #FFFFFF;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  position: relative;
}

.game-cover {
  width: 200rpx;
  height: 260rpx;
  flex-shrink: 0;
}

.game-info {
  flex: 1;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12rpx;
}

.game-name {
  flex: 1;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-right: 16rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.game-platforms {
  display: flex;
  gap: 8rpx;
}

.platform-tag {
  font-size: 24rpx;
}

.game-genres {
  margin-bottom: 16rpx;
}

.genre-tag {
  font-size: 24rpx;
  color: #999;
}

.game-meta {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-badge {
  font-size: 22rpx;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
}

.game-stats {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.rating {
  font-size: 26rpx;
  color: #F39C12;
  font-weight: 500;
}

.star {
  font-size: 24rpx;
}

.playtime {
  font-size: 24rpx;
  color: #999;
}

.favorite-btn {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  width: 56rpx;
  height: 56rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.favorite-icon {
  font-size: 32rpx;
  color: #DDD;
}

.favorite-icon.active {
  color: #E74C3C;
}

/* 空状态 */
.empty-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 60rpx;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #666;
  margin-bottom: 16rpx;
}

.empty-subtext {
  font-size: 26rpx;
  color: #999;
}

/* 添加按钮 */
.fab-btn {
  position: fixed;
  right: 40rpx;
  bottom: 140rpx;
  width: 100rpx;
  height: 100rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.4);
  z-index: 100;
}

.fab-icon {
  font-size: 48rpx;
  color: #FFFFFF;
  font-weight: 300;
}
</style>
