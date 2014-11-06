describe("FireBall", function(){
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
	
	it("Prueba Fireball",function(){
		SpriteSheet = {
			map : {explosion: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 },
					 ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 }}
			};

			miNave = board.add(new PlayerShip());
		
			Game = {keys: {'n': true}};
			board.step(3.5);
			expect(board.objects.length).toBe(1);
	});
});
