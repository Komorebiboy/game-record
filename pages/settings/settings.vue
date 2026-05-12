<template>
  <view class="container">
    <!-- 头部 -->
    <view class="header">
      <text class="header-title">设置</text>
      <text class="header-subtitle">数据管理与个性化</text>
    </view>

    <!-- 数据管理 -->
    <view class="section">
      <view class="section-title">数据管理</view>
      <view class="menu-list">
        <view class="menu-item" @click="exportJSON">
          <view class="menu-icon" style="background: #E3F2FD;">
            <uni-icons type="download" size="20" color="#2196F3"></uni-icons>
          </view>
          <view class="menu-content">
            <text class="menu-name">导出JSON</text>
            <text class="menu-desc">导出完整数据备份</text>
          </view>
          <uni-icons type="right" size="16" color="#CCC"></uni-icons>
        </view>

        <view class="menu-item" @click="exportCSV">
          <view class="menu-icon" style="background: #E8F5E9;">
            <uni-icons type="paperclip" size="20" color="#4CAF50"></uni-icons>
          </view>
          <view class="menu-content">
            <text class="menu-name">导出Excel (CSV)</text>
            <text class="menu-desc">导出为表格格式</text>
          </view>
          <uni-icons type="right" size="16" color="#CCC"></uni-icons>
        </view>

        <view class="menu-item" @click="showImportModal">
          <view class="menu-icon" style="background: #FFF3E0;">
            <uni-icons type="upload" size="20" color="#FF9800"></uni-icons>
          </view>
          <view class="menu-content">
            <text class="menu-name">导入数据</text>
            <text class="menu-desc">从JSON文件恢复</text>
          </view>
          <uni-icons type="right" size="16" color="#CCC"></uni-icons>
        </view>

        <view class="menu-item" @click="navigateToBackups">
          <view class="menu-icon" style="background: #F3E5F5;">
            <uni-icons type="folder-add" size="20" color="#9C27B0"></uni-icons>
          </view>
          <view class="menu-content">
            <text class="menu-name">本地备份</text>
            <text class="menu-desc">管理本地备份 ({{ backupCount }}个)</text>
          </view>
          <uni-icons type="right" size="16" color="#CCC"></uni-icons>
        </view>
      </view>
    </view>

    <!-- 分享 -->
    <view class="section">
      <view class="section-title">分享</view>
      <view class="menu-list">
        <view class="menu-item" @click="shareData">
          <view class="menu-icon" style="background: #E8EAF6;">
            <uni-icons type="redo" size="20" color="#667eea"></uni-icons>
          </view>
          <view class="menu-content">
            <text class="menu-name">分享我的游戏数据</text>
            <text class="menu-desc">生成分享文本</text>
          </view>
          <uni-icons type="right" size="16" color="#CCC"></uni-icons>
        </view>
      </view>
    </view>

    <!-- 外观 -->
    <view class="section">
      <view class="section-title">外观</view>
      <view class="menu-list">
        <view class="menu-item">
          <view class="menu-icon" style="background: #ECEFF1;">
            <uni-icons type="color" size="20" color="#607D8B"></uni-icons>
          </view>
          <view class="menu-content">
            <text class="menu-name">深色模式</text>
            <text class="menu-desc">切换深色/浅色主题</text>
          </view>
          <switch :checked="isDarkMode" @change="toggleDarkMode" color="#667eea"></switch>
        </view>
      </view>
    </view>

    <!-- 关于 -->
    <view class="section">
      <view class="section-title">关于</view>
      <view class="menu-list">
        <view class="menu-item">
          <view class="menu-icon" style="background: #E1F5FE;">
            <uni-icons type="info" size="20" color="#03A9F4"></uni-icons>
          </view>
          <view class="menu-content">
            <text class="menu-name">版本</text>
            <text class="menu-desc">v1.0.0</text>
          </view>
        </view>

        <view class="menu-item" @click="clearAllData">
          <view class="menu-icon" style="background: #FFEBEE;">
            <uni-icons type="trash" size="20" color="#F44336"></uni-icons>
          </view>
          <view class="menu-content">
            <text class="menu-name" style="color: #F44336;">清除所有数据</text>
            <text class="menu-desc">删除所有游戏记录</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 导入弹窗 -->
    <uni-popup ref="importPopup" type="center">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">导入数据</text>
          <text class="popup-close" @click="closeImportModal">✕</text>
        </view>
        <view class="popup-body">
          <textarea
            class="import-textarea"
            v-model="importData"
            placeholder="请粘贴JSON数据..."
            maxlength="100000"
          />
        </view>
        <view class="popup-footer">
          <button class="btn-cancel" @click="closeImportModal">取消</button>
          <button class="btn-confirm" @click="confirmImport">导入</button>
        </view>
      </view>
    </uni-popup>

    <!-- 自定义 TabBar -->
    <custom-tabbar />
  </view>
</template>

