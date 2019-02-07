// Funcions per controlar la posició i rotació dels objectes de l'escena
	
     var lastTime = 0;
	 //var gokuTocat = 0;
     var globalTime = 0.0;

     var KEY_W = 87, KEY_A = 65, KEY_S = 83, KEY_D = 68, KEY_Q = 81, KEY_E = 69, KEY_SPACE = 32, 
        KEY_SHIFT = 16, KEY_1 = 49, KEY_2 = 50, KEY_ENTER = 13;

    // Modifica l'estat de la rotació
    function animate() {
        var timeNow = new Date().getTime();
        /*if (lastTime != 0) {
            var elapsed = timeNow - lastTime;

            yRot += (ySpeed * elapsed) / 1000.0;
        }*/
        var elapsed = timeNow - lastTime;
        yRot += (ySpeed * elapsed) / 1000.0;
        lastTime = timeNow;
        //globalTime += elapsed;


    }

    function Unit(vector){
        norm = Math.sqrt(vector[0] * vector[0] + vector[1]* vector[1] + vector[2] * vector[2]);
        vector[0] = vector[0]/norm;
        vector[1] /= norm;
        vector[2] /= norm;

        return vector;
    }


    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }

    var yRot = 0;
    var ySpeed = -50;

    var z = -2.0;
    var x = 0;
	var y = 0;
    scale = 0.1

    var currentlyPressedKeys = {};

	// Callback de tecla premuda
    function handleKeyDown(event) {
        currentlyPressedKeys[event.keyCode] = true;
    }

	// Callback de tecla desapretada
    function handleKeyUp(event) {
        currentlyPressedKeys[event.keyCode] = false;
        justEntered = false;
    }

    var justEntered = false;

	// Funció que gestiona els events d'entrada d'usuari 
    function handleKeys() {
	
        if (currentlyPressedKeys[KEY_Q]) {
            //key up
			if(Goku.z > -100){
				Goku.z -= 0.5;
			}
			
        }
        if (currentlyPressedKeys[KEY_E]) {
            // key down
            Goku.z += 0.5;
        }

        if (currentlyPressedKeys[KEY_A]){
            //key left 
            Goku.x -=0.5;
        }

        if(currentlyPressedKeys[KEY_D]){
            //key right
            Goku.x +=0.5;
        }
		
		if(currentlyPressedKeys[KEY_W]){
			//key w
			Goku.y +=0.5;
		}
		
		if(currentlyPressedKeys[KEY_S]){
			//key s
			Goku.y -=0.5;
		}

        if(currentlyPressedKeys[KEY_1]){
            //1
            Escenari.scale -= 0.001;
        }

        if(currentlyPressedKeys[KEY_2]){
            //2
            Escenari.scale += 0.001;
        }
		
		if(currentlyPressedKeys[KEY_SPACE]){
            //DISPARA
			//key k
            if (bola.bolaExist == 0){
    			bola.bolaExist=1;
                Piccolo.blazeSound();
                var vector = [0,0,0];
                vector[0] = Goku.x - bola.originalX;
                vector[1] = Goku.y + 2 - bola.originalY;
                vector[2] = Goku.z - bola.originalZ;

                vector = Unit(vector);

                bola.incrX = vector[0];
                bola.incrY = vector[1];
                bola.incrZ = vector[2];

            }

        }

        if(currentlyPressedKeys[KEY_SHIFT] || Goku.gokuTocat == 1){
            if(!justEntered){
                Goku.current++;
                Goku.transformGoku();
                //console.log(Goku.current + "/" + Goku.num);
                if(Goku.current == Goku.num) Goku.current = 0;
                justEntered = true;
				Goku.gokuTocat = 0;
            }
        }

        if(currentlyPressedKeys[KEY_ENTER]){
            //ENTER
            if(!justEntered){
                console.log("Printing info------------------------------");
                console.log("x : " + x);
				console.log("y : " + y);
                console.log("z : " + z);
                console.log("scale : " + scale);
                console.log("-------------------------------------------");
                justEntered = true;
            }
        }
            
    }