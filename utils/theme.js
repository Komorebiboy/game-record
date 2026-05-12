// 主题管理工具

const THEME_KEY = 'app_theme';

// 主题配置
const themes = {
  light: {
    name: 'light',
    background: '#F5F7FA',
    surface: '#FFFFFF',
    primary: '#667eea',
    text: '#333333',
    textSecondary: '#666666',
    textMuted: '#999999',
    border: '#E5E5E5',
    card: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.08)'
  },
  dark: {
    name: 'dark',
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#8B9EFF',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textMuted: '#808080',
    border: '#333333',
    card: '#2A2A2A',
    shadow: 'rgba(0, 0, 0, 0.3)'
  }
};

/**
 * 获取当前主题
 */
function getCurrentTheme() {
  try {
    const theme = uni.getStorageSync(THEME_KEY);
    return theme === 'dark' ? themes.dark : themes.light;
  } catch (e) {
    return themes.light;
  }
}

/**
 * 获取主题名称
 */
function getThemeName() {
  try {
    return uni.getStorageSync(THEME_KEY) || 'light';
  } catch (e) {
    return 'light';
  }
}

/**
 * 设置主题
 */
function setTheme(themeName) {
  try {
    uni.setStorageSync(THEME_KEY, themeName);
    // 通知所有页面主题已更改
    uni.$emit('themeChanged', themeName);
    return themes[themeName] || themes.light;
  } catch (e) {
    console.error('设置主题失败:', e);
    return themes.light;
  }
}

/**
 * 切换主题
 */
function toggleTheme() {
  const current = getThemeName();
  const next = current === 'light' ? 'dark' : 'light';
  return setTheme(next);
}

/**
 * 应用主题到页面
 */
function applyTheme(pageInstance) {
  const theme = getCurrentTheme();
  
  if (pageInstance && pageInstance.theme) {
    pageInstance.theme = theme;
  }
  
  // 设置导航栏颜色
  uni.setNavigationBarColor({
    frontColor: theme.name === 'dark' ? '#ffffff' : '#ffffff',
    backgroundColor: theme.name === 'dark' ? '#1E1E1E' : '#667eea'
  });
  
  // 设置 TabBar 样式
  uni.setTabBarStyle({
    color: theme.textMuted,
    selectedColor: theme.primary,
    backgroundColor: theme.surface,
    borderStyle: theme.name === 'dark' ? 'black' : 'black'
  });
  
  return theme;
}

/**
 * 监听主题变化
 */
function onThemeChange(callback) {
  uni.$on('themeChanged', callback);
}

/**
 * 取消监听主题变化
 */
function offThemeChange(callback) {
  uni.$off('themeChanged', callback);
}

export {
  themes,
  getCurrentTheme,
  getThemeName,
  setTheme,
  toggleTheme,
  applyTheme,
  onThemeChange,
  offThemeChange
};
