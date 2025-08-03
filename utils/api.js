const { request } = require('./request.js');

function getHistoryList({ pageSize = 10, pageNum = 1, success, fail }) {
  request({
    url: `/user/history/list?pageSize=${pageSize}&pageNum=${pageNum}`,
    method: 'GET',
    success,
    fail
  });
}

module.exports = {
  getHistoryList
};
