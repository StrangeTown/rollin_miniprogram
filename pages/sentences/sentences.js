const { pendPresetItems } = require("../../utils/mock.js");
const shareBehavior = require('../../behaviors/share.js');

// pages/sentences/sentences.js
Page({
	behaviors: [shareBehavior],
	/**
	 * Page initial data
	 */
	data: {
		allResults: [],
		groupedResults: [], // New: grouped by date
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
		const groupIndex = dataset.groupIndex;
		const itemIndex = dataset.itemIndex;
		const selectedItem = this.data.groupedResults[groupIndex].items[itemIndex];
		
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

	/**
	 * Group results by date
	 */
	groupResultsByDate(results) {
		const grouped = {};
		const currentYear = new Date().getFullYear();
		
		results.forEach(item => {
			// Extract date from createdAt (assuming format like "08-23 14:30")
			const dateMatch = item.createdAt ? item.createdAt.match(/(\d{2}-\d{2})/) : null;
			const dateKey = dateMatch ? `${currentYear}-${dateMatch[1]}` : 'Unknown';
			
			if (!grouped[dateKey]) {
				grouped[dateKey] = {
					date: dateKey,
					items: []
				};
			}
			grouped[dateKey].items.push(item);
		});
		
		// Convert to array and sort by date (newest first)
		return Object.values(grouped).sort((a, b) => {
			// Sort by date string (YYYY-MM-DD format)
			return b.date.localeCompare(a.date);
		});
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
									}, () => {
										// Update grouped results after deletion
										const grouped = this.groupResultsByDate(this.data.allResults);
										this.setData({ groupedResults: grouped });
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
		const { formatTime, formatTimeHourMin } = require("../../utils/format.js");
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
						hourMin: formatTimeHourMin(item.createdAt)
					}));
					hasMore = respList.length === this.data.pageSize;
				}

				this.setData({
					allResults: pageNum === 1 ? list : [...this.data.allResults, ...list],
					pageNum,
					hasMore,
					isLoading: false,
				}, () => {
					// Group results by date after setting data
					const grouped = this.groupResultsByDate(this.data.allResults);
					this.setData({ groupedResults: grouped });
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
