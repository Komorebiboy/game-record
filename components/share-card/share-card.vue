<template>
  <view class="share-popup" v-if="visible">
    <view class="share-mask" @click="close"></view>
    <view class="share-content">
      <view class="share-card">
        <!-- 卡片头部 -->
        <view class="card-header">
          <image class="app-logo" src="/static/logo.png" mode="aspectFit" />
          <text class="app-name">游戏时光</text>
        </view>

        <!-- 游戏信息 -->
        <view class="game-section" v-if="type === 'game' && game">
          <image class="game-cover" :src="game.cover" mode="aspectFill" />
          <view class="game-info">
            <text class="game-name">{{ game.name }}</text>
            <view class="game-meta">
              <text class="game-rating" v-if="game.myRating">
                <text class="star">★</text> {{ game.myRating }}分
              </text>
              <text class="game-status" :style="getStatusStyle(game.myStatus)">
                {{ getStatusLabel(game.myStatus) }}
              </text>
            </view>
            <text class="game-review" v-if="game.myReview">"{{ game.myReview.substring(0, 50) }}..."</text>
          </view>
        </view>

        <!-- 统计信息 -->
        <view class="stats-section" v-if="type === 'stats'">
          <text class="stats-title">我的游戏时光</text>
          <view class="stats-grid">
            <view class="stat-item">
              <text class="stat-number">{{ stats.total }}</text>
              <text class="stat-label">游戏总数</text>
            </view>
            <view class="stat-item">
              <text class="stat-number">{{ stats.completed }}</text>
              <text class="stat-label">已通关</text>
            </view>
            <view class="stat-item">
              <text class="stat-number">{{ stats.totalPlayTime }}h</text>
              <text class="stat-label">总时长</text>
            </view>
          </view>
          <view class="top-games" v-if="topGames.length > 0">
            <text class="top-title">推荐游戏</text>
            <view class="top-list">
              <text v-for="(game, index) in topGames" :key="index" class="top-item">
                {{ index + 1 }}. {{ game.name }}
              </text>
            </view>
          </view>
        </view>

        <!-- 卡片底部 -->
        <view class="card-footer">
          <text class="footer-text">记录每一份游戏感动</text>
          <text class="footer-tip">扫码使用小程序</text>
        </view>
      </view>

      <!-- 分享选项 -->
      <view class="share-options">
        <view class="option-item" @click="shareToFriend">
          <view class="option-icon" style="background: #07C160;">
            <uni-icons type="chat" size="28" color="#FFFFFF"></uni-icons>
          </view>
          <text class="option-text">分享给好友</text>
        </view>
        <view class="option-item" @click="copyText">
          <view class="option-icon" style="background: #667eea;">
            <uni-icons type="compose" size="28" color="#FFFFFF"></uni-icons>
          </view>
          <text class="option-text">复制文字</text>
        </view>
        <view class="option-item" @click="saveImage" v-if="canSaveImage">
          <view class="option-icon" style="background: #FF9500;">
            <uni-icons type="download" size="28" color="#FFFFFF"></uni-icons>
          </view>
          <text class="option-text">保存图片</text>
        </view>
      </view>

      <view class="close-btn" @click="close">
        <text>取消</text>
      </view>
    </view>
  </view>
</template>

<script>
import { StatusConfig } from '@/utils/gameData.js';
import { generateShareText } from '@/utils/backup.js';

export default {
  name: 'ShareCard',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'game' // 'game' 或 'stats'
    },
    game: {
      type: Object,
      default: null
    },
    stats: {
      type: Object,
      default: () => ({
        total: 0,
        completed: 0,
        totalPlayTime: 0
      })
    },
    topGames: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      canSaveImage: false
    };
  },
  watch: {
    visible(val) {
      if (val) {
        // 检查是否支持保存图片
        uni.canIUse('canvasToTempFilePath') && (this.canSaveImage = true);
      }
    }
  },
  methods: {
    close() {
      this.$emit('close');
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

    shareToFriend() {
      // 调用微信小程序分享
      uni.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      });

      uni.showToast({
        title: '请点击右上角分享',
        icon: 'none'
      });
    },

    copyText() {
      let text = '';

      if (this.type === 'game' && this.game) {
        text = `🎮 ${this.game.name}\n`;
        if (this.game.myRating) {
          text += `⭐ 评分：${this.game.myRating}/10\n`;
        }
        text += `📊 状态：${this.getStatusLabel(this.game.myStatus)}\n`;
        if (this.game.myReview) {
          text += `💬 "${this.game.myReview.substring(0, 100)}..."\n`;
        }
        text += `—— 来自游戏时光`;
      } else {
        text = generateShareText();
      }

      uni.setClipboardData({
        data: text,
        success: () => {
          uni.showToast({
            title: '已复制到剪贴板',
            icon: 'success'
          });
          this.close();
        }
      });
    },

    saveImage() {
      uni.showToast({
        title: '图片保存功能开发中',
        icon: 'none'
      });
    }
  }
};
</script>

<style lang="scss">
.share-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.share-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}

.share-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #F5F7FA;
  border-radius: 24rpx 24rpx 0 0;
  padding: 40rpx 30rpx;
  padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
}

/* 分享卡片 */
.share-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  overflow: hidden;
  margin-bottom: 40rpx;
}

.card-header {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background: rgba(255, 255, 255, 0.1);
}

.app-logo {
  width: 60rpx;
  height: 60rpx;
  margin-right: 20rpx;
}

.app-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #FFFFFF;
}

/* 游戏信息 */
.game-section {
  padding: 30rpx;
  display: flex;
  gap: 24rpx;
}

.game-cover {
  width: 200rpx;
  height: 280rpx;
  border-radius: 16rpx;
  flex-shrink: 0;
}

.game-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.game-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #FFFFFF;
  margin-bottom: 16rpx;
}

.game-meta {
  display: flex;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.game-rating {
  font-size: 28rpx;
  color: #F1C40F;
  font-weight: 500;
}

.star {
  font-size: 32rpx;
}

.game-status {
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
}

.game-review {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  font-style: italic;
}

/* 统计信息 */
.stats-section {
  padding: 40rpx 30rpx;
}

.stats-title {
  display: block;
  font-size: 40rpx;
  font-weight: bold;
  color: #FFFFFF;
  text-align: center;
  margin-bottom: 40rpx;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx 20rpx;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16rpx;
}

.stat-number {
  font-size: 48rpx;
  font-weight: bold;
  color: #FFFFFF;
  margin-bottom: 12rpx;
}

.stat-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.top-games {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  padding: 30rpx;
}

.top-title {
  display: block;
  font-size: 28rpx;
  color: #FFFFFF;
  margin-bottom: 20rpx;
  font-weight: 500;
}

.top-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.top-item {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
}

/* 卡片底部 */
.card-footer {
  padding: 30rpx;
  background: rgba(0, 0, 0, 0.2);
  text-align: center;
}

.footer-text {
  display: block;
  font-size: 28rpx;
  color: #FFFFFF;
  margin-bottom: 8rpx;
}

.footer-tip {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.6);
}

/* 分享选项 */
.share-options {
  display: flex;
  justify-content: space-around;
  margin-bottom: 40rpx;
}

.option-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.option-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-text {
  font-size: 26rpx;
  color: #333;
}

/* 关闭按钮 */
.close-btn {
  text-align: center;
  padding: 30rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  margin: 0 20rpx;
}

.close-btn text {
  font-size: 30rpx;
  color: #666;
}
</style>
