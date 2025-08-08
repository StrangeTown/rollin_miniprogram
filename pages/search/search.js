// pages/search/search.js
Page({
	/**
	 * Page initial data
	 */
	data: {
		translatedResult: "",
		translatedSource: "",
		recentResults: [],
		searchValue: "",
		isLoading: false,
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
				} else {
					console.error("Translation failed:", res.data.msg);
					wx.showToast({ title: "翻译失败", icon: "none" });
					this.setData({ isLoading: false });
				}
			},
			fail: () => {
				wx.showToast({ title: "网络错误", icon: "none" });
				this.setData({ isLoading: false });
			}
		});
	},

	updateRecentResults() {
		const { getHistoryList } = require("../../utils/api.js");
		const { formatTime } = require("../../utils/format.js");
		getHistoryList({
			pageSize: 3,
			pageNum: 1,
			success: (res) => {
				if (
					res.data &&
					res.data.code === 0 &&
					res.data.data &&
					Array.isArray(res.data.data.list)
				) {
					const recentResults = res.data.data.list.map((item) => ({
						input: item.content,
						result: item.target,
						createdAt: formatTime(item.createdAt),
					}));
					this.setData({ recentResults });
				} else {
					this.setData({ recentResults: [] });
				}
			},
			fail: () => {
				this.setData({ recentResults: [] });
			}
		});
	},

	goToSentences() {
		wx.navigateTo({
			url: "/pages/sentences/sentences",
		});
	},

	/**
	 * Lifecycle function--Called when page load
	 */
	onLoad(options) {},

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

	/**
	 * Called when user click on the top right corner to share
	 */
	onShareAppMessage() {},
});
