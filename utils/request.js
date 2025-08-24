const IS_PROD = true;

const BASE_URL = IS_PROD
	? "https://www.itwork.club/rollin"
	: "https://www.itwork.club/rollin_test";

function getToken() {
	const token = wx.getStorageSync("token");
	return token && token.accessToken ? "Bearer " + token.accessToken : "";
}

function request({ url, method = "GET", data = {}, success, fail }) {
	wx.request({
		url: BASE_URL + url,
		method,
		data,
		header: {
			Authorization: getToken(),
		},
		success: (res) => {
			if (typeof success === "function") success(res);
		},
		fail: (err) => {
			wx.showToast({ title: "网络错误", icon: "none" });
			if (typeof fail === "function") fail(err);
		},
	});
}

module.exports = {
	request,
};
