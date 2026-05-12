<template>
  <view class="container">
    <!-- 游戏封面区 -->
    <view class="header-section">
      <image class="cover-image" :src="game.cover" mode="aspectFill" />
      <view class="cover-overlay"></view>
      <view class="header-content">
        <view class="game-basic">
          <text class="game-name">{{ game.name }}</text>
          <text class="game-name-en">{{ game.nameEn }}</text>
          <view class="game-platforms">
            <text 
              v-for="platform in game.platforms" 
              :key="platform"
              class="platform-badge"
            >
              {{ getPlatformIcon(platform) }} {{ getPlatformName(platform) }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-bar">
      <view class="action-btn" @click="toggleFavorite">
        <text :class="['action-icon', { active: game.isFavorite }]">★</text>
        <text class="action-text">{{ game.isFavorite ? '已收藏' : '收藏' }}</text>
      </view>
      <view class="action-btn" @click="showShareModal">
        <text class="action-icon">↗</text>
        <text class="action-text">分享</text>
      </view>
      <view class="action-btn" @click="showEditModal">
        <text class="action-icon">✎</text>
        <text class="action-text">编辑</text>
      </view>
      <view class="action-btn" @click="confirmDelete">
        <text class="action-icon">🗑</text>
        <text class="action-text">删除</text>
      </view>
    </view>

    <!-- 游戏信息卡片 -->
    <view class="info-section">
      <view class="info-grid">
        <view class="info-item">
          <text class="info-label">状态</text>
          <text class="info-value status" :style="getStatusStyle(game.myStatus)">
            {{ getStatusLabel(game.myStatus) }}
          </text>
        </view>
        <view class="info-item">
          <text class="info-label">评分</text>
          <text class="info-value rating">
            <text v-if="game.myRating" class="star">★</text>
            {{ game.myRating || '未评分' }}
          </text>
        </view>
        <view class="info-item">
          <text class="info-label">游戏时长</text>
          <text class="info-value">{{ game.playTime || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">开发商</text>
          <text class="info-value">{{ game.developer }}</text>
        </view>
      </view>
      
      <view class="info-row">
        <text class="info-label">类型</text>
        <view class="genre-list">
          <text v-for="genre in game.genres" :key="genre" class="genre-tag">{{ genre }}</text>
        </view>
      </view>
      
      <view class="info-row">
        <text class="info-label">发行日期</text>
        <text class="info-value">{{ game.releaseDate }}</text>
      </view>
      
      <view class="info-row" v-if="game.startDate">
        <text class="info-label">开始日期</text>
        <text class="info-value">{{ game.startDate }}</text>
      </view>
      
      <view class="info-row" v-if="game.completeDate">
        <text class="info-label">通关日期</text>
        <text class="info-value">{{ game.completeDate }}</text>
      </view>
    </view>

    <!-- 个人评价 -->
    <view class="review-section" v-if="game.myReview">
      <view class="section-header">
        <text class="section-title">我的评价</text>
      </view>
      <view class="review-content">
        <text class="review-text">{{ game.myReview }}</text>
      </view>
    </view>

    <!-- 游戏简介 -->
    <view class="description-section" v-if="game.description">
      <view class="section-header">
        <text class="section-title">游戏简介</text>
      </view>
      <view class="description-content">
        <text class="description-text">{{ game.description }}</text>
      </view>
    </view>

    <!-- 攻略心得 -->
    <view class="guides-section">
      <view class="section-header">
        <text class="section-title">攻略心得</text>
        <text class="add-guide-btn" @click="showAddGuideModal">+ 添加</text>
      </view>
      
      <view class="guides-list" v-if="game.guides && game.guides.length > 0">
        <view 
          v-for="guide in game.guides" 
          :key="guide.id"
          class="guide-card"
          @click="viewGuide(guide)"
        >
          <view class="guide-header">
            <text class="guide-title">{{ guide.title }}</text>
            <view class="guide-actions">
              <text class="guide-action" @click.stop="editGuide(guide)">编辑</text>
              <text class="guide-action delete" @click.stop="deleteGuide(guide.id)">删除</text>
            </view>
          </view>
          <text class="guide-preview">{{ getGuidePreview(guide.content) }}</text>
          <view class="guide-meta">
            <text class="guide-date">{{ guide.updateTime }}</text>
          </view>
        </view>
      </view>
      
      <view class="empty-guides" v-else>
        <text class="empty-icon">📝</text>
        <text class="empty-text">还没有攻略心得</text>
        <text class="empty-subtext">点击右上角添加你的第一篇攻略</text>
      </view>
    </view>

    <!-- 编辑游戏弹窗 -->
    <uni-popup ref="editPopup" type="bottom">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">编辑游戏</text>
          <text class="popup-close" @click="closeEditModal">✕</text>
        </view>
        <scroll-view scroll-y class="popup-body">
          <view class="form-group">
            <text class="form-label">游戏状态</text>
            <view class="status-options">
              <view 
                v-for="(config, status) in StatusConfig" 
                :key="status"
                class="status-option"
                :class="{ active: editForm.myStatus === status }"
                :style="editForm.myStatus === status ? `background: ${config.bgColor}; color: ${config.color}; border-color: ${config.color};` : ''"
                @click="editForm.myStatus = status"
              >
                {{ config.label }}
              </view>
            </view>
          </view>
          
          <view class="form-group">
            <text class="form-label">评分 (1-10)</text>
            <slider 
              :value="editForm.myRating" 
              @change="onRatingChange" 
              min="0" 
              max="10" 
              step="1"
              show-value
              activeColor="#667eea"
            />
          </view>
          
          <view class="form-group">
            <text class="form-label">游戏时长</text>
            <input 
              class="form-input" 
              v-model="editForm.playTime" 
              placeholder="例如：50小时"
            />
          </view>
          
          <view class="form-group">
            <text class="form-label">开始日期</text>
            <picker mode="date" :value="editForm.startDate" @change="onStartDateChange">
              <view class="form-picker">{{ editForm.startDate || '选择日期' }}</view>
            </picker>
          </view>
          
          <view class="form-group">
            <text class="form-label">通关日期</text>
            <picker mode="date" :value="editForm.completeDate" @change="onCompleteDateChange">
              <view class="form-picker">{{ editForm.completeDate || '选择日期' }}</view>
            </picker>
          </view>
          
          <view class="form-group">
            <text class="form-label">我的评价</text>
            <textarea 
              class="form-textarea" 
              v-model="editForm.myReview" 
              placeholder="写下你对这款游戏的评价..."
              maxlength="500"
            />
            <text class="char-count">{{ editForm.myReview.length }}/500</text>
          </view>
        </scroll-view>
        <view class="popup-footer">
          <button class="btn-cancel" @click="closeEditModal">取消</button>
          <button class="btn-confirm" @click="saveGame">保存</button>
        </view>
      </view>
    </uni-popup>

    <!-- 添加/编辑攻略弹窗 -->
    <uni-popup ref="guidePopup" type="center">
      <view class="guide-popup-content">
        <view class="popup-header">
          <text class="popup-title">{{ isEditingGuide ? '编辑攻略' : '添加攻略' }}</text>
          <text class="popup-close" @click="closeGuideModal">✕</text>
        </view>
        <view class="popup-body">
          <view class="form-group">
            <text class="form-label">标题</text>
            <input 
              class="form-input" 
              v-model="guideForm.title" 
              placeholder="输入攻略标题"
              maxlength="50"
            />
          </view>
          <view class="form-group">
            <text class="form-label">内容</text>
            <textarea 
              class="form-textarea guide-textarea" 
              v-model="guideForm.content" 
              placeholder="写下你的攻略心得..."
              maxlength="2000"
            />
            <text class="char-count">{{ guideForm.content.length }}/2000</text>
          </view>
        </view>
        <view class="popup-footer">
          <button class="btn-cancel" @click="closeGuideModal">取消</button>
          <button class="btn-confirm" @click="saveGuide">保存</button>
        </view>
      </view>
    </uni-popup>

    <!-- 查看攻略弹窗 -->
    <uni-popup ref="viewGuidePopup" type="center">
      <view class="view-guide-content" v-if="currentGuide">
        <view class="popup-header">
          <text class="popup-title">{{ currentGuide.title }}</text>
          <text class="popup-close" @click="closeViewGuide">✕</text>
        </view>
        <scroll-view scroll-y class="guide-detail-body">
          <text class="guide-detail-text">{{ currentGuide.content }}</text>
          <view class="guide-detail-meta">
            <text>创建于：{{ currentGuide.createTime }}</text>
            <text>更新于：{{ currentGuide.updateTime }}</text>
          </view>
        </scroll-view>
      </view>
    </uni-popup>

    <!-- 分享弹窗 -->
    <share-card
      :visible="showShare"
      type="game"
      :game="game"
      @close="closeShareModal"
    />
  </view>
</template>

<script>
import { 
  getGameById, 
  updateGame, 
  deleteGame, 
  toggleFavorite,
  addGuide,
  updateGuide,
  deleteGuide,
  StatusConfig,
  Platforms 
} from '@/utils/gameData.js';

export default {
  data() {
    return {
      gameId: '',
      game: {
        id: '',
        name: '',
        nameEn: '',
        cover: '',
        platforms: [],
        genres: [],
        developer: '',
        releaseDate: '',
        description: '',
        myStatus: '',
        myRating: 0,
        myReview: '',
        startDate: '',
        completeDate: '',
        playTime: '',
        isFavorite: false,
        guides: []
      },
      StatusConfig,
      Platforms,
      editForm: {
        myStatus: '',
        myRating: 0,
        myReview: '',
        startDate: '',
        completeDate: '',
        playTime: ''
      },
      guideForm: {
        id: '',
        title: '',
        content: ''
      },
      isEditingGuide: false,
      currentGuide: null,
      showShare: false
    };
  },
  
  onLoad(options) {
    if (options.id) {
      this.gameId = options.id;
      this.loadGame();
    }
  },
  
  onShow() {
    if (this.gameId) {
      this.loadGame();
    }
  },
  
  methods: {
    loadGame() {
      const game = getGameById(this.gameId);
      if (game) {
        this.game = { ...game };
      } else {
        uni.showToast({
          title: '游戏不存在',
          icon: 'none'
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }
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
    
    getPlatformName(platformId) {
      const platform = Platforms.find(p => p.id === platformId);
      return platform ? platform.name : platformId;
    },
    
    getGuidePreview(content) {
      if (!content) return '';
      return content.length > 60 ? content.substring(0, 60) + '...' : content;
    },
    
    toggleFavorite() {
      const isFavorite = toggleFavorite(this.gameId);
      this.game.isFavorite = isFavorite;
      uni.showToast({
        title: isFavorite ? '已收藏' : '已取消收藏',
        icon: 'none'
      });
    },
    
    showEditModal() {
      this.editForm = {
        myStatus: this.game.myStatus,
        myRating: this.game.myRating || 0,
        myReview: this.game.myReview || '',
        startDate: this.game.startDate || '',
        completeDate: this.game.completeDate || '',
        playTime: this.game.playTime || ''
      };
      this.$refs.editPopup.open();
    },
    
    closeEditModal() {
      this.$refs.editPopup.close();
    },
    
    onRatingChange(e) {
      this.editForm.myRating = e.detail.value;
    },
    
    onStartDateChange(e) {
      this.editForm.startDate = e.detail.value;
    },
    
    onCompleteDateChange(e) {
      this.editForm.completeDate = e.detail.value;
    },
    
    saveGame() {
      updateGame(this.gameId, {
        myStatus: this.editForm.myStatus,
        myRating: this.editForm.myRating,
        myReview: this.editForm.myReview,
        startDate: this.editForm.startDate,
        completeDate: this.editForm.completeDate,
        playTime: this.editForm.playTime
      });
      this.loadGame();
      this.closeEditModal();
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      });
    },
    
    confirmDelete() {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这款游戏吗？相关攻略也会被删除。',
        confirmColor: '#E74C3C',
        success: (res) => {
          if (res.confirm) {
            deleteGame(this.gameId);
            uni.showToast({
              title: '删除成功',
              icon: 'success'
            });
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          }
        }
      });
    },

    showShareModal() {
      this.showShare = true;
    },

    closeShareModal() {
      this.showShare = false;
    },
    
    showAddGuideModal() {
      this.isEditingGuide = false;
      this.guideForm = {
        id: '',
        title: '',
        content: ''
      };
      this.$refs.guidePopup.open();
    },
    
    editGuide(guide) {
      this.isEditingGuide = true;
      this.guideForm = {
        id: guide.id,
        title: guide.title,
        content: guide.content
      };
      this.$refs.guidePopup.open();
    },
    
    closeGuideModal() {
      this.$refs.guidePopup.close();
    },
    
    saveGuide() {
      if (!this.guideForm.title.trim()) {
        uni.showToast({
          title: '请输入标题',
          icon: 'none'
        });
        return;
      }
      if (!this.guideForm.content.trim()) {
        uni.showToast({
          title: '请输入内容',
          icon: 'none'
        });
        return;
      }
      
      if (this.isEditingGuide) {
        updateGuide(this.gameId, this.guideForm.id, {
          title: this.guideForm.title,
          content: this.guideForm.content
        });
      } else {
        addGuide(this.gameId, {
          title: this.guideForm.title,
          content: this.guideForm.content
        });
      }
      
      this.loadGame();
      this.closeGuideModal();
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      });
    },
    
    deleteGuide(guideId) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这篇攻略吗？',
        confirmColor: '#E74C3C',
        success: (res) => {
          if (res.confirm) {
            deleteGuide(this.gameId, guideId);
            this.loadGame();
            uni.showToast({
              title: '删除成功',
              icon: 'success'
            });
          }
        }
      });
    },
    
    viewGuide(guide) {
      this.currentGuide = guide;
      this.$refs.viewGuidePopup.open();
    },
    
    closeViewGuide() {
      this.$refs.viewGuidePopup.close();
      this.currentGuide = null;
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

/* 头部区域 */
.header-section {
  position: relative;
  height: 500rpx;
}

.cover-image {
  width: 100%;
  height: 100%;
}

.cover-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 300rpx;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
}

