<template>
  <view class="container">
    <!-- 头部 -->
    <view class="header">
      <text class="header-title">本地备份</text>
      <text class="header-count">{{ backups.length }} 个备份</text>
    </view>

    <!-- 新建备份按钮 -->
    <view class="create-section">
      <button class="btn-create" @click="createBackup">
        <uni-icons type="plus" size="18" color="#FFFFFF"></uni-icons>
        <text>新建备份</text>
      </button>
    </view>

    <!-- 备份列表 -->
    <view class="backups-section">
      <view class="backups-list" v-if="backups.length > 0">
        <view
          v-for="(backup, index) in backups"
          :key="index"
          class="backup-card"
        >
          <view class="backup-info">
            <view class="backup-time">
              <uni-icons type="calendar" size="16" color="#667eea"></uni-icons>
              <text>{{ formatTime(backup.backupTime) }}</text>
            </view>
            <view class="backup-stats">
              <text class="stat-item">{{ backup.games.length }} 款游戏</text>
              <text class="stat-item">{{ getCompletedCount(backup.games) }} 已通关</text>
            </view>
          </view>
          <view class="backup-actions">
            <view class="action-btn restore" @click="restoreBackup(index)">
              <uni-icons type="refresh" size="16" color="#4CAF50"></uni-icons>
              <text>恢复</text>
            </view>
            <view class="action-btn delete" @click="deleteBackup(index)">
              <uni-icons type="trash" size="16" color="#F44336"></uni-icons>
              <text>删除</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-section" v-else>
        <text class="empty-icon">📦</text>
        <text class="empty-text">还没有备份</text>
        <text class="empty-subtext">点击上方按钮创建备份</text>
      </view>
    </view>
  </view>
</template>

<script>
import {
  saveBackup,
  getBackups,
  restoreFromBackup,
  deleteBackup
} from '@/utils/backup.js';

export default {
  data() {
    return {
      backups: []
    };
  },

  onShow() {
    this.loadBackups();
  },

  methods: {
    loadBackups() {
      this.backups = getBackups();
    },

    formatTime(timeStr) {
      const date = new Date(timeStr);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    },

    getCompletedCount(games) {
      return games.filter(g => g.myStatus === 'completed').length;
    },

    createBackup() {
      try {
        saveBackup();
        this.loadBackups();
        uni.showToast({
          title: '备份成功',
          icon: 'success'
        });
      } catch (e) {
        uni.showToast({
          title: e.message || '备份失败',
          icon: 'none'
        });
      }
    },

    restoreBackup(index) {
      uni.showModal({
        title: '确认恢复',
        content: '恢复将覆盖当前所有数据，是否继续？',
        success: (res) => {
          if (res.confirm) {
            try {
              restoreFromBackup(index);
              uni.showToast({
                title: '恢复成功',
                icon: 'success'
              });
            } catch (e) {
              uni.showToast({
                title: e.message || '恢复失败',
                icon: 'none'
              });
            }
          }
        }
      });
    },

    deleteBackup(index) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个备份吗？',
        confirmColor: '#F44336',
        success: (res) => {
          if (res.confirm) {
            try {
              deleteBackup(index);
              this.loadBackups();
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              });
            } catch (e) {
              uni.showToast({
                title: e.message || '删除失败',
                icon: 'none'
              });
            }
          }
        }
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

.header-count {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

/* 创建备份 */
.create-section {
  margin: -30rpx 30rpx 30rpx;
  position: relative;
  z-index: 10;
}

.btn-create {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #FFFFFF;
  border-radius: 48rpx;
  font-size: 32rpx;
  font-weight: 500;
  border: none;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.4);
}

/* 备份列表 */
.backups-section {
  margin: 0 30rpx;
}

.backups-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.backup-card {
  background: #FFFFFF;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.backup-info {
  margin-bottom: 24rpx;
  padding-bottom: 24rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.backup-time {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.backup-time text {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.backup-stats {
  display: flex;
  gap: 24rpx;
}

.stat-item {
  font-size: 26rpx;
  color: #666;
  background: #F5F7FA;
  padding: 8rpx 20rpx;
  border-radius: 8rpx;
}

.backup-actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 20rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
}

.action-btn.restore {
  background: #E8F5E9;
  color: #4CAF50;
}

.action-btn.delete {
  background: #FFEBEE;
  color: #F44336;
}

/* 空状态 */
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
</style>
