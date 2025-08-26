const { request } = require('./request.js');

function getHistoryList({ pageSize = 10, pageNum = 1, success, fail }) {
  request({
    url: `/user/history/list?pageSize=${pageSize}&pageNum=${pageNum}`,
    method: 'GET',
    success,
    fail
  });
}

/**
 * Refresh authentication token from server.
 * Calls GET /user/refresh/token and returns a Promise that resolves with the response.
 * The caller can then update stored token info as needed.
 */
function refreshToken() {
  return new Promise((resolve, reject) => {
    try {
      request({
        url: '/user/refresh/token',
        method: 'GET',
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  getHistoryList,
  refreshToken
};