.header-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40rpx;
}

.game-basic {
  color: #FFFFFF;
}

.game-name {
  display: block;
  font-size: 44rpx;
  font-weight: bold;
  margin-bottom: 12rpx;
}

.game-name-en {
  display: block;
  font-size: 26rpx;
  color: rgba(255,255,255,0.7);
  margin-bottom: 20rpx;
}

.game-platforms {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.platform-badge {
  padding: 8rpx 20rpx;
  background: rgba(255,255,255,0.2);
  border-radius: 24rpx;
  font-size: 24rpx;
}

/* 操作栏 */
.action-bar {
  display: flex;
  justify-content: space-around;
  padding: 30rpx;
  background: #FFFFFF;
  margin: -40rpx 30rpx 30rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.08);
  position: relative;
  z-index: 10;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 40rpx;
}

.action-icon {
  font-size: 40rpx;
  margin-bottom: 12rpx;
  color: #999;
}

.action-icon.active {
  color: #E74C3C;
}

.action-text {
  font-size: 24rpx;
  color: #666;
}

/* 信息区域 */
.info-section {
  margin: 0 30rpx 30rpx;
  padding: 30rpx;
  background: #FFFFFF;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
  padding-bottom: 30rpx;
  border-bottom: 1rpx solid #F0F0F0;
  margin-bottom: 30rpx;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-label {
  font-size: 22rpx;
  color: #999;
  margin-bottom: 12rpx;
}

.info-value {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
}

.info-value.status {
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
}

.info-value.rating {
  color: #F39C12;
}

.star {
  font-size: 26rpx;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-row .info-label {
  width: 140rpx;
  margin-bottom: 0;
  flex-shrink: 0;
}

.genre-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.genre-tag {
  padding: 8rpx 20rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
  font-size: 24rpx;
  color: #666;
}

/* 评价区域 */
.review-section,
.description-section,
.guides-section {
  margin: 0 30rpx 30rpx;
  padding: 30rpx;
  background: #FFFFFF;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
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

.add-guide-btn {
  padding: 12rpx 24rpx;
  background: #667eea;
  color: #FFFFFF;
  border-radius: 28rpx;
  font-size: 26rpx;
}

.review-content,
.description-content {
  background: #F8F9FA;
  border-radius: 16rpx;
  padding: 24rpx;
}

.review-text,
.description-text {
  font-size: 28rpx;
  color: #555;
  line-height: 1.8;
}

/* 攻略列表 */
.guides-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.guide-card {
  background: #F8F9FA;
  border-radius: 16rpx;
  padding: 24rpx;
}

.guide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.guide-title {
  flex: 1;
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
  margin-right: 20rpx;
}

.guide-actions {
  display: flex;
  gap: 20rpx;
}

.guide-action {
  font-size: 24rpx;
  color: #667eea;
}

.guide-action.delete {
  color: #E74C3C;
}

.guide-preview {
  display: block;
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 16rpx;
}

.guide-meta {
  display: flex;
  justify-content: flex-end;
}

.guide-date {
  font-size: 22rpx;
  color: #999;
}

/* 空状态 */
.empty-guides {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 40rpx;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 30rpx;
  color: #666;
  margin-bottom: 12rpx;
}

.empty-subtext {
  font-size: 24rpx;
  color: #999;
}

/* 弹窗样式 */
.popup-content {
  background: #FFFFFF;
  border-radius: 24rpx 24rpx 0 0;
  max-height: 80vh;
}

.guide-popup-content,
.view-guide-content {
  background: #FFFFFF;
  border-radius: 24rpx;
  width: 680rpx;
  max-height: 80vh;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.popup-close {
  font-size: 36rpx;
  color: #999;
  padding: 10rpx;
}

.popup-body {
  padding: 30rpx;
  max-height: 60vh;
}

.form-group {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
  font-weight: 500;
}

.status-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.status-option {
  padding: 16rpx 32rpx;
  background: #F5F7FA;
  border: 2rpx solid transparent;
  border-radius: 12rpx;
  font-size: 26rpx;
  color: #666;
}

.form-input {
  padding: 20rpx 24rpx;
  background: #F5F7FA;
  border-radius: 12rpx;
  font-size: 28rpx;
}

.form-picker {
  padding: 20rpx 24rpx;
  background: #F5F7FA;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #333;
}

.form-textarea {
  width: 100%;
  height: 200rpx;
  padding: 20rpx 24rpx;
  background: #F5F7FA;
  border-radius: 12rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.form-textarea.guide-textarea {
  height: 400rpx;
}

.char-count {
  display: block;
  text-align: right;
  font-size: 22rpx;
  color: #999;
  margin-top: 12rpx;
}

.popup-footer {
  display: flex;
  gap: 20rpx;
  padding: 20rpx 30rpx 40rpx;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  font-size: 30rpx;
  border: none;
}

.btn-cancel {
  background: #F5F7FA;
  color: #666;
}

.btn-confirm {
  background: #667eea;
  color: #FFFFFF;
}

/* 攻略详情 */
.guide-detail-body {
  padding: 30rpx;
  max-height: 60vh;
}

.guide-detail-text {
  display: block;
  font-size: 28rpx;
  color: #333;
  line-height: 1.8;
  white-space: pre-wrap;
  margin-bottom: 40rpx;
}

.guide-detail-meta {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding-top: 30rpx;
  border-top: 1rpx solid #F0F0F0;
}

.guide-detail-meta text {
  font-size: 24rpx;
  color: #999;
}
</style>
