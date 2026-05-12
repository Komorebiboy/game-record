<template>
  <view class="container">
    <!-- 返回按钮 -->
    <view class="back-btn" @click="goBack">
      <text class="back-icon">←</text>
    </view>

    <!-- 头部 -->
    <view class="header">
      <text class="header-title">添加游戏</text>
      <text class="header-subtitle">记录一款新游戏到你的库中</text>
    </view>

    <!-- 表单 -->
    <view class="form-section">
      <!-- 封面 -->
      <view class="form-group">
        <text class="form-label">游戏封面</text>
        <view class="cover-uploader" @click="chooseCover">
          <image v-if="form.cover" class="cover-preview" :src="form.cover" mode="aspectFill" />
          <view v-else class="uploader-placeholder">
            <text class="uploader-icon">📷</text>
            <text class="uploader-text">点击添加封面</text>
            <text class="uploader-hint">支持网络图片链接</text>
          </view>
        </view>
        <input 
          v-if="!form.cover"
          class="cover-input" 
          v-model="coverUrl" 
          placeholder="或输入图片链接"
          @confirm="setCoverFromUrl"
        />
      </view>

      <!-- 基本信息 -->
      <view class="form-group">
        <text class="form-label required">游戏名称</text>
        <input 
          class="form-input" 
          v-model="form.name" 
          placeholder="输入游戏名称"
          maxlength="50"
        />
      </view>

      <view class="form-group">
        <text class="form-label">英文名称</text>
        <input 
          class="form-input" 
          v-model="form.nameEn" 
          placeholder="输入英文名称（选填）"
          maxlength="100"
        />
      </view>

      <view class="form-group">
        <text class="form-label required">游戏平台</text>
        <view class="platform-options">
          <view 
            v-for="platform in Platforms" 
            :key="platform.id"
            class="platform-option"
            :class="{ active: form.platforms.includes(platform.id) }"
            :style="form.platforms.includes(platform.id) ? `background: ${platform.color}20; color: ${platform.color}; border-color: ${platform.color};` : ''"
            @click="togglePlatform(platform.id)"
          >
            {{ platform.icon }} {{ platform.name }}
          </view>
        </view>
      </view>

      <view class="form-group">
        <text class="form-label">游戏类型</text>
        <view class="genre-options">
          <view 
            v-for="genre in Genres" 
            :key="genre"
            class="genre-option"
            :class="{ active: form.genres.includes(genre) }"
            @click="toggleGenre(genre)"
          >
            {{ genre }}
          </view>
        </view>
      </view>

      <view class="form-group">
        <text class="form-label">开发商</text>
        <input 
          class="form-input" 
          v-model="form.developer" 
          placeholder="输入开发商名称"
          maxlength="50"
        />
      </view>

      <view class="form-group">
        <text class="form-label">发行日期</text>
        <picker mode="date" :value="form.releaseDate" @change="onReleaseDateChange">
          <view class="form-picker">{{ form.releaseDate || '选择发行日期' }}</view>
        </picker>
      </view>

      <view class="form-group">
        <text class="form-label">游戏简介</text>
        <textarea 
          class="form-textarea" 
          v-model="form.description" 
          placeholder="输入游戏简介（选填）"
          maxlength="500"
        />
        <text class="char-count">{{ form.description.length }}/500</text>
      </view>

      <!-- 个人记录 -->
      <view class="section-divider">
        <text class="divider-text">个人记录</text>
      </view>

      <view class="form-group">
        <text class="form-label required">游戏状态</text>
        <view class="status-options">
          <view 
            v-for="(config, status) in StatusConfig" 
            :key="status"
            class="status-option"
            :class="{ active: form.myStatus === status }"
            :style="form.myStatus === status ? `background: ${config.bgColor}; color: ${config.color}; border-color: ${config.color};` : ''"
            @click="form.myStatus = status"
          >
            {{ config.label }}
          </view>
        </view>
      </view>

      <view class="form-group">
        <text class="form-label">评分 (1-10)</text>
        <view class="rating-section">
          <slider 
            :value="form.myRating" 
            @change="onRatingChange" 
            min="0" 
            max="10" 
            step="1"
            show-value
            activeColor="#667eea"
            block-size="28"
          />
          <view class="rating-display" v-if="form.myRating > 0">
            <text class="rating-stars">{{ getRatingStars(form.myRating) }}</text>
            <text class="rating-number">{{ form.myRating }}分</text>
          </view>
        </view>
      </view>

      <view class="form-group">
        <text class="form-label">游戏时长</text>
        <input 
          class="form-input" 
          v-model="form.playTime" 
          placeholder="例如：50小时"
          maxlength="20"
        />
      </view>

      <view class="form-group">
        <text class="form-label">开始日期</text>
        <picker mode="date" :value="form.startDate" @change="onStartDateChange">
          <view class="form-picker">{{ form.startDate || '选择开始日期' }}</view>
        </picker>
      </view>

      <view class="form-group">
        <text class="form-label">通关日期</text>
        <picker mode="date" :value="form.completeDate" @change="onCompleteDateChange">
          <view class="form-picker">{{ form.completeDate || '选择通关日期' }}</view>
        </picker>
      </view>

      <view class="form-group">
        <text class="form-label">我的评价</text>
        <textarea 
          class="form-textarea" 
          v-model="form.myReview" 
          placeholder="写下你对这款游戏的评价..."
          maxlength="500"
        />
        <text class="char-count">{{ form.myReview.length }}/500</text>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-section">
      <button class="btn-submit" @click="submitForm">添加游戏</button>
      <button class="btn-cancel" @click="goBack">取消</button>
    </view>
  </view>
