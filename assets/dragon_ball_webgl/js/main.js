


    //variables globals
    var gl;
    var canvas;
    var mvMatrix;
    var pMatrix;
    var mainMusic;
	var rainMusic;
    var phraseArray;

    var MODELPATH = "/assets/dragon_ball_webgl/models/";
    var SOUNDPATH = "/assets/dragon_ball_webgl/sounds/"

	// Incialitza el context WebGL
    function initGL(canvas) {
        try {
			gl = WebGLUtils.setupWebGL(canvas);
        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
    }

    function resize(gl) {
      // Get the canvas from the WebGL context
      var canvas = gl.canvas;
     
      // Lookup the size the browser is displaying the canvas.
      var displayWidth  = canvas.clientWidth;
      var displayHeight = canvas.clientHeight;
     
      // Check if the canvas is not the same size.
      if (canvas.width  != displayWidth ||
          canvas.height != displayHeight) {
     
        // Make the canvas the same size
        canvas.width  = displayWidth;
        canvas.height = displayHeight;
     
        // Set the viewport to match
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    }

	// Crea i compila un objecte del tipus shader
    function getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }
	
	// Inicitalitza shaders
	function createProgram(fragmentShaderID, vertexShaderID)
	{
		var fragmentShader = getShader(gl, fragmentShaderID);
        var vertexShader = getShader(gl, vertexShaderID);

		var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders" + fragmentShaderID + " " + vertexShaderID);
        }		
		
		return shaderProgram;
	}


	// Crea tots els programes --> program.js
    function initShaders() {
        initTextureFramebuffer();
        createBoxBuffers();

        createBlinnTextProgram();
        createBlinnNormalProgram();
        createStormProgram();
		createlightBallProgram();
        createGlowProgram();
        createBlurProgram();
	}

	function loadModels() {
        Goku.load();
		Escenari.load();
		bola.load();
        Piccolo.load();
		
	}		
		
	// Funcions de pintar
    function drawScene() {
        //netegem buffers
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
        //pintem

		Escenari.pintaEscenari();
        Piccolo.pintaPiccolo();
		bola.pintabola();
        Goku.pintaGoku();
        

    }

    var glowFramebuffer;
    var glowTexture;
    var blurTexture;

    function initTextureFramebuffer() {
    
        glowFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, glowFramebuffer);
        glowFramebuffer.width = 256;
        glowFramebuffer.height = 256;

        glowTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, glowTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, glowFramebuffer.width, glowFramebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.generateMipmap(gl.TEXTURE_2D);

        blurTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, blurTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, glowFramebuffer.width, glowFramebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.generateMipmap(gl.TEXTURE_2D);

        var renderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, glowFramebuffer.width, glowFramebuffer.height);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, glowTexture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
        
         if (!gl.isFramebuffer(glowFramebuffer)) {
                throw("Invalid framebuffer");
        }
        var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        switch (status) {
            case gl.FRAMEBUFFER_COMPLETE:
                break;
            case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                throw("Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
                break;
            case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                throw("Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
                break;
            case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                throw("Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
                break;
            case gl.FRAMEBUFFER_UNSUPPORTED:
                throw("Incomplete framebuffer: FRAMEBUFFER_UNSUPPORTED");
                break;
            default:
                throw("Incomplete framebuffer: " + status);
        }       

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    var boxVertexPositionBuffer;
    var boxVertexTextureCoordBuffer;
    function createBoxBuffers()
    {
        boxVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexPositionBuffer);
        var vertices = [
            -1.0, -1.0,
             1.0, -1.0,
             1.0,  1.0,
            -1.0, -1.0,
             1.0,  1.0,
            -1.0,  1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        boxVertexPositionBuffer.itemSize = 2;
        boxVertexPositionBuffer.numItems = 6;

        boxVertexTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexTextureCoordBuffer);
        var texCoords = [
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
        boxVertexTextureCoordBuffer.itemSize = 2;
        boxVertexTextureCoordBuffer.numItems = 6;
    }


	// Bucle principal que es crida amb un frame rate constant
    function tick() {
        requestAnimFrame(tick);
        handleKeys();
        animate();
		drawScene();
    }
	
    //inicialitzem matrius
    function initMatrix(){
        //matriu de projeccio
        pMatrix = mat4.create();
        var aspect = canvas.clientWidth / canvas.clientHeight;
        mat4.perspective(pMatrix, 45, aspect, 0.1, 1000.0);

        mvMatrix = mat4.create();
    }
	

    function initTextures(){
        //Carreguem les textures del goku dins de Goku.load() ja està fet
    }


    function loadTexture(texturePath) {
        var texture = gl.createTexture();
        
        texture.image = new Image();
        texture.image.onload = function () {
            handleLoadedTexture(texture)
        }
        texture.image.src = texturePath;
        
        return texture;
    }

    function handleLoadedTexture(texture) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
                      gl.UNSIGNED_BYTE, texture.image);
                      
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

     function initMusic(){
		mainMusic = new Audio(SOUNDPATH + "combat.mp3");
		mainMusic.volume = .5;
        mainMusic.addEventListener('ended', function(){
		this.currentTime = 0;
		this.play();
		}, false);

        mainMusic.addEventListener('loadeddata', () => {
            mainMusic.play();
        });

		//mainMusic.play();
		
		rainMusic = new Audio(SOUNDPATH + "rain.mp3");
        rainMusic.addEventListener('ended', function(){
		this.currentTime = 0;
		this.play();
		}, false);
		//rainMusic.play();

        rainMusic.addEventListener('loadeddata', () => {
            rainMusic.play();
        });

        Piccolo.phraseArray = [];
        Piccolo.phraseArray[0] = new Audio( SOUNDPATH + "phrase1.mp3");
        Piccolo.phraseArray[1] = new Audio( SOUNDPATH + "phrase2.mp3");
        Piccolo.phraseArray[2] = new Audio( SOUNDPATH + "phrase3.mp3");
        Piccolo.phraseArray[3] = new Audio( SOUNDPATH + "phrase4.mp3");
        setInterval(function(){Piccolo.talkPhrase();}, 8000);

        Piccolo.blazeArray = [];
        Piccolo.blazeArray[0] = new Audio( SOUNDPATH + "blaze1.mp3");
        Piccolo.blazeArray[1] = new Audio( SOUNDPATH + "blaze2.mp3");

        Goku.transformArray = [];
        Goku.transformArray[0] = new Audio( SOUNDPATH + "transf1.mp3");
        Goku.transformArray[1] = new Audio( SOUNDPATH + "transf2.mp3");
    }

	function handleEndedSound( event ){
		this.currentTime = 0;
		this.play();
	}

	// Funció d'inicialització
    function webGLStart() {
        canvas = document.getElementById("webgl-canvas");
        initGL(canvas);
        resize(gl);
        initShaders();
        initMatrix();
        initTextures();
        initMusic(); 
 		loadModels();

        gl.clearColor(0.5, 0.8, 0.9, 1.0);
        gl.enable(gl.DEPTH_TEST);

        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;

        tick();
    }


    //IMPORT IS DEPRECATED
     
    //funcio que carrega htmls externs --> shaders
     /*function loadFiles(){
        var link = document.querySelector('link[rel="import"]');

        // Clone the <template> in the import.
        var template = link.import.querySelector('template');
        var clone = document.importNode(template.content, true);

        document.querySelector('#container').appendChild(clone);

        webGLStart();
    }*/