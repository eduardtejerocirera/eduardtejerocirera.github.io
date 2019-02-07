var bola = {
    z: -3.5,
    x: -1.5,
	y: 0.1,
    originalZ: -3.5,
    originalX: -1.5,
    originalY: 0.1,
    originalScale: 0.018,
    incrX: 0,
    incrY: 0,
    incrZ: 0,
	scale: 0.018, 	
    model: null,
    current:1,
    bolaExist: 0,
    yRot: 90,
    zRot: 90,
 	
    load: function(){
        	
            this.model = [];
            this.model.inScene = false;
            this.model.vnBuffer = null;
            this.model.vpBuffer = null;
            this.model.textureBuffer = null;
            this.model.diffTexture = null;
            
			
    		path = MODELPATH + "escenari/s2.obj";
     		K3D.load(path, function(e){
            	bola.handleLoadedbola(e);
    		});
		
            path = MODELPATH + "escenari/energy.jpg";
            this.model.diffTexture = loadTexture(path);

    },

    handleLoadedbola: function(data, j){

	    
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

    pintabola: function(){
        if (this.model.vpBuffer != null && this.model.vnBuffer != null && this.bolaExist) {

			
            this.moubola();
			//drawBlinnText(this.model, 0.0);
			DrawlightBall(this.model, 0.0);
        }
    },

    moubola: function(){
		this.z += this.incrZ;
		this.x += this.incrX; 
        this.y += this.incrY;
		this.scale = (bola.scale - 0.00001);
        mat4.identity(mvMatrix);
		
		if( Goku.x < -4.5 ){
			this.originalX = -0.5;
		} else if( Goku.x > 4.5 ){
			this.originalX = 0.5;
		} else{
			this.originalX = 0.0;
		}
		
		mat4.translate(mvMatrix, mvMatrix, [this.x, this.y, this.z]);
        mat4.rotate(mvMatrix, mvMatrix, degToRad(this.yRot), [0, 1, 0]);
        mat4.rotate(mvMatrix, mvMatrix, degToRad(this.zRot), [0, 0, 1]);
        mat4.scale(mvMatrix,mvMatrix,[this.scale ,this.scale ,this.scale]);

        if ( Math.abs(this.z - Goku.z) <=2 && Math.abs(this.y - Goku.y) <=2 && Math.abs(this.x - Goku.x) <= 2){
			this.bolaExist = 0;
            this.z = this.originalZ;
            this.x = this.originalX;
            this.y = this.originalY;
            Goku.gokuTocat = 1;
            this.scale = this.originalScale;
        }
		
		if (this.z <= -100){
			this.bolaExist = 0;
			this.z = this.originalZ;
            
			if( Goku.x < -4.5 ){
				this.originalX = -0.5;
			} else if( Goku.x > 4.5 ){
				this.originalX = 0.5;
			} else{
				this.originalX = 0.0;
			}
			
            this.y = this.originalY;
			this.scale = this.originalScale;
		}
    },
	

	
}