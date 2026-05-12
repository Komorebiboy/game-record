<template>
  <view class="container">
    <!-- 返回按钮 -->
    <view class="back-btn" @click="goBack">
      <text class="back-icon">←</text>
    </view>

    <view class="header">
      <text class="header-title">Backups</text>
      <text class="header-count">{{ backups.length }} backups</text>
    </view>

    <view class="create-section">
      <button class="btn-create" @click="createBackup">
        <text class="btn-icon">+</text>
        <text>Create Backup</text>
      </button>
    </view>

    <view class="backups-section">
      <view class="backups-list" v-if="backups.length > 0">
        <view v-for="(backup, index) in backups" :key="index" class="backup-card">
          <view class="backup-info">
            <view class="backup-time">
              <text class="time-icon">📅</text>
              <text>{{ formatTime(backup.backupTime) }}</text>
            </view>
            <view class="backup-stats">
              <text class="stat-item">{{ backup.games.length }} games</text>
              <text class="stat-item">{{ getCompletedCount(backup.games) }} completed</text>
            </view>
          </view>
          <view class="backup-actions">
            <view class="action-btn restore" @click="restoreBackup(index)">
              <text class="action-icon">🔄</text>
              <text>Restore</text>
            </view>
            <view class="action-btn delete" @click="deleteBackup(index)">
              <text class="action-icon">🗑️</text>
              <text>Delete</text>
            </view>
          </view>
        </view>
      </view>

      <view class="empty-section" v-else>
        <text class="empty-icon">📦</text>
        <text class="empty-text">No backups yet</text>
        <text class="empty-subtext">Click above to create backup</text>
      </view>
    </view>
  </view>
</template>

<script>
import { saveBackup, getBackups, restoreFromBackup, deleteBackup } from '@/utils/backup.js';

export default {
  data() {
    return { backups: [] };
  },

  onShow() { this.loadBackups(); },

  methods: {
    loadBackups() { this.backups = getBackups(); },

    formatTime(timeStr) {
      const date = new Date(timeStr);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    },

    getCompletedCount(games) { return games.filter(g => g.myStatus === 'completed').length; },

    createBackup() {
      try { saveBackup(); this.loadBackups(); uni.showToast({ title: 'Backup created', icon: 'success' }); }
      catch (e) { uni.showToast({ title: e.message || 'Failed', icon: 'none' }); }
    },

    restoreBackup(index) {
      uni.showModal({
        title: 'Confirm Restore',
        content: 'Restore will overwrite current data, continue?',
        success: (res) => {
          if (res.confirm) {
            try { restoreFromBackup(index); uni.showToast({ title: 'Restored', icon: 'success' }); }
            catch (e) { uni.showToast({ title: e.message || 'Failed', icon: 'none' }); }
          }
        }
      });
    },

    deleteBackup(index) {
      uni.showModal({
        title: 'Confirm Delete',
        content: 'Delete this backup?',
        confirmColor: '#F44336',
        success: (res) => {
          if (res.confirm) {
            try { deleteBackup(index); this.loadBackups(); uni.showToast({ title: 'Deleted', icon: 'success' }); }
            catch (e) { uni.showToast({ title: e.message || 'Failed', icon: 'none' }); }
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
.container { min-height: 100vh; background: #F5F7FA; padding-bottom: 40rpx; }
.back-btn { position: fixed; top: 40rpx; left: 30rpx; z-index: 100; width: 72rpx; height: 72rpx; background: rgba(0,0,0,0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.back-icon { font-size: 32rpx; color: #FFFFFF; }

.header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 60rpx 40rpx; }
.header-title { display: block; font-size: 44rpx; font-weight: bold; color: #FFFFFF; margin-bottom: 12rpx; }
.header-count { font-size: 26rpx; color: rgba(255, 255, 255, 0.8); }

.create-section { margin: -30rpx 30rpx 30rpx; position: relative; z-index: 10; }
.btn-create { display: flex; align-items: center; justify-content: center; gap: 12rpx; width: 100%; height: 96rpx; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #FFFFFF; border-radius: 48rpx; font-size: 32rpx; font-weight: 500; border: none; box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.4); }
.btn-icon { font-size: 36rpx; font-weight: bold; }

.backups-section { margin: 0 30rpx; }
.backups-list { display: flex; flex-direction: column; gap: 24rpx; }
.backup-card { background: #FFFFFF; border-radius: 20rpx; padding: 30rpx; box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06); }

.backup-info { margin-bottom: 24rpx; padding-bottom: 24rpx; border-bottom: 1rpx solid #F0F0F0; }
.backup-time { display: flex; align-items: center; gap: 12rpx; margin-bottom: 16rpx; }
.time-icon { font-size: 28rpx; }
.backup-time text:last-child { font-size: 32rpx; font-weight: bold; color: #333; }
.backup-stats { display: flex; gap: 24rpx; }
.stat-item { font-size: 26rpx; color: #666; background: #F5F7FA; padding: 8rpx 20rpx; border-radius: 8rpx; }

.backup-actions { display: flex; gap: 20rpx; }
.action-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8rpx; padding: 20rpx; border-radius: 12rpx; font-size: 28rpx; }
.action-btn.restore { background: #E8F5E9; color: #4CAF50; }
.action-btn.delete { background: #FFEBEE; color: #F44336; }
.action-icon { font-size: 28rpx; }

.empty-section { display: flex; flex-direction: column; align-items: center; padding: 120rpx 60rpx; }
.empty-icon { font-size: 100rpx; margin-bottom: 30rpx; }
.empty-text { font-size: 32rpx; color: #666; margin-bottom: 16rpx; }
.empty-subtext { font-size: 26rpx; color: #999; }
</style>
