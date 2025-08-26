const { pendPresetItems } = require("../../utils/mock.js");
const shareBehavior = require('../../behaviors/share.js');
const storage = require('../../utils/storage.js');

// pages/search/search.js
Page({
	behaviors: [shareBehavior],
	/**
	 * Page initial data
	 */
	data: {
		translatedResult: "",
		translatedSource: "",
		recentResults: [],
		searchValue: "",
		isLoading: false,
		points: 0,
		// current language flag emoji
		languageFlag: '🇺🇸'
	},

	onConfirm(e) {
		const value = e.detail.value;
		if (!value) return;

		this.setData({ isLoading: true });

		const { request } = require("../../utils/request.js");
		request({
			url: "/search",
			method: "POST",
			data: {
				content: value,
			},
			success: (res) => {
				console.log("Translation response:", res);
				if (res.data && res.data.code === 0) {
					const translatedResult = res.data.data;
					this.setData({
						translatedResult,
						translatedSource: value,
						searchValue: "",
						isLoading: false,
					});
					this.updateRecentResults();
					// Refresh user's points after a successful search
					if (typeof this.fetchPoints === 'function') {
						this.fetchPoints();
					}
				} else if (res.data && res.data.code === 10015) {
					// Insufficient points error
					this.setData({ isLoading: false });
					wx.showModal({
						title: '翻点不足',
						content: '你当前的翻点不足，暂时无法继续搜索',
						showCancel: true,
						cancelText: '取消',
						confirmText: '获取更多',
						success: (modalRes) => {
							if (modalRes.confirm) {
								// User clicked "获取更多翻点" button
								this.goToPoints();
							}
						}
					});
				} else {
					console.error("Translation failed:", res.data.msg);
					wx.showToast({ title: "目前翻译人数太多，请稍后重试", icon: "none" });
					this.setData({ isLoading: false });
				}
			},
			fail: () => {
				wx.showToast({ title: "网络错误", icon: "none" });
				this.setData({ isLoading: false });
			},
		});
	},

	onCopyResult() {
		if (this.data.translatedResult) {
			wx.setClipboardData({
				data: this.data.translatedResult,
				success: () => {
					wx.showToast({
						title: '已复制到剪贴板',
						icon: 'success',
						duration: 1500
					});
				},
				fail: () => {
					wx.showToast({
						title: '复制失败',
						icon: 'none',
						duration: 1500
					});
				}
			});
		}
	},

	updateRecentResults() {
		const pageNum = 1;
		const { getHistoryList } = require("../../utils/api.js");
		const { formatTime } = require("../../utils/format.js");
		getHistoryList({
			pageSize: 3,
			pageNum,
			success: (res) => {
				if (
					res.data &&
					res.data.code === 0 &&
					res.data.data
				) {
					let respList = res.data.data.list || [];
					if (pageNum === 1) {
						respList = pendPresetItems(respList).slice(0, 3);
					}
					const recentResults = respList.map((item) => ({
						...item,
						createdAt: formatTime(item.createdAt),
					}));
					this.setData({ recentResults });
				} else {
					this.setData({ recentResults: [] });
				}
			},
			fail: () => {
				this.setData({ recentResults: [] });
			},
		});
	},

	syncUserPoints() {
		try {
			const app = getApp();
			if (app && app.globalData) {
				const points = app.globalData.userPoints;
				// set the page-level points from global data
				this.setData({ points: points });
			}
		} catch (err) {
			console.error('Error syncing userPoints from search page:', err);
		}
	},

	/**
	 * Fetch latest user points from global fetchUserPoints and update page
	 */
	fetchPoints() {
		const app = getApp();
		if (app && typeof app.fetchUserPoints === 'function') {
			app.fetchUserPoints().then((points) => {
				if (points !== null && points !== undefined) {
					this.setData({ points });
				}
			});
		}
	},

	goToSentences() {
		wx.navigateTo({
			url: "/pages/sentences/sentences",
		});
	},

	goToPoints() {
		wx.navigateTo({
			url: "/pages/points/points",
		});
	},

	goToSettings() {
		wx.navigateTo({
			url: "/pages/settings/settings",
		});
	},

	/**
	 * Lifecycle function--Called when page load
	 */
	onLoad(options) {
	},

	/**
	 * Set page data `languageFlag` based on stored target language
	 */
	setLanguageFlag() {
		try {
			const target = storage.getTargetLanguage();
			const languageFlagMap = {
				'en': '🇺🇸',
				'en-US': '🇺🇸',
				'zh': '🇨🇳',
				'zh-CN': '🇨🇳',
				'ja': '🇯🇵',
				'ja-JP': '🇯🇵',
				'ko': '🇰🇷',
				'ko-KR': '🇰🇷',
				'es': '🇪🇸',
				'es-ES': '🇪🇸',
				'fr': '🇫🇷',
				'fr-FR': '🇫🇷',
				'de': '🇩🇪',
				'de-DE': '🇩🇪'
			};
			const flag = target && languageFlagMap[target] ? languageFlagMap[target] : '🇺🇸';
			this.setData({ languageFlag: flag });
		} catch (err) {
			console.error('Failed to set language flag:', err);
		}
	},

	/**
	 * Lifecycle function--Called when page is initially rendered
	 */
	onReady() {},

	/**
	 * Lifecycle function--Called when page show
	 */

	onShow() {
		// Load recent results from server when page is shown
		this.updateRecentResults();

		// Sync user points with global state
		this.syncUserPoints();

		// Update language flag based on current target language
		this.setLanguageFlag();
	},

	/**
	 * Lifecycle function--Called when page hide
	 */
	onHide() {},

	/**
	 * Lifecycle function--Called when page unload
	 */
	onUnload() {},

	/**
	 * Page event handler function--Called when user drop down
	 */
	onPullDownRefresh() {},

	/**
	 * Called when page reach bottom
	 */
	onReachBottom() {},

});
