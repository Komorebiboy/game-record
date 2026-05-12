<template>
  <view class="container">
    <!-- 头部 -->
    <view class="header">
      <text class="header-title">我的收藏</text>
      <text class="header-count">{{ favoriteGames.length }} 款游戏</text>
    </view>

    <!-- 收藏列表 -->
    <view class="games-section">
      <view class="games-list" v-if="favoriteGames.length > 0">
        <view 
          v-for="game in favoriteGames" 
          :key="game.id"
          class="game-card"
          @click="navigateToDetail(game.id)"
        >
          <image class="game-cover" :src="game.cover" mode="aspectFill" />
          <view class="game-info">
            <text class="game-name">{{ game.name }}</text>
            <view class="game-genres">
              <text v-for="(genre, index) in game.genres.slice(0, 2)" :key="genre" class="genre-tag">
                {{ genre }}{{ index < game.genres.slice(0, 2).length - 1 ? ' · ' : '' }}
              </text>
            </view>
            <view class="game-meta">
              <text class="status-badge" :style="getStatusStyle(game.myStatus)">
                {{ getStatusLabel(game.myStatus) }}
              </text>
              <text v-if="game.myRating" class="rating">★ {{ game.myRating }}</text>
            </view>
          </view>
          <view class="favorite-btn" @click.stop="removeFavorite(game.id)">
            <text class="favorite-icon active">★</text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-section" v-else>
        <text class="empty-icon">☆</text>
        <text class="empty-text">还没有收藏任何游戏</text>
        <text class="empty-subtext">在游戏详情页点击收藏按钮添加</text>
      </view>
    </view>
    
    <!-- 自定义 TabBar -->
    <custom-tabbar />
  </view>
</template>

<script>
import { getGames, toggleFavorite, StatusConfig } from '@/utils/gameData.js';

export default {
  data() {
    return {
      favoriteGames: [],
      StatusConfig
    };
  },
  
  onShow() {
    this.loadFavorites();
  },
  
  onPullDownRefresh() {
    this.loadFavorites();
    uni.stopPullDownRefresh();
  },
  
  methods: {
    loadFavorites() {
      const games = getGames();
      this.favoriteGames = games.filter(g => g.isFavorite);
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
    
    removeFavorite(gameId) {
      uni.showModal({
        title: '取消收藏',
        content: '确定要取消收藏这款游戏吗？',
        success: (res) => {
          if (res.confirm) {
            toggleFavorite(gameId);
            this.loadFavorites();
            uni.showToast({
              title: '已取消收藏',
              icon: 'none'
            });
          }
        }
      });
    },
    
    navigateToDetail(id) {
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

.header-count {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

/* 游戏列表 */
.games-section {
  margin: -40rpx 30rpx 30rpx;
  padding: 30rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  min-height: 600rpx;
}

.games-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.game-card {
  display: flex;
  background: #F8F9FA;
  border-radius: 20rpx;
  overflow: hidden;
  position: relative;
}

.game-cover {
  width: 180rpx;
  height: 240rpx;
  flex-shrink: 0;
}

.game-info {
  flex: 1;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
}

.game-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
  align-items: center;
  gap: 20rpx;
}

.status-badge {
  font-size: 22rpx;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
}

.rating {
  font-size: 26rpx;
  color: #F39C12;
  font-weight: 500;
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
  color: #DDD;
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
</style>
