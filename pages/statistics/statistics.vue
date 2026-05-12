<template>
  <view class="container">
    <!-- 头部 -->
    <view class="header">
      <text class="header-title">数据统计</text>
      <text class="header-subtitle">游戏时光数据可视化</text>
    </view>

    <!-- 总览卡片 -->
    <view class="overview-section">
      <view class="overview-grid">
        <view class="overview-card">
          <text class="overview-number">{{ stats.total }}</text>
          <text class="overview-label">游戏总数</text>
        </view>
        <view class="overview-card">
          <text class="overview-number">{{ stats.completed }}</text>
          <text class="overview-label">已通关</text>
        </view>
        <view class="overview-card">
          <text class="overview-number">{{ stats.totalPlayTime }}h</text>
          <text class="overview-label">总时长</text>
        </view>
        <view class="overview-card">
          <text class="overview-number">{{ averageRating }}</text>
          <text class="overview-label">平均评分</text>
        </view>
      </view>
    </view>

    <!-- 状态分布饼图 -->
    <view class="chart-section">
      <view class="chart-header">
        <text class="chart-title">游戏状态分布</text>
      </view>
      <view class="pie-chart">
        <view class="pie-container">
          <view 
            v-for="(item, index) in statusData" 
            :key="index"
            class="pie-segment"
            :style="getPieSegmentStyle(item, index)"
          ></view>
        </view>
        <view class="pie-legend">
          <view 
            v-for="(item, index) in statusData" 
            :key="index"
            class="legend-item"
          >
            <view class="legend-color" :style="{ background: item.color }"></view>
            <text class="legend-name">{{ item.name }}</text>
            <text class="legend-value">{{ item.value }}款 ({{ item.percentage }}%)</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 平台分布横向柱状图 -->
    <view class="chart-section">
      <view class="chart-header">
        <text class="chart-title">平台分布</text>
      </view>
      <view class="bar-chart">
        <view 
          v-for="(item, index) in platformData" 
          :key="index"
          class="bar-item"
        >
          <view class="bar-label">
            <text class="bar-icon">{{ item.icon }}</text>
            <text class="bar-name">{{ item.name }}</text>
          </view>
          <view class="bar-wrapper">
            <view 
              class="bar-fill"
              :style="{ 
                width: item.percentage + '%',
                background: item.color
              }"
            ></view>
          </view>
          <text class="bar-value">{{ item.value }}</text>
        </view>
      </view>
    </view>

    <!-- 类型分布标签云 -->
    <view class="chart-section">
      <view class="chart-header">
        <text class="chart-title">游戏类型偏好</text>
      </view>
      <view class="tag-cloud">
        <view 
          v-for="(item, index) in genreData" 
          :key="index"
          class="tag-item"
          :style="{ 
            fontSize: item.size + 'rpx',
            opacity: item.opacity,
            background: item.background
          }"
        >
          {{ item.name }} ({{ item.value }})
        </view>
      </view>
    </view>

    <!-- 年度游戏趋势 -->
    <view class="chart-section">
      <view class="chart-header">
        <text class="chart-title">年度游戏趋势</text>
      </view>
      <view class="trend-chart">
        <view class="trend-header">
          <text class="trend-year">年份</text>
          <text class="trend-count">新增游戏</text>
          <text class="trend-completed">通关数</text>
        </view>
        <view 
          v-for="(item, index) in yearData" 
          :key="index"
          class="trend-item"
        >
          <text class="trend-year">{{ item.year }}</text>
          <view class="trend-bar-wrapper">
            <view 
              class="trend-bar"
              :style="{ width: item.barWidth + '%' }"
            ></view>
          </view>
          <text class="trend-count">{{ item.count }}</text>
          <text class="trend-completed">{{ item.completed }}</text>
        </view>
      </view>
    </view>

    <!-- 评分分布 -->
    <view class="chart-section">
      <view class="chart-header">
        <text class="chart-title">评分分布</text>
      </view>
      <view class="rating-chart">
        <view 
          v-for="(item, index) in ratingData" 
          :key="index"
          class="rating-item"
        >
          <text class="rating-stars">{{ item.stars }}</text>
          <view class="rating-bar-wrapper">
            <view 
              class="rating-bar"
              :style="{ width: item.percentage + '%' }"
            ></view>
          </view>
          <text class="rating-count">{{ item.count }}</text>
        </view>
      </view>
    </view>

    <!-- 游戏时长排行 -->
    <view class="chart-section">
      <view class="chart-header">
        <text class="chart-title">游戏时长 TOP 5</text>
      </view>
      <view class="playtime-list">
        <view 
          v-for="(game, index) in topPlayTimeGames" 
          :key="index"
          class="playtime-item"
          @click="navigateToGame(game.id)"
        >
          <text class="playtime-rank" :class="{ top: index < 3 }">{{ index + 1 }}</text>
          <image class="playtime-cover" :src="game.cover" mode="aspectFill" />
          <view class="playtime-info">
            <text class="playtime-name">{{ game.name }}</text>
            <text class="playtime-platform">{{ getPlatformNames(game.platforms) }}</text>
          </view>
          <text class="playtime-hours">{{ game.playTime }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getGames, getStatistics, StatusConfig, Platforms } from '@/utils/gameData.js';

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
      statusData: [],
      platformData: [],
      genreData: [],
      yearData: [],
      ratingData: [],
      topPlayTimeGames: []
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
      this.calculateStatusData();
      this.calculatePlatformData();
      this.calculateGenreData();
      this.calculateYearData();
      this.calculateRatingData();
      this.getTopPlayTimeGames();
    },

    calculateStatusData() {
      const total = this.games.length;
      if (total === 0) {
        this.statusData = [];
        return;
      }

      const statusMap = {
        'want_to_play': { name: '想玩', color: '#9B59B6' },
        'playing': { name: '在玩', color: '#3498DB' },
        'completed': { name: '已通关', color: '#27AE60' },
        'dropped': { name: '弃坑', color: '#95A5A6' }
      };

      let currentAngle = 0;
      this.statusData = Object.keys(statusMap).map(status => {
        const count = this.games.filter(g => g.myStatus === status).length;
        const percentage = Math.round((count / total) * 100);
        const angle = (count / total) * 360;
        const startAngle = currentAngle;
        currentAngle += angle;

        return {
          name: statusMap[status].name,
          value: count,
          percentage,
          color: statusMap[status].color,
          startAngle,
          endAngle: currentAngle
        };
      }).filter(item => item.value > 0);
    },

    getPieSegmentStyle(item, index) {
      return {
        background: `conic-gradient(${item.color} ${item.startAngle}deg, ${item.color} ${item.endAngle}deg, transparent ${item.endAngle}deg)`,
        zIndex: this.statusData.length - index
      };
    },

    calculatePlatformData() {
      const platformCounts = {};
      this.games.forEach(game => {
        game.platforms.forEach(platform => {
          platformCounts[platform] = (platformCounts[platform] || 0) + 1;
        });
      });

      const maxCount = Math.max(...Object.values(platformCounts), 1);

      this.platformData = Platforms.map(platform => {
        const count = platformCounts[platform.id] || 0;
        return {
          name: platform.name,
          icon: platform.icon,
          color: platform.color,
          value: count,
          percentage: (count / maxCount) * 100
        };
      }).filter(item => item.value > 0).sort((a, b) => b.value - a.value);
    },

    calculateGenreData() {
      const genreCounts = {};
      this.games.forEach(game => {
        game.genres.forEach(genre => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      });

      const maxCount = Math.max(...Object.values(genreCounts), 1);
      const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

      this.genreData = Object.entries(genreCounts)
        .map(([name, count], index) => ({
          name,
          value: count,
          size: 24 + (count / maxCount) * 16,
          opacity: 0.6 + (count / maxCount) * 0.4,
          background: colors[index % colors.length] + '20'
        }))
        .sort((a, b) => b.value - a.value);
    },

    calculateYearData() {
      const yearData = {};
      const currentYear = new Date().getFullYear();

      // 初始化近5年
      for (let i = 0; i < 5; i++) {
        yearData[currentYear - i] = { count: 0, completed: 0 };
      }

      this.games.forEach(game => {
        const year = new Date(game.createTime).getFullYear();
        if (yearData[year]) {
          yearData[year].count++;
          if (game.myStatus === 'completed') {
            yearData[year].completed++;
          }
        }
      });

      const maxCount = Math.max(...Object.values(yearData).map(y => y.count), 1);

      this.yearData = Object.entries(yearData)
        .map(([year, data]) => ({
          year,
          count: data.count,
          completed: data.completed,
          barWidth: (data.count / maxCount) * 100
        }))
        .sort((a, b) => b.year - a.year);
    },

    calculateRatingData() {
      const ratingRanges = [
        { stars: '★★★★★', min: 9, max: 10 },
        { stars: '★★★★☆', min: 7, max: 8 },
        { stars: '★★★☆☆', min: 5, max: 6 },
        { stars: '★★☆☆☆', min: 3, max: 4 },
        { stars: '★☆☆☆☆', min: 1, max: 2 },
        { stars: '未评分', min: 0, max: 0 }
      ];

      const maxCount = Math.max(...ratingRanges.map(range => {
        if (range.min === 0) {
          return this.games.filter(g => !g.myRating || g.myRating === 0).length;
        }
        return this.games.filter(g => g.myRating >= range.min && g.myRating <= range.max).length;
      }), 1);

      this.ratingData = ratingRanges.map(range => {
        let count;
        if (range.min === 0) {
          count = this.games.filter(g => !g.myRating || g.myRating === 0).length;
        } else {
          count = this.games.filter(g => g.myRating >= range.min && g.myRating <= range.max).length;
        }

        return {
          stars: range.stars,
          count,
          percentage: (count / maxCount) * 100
        };
      });
    },

    getTopPlayTimeGames() {
      this.topPlayTimeGames = this.games
        .filter(g => g.playTime)
        .sort((a, b) => {
          const hoursA = parseInt(a.playTime) || 0;
          const hoursB = parseInt(b.playTime) || 0;
          return hoursB - hoursA;
        })
        .slice(0, 5);
    },

    getPlatformNames(platformIds) {
      return platformIds
        .map(id => Platforms.find(p => p.id === id)?.name || id)
        .join('、');
    },

    navigateToGame(id) {
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
  padding-bottom: 40rpx;
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

/* 总览卡片 */
.overview-section {
  margin: -40rpx 30rpx 30rpx;
  position: relative;
  z-index: 10;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 30rpx 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.overview-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 0;
}

.overview-number {
  font-size: 40rpx;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 8rpx;
}

.overview-label {
  font-size: 22rpx;
  color: #999;
}

/* 图表区域 */
.chart-section {
  margin: 30rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.chart-header {
  margin-bottom: 30rpx;
}

.chart-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

/* 饼图 */
.pie-chart {
  display: flex;
  align-items: center;
  gap: 40rpx;
}

.pie-container {
  position: relative;
  width: 240rpx;
  height: 240rpx;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.pie-segment {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.pie-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.legend-color {
  width: 24rpx;
  height: 24rpx;
  border-radius: 6rpx;
}

.legend-name {
  font-size: 28rpx;
  color: #333;
  width: 100rpx;
}

.legend-value {
  font-size: 26rpx;
  color: #999;
}

/* 柱状图 */
.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.bar-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.bar-label {
  display: flex;
  align-items: center;
  gap: 12rpx;
  width: 140rpx;
  flex-shrink: 0;
}

.bar-icon {
  font-size: 32rpx;
}

.bar-name {
  font-size: 26rpx;
  color: #333;
}

.bar-wrapper {
  flex: 1;
  height: 24rpx;
  background: #F5F7FA;
  border-radius: 12rpx;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 12rpx;
  transition: width 0.5s ease;
}

.bar-value {
  font-size: 26rpx;
  color: #666;
  width: 60rpx;
  text-align: right;
}

/* 标签云 */
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  padding: 20rpx;
}

.tag-item {
  padding: 16rpx 32rpx;
  border-radius: 32rpx;
  font-weight: 500;
  color: #333;
  transition: transform 0.2s;
}

/* 趋势图 */
.trend-chart {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.trend-header {
  display: flex;
  align-items: center;
  padding: 0 20rpx 20rpx;
  border-bottom: 1rpx solid #F0F0F0;
  font-size: 24rpx;
  color: #999;
}

.trend-header .trend-year {
  width: 100rpx;
}

.trend-header .trend-count {
  width: 120rpx;
  text-align: center;
}

.trend-header .trend-completed {
  width: 120rpx;
  text-align: center;
}

.trend-item {
  display: flex;
  align-items: center;
  padding: 16rpx 20rpx;
  background: #F8F9FA;
  border-radius: 12rpx;
}

.trend-item .trend-year {
  width: 100rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.trend-bar-wrapper {
  flex: 1;
  height: 16rpx;
  background: #E0E0E0;
  border-radius: 8rpx;
  overflow: hidden;
  margin: 0 20rpx;
}

.trend-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 8rpx;
  transition: width 0.5s ease;
}

.trend-item .trend-count {
  width: 120rpx;
  text-align: center;
  font-size: 26rpx;
  color: #667eea;
  font-weight: 500;
}

.trend-item .trend-completed {
  width: 120rpx;
  text-align: center;
  font-size: 26rpx;
  color: #27AE60;
}

/* 评分分布 */
.rating-chart {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.rating-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.rating-stars {
  width: 140rpx;
  font-size: 28rpx;
  color: #F39C12;
}

.rating-bar-wrapper {
  flex: 1;
  height: 20rpx;
  background: #F5F7FA;
  border-radius: 10rpx;
  overflow: hidden;
}

.rating-bar {
  height: 100%;
  background: linear-gradient(90deg, #F39C12, #F1C40F);
  border-radius: 10rpx;
  transition: width 0.5s ease;
}

.rating-count {
  width: 60rpx;
  text-align: right;
  font-size: 26rpx;
  color: #666;
}

/* 游戏时长排行 */
.playtime-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.playtime-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx;
  background: #F8F9FA;
  border-radius: 16rpx;
}

.playtime-rank {
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

.playtime-rank.top {
  background: #667eea;
  color: #FFFFFF;
}

.playtime-cover {
  width: 100rpx;
  height: 130rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.playtime-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.playtime-name {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
}

.playtime-platform {
  font-size: 24rpx;
  color: #999;
}

.playtime-hours {
  font-size: 32rpx;
  font-weight: bold;
  color: #667eea;
}
</style>
