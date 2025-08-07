// pages/sentences/sentences.js
Page({
	/**
	 * Page initial data
	 */
	data: {
		allResults: [],
		windowHeight: 0,
		pageNum: 1,
		pageSize: 10,
		hasMore: true,
		isLoading: false,
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

	loadHistoryList(pageNum = 1) {
		if (this.data.isLoading || !this.data.hasMore) return;
		
		this.setData({ isLoading: true });
		
		const { getHistoryList } = require("../../utils/api.js");
		const { formatTime } = require("../../utils/format.js");
		getHistoryList({
			pageSize: this.data.pageSize,
			pageNum,
			success: (res) => {
				let list = [];
				let hasMore = true;
				
				if (
					res.data &&
					res.data.code === 0 &&
					res.data.data &&
					Array.isArray(res.data.data.list)
				) {
					list = res.data.data.list.map((item) => ({
						...item,
						createdAt: formatTime(item.createdAt),
					}));
					hasMore = res.data.data.list.length === this.data.pageSize;
				}
				
				this.setData({
					allResults: pageNum === 1 ? list : [...this.data.allResults, ...list],
					pageNum,
					hasMore,
					isLoading: false,
				});
			},
			fail: () => {
				this.setData({ isLoading: false });
			}
		});
	},

	/**
	 * Lifecycle function--Called when page show
	 */
	onShow() {
		// Load first page data when page is shown
		this.loadHistoryList(1);
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
	 * Called when user click on the top right corner to share
	 */
	onShareAppMessage() {},

	/**
	 * Called when scroll to bottom of scroll-view
	 */
	onScrollToLower() {
		if (this.data.hasMore && !this.data.isLoading) {
			this.loadHistoryList(this.data.pageNum + 1);
		}
	},

	/**
	 * Called when page reach bottom (not used with scroll-view)
	 */
	onReachBottom() {},
});