</template>

<script>
import { addGame, StatusConfig, Platforms, Genres } from '@/utils/gameData.js';

export default {
  data() {
    return {
      StatusConfig,
      Platforms,
      Genres,
      coverUrl: '',
      form: {
        name: '',
        nameEn: '',
        cover: '',
        platforms: [],
        genres: [],
        developer: '',
        releaseDate: '',
        description: '',
        myStatus: 'want_to_play',
        myRating: 0,
        myReview: '',
        startDate: '',
        completeDate: '',
        playTime: ''
      }
    };
  },
  
  methods: {
    chooseCover() {
      uni.showActionSheet({
        itemList: ['从相册选择', '输入图片链接', '使用默认封面'],
        success: (res) => {
          switch (res.tapIndex) {
            case 0:
              this.selectFromAlbum();
              break;
            case 1:
              this.showUrlInput();
              break;
            case 2:
              this.useDefaultCover();
              break;
          }
        }
      });
    },
    
    selectFromAlbum() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          this.form.cover = res.tempFilePaths[0];
        }
      });
    },
    
    showUrlInput() {
      uni.showModal({
        title: '输入图片链接',
        editable: true,
        placeholderText: 'https://...',
        success: (res) => {
          if (res.confirm && res.content) {
            this.form.cover = res.content;
          }
        }
      });
    },
    
    useDefaultCover() {
      const defaultCovers = [
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
        'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400',
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
        'https://images.unsplash.com/photo-1612287230217-969b698c8d13?w=400'
      ];
      this.form.cover = defaultCovers[Math.floor(Math.random() * defaultCovers.length)];
    },
    
    setCoverFromUrl() {
      if (this.coverUrl) {
        this.form.cover = this.coverUrl;
        this.coverUrl = '';
      }
    },
    
    togglePlatform(platformId) {
      const index = this.form.platforms.indexOf(platformId);
      if (index > -1) {
        this.form.platforms.splice(index, 1);
      } else {
        this.form.platforms.push(platformId);
      }
    },
    
    toggleGenre(genre) {
      const index = this.form.genres.indexOf(genre);
      if (index > -1) {
        this.form.genres.splice(index, 1);
      } else {
        this.form.genres.push(genre);
      }
    },
    
    onReleaseDateChange(e) {
      this.form.releaseDate = e.detail.value;
    },
    
    onRatingChange(e) {
      this.form.myRating = e.detail.value;
    },
    
    onStartDateChange(e) {
      this.form.startDate = e.detail.value;
    },
    
    onCompleteDateChange(e) {
      this.form.completeDate = e.detail.value;
    },
    
    getRatingStars(rating) {
      return '★'.repeat(Math.floor(rating / 2)) + (rating % 2 >= 1 ? '☆' : '');
    },
    
    validateForm() {
      if (!this.form.name.trim()) {
        uni.showToast({
          title: '请输入游戏名称',
          icon: 'none'
        });
        return false;
      }
      
      if (this.form.platforms.length === 0) {
        uni.showToast({
          title: '请至少选择一个平台',
          icon: 'none'
        });
        return false;
      }
      
      return true;
    },
    
    submitForm() {
      if (!this.validateForm()) return;
      
      // 如果没有封面，使用默认封面
      if (!this.form.cover) {
        this.useDefaultCover();
      }
      
      const newGame = addGame({
        name: this.form.name.trim(),
        nameEn: this.form.nameEn.trim(),
        cover: this.form.cover,
        platforms: this.form.platforms,
        genres: this.form.genres,
        developer: this.form.developer.trim(),
        releaseDate: this.form.releaseDate,
        description: this.form.description.trim(),
        myStatus: this.form.myStatus,
        myRating: this.form.myRating,
        myReview: this.form.myReview.trim(),
        startDate: this.form.startDate,
        completeDate: this.form.completeDate,
        playTime: this.form.playTime.trim(),
        isFavorite: false
      });
      
      uni.showToast({
        title: '添加成功',
        icon: 'success'
      });
      
      setTimeout(() => {
        uni.navigateTo({
          url: `/pages/game-detail/game-detail?id=${newGame.id}`
        });
      }, 1500);
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
  padding-bottom: 60rpx;
}

