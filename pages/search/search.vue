<template>
  <view class="container">
    <!-- 返回按钮 -->
    <view class="back-btn" @click="goBack">
      <text class="back-icon">←</text>
    </view>

    <!-- 搜索栏 -->
    <view class="search-section">
      <view class="search-box">
        <text class="search-icon">🔍</text>
        <input 
          class="search-input" 
          type="text" 
          placeholder="搜索游戏名称、开发商、类型..."
          v-model="searchKeyword"
          @confirm="handleSearch"
          focus
        />
        <text v-if="searchKeyword" class="clear-icon" @click="clearSearch">✕</text>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view class="results-section" v-if="hasSearched">
      <view class="results-header">
        <text class="results-title">搜索结果</text>
        <text class="results-count">共 {{ searchResults.length }} 款游戏</text>
      </view>

      <view class="games-list" v-if="searchResults.length > 0">
        <view 
          v-for="game in searchResults" 
          :key="game.id"
          class="game-card"
          @click="navigateToDetail(game.id)"
        >
          <image class="game-cover" :src="game.cover" mode="aspectFill" />
          <view class="game-info">
            <text class="game-name">{{ game.name }}</text>
            <text class="game-en">{{ game.nameEn }}</text>
            <view class="game-meta">
              <text class="status-badge" :style="getStatusStyle(game.myStatus)">
                {{ getStatusLabel(game.myStatus) }}
              </text>
              <text v-if="game.myRating" class="rating">★ {{ game.myRating }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 无结果 -->
      <view class="empty-section" v-else>
        <text class="empty-icon">🔍</text>
        <text class="empty-text">未找到相关游戏</text>
        <text class="empty-subtext">试试其他关键词</text>
      </view>
    </view>

    <!-- 搜索历史和推荐 -->
    <view class="suggestions-section" v-else>
      <!-- 最近搜索 -->
      <view class="history-section" v-if="searchHistory.length > 0">
        <view class="section-header">
          <text class="section-title">最近搜索</text>
          <text class="clear-btn" @click="clearHistory">清空</text>
        </view>
        <view class="history-list">
          <text 
            v-for="(keyword, index) in searchHistory" 
            :key="index"
            class="history-tag"
            @click="quickSearch(keyword)"
          >
            {{ keyword }}
          </text>
        </view>
      </view>

      <!-- 热门推荐 -->
      <view class="hot-section">
        <view class="section-header">
          <text class="section-title">热门推荐</text>
        </view>
        <view class="hot-list">
          <view 
            v-for="(game, index) in hotGames" 
            :key="game.id"
            class="hot-item"
            @click="navigateToDetail(game.id)"
          >
            <text class="hot-rank" :class="{ top: index < 3 }">{{ index + 1 }}</text>
            <image class="hot-cover" :src="game.cover" mode="aspectFill" />
            <view class="hot-info">
              <text class="hot-name">{{ game.name }}</text>
              <text class="hot-rating" v-if="game.myRating">★ {{ game.myRating }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { searchGames, getGames, StatusConfig } from '@/utils/gameData.js';

const HISTORY_KEY = 'game_search_history';

export default {
  data() {
    return {
      searchKeyword: '',
      searchResults: [],
      searchHistory: [],
      hasSearched: false,
      StatusConfig
    };
  },
  
  computed: {
    hotGames() {
      const games = getGames();
      // 按评分和收藏排序，取前5个
      return games
        .filter(g => g.myRating > 0 || g.isFavorite)
        .sort((a, b) => {
          if (b.myRating !== a.myRating) return b.myRating - a.myRating;
          if (b.isFavorite !== a.isFavorite) return b.isFavorite ? 1 : -1;
          return 0;
        })
        .slice(0, 5);
    }
  },
  
  onLoad() {
    this.loadHistory();
  },
  
  methods: {
    loadHistory() {
      try {
        const history = uni.getStorageSync(HISTORY_KEY);
        this.searchHistory = history ? JSON.parse(history) : [];
      } catch (e) {
        this.searchHistory = [];
      }
    },
    
    saveHistory() {
      try {
        uni.setStorageSync(HISTORY_KEY, JSON.stringify(this.searchHistory));
      } catch (e) {
        console.error('保存搜索历史失败:', e);
      }
    },
    
    addToHistory(keyword) {
      if (!keyword.trim()) return;
      
      // 移除重复项
      const index = this.searchHistory.indexOf(keyword);
      if (index > -1) {
        this.searchHistory.splice(index, 1);
      }
      
      // 添加到开头
      this.searchHistory.unshift(keyword);
      
      // 最多保存10条
      if (this.searchHistory.length > 10) {
        this.searchHistory = this.searchHistory.slice(0, 10);
      }
      
      this.saveHistory();
    },
    
    clearHistory() {
      uni.showModal({
        title: '确认清空',
        content: '确定要清空搜索历史吗？',
        success: (res) => {
          if (res.confirm) {
            this.searchHistory = [];
            this.saveHistory();
          }
        }
      });
    },
    
    handleSearch() {
      if (!this.searchKeyword.trim()) {
        uni.showToast({
          title: '请输入搜索关键词',
          icon: 'none'
        });
        return;
      }
      
      this.searchResults = searchGames(this.searchKeyword);
      this.addToHistory(this.searchKeyword);
      this.hasSearched = true;
    },
    
    quickSearch(keyword) {
      this.searchKeyword = keyword;
      this.handleSearch();
    },
    
    clearSearch() {
      this.searchKeyword = '';
      this.searchResults = [];
      this.hasSearched = false;
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
    
    navigateToDetail(id) {
      uni.navigateTo({
        url: `/pages/game-detail/game-detail?id=${id}`
      });
    },

    goBack() {
      uni.navigateBack();
    }
  }
};
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background: #F5F7FA;
}

.back-btn { position: fixed; top: 40rpx; left: 30rpx; z-index: 100; width: 72rpx; height: 72rpx; background: rgba(0,0,0,0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.back-icon { font-size: 32rpx; color: #FFFFFF; }

/* 搜索栏 */
.search-section {
  padding: 30rpx;
  background: #FFFFFF;
  border-bottom: 1rpx solid #F0F0F0;
}

.search-box {
  display: flex;
  align-items: center;
  background: #F5F7FA;
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
}

.search-icon {
  font-size: 32rpx;
  margin-right: 16rpx;
  color: #999;
}

.search-input {
  flex: 1;
  font-size: 30rpx;
  color: #333;
}

.clear-icon {
  font-size: 28rpx;
  color: #999;
  padding: 10rpx;
}

/* 搜索结果 */
.results-section {
  padding: 30rpx;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.results-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.results-count {
  font-size: 26rpx;
  color: #999;
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
  margin-bottom: 8rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.game-en {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 16rpx;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

/* 无结果 */
.empty-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 60rpx;
}

.empty-icon {
  font-size: 100rpx;
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

/* 建议区域 */
.suggestions-section {
  padding: 30rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.clear-btn {
  font-size: 26rpx;
  color: #999;
}

/* 搜索历史 */
.history-section {
  margin-bottom: 40rpx;
}

.history-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.history-tag {
  padding: 16rpx 28rpx;
  background: #FFFFFF;
  border-radius: 28rpx;
  font-size: 26rpx;
  color: #666;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

/* 热门推荐 */
.hot-section {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.hot-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.hot-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.hot-rank {
  width: 48rpx;
  height: 48rpx;
  line-height: 48rpx;
  text-align: center;
  background: #F5F7FA;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: bold;
  color: #999;
  flex-shrink: 0;
}

.hot-rank.top {
  background: #667eea;
  color: #FFFFFF;
}

.hot-cover {
  width: 100rpx;
  height: 130rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.hot-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.hot-name {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 12rpx;
}

.hot-rating {
  font-size: 26rpx;
  color: #F39C12;
}
</style>
