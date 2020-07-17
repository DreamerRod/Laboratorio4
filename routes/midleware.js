
var JWT=require('jsonwebtoken');
var USER=require('../database/users');

var midleware= async(req,res,next)=>{
	var token= req.headers["Authorization"];
	if (token==null||token=="") {
		res.status(403).json({error:"no tienes acceso a este lugar token nulo"});
		return;
	}
	try{
	var decoded=JWT.verify(token,"datamongoose");
	if (decoded==null) {
		res.status(403).json({error:"no tienes acceso a este lugar token falso"});
		return;
	}

	/*if ((Date.now()/1000) > decoded.exp) {
		res.status(403).json({error:"el token ya expiro"});
		return;
	}*/

	var iduser=decoded.data;
	var docs = await USER.findOne({_id: iduser});
	if (docs==null) {
		res.status(403).json({error:"el usuario no existe en la db"});
		return;
	}
	var roles=docs.permisos.map( item =>{
		return item;
	});
	var services=req.originalUrl.substr(1,100);
	if (services.lastIndexOf("?") > -1) {
		services=services.substring(0,services.lastIndexOf("?"));
	}
	var METHOD=req.method;
	var URL= services;
	for (var i = 0; i < roles.length; i++) {
		if (METHOD==roles[i].method&&URL==roles[i].services) {
			next();
			return;
		}
	}
	res.status(403).json({error:"no tienes acceso"});
	return;
	}
	catch(TokenExpiredError){
		res.status(403).json({error:"el tiempo del token ya expiro"});
		return;
	}
}
module.exports = midleware;

