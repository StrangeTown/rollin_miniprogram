// pages/practice/practice.js
Page({
	/**
	 * Page initial data
	 */
	data: {
		practiceList: [],
		rememberedItems: [],
		forgotItems: [],
	},

	onNotRemember() {
		const first = this.data.practiceList[0];
		if (first) {
			this.setData(
				{
					forgotItems: [...this.data.forgotItems, first],
					practiceList: this.data.practiceList.slice(1),
				},
				() => {
					this.checkLeftData();
				}
			);
		}
	},

	onRemember() {
		const first = this.data.practiceList[0];
		if (first) {
			this.setData(
				{
					rememberedItems: [...this.data.rememberedItems, first],
					practiceList: this.data.practiceList.slice(1),
				},
				() => {
					this.checkLeftData();
				}
			);
		}
	},

	updateFamiliarity(onSuccess) {
		const rememberedItems = this.data.rememberedItems.map((item) => ({
			id: item.id,
			isFamiliar: true,
		}));
		const forgotItems = this.data.forgotItems.map((item) => ({
			id: item.id,
			isFamiliar: false,
		}));
		const items = [...rememberedItems, ...forgotItems];
		console.log("更新熟悉度:", items);
		if (items.length > 0) {
			const { request } = require("../../utils/request.js");
			request({
				url: "/user/history",
				method: "PUT",
				data: items,
				success: (res) => {
					console.log("熟悉度更新成功", res);
					if (typeof onSuccess === "function") onSuccess();
				},
				fail: () => {
					wx.showToast({ title: "熟悉度更新失败", icon: "none" });
				},
			});
		} else {
			if (typeof onSuccess === "function") onSuccess();
		}
	},

	checkLeftData() {
		console.log("剩余练习数量:", this.data.practiceList.length);
		const leftCount = this.data.practiceList.length;
		if (leftCount <= 2) {
			// Update familiarity based on remembered and forgotten items, then fetch new data on success
			this.updateFamiliarity(() => {
				this.fetchNewData();
			});
		}
	},

	fetchNewData() {
		const rememberedIds = this.data.rememberedItems.map((item) => item.id);
		const forgotIds = this.data.forgotItems.map((item) => item.id);
		const excludeIds = [...rememberedIds, ...forgotIds];
		this.requestPracticeBatch(excludeIds);
	},

	/**
	 * Lifecycle function--Called when page load
	 */
	onLoad(options) {
		this.fetchNewData();
	},

	updateList(newList) {
		// Insert forgotItems into newList at random positions
		let mergedList = [...newList];
		const forgotItems = [...this.data.forgotItems];
		while (forgotItems.length > 0) {
			const item = forgotItems.pop();
			const pos = Math.floor(Math.random() * (mergedList.length + 1));
			mergedList.splice(pos, 0, item);
		}
		this.setData({
			practiceList: [...this.data.practiceList, ...mergedList],
			rememberedItems: [],
			forgotItems: [],
		});
	},

	requestPracticeBatch(excludeIds = []) {
		const { request } = require("../../utils/request.js");
		let url = "/user/history/rand/history?limit=5";
		if (excludeIds && excludeIds.length > 0) {
			const params = excludeIds.map((id) => `ids=${id}`).join("&");
			url += `&${params}`;
		}
		request({
			url,
			method: "GET",
			success: (res) => {
				if (res.data && res.data.code === 0 && Array.isArray(res.data.data)) {
          console.log("获取练习数据:", res.data.data);
					this.updateList(res.data.data);
				} else {
					wx.showToast({ title: "获取练习数据失败", icon: "none" });
				}
			},
			fail: () => {
				wx.showToast({ title: "网络错误", icon: "none" });
			},
		});
	},

	/**
	 * Lifecycle function--Called when page is initially rendered
	 */
	onReady() {},

	/**
	 * Lifecycle function--Called when page show
	 */
	onShow() {},

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
