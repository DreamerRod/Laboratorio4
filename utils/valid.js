
var valid = {
checkParams: function(refobj, evalueobj) { //req, res
var msn="";
for (var i = 0; i < Object.keys(evalueobj).length; i++) {
	var cont=0;
	for (var j = 0; j < Object.keys(refobj).length; j++) {
		if (Object.keys(refobj)[j]==Object.keys(evalueobj)[i]) {
			cont++;
		}
		//msn=msn+Object.keys(evalueobj)[i]+" - "+Object.keys(refobj)[j]+" <--> ";
	}
	if (cont==0) {
		msn=msn+Object.keys(evalueobj)[i]+" no existe - ";
	}
}
if (msn!="") {
	msn="añadir datos: "+msn;
	return msn;
}

if (refobj.name!=null || refobj.name!="") {
	for (var i = 0; i < refobj.name.length; i++) {
		if (parseInt(refobj.name[i])>=0||refobj.name[i]=="&") {
			msn="el nombre no debe contener otro tipo de caracteres o numeros";
			return msn;
		}
	}
	if (refobj.email!=null || refobj.email!="") {
		if (!/^[\w\.]+@[\w\.]+\.\w{3,3}$/.test(refobj.email)) {
			msn="el email tiene datos incorrectos";
			return msn;
		}
		if (refobj.password!=null || refobj.password!="") {
			if (refobj.password.length<6||refobj.password.length==null) {
				msn="la contraseña debe contener mas caracteres";
				return msn;
			}
			if (!/^[A-Z]{1,1}/.test(refobj.password)) {
				msn="la contraseña debe empezar con letras en mayuscula";
				return msn;
			}
			if (!/[A-Z]+/.test(refobj.password)) {
				msn="la contraseña debe contener letras en mayuscula";
				return msn;
			}
			/*if (!/[a-z]+/.test(refobj.password)) {
				msn="la contraseña debe contener letras";
				return msn;
			}*/
			if (!/[0-9]+/.test(refobj.password)) {
				msn="la contraseña debe contener numeros";
				return msn;
			}
			if (!/[\$\^\@\&\(\)\{\}\#]+/.test(refobj.password)) {
				msn="la contraseña debe contener caracteres especiales";
				return msn;
			}
			if (refobj.registerdate==null||refobj.registerdate=="") {
				refobj.registerdate = new Date();
			}
			if (refobj.registerdate!=null || refobj.registerdate!="") {
				if (refobj.sex!=null || refobj.sex!="") {
					if (refobj.sex!="femenino"&&refobj.sex!="masculino") {
						msn="el tipo de sexo debe ser definido por femenino o masculino";
						return msn;
					}
					if (refobj.pathfile==""||refobj.pathfile==null) {
						refobj.pathfile=="";
					}
					if (refobj.relativepath==""||refobj.relativepath==null) {
						refobj.relativepath=="";
					}
					if (refobj.permisos==""||refobj.permisos==null) {
						refobj.permisos=="";
					}
					if (refobj.address!=null || refobj.address!="") {
						msn="true";
						return msn;
					}
					else{
						msn="la direccion es requerida";
						return msn;
					}
				}
				else{
					msn="el sexo es requerida";
					return msn;
				}
			}
			else{
				msn="la fecha es requerida";
				return msn;
			}
		}
		else{
			msn="la contraseña es requerida";
			return msn;
		}
	}
	else{
		msn="el email es necesario";
		return msn;
	}
}
else{
	msn="el nombre es necesario";
	return msn;
}

},
checkPassword: function (password) {

var msn="";
if (password.length<6||password.length==null) {
	msn="la contraseña debe contener mas caracteres";
	return msn;
}
if (!/^[A-Z]{1,1}/.test(password)) {
	msn="la contraseña debe empezar con letras en mayuscula";
	return msn;
}
if (!/[A-Z]+/.test(password)) {
	msn="la contraseña debe contener letras en mayuscula";
	return msn;
}
/*if (!/[a-z]+/.test(password)) {
	msn="la contraseña debe contener letras";
	return msn;
}*/
if (!/[0-9]+/.test(password)) {
msn="la contraseña debe contener numeros";
return msn;
}
if (!/[\$\^\@\&\(\)\{\}\#]+/.test(password)) {
	msn="la contraseña debe contener caracteres especiales";
	return msn;
}
msn="true";
return msn;

},
checkEmail: function(email) {

var msn="";
if (!/^[\w\.]+@[\w\.]+\.\w{3,3}$/.test(email)) {
	/*msn="el email tiene datos incorrectos";
	return msn;*/
	msn = "Existen problemas en la base de datos";
    return msn;
}
else{
msn="true";
return msn;
}
}
};


module.exports = valid;