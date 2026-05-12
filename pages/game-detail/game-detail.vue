<template>
  <view class="container">
    <!-- 返回按钮 -->
    <view class="back-btn" @click="goBack">
      <text class="back-icon">←</text>
    </view>

    <view class="header-section">
      <image class="cover-image" :src="game.cover" mode="aspectFill" />
      <view class="cover-overlay"></view>
      <view class="header-content">
        <text class="game-name">{{ game.name }}</text>
        <text class="game-name-en">{{ game.nameEn }}</text>
      </view>
    </view>

    <view class="action-bar">
      <view class="action-btn" @click="toggleFavorite">
        <text :class="['action-icon', { active: game.isFavorite }]">★</text>
        <text class="action-text">{{ game.isFavorite ? 'collected' : 'collect' }}</text>
      </view>
      <view class="action-btn" @click="showEditModal">
        <text class="action-icon">✎</text>
        <text class="action-text">edit</text>
      </view>
      <view class="action-btn" @click="confirmDelete">
        <text class="action-icon">🗑</text>
        <text class="action-text">delete</text>
      </view>
    </view>

    <view class="info-section">
      <view class="info-grid">
        <view class="info-item">
          <text class="info-label">status</text>
          <text class="info-value" :style="getStatusStyle(game.myStatus)">
            {{ getStatusLabel(game.myStatus) }}
          </text>
        </view>
        <view class="info-item">
          <text class="info-label">rating</text>
          <text class="info-value">{{ game.myRating || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">play time</text>
          <text class="info-value">{{ game.playTime || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">platform</text>
          <text class="info-value">{{ getPlatformNames(game.platforms) }}</text>
        </view>
      </view>

      <view class="info-row">
        <text class="info-label">developer</text>
        <text class="info-value">{{ game.developer }}</text>
      </view>

      <view class="info-row">
        <text class="info-label">release</text>
        <text class="info-value">{{ game.releaseDate }}</text>
      </view>
    </view>

    <view class="description-section" v-if="game.description">
      <text class="section-title">description</text>
      <text class="description-text">{{ game.description }}</text>
    </view>

    <view class="modal-overlay" v-if="showEdit" @click="showEdit = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">edit game</text>
          <text class="modal-close" @click="showEdit = false">✕</text>
        </view>
        <view class="modal-body">
          <view class="form-group">
            <text class="form-label">rating</text>
            <input class="form-input" v-model="editForm.rating" type="number" placeholder="1-10" />
          </view>
          <view class="form-group">
            <text class="form-label">play time</text>
            <input class="form-input" v-model="editForm.playTime" placeholder="e.g. 50 hours" />
          </view>
        </view>
        <view class="modal-footer">
          <button class="btn-cancel" @click="showEdit = false">cancel</button>
          <button class="btn-confirm" @click="saveEdit">save</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getGameById, updateGame, deleteGame, toggleFavorite, StatusConfig, Platforms } from '@/utils/gameData.js';

export default {
  data() {
    return {
      gameId: '',
      game: {
        id: '', name: '', nameEn: '', cover: '', platforms: [], developer: '', 
        releaseDate: '', description: '', myStatus: '', myRating: 0, 
        playTime: '', isFavorite: false
      },
      showEdit: false,
      editForm: { rating: '', playTime: '' }
    };
  },

  onLoad(options) {
    if (options && options.id) {
      this.gameId = options.id;
      this.loadGame();
    }
  },

  methods: {
    loadGame() {
      const game = getGameById(this.gameId);
      if (game) {
        this.game = { ...game };
      } else {
        uni.showToast({ title: 'game not found', icon: 'none' });
        setTimeout(() => { uni.navigateBack(); }, 1500);
      }
    },

    getStatusLabel(status) {
      return StatusConfig[status]?.label || status;
    },

    getStatusStyle(status) {
      const config = StatusConfig[status];
      if (config) {
        return `color: ${config.color}; background: ${config.bgColor}; padding: 6rpx 16rpx; border-radius: 8rpx;`;
      }
      return '';
    },

    getPlatformNames(platformIds) {
      return platformIds.map(id => {
        const platform = Platforms.find(p => p.id === id);
        return platform ? platform.name : id;
      }).join(', ');
    },

    toggleFavorite() {
      const isFavorite = toggleFavorite(this.gameId);
      this.game.isFavorite = isFavorite;
      uni.showToast({ title: isFavorite ? 'collected' : 'uncollected', icon: 'none' });
    },

    showEditModal() {
      this.editForm = {
        rating: String(this.game.myRating || ''),
        playTime: this.game.playTime || ''
      };
      this.showEdit = true;
    },

    saveEdit() {
      updateGame(this.gameId, {
        myRating: parseInt(this.editForm.rating) || 0,
        playTime: this.editForm.playTime
      });
      this.loadGame();
      this.showEdit = false;
      uni.showToast({ title: 'saved', icon: 'success' });
    },

    confirmDelete() {
      uni.showModal({
        title: 'confirm delete',
        content: 'delete this game?',
        confirmColor: '#E74C3C',
        success: (res) => {
          if (res.confirm) {
            deleteGame(this.gameId);
            uni.showToast({ title: 'deleted', icon: 'success' });
            setTimeout(() => { uni.navigateBack(); }, 1500);
          }
        }
      });
    },

    goBack() {
      uni.navigateBack();
    }
  }
};
</script>

<style lang="scss">
.container { min-height: 100vh; background: #F5F7FA; }
.back-btn { position: fixed; top: 40rpx; left: 30rpx; z-index: 100; width: 72rpx; height: 72rpx; background: rgba(0,0,0,0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.back-icon { font-size: 32rpx; color: #FFFFFF; }
.header-section { position: relative; height: 400rpx; }
.cover-image { width: 100%; height: 100%; }
.cover-overlay { position: absolute; bottom: 0; left: 0; right: 0; height: 200rpx; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); }
.header-content { position: absolute; bottom: 30rpx; left: 30rpx; }
.game-name { display: block; font-size: 40rpx; font-weight: bold; color: #FFFFFF; margin-bottom: 8rpx; }
.game-name-en { font-size: 24rpx; color: rgba(255,255,255,0.7); }

.action-bar { display: flex; justify-content: space-around; padding: 20rpx 30rpx; background: #FFFFFF; margin: -20rpx 30rpx 20rpx; border-radius: 16rpx; box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06); }
.action-btn { display: flex; flex-direction: column; align-items: center; padding: 16rpx 32rpx; }
.action-icon { font-size: 36rpx; margin-bottom: 8rpx; color: #999; }
.action-icon.active { color: #E74C3C; }
.action-text { font-size: 22rpx; color: #666; }

.info-section { margin: 0 30rpx 20rpx; padding: 24rpx; background: #FFFFFF; border-radius: 16rpx; }
.info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16rpx; margin-bottom: 20rpx; }
.info-item { display: flex; flex-direction: column; align-items: center; }
.info-label { font-size: 20rpx; color: #999; margin-bottom: 8rpx; }
.info-value { font-size: 26rpx; color: #333; }

.info-row { display: flex; justify-content: space-between; align-items: center; padding: 12rpx 0; border-top: 1rpx solid #F5F5F5; }
.info-row .info-label { margin-bottom: 0; }

.description-section { margin: 0 30rpx 20rpx; padding: 24rpx; background: #FFFFFF; border-radius: 16rpx; }
.section-title { display: block; font-size: 28rpx; font-weight: bold; color: #333; margin-bottom: 16rpx; }
.description-text { font-size: 26rpx; color: #666; line-height: 1.6; }

.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: #FFFFFF; border-radius: 20rpx; width: 600rpx; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 24rpx; border-bottom: 1rpx solid #F0F0F0; }
.modal-title { font-size: 30rpx; font-weight: bold; color: #333; }
.modal-close { font-size: 32rpx; color: #999; }
.modal-body { padding: 24rpx; }

.form-group { margin-bottom: 24rpx; }
.form-label { display: block; font-size: 26rpx; color: #333; margin-bottom: 12rpx; }
.form-input { width: 100%; padding: 16rpx; background: #F5F7FA; border-radius: 12rpx; font-size: 26rpx; box-sizing: border-box; }

.modal-footer { display: flex; gap: 16rpx; padding: 20rpx 24rpx; }
.btn-cancel, .btn-confirm { flex: 1; height: 72rpx; line-height: 72rpx; border-radius: 36rpx; font-size: 28rpx; border: none; }
.btn-cancel { background: #F5F7FA; color: #666; }
.btn-confirm { background: #667eea; color: #FFFFFF; }
</style>
