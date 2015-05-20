var canvas = document.getElementById('canvasElement');
var contexto = canvas.getContext('2d');

var mapa = Util.crearMapa();
var jugador = Util.crearJugador();
var controles = Util.crearControles();
var balas = [];

var posX = 100;
var posY = 350 - jugador.alto;
var velX = 0;
var velY = 0;
var enPiso = true;
var gravedad = 1.0;

controles.mapear('derecha', function(inicia){
	jugador.derecha(inicia);
	if(inicia){
		velX = 10.0;
	} else if(jugador.corriendo){
		velX = -10.0;
	} else{
		velX = 0;
	}
});
controles.mapear('izquierda', function(inicia){
	jugador.izquierda(inicia);
	if(inicia){
		velX = -10.0;
	} else if(jugador.corriendo){
		velX = 10.0;
	} else{
		velX = 0;
	}
});
controles.mapear('salto', function(inicia){
	if(inicia && enPiso){
		velY = -18;
		enPiso = false;
		jugador.salto(true);
	} else if(velY < -6.0 && !enPiso){
		velY = -6.0;
	}
});


var actualizar = function(){
	velY += gravedad;
	posY += velY;
	posX += velX;

	if(posY > 350 - jugador.alto){
		posY = 350 - jugador.alto;
		velY = 0;

		if(!enPiso){
			enPiso = true;
			jugador.salto(false);
		}
	}
	if(posX <= 0 || posX >= 600 - jugador.ancho){
		posX -= velX;
	}

	var balasRestantes = []; 
	for(var i = 0; i < balas.length; i++){
		if(!balas[i].actualizar(600)){
			balasRestantes.push(balas[i]);
		} else{
			if(timeInterval > 2000){
				timeInterval -= 400;
			} else if(timeInterval > 1000){
				timeInterval -= 100;
			} else{
				timeInterval -= 10;
			}
			if(timeInterval < 500){
				timeInterval = 500;
			}
		}
	}
	balas = balasRestantes;
}

var contador = new Date();
var dibujar = function(){
	contexto.clearRect(0, 0, 600, 450);
	mapa.dibujar(contexto, 600, 450, contador);
	for(var i = 0; i < balas.length; i++){
		balas[i].dibujar(contexto);
	}
	jugador.dibujar(contexto, posX, posY);
}

var stamp = new Date();
var timeInterval = 4000;
var balear = function(){
	var ahora = new Date();
	if(ahora.getTime() - stamp.getTime() >= timeInterval){
		var derecha = Math.random() > 0.5;
		var bala = Util.crearBala(derecha? 0: 600, (Math.floor(Math.random() * 3) * 50) + 200, derecha);
		balas.push(bala);
		stamp = ahora;
	}
}

var colision = function(){
	for(var i = 0; i < balas.length; i++){
		if(balas[i].colision(posX, posY, jugador.ancho, jugador.alto)){
			jugador.muerto();
			clearInterval(interval);
		}
	}
};

var interval = setInterval(function function_name (argument) {
	balear();
	actualizar();
	colision();
	dibujar();
}, 1000 / 30);