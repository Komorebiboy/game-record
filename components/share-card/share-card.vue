<template>
  <view class="share-modal" v-if="visible">
    <view class="modal-overlay" @click="handleClose"></view>
    <view class="modal-content">
      <view class="modal-header">
        <text class="modal-title">Share</text>
        <text class="modal-close" @click="handleClose">✕</text>
      </view>
      <view class="modal-body">
        <view class="share-info">
          <text class="share-title">Game Records</text>
          <text class="share-desc">Share your game collection</text>
        </view>
        <view class="share-actions">
          <view class="action-item" @click="shareToChat">
            <view class="action-icon-wrap chat">
              <text class="action-icon">💬</text>
            </view>
            <text class="action-text">Chat</text>
          </view>
          <view class="action-item" @click="shareToMoment">
            <view class="action-icon-wrap moment">
              <text class="action-icon">✏️</text>
            </view>
            <text class="action-text">Moment</text>
          </view>
          <view class="action-item" @click="copyLink">
            <view class="action-icon-wrap link">
              <text class="action-icon">⬇️</text>
            </view>
            <text class="action-text">Copy</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ShareCard',
  props: {
    visible: { type: Boolean, default: false },
    type: { type: String, default: 'game' },
    game: { type: Object, default: null }
  },

  methods: {
    handleClose() { this.$emit('close'); },

    shareToChat() {
      uni.showToast({ title: 'Share to chat', icon: 'none' });
      this.handleClose();
    },

    shareToMoment() {
      uni.showToast({ title: 'Share to moment', icon: 'none' });
      this.handleClose();
    },

    copyLink() {
      const text = this.game ? `Game: ${this.game.name}\n${this.game.nameEn}` : 'My Game Records';
      uni.setClipboardData({
        data: text,
        success: () => {
          uni.showToast({ title: 'Copied', icon: 'success' });
          this.handleClose();
        }
      });
    }
  }
};
</script>

<style lang="scss">
.share-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; }
.modal-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); }
.modal-content { position: relative; background: #FFFFFF; border-radius: 24rpx; width: 600rpx; padding-bottom: 40rpx; }

.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 30rpx; border-bottom: 1rpx solid #F0F0F0; }
.modal-title { font-size: 32rpx; font-weight: bold; color: #333; }
.modal-close { font-size: 36rpx; color: #999; }

.modal-body { padding: 30rpx; }
.share-info { text-align: center; margin-bottom: 40rpx; }
.share-title { display: block; font-size: 36rpx; font-weight: bold; color: #333; margin-bottom: 12rpx; }
.share-desc { font-size: 26rpx; color: #999; }

.share-actions { display: flex; justify-content: space-around; }
.action-item { display: flex; flex-direction: column; align-items: center; gap: 16rpx; }
.action-icon-wrap { width: 100rpx; height: 100rpx; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.action-icon-wrap.chat { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.action-icon-wrap.moment { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.action-icon-wrap.link { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.action-icon { font-size: 40rpx; color: #FFFFFF; }
.action-text { font-size: 26rpx; color: #666; }
</style>
