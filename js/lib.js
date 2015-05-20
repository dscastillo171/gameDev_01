var Util = Util || {};

(function(){
	// Cargar sprites.
	var sprites = new Image();
	sprites.src = 'sprites/sprites.gif';
	var flipedSriptes = new Image();
	flipedSriptes.src = 'sprites/spritesFlip.gif';

	// Mapa del juego.
	var crearMapa = function(){
		return Object.seal(Object.create({}, {
			"dibujar": {
				value: function(ctx, ancho, alto, contador){
					if(ancho >= 200 && alto >= 200){
						ctx.lineWidth = 2;
						ctx.strokeStyle = '#E2E2E2';
						ctx.font = "10px Monaco";
						ctx.fillStyle = '#EBB3B3';
						
						ctx.beginPath();
						ctx.moveTo(50, 0);
						ctx.lineTo(50, alto);
						ctx.stroke();

						ctx.beginPath();
						ctx.moveTo(0, 50);
						ctx.lineTo(ancho, 50);
						ctx.stroke();

						for(var i = 50; i < alto - 50; i += 50){
							ctx.beginPath();
							ctx.moveTo(40, i);
							ctx.lineTo(60, i);
							ctx.stroke();
							if(i % 100 === 0){
								ctx.fillText(i + 'px', 63, i + 3);
							}
						}

						for(var i = 50; i < ancho - 50; i += 50){
							ctx.beginPath();
							ctx.moveTo(i, 40);
							ctx.lineTo(i, 60);
							ctx.stroke();
							if(i % 200 === 0){
								ctx.fillText(i + 'px', i - 10, 37);
							}
						}

						ctx.fillStyle = '#EBEBEB';
						ctx.fillRect(0, 350, ancho, alto - 350);

						ctx.strokeStyle = '#000';
						ctx.beginPath();
						ctx.moveTo(0, 350);
						ctx.lineTo(ancho, 350);
						ctx.stroke();

						for(var i = -40; i < ancho; i += 40){
							ctx.beginPath();
							ctx.moveTo(i + 80, 350);
							ctx.lineTo(i, alto);
							ctx.stroke();
						}

						if(contador){
							var tiempo = (new Date()).getTime() - contador.getTime();
							var segundos = Math.round(tiempo * 0.001);
			        		var minutos = Math.floor(segundos / 60);
			        		segundos = segundos - (minutos * 60);
			        		segundos = segundos < 10 ? '0' + segundos: segundos;
			        		ctx.font = "bold 18px Monaco";
			        		ctx.fillStyle = '#000';
			        		ctx.fillText(minutos + 'm ' + segundos + 's', ancho - 80, 40);
						}
					}
				}
			}
		}));
	};
	

	// Objeto jugador.
	var crearJugador = function(){
		var contador = 0;
		var movimientos = 0;
		var adelante = true;
		var corriendo = false;
		var estado = 'parado';
		var nuevoEstado = function(bitmap){
			if(bitmap & 1 || bitmap & 2){
				estado = 'corriendo';
				corriendo = true;
			} else{
				corriendo = false;
			}
			if(bitmap & 4){
				estado = 'saltando';
			} else if(bitmap === 0){
				estado = 'parado';
			}
		};
		return Object.seal(Object.create({}, {
			"alto": {
				value: 40
			},
			"ancho": {
				value: 30
			},
			"corriendo": {
				get: function(){
					return corriendo;
				}
			},
			"derecha": {
				value: function(inicia){
					if(inicia){
						movimientos = movimientos | 1;
						adelante = true;
					} else{
						movimientos = movimientos ^ 1;
						if(movimientos & 2){
							adelante = false;
						}
					}
					nuevoEstado(movimientos);
				}
			},
			"izquierda": {
				value: function(inicia){
					if(inicia){
						movimientos = movimientos | 2;
						adelante = false;
					} else{
						movimientos = movimientos ^ 2;
						if(movimientos & 1){
							adelante = true;
						}
					}
					nuevoEstado(movimientos);
				}
			},
			"salto": {
				value: function(inicia){
					if(inicia){
						movimientos = movimientos | 4;	
					} else{
						movimientos = movimientos ^ 4;
					}
					nuevoEstado(movimientos);
				}
			},
			"muerto": {
				value: function(){
					estado = 'muerto';
				}
			},
			"dibujar": {
				value: function(ctx, x, y){
					if(estado === 'muerto'){
						ctx.drawImage(sprites, 504, 0, 80, 80, x - 5, y, 40, 40);
					} else if(estado === 'parado'){
						if(adelante){
							ctx.drawImage(sprites, 98, 0, 60, 80, x, y, 30, 40);
						} else{
							ctx.drawImage(flipedSriptes, 538, 0, 60, 80, x, y, 30, 40);
						}
					} else if(estado === 'saltando'){
						if(adelante){
							ctx.drawImage(sprites, 172, 0, 80, 80, x - 5, y, 40, 40);
						} else{
							ctx.drawImage(flipedSriptes, 442, 0, 80, 80, x - 5, y, 40, 40);
						}
					} else if(estado === 'corriendo'){
						if(adelante){
							if(contador === 0){
								ctx.drawImage(sprites, 22, 0, 60, 80, x, y, 30, 40);
							} else if(contador === 1 || contador === 3){
								ctx.drawImage(sprites, 270, 0, 60, 80, x, y, 30, 40);
							} else{
								ctx.drawImage(sprites, 422, 0, 80, 80, x - 5, y, 40, 40);
							}
						} else{
							if(contador === 0){
								ctx.drawImage(flipedSriptes, 612, 0, 60, 80, x, y, 30, 40);
							} else if(contador === 1 || contador === 3){
								ctx.drawImage(flipedSriptes, 366, 0, 60, 80, x, y, 30, 40);
							} else{
								ctx.drawImage(flipedSriptes, 198, 0, 80, 80, x - 5, y, 40, 40);
							}
						}
					}
					contador++;
					if(contador === 4){
						contador = 0;
					}
				}
			}
		}));
	};
	
	// Objeto bala.
	var crearBala = function(inicialX, inicialY, direccion){
		var posX = inicialX - 40;
		var posY = inicialY + 7;
		var derecha = direccion;
		return Object.seal(Object.create({}, {
			"actualizar": {
				value: function(maximo){
					if(derecha){
						posX += 7.0;
					} else{
						posX += -7.0;
					}

					if((derecha && posX > maximo) || (!derecha && posX + 40 < 0)){
						return true;
					} else{
						return false;
					}
				}
			},
			"colision": {
				value: function(x, y, ancho, alto){
					var hitbox = {x: posX + 10, y: posY + 10, w: 20, h: 15};
					if (posX < x + ancho && posX + 40 > x && posY < y + alto && 35 + posY > y) {
						return true;
					} else{
						return false;
					}
				}
			},
			"dibujar": {
				value: function(ctx){
					if(derecha){
						ctx.drawImage(flipedSriptes, 20, 0, 80, 70, posX, posY, 40, 35);
					} else{
						ctx.drawImage(sprites, 595, 0, 80, 70, posX, posY, 40, 35);
					}
				}
			}
		}));
	};

	// Controles.
	var crearControles = function(){
		var callbacks = {
			derecha: function(){

			},
			izquierda: function(){

			},
			salto: function(){

			}
		};
		document.onkeydown = function (e){
		    e = e || window.event;
		    if(e.keyCode === 39){
		    	if(typeof callbacks.derecha === 'function'){
		    		callbacks.derecha(true);
		    	}
		    } else if(e.keyCode === 37){
		    	if(typeof callbacks.izquierda === 'function'){
		    		callbacks.izquierda(true);
		    	}
		    }  else if(e.keyCode === 32){
		    	if(typeof callbacks.salto === 'function'){
			    	callbacks.salto(true);
			    }
		    }
		};
		document.onkeyup = function (e){
			e = e || window.event;
		    if(e.keyCode === 39){
		    	if(typeof callbacks.derecha === 'function'){
		    		callbacks.derecha(false);
		    	}
		    } else if(e.keyCode === 37){
		    	if(typeof callbacks.izquierda === 'function'){
		    		callbacks.izquierda(false);
		    	}
		    }  else if(e.keyCode === 32){
		    	if(typeof callbacks.salto === 'function'){
			    	callbacks.salto(false);
			    }
		    }
		};
		return Object.seal(Object.create({}, {
			"mapear": {
				value: function(tecla, callback){
					callbacks[tecla] = callback;
				}
			}
		}));
	};

	// Exportar propiedades.
	Object.defineProperties(Util, {
		"crearMapa": {
			value: crearMapa,
			enumerable: true
		},
		"crearJugador": {
			value: crearJugador,
			enumerable: true
		},
		"crearControles": {
			value: crearControles,
			enumerable: true
		},
		"crearBala": {
			value: crearBala,
			enumerable: true
		}
	});
})();