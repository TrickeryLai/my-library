

var getAllData = require("./getAllData.js");
var baseInfo = require("./baseInfo");

var login = require("./login");
var register = require("./register");
var getUserData = require("./getUserData");

module.exports = {
	getAllData: getAllData,
	baseInfo: baseInfo,
	login: login,
	register: register,
	getUserData: getUserData
}