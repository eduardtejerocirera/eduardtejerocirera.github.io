var Piccolo = {
	model: null,
 	x: -0.5,
    y: -2.0,
    z: -1.2,
	scale: 0.1,
	xRot: 15,
	yRot: 80,
	zRot: 0,
    phraseArray : null,
    phraseCount : 0,
    blazeArray: null,
    blazeCount: 0,

	load : function(){
		this.model = [];
        this.model.inScene = false;
        this.model.vnBuffer = null;
        this.model.vpBuffer = null;
        this.model.textureBuffer = null;
        this.model.diffTexture = null;

        path = MODELPATH + "gokuDefinitiu/piccolo.obj";
        K3D.load(path, function(e){
            Piccolo.handleLoadedPiccolo(e);
        });

        path = MODELPATH + "gokuDefinitiu/piccolo.jpg";
        this.model.diffTexture = loadTexture(path);
	},

	handleLoadedPiccolo: function(data){

	    //console.log(data);
		var model = K3D.parse.fromOBJ(data);
	
		var normals = K3D.edit.unwrap(model.i_norms , model.c_norms , 3);
        this.model.vnBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.model.vnBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        this.model.vnBuffer.itemSize = 3;
        this.model.vnBuffer.numItems = normals.length / 3;

		var vertices = K3D.edit.unwrap(model.i_verts, model.c_verts, 3);
        this.model.vpBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.model.vpBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        this.model.vpBuffer.itemSize = 3;
        this.model.vpBuffer.numItems = vertices.length / 3;

        var uvs = K3D.edit.unwrap(model.i_uvt, model.c_uvt, 2);
        this.model.textureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.model.textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
        this.model.textureBuffer.itemSize = 2;
        this.model.textureBuffer.numItems = uvs.length / 2;
    },

    pintaPiccolo: function(){
        if (this.model.vpBuffer != null && this.model.vnBuffer != null) {
            this.mouPiccolo();
            drawBlinnText(this.model, 0.0);
        }
    },

    mouPiccolo: function(){
        mat4.identity(mvMatrix);
        
		mat4.translate(mvMatrix, mvMatrix, [0.0, this.y, this.z]);
        
        mat4.rotate(mvMatrix, mvMatrix, degToRad(this.xRot), [1, 0, 0]);
        if( Goku.x < -4.5 ){
			mat4.rotate(mvMatrix, mvMatrix, degToRad(120), [0, 1, 0]);
		} else if( Goku.x > 4.5 ){
			mat4.rotate(mvMatrix, mvMatrix, degToRad(55), [0, 1, 0]);
		} else{
			mat4.rotate(mvMatrix, mvMatrix, degToRad(90), [0, 1, 0]);
		}
        mat4.rotate(mvMatrix, mvMatrix, degToRad(this.xRot), [0, 0, 1]);
        
        mat4.scale(mvMatrix,mvMatrix,[this.scale ,this.scale ,this.scale]);
    },

    talkPhrase: function(){
		this.phraseArray[this.phraseCount].volume = .5;
        this.phraseArray[this.phraseCount].play();
        this.phraseCount++;
        if (this.phraseCount == this.phraseArray.length) this.phraseCount = 0;
    },

    blazeSound: function(){
        this.blazeArray[this.blazeCount].play();
        this.blazeCount++;
        if(this.blazeCount == this.blazeArray.length) this.blazeCount = 0;
    }


}