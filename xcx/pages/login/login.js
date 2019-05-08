
let _server = require("../../server/server.js");

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    _server.getCaptchaPic().then((res) => {}).catch(error => {})
  }
})