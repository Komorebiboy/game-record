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
    name: '塞尔达传说：王国之泪',
    nameEn: 'The Legend of Zelda: Tears of the Kingdom',
    cover: 'https://images.unsplash.com/photo-1612287230217-969b698c8d13?w=400',
    platforms: ['switch'],
    genres: ['动作', '冒险', 'RPG'],
    developer: 'Nintendo',
    releaseDate: '2023-05-12',
    description: '塞尔达传说系列的最新作，拥有极高的自由度和创造力。',
    
    // 个人记录
    myStatus: GameStatus.COMPLETED,
    myRating: 10,
    myReview: '神作！自由度极高，建造系统让人上瘾。神庙设计巧妙，剧情也很感人。',
    startDate: '2023-05-15',
    completeDate: '2023-08-20',
    playTime: '150小时',
    isFavorite: true,
    
    // 攻略心得
    guides: [
      {
        id: 'guide_001',
        title: '全神庙位置攻略',
        content: '海拉鲁大陆共有152个神庙...\n\n1. 初始空岛区域有4个神庙\n2. 地面区域分布着大部分神庙\n3. 地下区域也有一些隐藏神庙',
        createTime: '2023-06-01',
        updateTime: '2023-06-15'
      },
      {
        id: 'guide_002',
        title: '实用建造技巧',
        content: 'MK2飞行器是最实用的交通工具...\n\n材料需求：\n- 风扇机 x2\n- 操纵杆 x1\n- 木板 x1',
        createTime: '2023-06-10',
        updateTime: '2023-06-10'
      }
    ],
    
    createTime: '2023-05-15',
    updateTime: '2023-08-20'
  },
  {
    id: 'game_002',
    name: '艾尔登法环',
    nameEn: 'Elden Ring',
    cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
    platforms: ['pc', 'ps5', 'xbox'],
    genres: ['动作', 'RPG'],
    developer: 'FromSoftware',
    releaseDate: '2022-02-25',
    description: '魂系游戏的集大成之作，开放世界与硬核动作的完美结合。',
    
    myStatus: GameStatus.PLAYING,
    myRating: 9,
    myReview: '难度很高但很有成就感，世界观非常吸引人。目前正在挑战女武神。',
    startDate: '2024-01-10',
    completeDate: '',
    playTime: '80小时',
    isFavorite: true,
    
    guides: [
      {
        id: 'guide_003',
        title: '新手开荒建议',
        content: '1. 先探索啜泣半岛，难度较低\n2. 建议先拿灵马，方便跑图\n3. 多收集黄金种子增加血瓶',
        createTime: '2024-01-12',
        updateTime: '2024-01-12'
      }
    ],
    
    createTime: '2024-01-10',
    updateTime: '2024-01-10'
  },
  {
    id: 'game_003',
    name: '博德之门3',
    nameEn: "Baldur's Gate 3",
    cover: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400',
    platforms: ['pc', 'ps5'],
    genres: ['RPG', '策略'],
    developer: 'Larian Studios',
    releaseDate: '2023-08-03',
    description: '年度游戏，CRPG的巅峰之作，自由度极高。',
    
    myStatus: GameStatus.WANT_TO_PLAY,
    myRating: 0,
    myReview: '',
    startDate: '',
    completeDate: '',
    playTime: '',
    isFavorite: false,
    
    guides: [],
    
    createTime: '2024-02-01',
    updateTime: '2024-02-01'
  },
  {
    id: 'game_004',
    name: '原神',
    nameEn: 'Genshin Impact',
    cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
    platforms: ['pc', 'ps5', 'mobile'],
    genres: ['RPG', '冒险'],
    developer: 'miHoYo',
    releaseDate: '2020-09-28',
    description: '开放世界冒险游戏，二次元风格的代表作。',
    
    myStatus: GameStatus.DROPPED,
    myRating: 7,
    myReview: '画面精美，但后期太肝了，抽卡机制也让人疲惫。',
    startDate: '2021-03-01',
    completeDate: '',
    playTime: '200小时',
    isFavorite: false,
    
    guides: [],
    
    createTime: '2021-03-01',
    updateTime: '2022-06-01'
  }
];

// 获取所有游戏数据
function getGames() {
  try {
    const data = uni.getStorageSync(STORAGE_KEY);
    return data ? JSON.parse(data) : defaultGames;
  } catch (e) {
    console.error('获取游戏数据失败:', e);
    return defaultGames;
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
  resetToDefault
};
