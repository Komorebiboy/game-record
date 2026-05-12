// 游戏数据管理
const STORAGE_KEY = 'game_records_data';

// 游戏状态枚举
const GameStatus = {
  WANT_TO_PLAY: 'want_to_play',
  PLAYING: 'playing',
  COMPLETED: 'completed',
  DROPPED: 'dropped'
};

// 平台选项
const Platforms = [
  { id: 'pc', name: 'PC', icon: '💻', color: '#4A90D9' },
  { id: 'ps5', name: 'PS5', icon: '🎮', color: '#003791' },
  { id: 'ps4', name: 'PS4', icon: '🎮', color: '#003791' },
  { id: 'switch', name: 'Switch', icon: '🕹️', color: '#E60012' },
  { id: 'xbox', name: 'Xbox', icon: '🎯', color: '#107C10' },
  { id: 'mobile', name: '手机', icon: '📱', color: '#FF6B6B' }
];

// 游戏类型
const Genres = [
  '动作', '冒险', 'RPG', '射击', '策略', '解谜', 
  '竞速', '体育', '模拟', '恐怖', '休闲', '独立游戏'
];

// 状态显示配置
const StatusConfig = {
  [GameStatus.WANT_TO_PLAY]: { label: '想玩', color: '#9B59B6', bgColor: '#F3E5F5' },
  [GameStatus.PLAYING]: { label: '在玩', color: '#3498DB', bgColor: '#E3F2FD' },
  [GameStatus.COMPLETED]: { label: '已通关', color: '#27AE60', bgColor: '#E8F5E9' },
  [GameStatus.DROPPED]: { label: '弃坑', color: '#95A5A6', bgColor: '#ECEFF1' }
};

// 默认游戏数据（示例）
const defaultGames = [
  {
    id: 'game_001',
    name: '守墓人',
    nameEn: 'Graveyard Keeper',
    cover: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400',
    platforms: ['pc'],
    genres: ['模拟', '冒险', '独立游戏'],
    developer: 'Lazy Bear Games',
    releaseDate: '2018-08-15',
    description: '一款中世纪风格的模拟经营游戏，玩家扮演一名守墓人，经营自己的墓地。',
    
    // 个人记录
    myStatus: GameStatus.PLAYING,
    myRating: 8,
    myReview: '非常有趣的模拟经营游戏，充满黑色幽默，经营要素丰富。',
    startDate: '2024-05-01',
    completeDate: '',
    playTime: '30小时',
    isFavorite: true,
    
    // 攻略心得
    guides: [
      {
        id: 'guide_001',
        title: '初期发展攻略',
        content: '1. 先清理墓地，获取基础资源\n2. 种点胡萝卜和小麦\n3. 制作简单的药水赚钱',
        createTime: '2024-05-05',
        updateTime: '2024-05-05'
      }
    ],
    
    createTime: '2024-05-01',
    updateTime: '2024-05-10'
  }
];

// 获取所有游戏数据
function getGames() {
  try {
    const data = uni.getStorageSync(STORAGE_KEY);
    if (!data) {
      saveGames(defaultGames);
      return defaultGames;
    }
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveGames(defaultGames);
      return defaultGames;
    }
    return parsed;
  } catch (e) {
    console.error('获取游戏数据失败:', e);
    saveGames(defaultGames);
    return defaultGames;
  }
}

// 清除缓存数据
function clearStorage() {
  try {
    uni.removeStorageSync(STORAGE_KEY);
    return true;
  } catch (e) {
    console.error('清除缓存失败:', e);
    return false;
  }
}

// 保存游戏数据
function saveGames(games) {
  try {
    uni.setStorageSync(STORAGE_KEY, JSON.stringify(games));
    return true;
  } catch (e) {
    console.error('保存游戏数据失败:', e);
    return false;
  }
}

// 根据ID获取游戏
function getGameById(id) {
  const games = getGames();
  return games.find(g => g.id === id);
}

// 添加新游戏
function addGame(gameData) {
  const games = getGames();
  const newGame = {
    id: 'game_' + Date.now(),
    ...gameData,
    guides: [],
    createTime: new Date().toISOString().split('T')[0],
    updateTime: new Date().toISOString().split('T')[0]
  };
  games.unshift(newGame);
  saveGames(games);
  return newGame;
}

// 更新游戏
function updateGame(id, updates) {
  const games = getGames();
  const index = games.findIndex(g => g.id === id);
  if (index !== -1) {
    games[index] = {
      ...games[index],
      ...updates,
      updateTime: new Date().toISOString().split('T')[0]
    };
    saveGames(games);
    return games[index];
  }
  return null;
}