.back-btn { position: fixed; top: 40rpx; left: 30rpx; z-index: 100; width: 72rpx; height: 72rpx; background: rgba(0,0,0,0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.back-icon { font-size: 32rpx; color: #FFFFFF; }

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

/* 表单区域 */
.form-section {
  margin: -40rpx 30rpx 30rpx;
  padding: 40rpx 30rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.form-group {
  margin-bottom: 40rpx;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
  font-weight: 500;
}

.form-label.required::after {
  content: '*';
  color: #E74C3C;
  margin-left: 8rpx;
}

/* 封面上传 */
.cover-uploader {
  width: 100%;
  height: 400rpx;
  background: #F5F7FA;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
}

.cover-preview {
  width: 100%;
  height: 100%;
}

.uploader-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.uploader-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.uploader-text {
  font-size: 30rpx;
  color: #666;
  margin-bottom: 12rpx;
}

.uploader-hint {
  font-size: 24rpx;
  color: #999;
}

.cover-input {
  padding: 20rpx 24rpx;
  background: #F5F7FA;
  border-radius: 12rpx;
  font-size: 28rpx;
}

/* 输入框 */
.form-input {
  padding: 24rpx;
  background: #F5F7FA;
  border-radius: 12rpx;
  font-size: 28rpx;
}

.form-picker {
  padding: 24rpx;
  background: #F5F7FA;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #333;
}

.form-textarea {
  width: 100%;
  height: 200rpx;
  padding: 24rpx;
  background: #F5F7FA;
  border-radius: 12rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.char-count {
  display: block;
  text-align: right;
  font-size: 22rpx;
  color: #999;
  margin-top: 12rpx;
}

/* 平台选择 */
.platform-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.platform-option {
  padding: 16rpx 28rpx;
  background: #F5F7FA;
  border: 2rpx solid transparent;
  border-radius: 12rpx;
  font-size: 26rpx;
  color: #666;
}

.platform-option.active {
  border-color: #667eea;
}

/* 类型选择 */
.genre-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.genre-option {
  padding: 12rpx 24rpx;
  background: #F5F7FA;
  border-radius: 28rpx;
  font-size: 24rpx;
  color: #666;
}

.genre-option.active {
  background: #667eea;
  color: #FFFFFF;
}

/* 状态选择 */
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

/* 评分 */
.rating-section {
  background: #F5F7FA;
  border-radius: 12rpx;
  padding: 20rpx 24rpx;
}

.rating-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  margin-top: 16rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #E0E0E0;
}

.rating-stars {
  font-size: 36rpx;
  color: #F39C12;
}

.rating-number {
  font-size: 32rpx;
  font-weight: bold;
  color: #F39C12;
}

/* 分隔线 */
.section-divider {
  display: flex;
  align-items: center;
  margin: 50rpx 0 40rpx;
}

.section-divider::before,
.section-divider::after {
  content: '';
  flex: 1;
  height: 1rpx;
  background: #E0E0E0;
}

.divider-text {
  padding: 0 30rpx;
  font-size: 28rpx;
  color: #999;
  font-weight: 500;
}

/* 提交按钮 */
.submit-section {
  margin: 0 30rpx;
}

.btn-submit {
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #FFFFFF;
  border-radius: 48rpx;
  font-size: 32rpx;
  font-weight: 500;
  border: none;
  margin-bottom: 24rpx;
}

.btn-cancel {
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  background: #F5F7FA;
  color: #666;
  border-radius: 48rpx;
  font-size: 32rpx;
  border: none;
}
</style>
