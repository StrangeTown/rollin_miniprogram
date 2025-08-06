// pages/sentences/sentences.js
Page({
	/**
	 * Page initial data
	 */
	data: {
		allResults: [],
		windowHeight: 0,
	},

	goToPractice() {
		wx.navigateTo({
			url: "/pages/practice/practice",
		});
	},

	/**
	 * Lifecycle function--Called when page load
	 */
	onLoad(options) {
		const systemInfo = wx.getSystemInfoSync();
		this.setData({ windowHeight: systemInfo.windowHeight });
	},

	/**
	 * Lifecycle function--Called when page is initially rendered
	 */
	onReady() {},

	/**
	 * Lifecycle function--Called when page show
	 */
	onShow() {
		// Load list data from server when page is shown
		const { getHistoryList } = require("../../utils/api.js");
		const { formatTime } = require("../../utils/format.js");
		getHistoryList({
			pageSize: 10,
			pageNum: 1,
			success: (res) => {
				if (
					res.data &&
					res.data.code === 0 &&
					res.data.data &&
					Array.isArray(res.data.data.list)
				) {
					const formattedList = res.data.data.list.map((item) => ({
						...item,
						createdAt: formatTime(item.createdAt),
					}));
					this.setData({ allResults: formattedList });
				} else {
					this.setData({ allResults: [] });
				}
			},
			fail: () => {
				this.setData({ allResults: [] });
			}
		});
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
