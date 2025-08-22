const { pendPresetItems } = require("../../utils/mock.js");

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
		showActionModal: false,
		selectedItem: null,
	},

	goToPractice() {
		wx.navigateTo({
			url: "/pages/practice/practice",
		});
	},

	onMoreClick(e) {
		console.log('More icon clicked');
		// Get the item data from the event
		const dataset = e.currentTarget.dataset;
		const index = dataset.index;
		const selectedItem = this.data.allResults[index];
		
		this.setData({
			showActionModal: true,
			selectedItem: selectedItem
		});
	},

	closeActionModal() {
		this.setData({
			showActionModal: false,
			selectedItem: null
		});
	},

	stopPropagation() {
		// Prevent modal from closing when clicking on modal content
	},

	copyItem() {
		if (this.data.selectedItem) {
			const content = this.data.selectedItem.target || this.data.selectedItem.content;
			wx.setClipboardData({
				data: content,
				success: () => {
					wx.showToast({
						title: '已复制到剪贴板',
						icon: 'success',
						duration: 1500
					});
					this.closeActionModal();
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

	deleteItem() {
		if (this.data.selectedItem) {
			wx.showModal({
				title: '确认删除',
				content: '确定要删除这条记录吗？',
				success: (res) => {
					if (res.confirm) {
						const { request } = require("../../utils/request.js");
						const itemId = this.data.selectedItem.id;
						
						request({
							url: `/user/history/${itemId}`,
							method: 'DELETE',
							success: (response) => {
								console.log('Delete response:', response);
								if (response.data && response.data.code === 0) {
									// Remove item from allResults array
									const updatedResults = this.data.allResults.filter(item => item.id !== itemId);
									this.setData({
										allResults: updatedResults
									});
									
									wx.showToast({
										title: '删除成功',
										icon: 'success',
										duration: 1500
									});
								} else {
									wx.showToast({
										title: '删除失败',
										icon: 'none',
										duration: 1500
									});
								}
							},
							fail: (err) => {
								console.error('Delete request failed:', err);
								wx.showToast({
									title: '删除失败',
									icon: 'none',
									duration: 1500
								});
							}
						});
					}
					this.closeActionModal();
				}
			});
		}
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
					res.data.data
				) {
					let respList = res.data.data.list || [];
					if (pageNum === 1) {
						list = pendPresetItems(respList);
					}
					list = list.map((item) => ({
						...item,
						createdAt: formatTime(item.createdAt),
					}));
					hasMore = respList.length === this.data.pageSize;
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