<script>
import {
  exportToJSON,
  exportToCSV,
  importFromJSON,
  getBackups,
  generateShareText
} from '@/utils/backup.js';
import { toggleTheme, getThemeName } from '@/utils/theme.js';

export default {
  data() {
    return {
      isDarkMode: false,
      backupCount: 0,
      importData: ''
    };
  },

  onShow() {
    this.loadBackupCount();
    this.loadTheme();
  },

  methods: {
    loadBackupCount() {
      const backups = getBackups();
      this.backupCount = backups.length;
    },

    loadTheme() {
      this.isDarkMode = getThemeName() === 'dark';
    },

    // 导出JSON
    exportJSON() {
      try {
        const data = exportToJSON();
        this.copyToClipboard(data, 'JSON数据已复制到剪贴板');
      } catch (e) {
        uni.showToast({
          title: e.message || '导出失败',
          icon: 'none'
        });
      }
    },

    // 导出CSV
    exportCSV() {
      try {
        const data = exportToCSV();
        this.copyToClipboard(data, 'CSV数据已复制到剪贴板');
      } catch (e) {
        uni.showToast({
          title: e.message || '导出失败',
          icon: 'none'
        });
      }
    },

    // 复制到剪贴板
    copyToClipboard(data, successMsg) {
      uni.setClipboardData({
        data: data,
        success: () => {
          uni.showToast({
            title: successMsg,
            icon: 'success'
          });
        },
        fail: () => {
          uni.showToast({
            title: '复制失败',
            icon: 'none'
          });
        }
      });
    },

    // 显示导入弹窗
    showImportModal() {
      this.importData = '';
      this.$refs.importPopup.open();
    },

    // 关闭导入弹窗
    closeImportModal() {
      this.$refs.importPopup.close();
    },

    // 确认导入
    confirmImport() {
      if (!this.importData.trim()) {
        uni.showToast({
          title: '请输入数据',
          icon: 'none'
        });
        return;
      }

      uni.showModal({
        title: '确认导入',
        content: '导入将覆盖现有数据，是否继续？',
        success: (res) => {
          if (res.confirm) {
            try {
              const count = importFromJSON(this.importData);
              this.closeImportModal();
              uni.showToast({
                title: `成功导入 ${count} 款游戏`,
                icon: 'success'
              });
            } catch (e) {
              uni.showToast({
                title: e.message || '导入失败',
                icon: 'none'
              });
            }
          }
        }
      });
    },

    // 跳转到备份管理
    navigateToBackups() {
      uni.navigateTo({
        url: '/pages/backups/backups'
      });
    },

    // 分享数据
    shareData() {
      try {
        const text = generateShareText();
        uni.setClipboardData({
          data: text,
          success: () => {
            uni.showModal({
              title: '分享文本已复制',
              content: '你可以粘贴到朋友圈或聊天中分享',
              showCancel: false
            });
          }
        });
      } catch (e) {
        uni.showToast({
          title: e.message || '生成分享文本失败',
          icon: 'none'
        });
      }
    },

    // 切换深色模式
    toggleDarkMode(e) {
      const newTheme = toggleTheme();
      this.isDarkMode = newTheme.name === 'dark';

      uni.showToast({
        title: this.isDarkMode ? '已切换到深色模式' : '已切换到浅色模式',
        icon: 'none'
      });

      // 重新加载页面以应用主题
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/settings/settings'
        });
      }, 500);
    },

    // 清除所有数据
    clearAllData() {
      uni.showModal({
        title: '危险操作',
        content: '确定要删除所有游戏记录吗？此操作不可恢复！',
        confirmColor: '#F44336',
        success: (res) => {
          if (res.confirm) {
            uni.showModal({
              title: '再次确认',
              content: '真的确定吗？建议先导出备份！',
              confirmColor: '#F44336',
              success: (res2) => {
                if (res2.confirm) {
                  uni.removeStorageSync('game_records_data');
                  uni.showToast({
                    title: '数据已清除',
                    icon: 'success'
                  });
                }
              }
            });
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

.header-subtitle {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

/* 分区 */
.section {
  margin: 30rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.section-title {
  padding: 30rpx 30rpx 20rpx;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

/* 菜单列表 */
.menu-list {
  padding: 0 20rpx 20rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border-radius: 16rpx;
  margin-bottom: 12rpx;
  background: #F8F9FA;
}

.menu-item:last-child {
  margin-bottom: 0;
}

.menu-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.menu-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.menu-name {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 8rpx;
}

.menu-desc {
  font-size: 24rpx;
  color: #999;
}

/* 弹窗 */
.popup-content {
  background: #FFFFFF;
  border-radius: 24rpx;
  width: 640rpx;
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
}

.import-textarea {
  width: 100%;
  height: 400rpx;
  padding: 24rpx;
  background: #F5F7FA;
  border-radius: 12rpx;
  font-size: 26rpx;
  box-sizing: border-box;
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
</style>
