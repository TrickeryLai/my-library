

var getAllData = require("./getAllData.js");

var login = require("./login");
var register = require("./register");
var getUserData = require("./getUserData");
var changeUserData = require("./changeUserData");

module.exports = {
	getAllData: getAllData,
	login: login,
	register: register,
	getUserData: getUserData,
	changeUserData: changeUserData
}