// 删除游戏
function deleteGame(id) {
  const games = getGames();
  const filtered = games.filter(g => g.id !== id);
  saveGames(filtered);
  return filtered.length !== games.length;
}

// 添加攻略
function addGuide(gameId, guideData) {
  const games = getGames();
  const game = games.find(g => g.id === gameId);
  if (game) {
    const newGuide = {
      id: 'guide_' + Date.now(),
      ...guideData,
      createTime: new Date().toISOString().split('T')[0],
      updateTime: new Date().toISOString().split('T')[0]
    };
    game.guides.unshift(newGuide);
    game.updateTime = new Date().toISOString().split('T')[0];
    saveGames(games);
    return newGuide;
  }
  return null;
}

// 更新攻略
function updateGuide(gameId, guideId, updates) {
  const games = getGames();
  const game = games.find(g => g.id === gameId);
  if (game) {
    const guideIndex = game.guides.findIndex(g => g.id === guideId);
    if (guideIndex !== -1) {
      game.guides[guideIndex] = {
        ...game.guides[guideIndex],
        ...updates,
        updateTime: new Date().toISOString().split('T')[0]
      };
      game.updateTime = new Date().toISOString().split('T')[0];
      saveGames(games);
      return game.guides[guideIndex];
    }
  }
  return null;
}

// 删除攻略
function deleteGuide(gameId, guideId) {
  const games = getGames();
  const game = games.find(g => g.id === gameId);
  if (game) {
    const originalLength = game.guides.length;
    game.guides = game.guides.filter(g => g.id !== guideId);
    if (game.guides.length !== originalLength) {
      game.updateTime = new Date().toISOString().split('T')[0];
      saveGames(games);
      return true;
    }
  }
  return false;
}

// 切换收藏状态
function toggleFavorite(gameId) {
  const games = getGames();
  const game = games.find(g => g.id === gameId);
  if (game) {
    game.isFavorite = !game.isFavorite;
    game.updateTime = new Date().toISOString().split('T')[0];
    saveGames(games);
    return game.isFavorite;
  }
  return null;
}

// 获取统计数据
function getStatistics() {
  const games = getGames();
  return {
    total: games.length,
    wantToPlay: games.filter(g => g.myStatus === GameStatus.WANT_TO_PLAY).length,
    playing: games.filter(g => g.myStatus === GameStatus.PLAYING).length,
    completed: games.filter(g => g.myStatus === GameStatus.COMPLETED).length,
    dropped: games.filter(g => g.myStatus === GameStatus.DROPPED).length,
    favorites: games.filter(g => g.isFavorite).length,
    totalPlayTime: games.reduce((sum, g) => {
      const hours = parseInt(g.playTime) || 0;
      return sum + hours;
    }, 0)
  };
}

// 按状态筛选游戏
function filterByStatus(status) {
  const games = getGames();
  if (!status) return games;
  return games.filter(g => g.myStatus === status);
}

// 按平台筛选游戏
function filterByPlatform(platform) {
  const games = getGames();
  if (!platform) return games;
  return games.filter(g => g.platforms.includes(platform));
}

// 搜索游戏
function searchGames(keyword) {
  const games = getGames();
  if (!keyword) return games;
  const lowerKeyword = keyword.toLowerCase();
  return games.filter(g => 
    g.name.toLowerCase().includes(lowerKeyword) ||
    g.nameEn.toLowerCase().includes(lowerKeyword) ||
    g.developer.toLowerCase().includes(lowerKeyword) ||
    g.genres.some(genre => genre.toLowerCase().includes(lowerKeyword))
  );
}

// 获取最近游玩的游戏
function getRecentGames(limit = 5) {
  const games = getGames();
  return games
    .filter(g => g.myStatus === GameStatus.PLAYING || g.myStatus === GameStatus.COMPLETED)
    .sort((a, b) => new Date(b.updateTime) - new Date(a.updateTime))
    .slice(0, limit);
}

// 重置为默认数据
function resetToDefault() {
  uni.removeStorageSync(STORAGE_KEY);
  saveGames(defaultGames);
  return defaultGames;
}

export {
  GameStatus,
  Platforms,
  Genres,
  StatusConfig,
  getGames,
  saveGames,
  getGameById,
  addGame,
  updateGame,
  deleteGame,
  addGuide,
  updateGuide,
  deleteGuide,
  toggleFavorite,
  getStatistics,
  filterByStatus,
  filterByPlatform,
  searchGames,
  getRecentGames,
  resetToDefault,
  clearStorage
};
