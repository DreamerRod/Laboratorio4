var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');
var USER= require('../database/users');
var JWT=require('jsonwebtoken');
var valid=require('../utils/valid');
var sha1=require("sha1");
var midleware=require("./midleware");

var mongoose = require("mongoose");

router.post('/user', async(req, res) => {
var params = req.body;
if (valid.checkParams(params,USER.schema.obj)!="true") {
	res.status(403).json(valid.checkParams(params,USER.schema.obj));
	return;
}
if (valid.checkPassword(params.password)!="true") {
	res.status(403).json(valid.checkPassword(params.password));
	return;
}
if (valid.checkEmail(params.email)!="true") {
	res.status(403).json(valid.checkEmail(params.email));
	return;
}
var users = new USER(params);
var result = await users.save();
res.status(200).json(result);
});

router.get("/user", (req, res) => {
var params = req.query;
console.log(params);
//console.log(Object.keys(USER.schema.inherits));
//console.log(typeof(USER));
var limit = 100;
if (params.limit != null) {
	limit = parseInt(params.limit);
}
var order = -1;
if (params.order != null) {
	if (params.order == "desc") {
		order = -1;
	} else if (params.order == "asc") {
		order = 1;
	}
}
var skip = 10;
if (params.skip != null) {
	skip = parseInt(params.skip);
}

USER.find({}).limit(limit).sort({_id: order}).skip(skip).exec({},(err, docs) => {
		res.status(200).json(docs);
	});
});

router.patch("/user", (req, res) => {
if (req.query.id == null) {
	res.status(300).json({
		msn: "Error no existe id"
	});
	return;
}
var id = req.query.id;
var params = req.body;
USER.findOneAndUpdate({_id: id}, params, (err, docs) => {
		res.status(200).json(docs);
	});
});

router.delete("/user", async(req, res) => {
if (req.query.id == null) {
	res.status(300).json({
		msn: "Error no existe id"
    });
    return;
}
var r = await USER.remove({_id: req.query.id});
	res.status(300).json(r);
});


router.post("/indexlogin", async(req,res)=>{
    var body = req.body;
    if (body.name == null) {
        res.status(300).json({msn: "El nombre es necesario"});
             return;
    }
    if (body.password == null) {
        res.status(300).json({msn: "El password es necesario"});
        return;
    }
var results = await USER.find({name: body.name, password: body.password});
    if (results.length == 1) {
		var token = JWT.sign({
			exp: Math.floor(Date.now() / 1000)+(60*60),
			data: results[0].id
		},'datamongoose');

        res.status(200).json({msn: "Bienvenido " + body.name , token:token });
        return;
    }

res.status(200).json({msn: "credenciales incorrectas"});
});


router.use(fileUpload({
    fileSize: 5 * 1024 * 1024
}));
router.put("/updateavatar", midleware, (req, res) => {
    var params = req.query;
    var bodydata = req.body;
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID es necesario"});
        return;
    }
    var image = req.files.file;
    var path = __dirname.replace(/\/routes/g, "/avatar");
    console.log(path);
    var date = new Date();
    var foto  = sha1(date.toString()).substr(1, 5);
    var totalpath = path + "/" + foto + "_" + image.name.replace(/\s/g,"_");
    console.log(totalpath);
    image.mv(totalpath, (err) => {
        if (err) {
            return res.status(300).send({msn : "Error al escribir el archivo en el disco duro"});
        }
        var obj = {};
        obj["pathfile"] = totalpath;
        //obj["hash"] = totalpath;
        obj["relativepath"] = "/v1.0/api/getfile/?id=" + totalpath; //obj["hash"];
        console.log(obj);
        USER.update({_id:  params.id}, {$set: obj /*updateobjectdata*/}, (err, docs) => {
		if (err) {
           res.status(500).json({msn: "Existen problemas en la base de datos"});
           return;
        } 
        res.status(200).json(docs);
    	});
    });

    /*var allowkeylist = ["name", "email", "password"];
    var keys = Object.keys(bodydata);
    var updateobjectdata = {};
    for (var i = 0; i < keys.length; i++) {
        if (allowkeylist.indexOf(keys[i]) > -1) {
            updateobjectdata[keys[i]] = bodydata[keys[i]];
        }
    }*/
    /*USER.update({_id:  params.id}, {$set: updateobjectdata}, (err, docs) => {
       if (err) {
           res.status(500).json({msn: "Existen problemas en la base de datos"});
            return;
        } 
        res.status(200).json(docs);
    });*/

});

router.get("/getfile", midleware, async(req, res, next) => {
    var params = req.query;
    if (params == null) {
        res.status(300).json({
            msn: "Error es necesario un ID"
        });
        return;
    }
    var id = params.id;
    var usuario =  await USER.find({_id: id});
    if (usuario.length > 0) {
        var path = usuario[0].pathfile;
        if (path!=null) {
        res.sendFile(path);
        return;
    	}
    	else{
    		res.status(200).json(usuario[0]);
        	return;
    	}
    }
    res.status(300).json({
        msn: "Error en la petición"
    });
    return;
});


module.exports = router;
