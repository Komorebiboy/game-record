<script>
import { getThemeName, onThemeChange } from '@/utils/theme.js';
import './utils/animations.css';

export default {
	onLaunch: function() {
		console.log('App Launch');
		// 初始化主题
		this.initTheme();
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	},
	methods: {
		initTheme() {
			const theme = getThemeName();
			this.applyThemeToPage(theme);
			
			// 监听主题变化
			onThemeChange((newTheme) => {
				this.applyThemeToPage(newTheme);
			});
		},
		applyThemeToPage(themeName) {
			const pages = getCurrentPages();
			if (pages.length > 0) {
				const currentPage = pages[pages.length - 1];
				if (currentPage && currentPage.$page) {
					currentPage.$page.theme = themeName;
				}
			}
		}
	}
};
</script>

<style>
/*每个页面公共css */
@import './utils/animations.css';

page {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	transition: background-color 0.3s ease;
}

/* 浅色模式默认样式 */
page {
	background-color: #F5F7FA;
}

/* 深色模式样式 */
page[data-theme="dark"] {
	background-color: #121212;
}

/* 全局过渡动画 */
.container,
.section,
.card,
.menu-item,
.game-card,
.chart-section {
	transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

/* 深色模式通用样式 */
page[data-theme="dark"] .container {
	background-color: #121212 !important;
}

page[data-theme="dark"] .section,
page[data-theme="dark"] .card,
page[data-theme="dark"] .menu-item,
page[data-theme="dark"] .game-card,
page[data-theme="dark"] .chart-section {
	background-color: #1E1E1E !important;
	border-color: #333333 !important;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.3) !important;
}

page[data-theme="dark"] .section-title,
page[data-theme="dark"] .chart-title,
page[data-theme="dark"] .game-name,
page[data-theme="dark"] .menu-name {
	color: #FFFFFF !important;
}

page[data-theme="dark"] .section-subtitle,
page[data-theme="dark"] .menu-desc,
page[data-theme="dark"] .legend-value,
page[data-theme="dark"] .bar-value {
	color: #808080 !important;
}

page[data-theme="dark"] .form-input,
page[data-theme="dark"] .form-picker,
page[data-theme="dark"] .form-textarea,
page[data-theme="dark"] .search-box {
	background-color: #2A2A2A !important;
	color: #FFFFFF !important;
}

page[data-theme="dark"] .status-item,
page[data-theme="dark"] .filter-item,
page[data-theme="dark"] .platform-item {
	background-color: #2A2A2A !important;
}

page[data-theme="dark"] .empty-text {
	color: #B0B0B0 !important;
}

page[data-theme="dark"] .empty-subtext {
	color: #808080 !important;
}
</style>
