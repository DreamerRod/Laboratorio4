var mongoose = require("./connect");
var USERSCHEMA = new mongoose.Schema({
name : String,
email : String,
password : String,
registerdate: Date,
sex : String,
address : String,
relativepath: String,
pathfile:String,
permisos:{
	method:String,
	services:String
}
});
/*const mongoose = require("./connect");
var USERSCHEMA = {
name : String,
email : String,
password : String,
registerdate: Date,
sex : String,
address : String
}
const USERS = mongoose.model("users", USERSCHEMA);*/
var USERS = mongoose.model("users", USERSCHEMA);
module.exports = USERS;