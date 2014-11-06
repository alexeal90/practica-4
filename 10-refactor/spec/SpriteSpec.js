describe("Clase SpriteSpec", function(){
    
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

   it("Draw Sprite", function(){

        NuevoSprite= new Sprite();

        spyOn(SpriteSheet, "draw");
 
		  NuevoSprite.draw(ctx)
        expect(SpriteSheet.draw).toHaveBeenCalled();
   });

   it("Setup Sprite", function(){

        enemigo= board.add(new Enemy(enemies.basic));
        
		  spyOn(enemigo, "merge");

		  enemigo.setup(enemies.basic.sprite)
        expect(enemigo.merge).toHaveBeenCalled();
   });

});

