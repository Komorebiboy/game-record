export default {
	data() {
		return {
			loading: false
		}
	},
	methods: {
		showLoading(title = '加载中...') {
			this.loading = true
			uni.showLoading({
				title: title,
				mask: true
			})
		},
		hideLoading() {
			this.loading = false
			uni.hideLoading()
		},
		showToast(title, icon = 'none', duration = 2000) {
			uni.showToast({
				title: title,
				icon: icon,
				duration: duration
			})
		},
		showModal(title, content, confirmText = '确定', cancelText = '取消') {
			return new Promise((resolve, reject) => {
				uni.showModal({
					title: title,
					content: content,
					confirmText: confirmText,
					cancelText: cancelText,
					success: (res) => {
						if (res.confirm) {
							resolve(true)
						} else {
							resolve(false)
						}
					},
					fail: () => {
						reject(false)
					}
				})
			})
		}
	}
}