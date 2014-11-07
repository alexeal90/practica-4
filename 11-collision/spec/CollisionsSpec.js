/*

  Requisitos:

  El objetivo de este prototipo es que se detecten colisiones entre
  varios tipos de sprites:
  
  - Los misiles tienen ahora una nueva propiedad: el daño (damage) que
    infligen a una nave enemiga cuando colisionan con ella. Cuando un
    misil colisione con una nave enemiga le infligirá un daño de
    cierta cuantía (damage) a la nave enemiga con la que impacta, y
    desaparecerá.

  - Las naves enemigas tienen ahora una nueva propiedad: su salud
    (health).  El daño ocasionado a una nave enemiga por un misil hará
    que disminuya la salud de la nave enemiga, y cuando llegue a cero,
    la nave enemiga desaparecerá.

  - cuando una nave enemiga colisione con la nave del jugador, deberá
    desaparecer tanto la nave enemiga como la nave del jugador.



  Especificación:

  En el prototipo 07-gameboard se añadió el constructor GameBoard. El
  método overlap() de los objetos creados con GameBoard() ofrece
  funcionalidad para comprobar si los rectángulos que circunscriben a
  los sprites que se le pasan como parámetros tienen intersección no
  nula. El método collide() de GameBoard utiliza overlap() para
  detectar si el objeto que se le pasa como primer parámetro ha
  colisionado con algún objeto del tipo que se le pasa como segundo
  parámetro.

  En este prototipo se utilizará el método collide() para detectar los
  siguientes tipos de colisiones:

    a) detectar si un misil disparado por la nave del jugador
       colisiona con una nave enemiga

    b) detectar si una nave enemiga colisiona con la nave del jugador


  En el método step() de los objetos creados con PlayerMissile() y
  Enemy(), tras "moverse" a su nueva posición calculada, se comprobará
  si han colisionado con algún objeto del tipo correspondiente. 

  No interesa comprobar si se colisiona con cualquier otro objeto,
  sino sólo con los de ciertos tipos. El misil tiene que comprobar si
  colisiona con naves enemigas. Por otro lado, tras moverse una nave
  enemiga, ésta tiene que comprobar si colisiona con la nave del
  jugador. Para ello cada sprite tiene un tipo y cuando se comprueba
  si un sprite ha colisionado con otros, se pasa como segundo
  argumento a collide() el tipo de sprites con los que se quiere ver
  si ha colisionado el objeto que se pasa como primer argumento.

  Cuando un objeto detecta que ha colisionado con otro, llama al
  método hit() del objeto con el que ha colisionado. 


  Efectos de las colisiones de un misil con una nave enemiga:

    Cuando el misil llama al método hit() de una nave enemiga, pasa
    como parámetro el daño que provoca para que la nave enemiga pueda
    calcular la reducción de salud que conlleva la colisión. Cuando
    una nave enemiga recibe una llamada a su método .hit() realizada
    por un misil que ha detectado la colisión, la nave enemiga
    recalcula su salud reduciéndola en tantas unidades como el daño
    del misil indique, y si su salud llega a 0 desaparece del tablero
    de juegos, produciéndose en su lugar la animación de una
    explosión.

    El misil, tras informar llamando al métod hit() de la nave enemiga
    con la que ha detectado colisión, desaparece.


  Efectos de las colisiones de una nave enemiga con la nave del jugador:

    Cuando la nave del jugador recibe la llamada .hit() realizada por
    una nave enemiga que ha detectado la colisión, la nave del jugador
    desaparece del tablero.

    La nave enemiga, tras informar llamando a hit() de la nave del
    jugador, desaparece también.

*/

describe("CollisionsSpec", function(){
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
   
   it("Colision nave/enemigo", function(){
      
      var naveAux = board.add(new PlayerShip());
      naveAux.x = 5;
      naveAux.y = 5;

   	var enemyAux = board.add(new Enemy(enemies.basic));
      enemyAux.x = 5;
      enemyAux.y = 5;

      board.step(0.01);
      
      //Cuando nave y enemigo colisionan, las dos se destruyen por lo que en board.objects no habra nada despues de la colision
      expect(board.objects.length).toBe(0);
   });
   
   it("Misil no destruye enemigo",function(){

      var missileAux = board.add(new PlayerMissile(5,5));
      missileAux.x = 5;
      missileAux.y = 5;
      missileAux.damage = 1;

		var enemyAux = board.add(new Enemy(enemies.basic));
      enemyAux.x = 5;
      enemyAux.y = 5;

      board.step(0.01);

		// Como el misil le ha quitado solo uno de vida al enemigo, comprobamos que sigue estando en board.objects y que tiene 19 de vida
		expect(board.objects[0]).toBe(enemyAux);
      expect(enemyAux.health).toBe(19);

	});
	
	it("Misil y Fireball destruyen enemigo",function(){
  
      var missileAux = board.add(new PlayerMissile(5,5));
      missileAux.x = 5;
      missileAux.y = 5;
      missileAux.damage = 21;
      
      var fireBallAux = new PlayerFireN(10, 10);

		var enemyAux1 = board.add(new Enemy(enemies.basic));
      enemyAux1.x = 5;
      enemyAux1.y = 5;

		var enemyAux2 = new Enemy(enemies.basic);
      enemyAux2.x = 10;
      enemyAux2.y = 10;

      board.step(0.01);

		// Como enemigo y misil tienen mismas coordenadas, hay colision y, como el daño del misil es mayor que la vida del enemigo,
		// en board.objects tendra solo un objeto cuyo sprite explosion.
		expect(board.objects[0].sprite).toBe('explosion');
      expect(board.objects.length).toBe(1);
      
      board.add(enemyAux2);
      board.add(fireBallAux);
      
	});

});

