/*

  Requisitos: 

  La nave del usuario disparar� 2 misiles si est� pulsada la tecla de
  espacio y ha pasado el tiempo de recarga del arma.

  El arma tendr� un tiempo de recarga de 0,25s, no pudi�ndose enviar
  dos nuevos misiles antes de que pasen 0,25s desde que se enviaron
  los anteriores



  Especificaci�n:

  - Hay que a�adir a la variable sprites la especificaci�n del sprite
    missile

  - Cada vez que el usuario presione la tecla de espacio se a�adir�n
    misiles al tablero de juego en la posici�n en la que est� la nave
    del usuario. En el c�digo de la clase PlayerSip es donde tienen
    que a�adirse los misiles

  - La clase PlayerMissile es la que implementa los misiles. Es
    importante que la creaci�n de los misiles sea poco costosa pues va
    a haber muchos disparos, para lo cual se declarar�n los m�todos de
    la clase en el prototipo

*/

describe("PlayerMissile", function(){
   
   var canvas, ctx;
	var board;
	
   beforeEach(function(){
       
       loadFixtures('index.html');

       canvas = $('#game')[0];
       expect(canvas).toExist();

       ctx = canvas.getContext('2d');
       expect(ctx).toBeDefined();
       board = new GameBoard();
       oldSpriteSheet = SpriteSheet;
   });
   
   afterEach(function(){
   	SpriteSheet = oldSpriteSheet;
   });

	it("Prueba PlayerMissile", function() {
		SpriteSheet.map = {missile: {h:10, w:2}};
		disparo = new PlayerMissile(1, 1);
		
		expect(disparo.w).toBe(SpriteSheet.map['missile'].w);
		expect(disparo.h).toBe(SpriteSheet.map['missile'].h);
		expect(disparo.x).toEqual(0);
		expect(disparo.y).toEqual(-9);
		expect(disparo.vy).toEqual(-700);
	});

	it("Draw PlayerMissile", function() {
		SpriteSheet = {
			draw: function(){},
			map: {missile: {sx: 0, sy: 30, w: 2, h: 10, frames: 1}}
			};
		var aux = {};
		disparo = new PlayerMissile(1,1);
		
		spyOn(SpriteSheet, 'draw');
		disparo.draw(aux);
		
		expect(SpriteSheet.draw).toHaveBeenCalled();
	});

	it("Step PlayerMissile", function() {
		disparo = new PlayerMissile(1, 1);
		var yAux = disparo.y;
		var cte = -1;
		//creo un board nuevo con un campo remove vacio, necesario para step.
		var newBoard = {
			remove: function() {}
		};
		
		disparo.board = newBoard;
		spyOn(newBoard, "remove");
		
		disparo.step(cte);
		//en estos momentos this.y = 709 ser� mayor que -this.h = -10 por lo que no se cumplira la condicion para llamara a .remove
		expect(disparo.y).toBe(yAux + disparo.vy*cte);
		expect(newBoard.remove).not.toHaveBeenCalled();
		//modifico el valor del argumento que le paso a .step para que se cumpla la condicion y se llame a .remove con disparo como argumento
		disparo.step(1+(-disparo.h-disparo.y)/disparo.vy);
		expect(newBoard.remove).toHaveBeenCalledWith(disparo);
	});

});
