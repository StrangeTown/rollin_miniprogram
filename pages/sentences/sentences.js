// pages/sentences/sentences.js
Page({
	/**
	 * Page initial data
	 */
	data: {
		allResults: [],
	},

	goToPractice() {
		wx.navigateTo({
			url: "/pages/practice/practice",
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
		// Load list data from server when page is shown
		const { request } = require("../../utils/request.js");
		request({
			url: "/user/history/list?pageSize=10&pageNum=1",
			method: "GET",
			success: (res) => {
				if (
					res.data &&
					res.data.code === 0 &&
					res.data.data &&
					Array.isArray(res.data.data.list)
				) {
					this.setData({ allResults: res.data.data.list });
				} else {
					wx.showToast({ title: "获取历史失败", icon: "none" });
				}
			},
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
