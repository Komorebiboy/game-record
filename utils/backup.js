// 数据备份与导出功能

const BACKUP_KEY = 'game_records_backup';

/**
 * 导出数据为JSON
 */
function exportToJSON() {
  try {
    const games = uni.getStorageSync('game_records_data');
    if (!games) {
      throw new Error('没有数据可导出');
    }
    
    const data = {
      version: '1.0',
      exportTime: new Date().toISOString(),
      games: JSON.parse(games)
    };
    
    return JSON.stringify(data, null, 2);
  } catch (e) {
    console.error('导出JSON失败:', e);
    throw e;
  }
}

/**
 * 导出数据为CSV格式
 */
function exportToCSV() {
  try {
    const games = uni.getStorageSync('game_records_data');
    if (!games) {
      throw new Error('没有数据可导出');
    }
    
    const gameList = JSON.parse(games);
    
    // CSV 表头
    const headers = ['游戏名称', '英文名称', '平台', '类型', '开发商', '发行日期', 
                     '状态', '评分', '游戏时长', '开始日期', '通关日期', '我的评价'];
    
    // CSV 内容
    const rows = gameList.map(game => [
      game.name,
      game.nameEn || '',
      game.platforms.join('、'),
      game.genres.join('、'),
      game.developer || '',
      game.releaseDate || '',
      getStatusLabel(game.myStatus),
      game.myRating || '',
      game.playTime || '',
      game.startDate || '',
      game.completeDate || '',
      game.myReview || ''
    ]);
    
    // 转换为CSV格式
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    
    // 添加BOM以支持中文
    return '\uFEFF' + csvContent;
  } catch (e) {
    console.error('导出CSV失败:', e);
    throw e;
  }
}

/**
 * 保存备份到本地
 */
function saveBackup() {
  try {
    const games = uni.getStorageSync('game_records_data');
    if (!games) {
      throw new Error('没有数据可备份');
    }
    
    const backup = {
      version: '1.0',
      backupTime: new Date().toISOString(),
      games: JSON.parse(games)
    };
    
    // 获取已有备份列表
    let backups = uni.getStorageSync(BACKUP_KEY) || '[]';
    backups = JSON.parse(backups);
    
    // 添加新备份（最多保留10个）
    backups.unshift(backup);
    if (backups.length > 10) {
      backups = backups.slice(0, 10);
    }
    
    uni.setStorageSync(BACKUP_KEY, JSON.stringify(backups));
    return backup;
  } catch (e) {
    console.error('保存备份失败:', e);
    throw e;
  }
}

/**
 * 获取备份列表
 */
function getBackups() {
  try {
    const backups = uni.getStorageSync(BACKUP_KEY);
    return backups ? JSON.parse(backups) : [];
  } catch (e) {
    console.error('获取备份列表失败:', e);
    return [];
  }
}

/**
 * 从备份恢复数据
 */
function restoreFromBackup(backupIndex) {
  try {
    const backups = getBackups();
    if (backupIndex < 0 || backupIndex >= backups.length) {
      throw new Error('备份索引无效');
    }
    
    const backup = backups[backupIndex];
    uni.setStorageSync('game_records_data', JSON.stringify(backup.games));
    return backup;
  } catch (e) {
    console.error('恢复备份失败:', e);
    throw e;
  }
}

/**
 * 删除备份
 */
function deleteBackup(backupIndex) {
  try {
    let backups = getBackups();
    if (backupIndex < 0 || backupIndex >= backups.length) {
      throw new Error('备份索引无效');
    }
    
    backups.splice(backupIndex, 1);
    uni.setStorageSync(BACKUP_KEY, JSON.stringify(backups));
    return true;
  } catch (e) {
    console.error('删除备份失败:', e);
    throw e;
  }
}

/**
 * 导入JSON数据
 */
function importFromJSON(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    
    // 验证数据格式
    if (!data.games || !Array.isArray(data.games)) {
      throw new Error('数据格式无效');
    }
    
    // 保存数据
    uni.setStorageSync('game_records_data', JSON.stringify(data.games));
    return data.games.length;
  } catch (e) {
    console.error('导入数据失败:', e);
    throw e;
  }
}

/**
 * 获取状态标签
 */
function getStatusLabel(status) {
  const statusMap = {
    'want_to_play': '想玩',
    'playing': '在玩',
    'completed': '已通关',
    'dropped': '弃坑'
  };
  return statusMap[status] || status;
}

/**
 * 分享数据（生成分享文本）
 */
function generateShareText() {
  try {
    const games = uni.getStorageSync('game_records_data');
    if (!games) {
      throw new Error('没有数据可分享');
    }
    
    const gameList = JSON.parse(games);
    const stats = {
      total: gameList.length,
      completed: gameList.filter(g => g.myStatus === 'completed').length,
      playing: gameList.filter(g => g.myStatus === 'playing').length,
      totalPlayTime: gameList.reduce((sum, g) => sum + (parseInt(g.playTime) || 0), 0)
    };
    
    const topGames = gameList
      .filter(g => g.myRating >= 8)
      .slice(0, 3)
      .map(g => g.name)
      .join('、');
    
    return `🎮 我的游戏时光\n` +
           `📊 已记录 ${stats.total} 款游戏\n` +
           `✅ 已通关 ${stats.completed} 款\n` +
           `🎯 正在玩 ${stats.playing} 款\n` +
           `⏱️ 总时长 ${stats.totalPlayTime} 小时\n` +
           `🏆 推荐游戏：${topGames || '暂无'}\n` +
           `—— 来自游戏时光小程序`;
  } catch (e) {
    console.error('生成分享文本失败:', e);
    throw e;
  }
}

export {
  exportToJSON,
  exportToCSV,
  saveBackup,
  getBackups,
  restoreFromBackup,
  deleteBackup,
  importFromJSON,
  generateShareText
};
