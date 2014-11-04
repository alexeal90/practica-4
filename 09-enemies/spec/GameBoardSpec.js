/*

  En el anterior prototipo (06-player), el objeto Game permite
  gestionar una colecci�n de tableros (boards). Los tres campos de
  estrellas, la pantalla de inicio, y el sprite de la nave del
  jugador, se a�aden como tableros independientes para que Game pueda
  ejecutar sus m�todos step() y draw() peri�dicamente desde su m�todo
  loop(). Sin embargo los objetos que muestran los tableros no pueden
  interaccionar entre s�. Aunque se a�adiesen nuevos tableros para los
  misiles y para los enemigos, resulta dif�cil con esta arquitectura
  pensar en c�mo podr�a por ejemplo detectarse la colisi�n de una nave
  enemiga con la nave del jugador, o c�mo podr�a detectarse si un
  misil disparado por la nave del usuario ha colisionado con una nave
  enemiga.


  Requisitos:

  Este es precisamente el requisito que se ha identificado para este
  prototipo: dise�ar e implementar un mecanismo que permita gestionar
  la interacci�n entre los elementos del juego. Para ello se dise�ar�
  la clase GameBoard. Piensa en esta clase como un tablero de un juego
  de mesa, sobre el que se disponen los elementos del juego (fichas,
  cartas, etc.). En Alien Invasion los elementos del juego ser�n las
  naves enemigas, la nave del jugador y los misiles. Para el objeto
  Game, GameBoard ser� un board m�s, por lo que deber� ofrecer los
  m�todos step() y draw(), siendo responsable de mostrar todos los
  objetos que contenga cuando Game llame a estos m�todos.

  Este prototipo no a�ade funcionalidad nueva a la que ofrec�a el
  prototipo 06.


  Especificaci�n: GameBoard debe

  - mantener una colecci�n a la que se pueden a�adir y de la que se
    pueden eliminar sprites como nave enemiga, misil, nave del
    jugador, explosi�n, etc.

  - interacci�n con Game: cuando Game llame a los m�todos step() y
    draw() de un GameBoard que haya sido a�adido como un board a Game,
    GameBoard debe ocuparse de que se ejecuten los m�todos step() y
    draw() de todos los objetos que contenga

  - debe ofrecer la posibilidad de detectar la colisi�n entre
    objetos. Un objeto sprite almacenado en GameBoard debe poder
    detectar si ha colisionado con otro objeto del mismo
    GameBoard. Los misiles disparados por la nave del jugador deber�n
    poder detectar gracias a esta funcionalidad ofrecida por GameBoard
    cu�ndo han colisionado con una nave enemiga; una nave enemiga debe
    poder detectar si ha colisionado con la nave del jugador; un misil
    disparado por la nave enemiga debe poder detectar si ha
    colisionado con la nave del jugador. Para ello es necesario que se
    pueda identificar de qu� tipo es cada objeto sprite almacenado en
    el tablero de juegos, pues cada objeto s�lo quiere comprobar si ha
    colisionado con objetos de cierto tipo, no con todos los objetos.

*/

describe("GameBoard", function(){
   
   var canvas, ctx;
	var board;
	
   beforeEach(function(){
       
       loadFixtures('index.html');

       canvas = $('#game')[0];
       expect(canvas).toExist();

       ctx = canvas.getContext('2d');
       expect(ctx).toBeDefined();
       board = new GameBoard();
   });

   it("A�ade objetos", function(){
       var objAux= {};
       board.add(objAux);
       expect(board.objects[0]).toBe(objAux);
   	 expect(objAux.board).toBe(board);
   });
   
   it("Borra objetos", function(){
   	 var objAux= {};
   	 
   	 spyOn(board, 'remove').andCallThrough();
   	 spyOn(board, 'resetRemoved').andCallThrough();
   	 spyOn(board, 'finalizeRemoved').andCallThrough();
   	 
   	 board.add(objAux);
   	 board.resetRemoved();
   	 board.remove(objAux);
   	 
   	 expect(board.removed[0]).toBe(objAux);
   	 expect(board.removed.length).toBe(1);
   	 expect(board.resetRemoved).toHaveBeenCalled();
   	 
   	 board.finalizeRemoved();
   	 board.resetRemoved();
   	 expect(board.objects.length).toBe(0);
   	 expect(board.removed.length).toBe(0);
   	 expect(board.finalizeRemoved).toHaveBeenCalled();
   });
   
	it("Prueba iteracion", function(){
   	 var objAux = {
   	 	drawAux: function(){},
   	 	stepAux: function(){}
   	 };
   	 
   	 var objAux2 = {
   	 	drawAux: function(){},
   	 	stepAux: function(){}
   	 };
   	 
   	 board.add(objAux);
   	 board.add(objAux2);
   	 
   	 spyOn(board.objects[0], 'drawAux');
   	 spyOn(board.objects[1], 'stepAux');
   	 
   	 board.iterate('drawAux');
   	 board.iterate('stepAux', 3);
   	 
   	 expect(board.objects[0].drawAux).toHaveBeenCalled();
   	 expect(board.objects[1].stepAux).toHaveBeenCalledWith(3);
   });
   
   it("Prueba detect", function(){
   	 
   	 function decisor () {
			return this.p === 1;
   	 };
   	 
   	 var objAux = {
   	 	p: 0
   	 };
   	 
   	 var objAux2 = {
   	 	p: 1
   	 };
   	 
   	 board.add(objAux);
   	 board.add(objAux2);
   	 
   	 var resultado = board.detect(decisor);
   	 
   	 expect(resultado).toEqual(objAux2);
   });
   
   it("Prueba draw", function(){
   	 spyOn(board, 'iterate');
   	 
   	 board.draw();
   	 
   	 expect(board.iterate).toHaveBeenCalled();
   });
   
   it("Prueba step", function(){
   	 spyOn(board, 'resetRemoved');
   	 spyOn(board, 'iterate');
   	 spyOn(board, 'finalizeRemoved');
   	 
   	 board.step();
   	 
   	 expect(board.resetRemoved).toHaveBeenCalled();
   	 expect(board.iterate).toHaveBeenCalled();
   	 expect(board.finalizeRemoved).toHaveBeenCalled();
   });
   
   it("Existe interseccion", function(){
   	 
   	 var objRef = {x:0, y:0, w:5, h:10};
   	 var objCercano = {x:0, y:2, w:10, h:10};
   	 var objLejano = {x:20, y:20, w:5, h:5};
   	 
   	 expect(board.overlap(objRef,objCercano)).toBeTruthy();
   	 expect(board.overlap(objRef,objLejano)).toBeFalsy();
  	});
   	 
   it("Hay colision", function(){
   	 
   	 var objRef = {x:0, y:0, w:5, h:10, type: 0};
   	 var objCercano = {x:0, y:2, w:10, h:10, type: 1};
   	 var objLejano = {x:20, y:20, w:5, h:5, type: 2};
   	 
   	 // se a�aden a tablero porque se usa collide, que a su vez usa detect, que a su ves usa la lista de objetos
   	 board.add(objRef); 
   	 board.add(objCercano);
   	 board.add(objLejano);
   	 
   	 expect(board.collide(objRef,objCercano.type)).toBe(objCercano);
   	 expect(board.collide(objRef,objLejano)).toEqual(false);
  	});
   		 
   	 
});

