 
 var Goku = {
        
	num : 4,
    array: [],
    current:0,
    x: -0.5,
    y: -2.0,
    z: -10,
    scale: 0.2,
    gokuTocat: 0,
    transformArray: null,
    transformCount: 0,


    
    load: function(){
            for (i = 0; i < this.num; i++){
                this.array[i] = [];
                this.array[i].inScene = false;
                this.array[i].vnBuffer = null;
                this.array[i].vpBuffer = null;
                this.array[i].textureBuffer = null;
                this.array[i].diffTexture = null;
                this.array[i].glowTexture = null;
                this.array[i].glows = 0.0;
            }   

            path =  MODELPATH + "gokuDefinitiu/gokuPetit_Definitiu.obj";
            K3D.load(path, function(e){
                Goku.handleLoadedGoku(e,0);
            });

            path = MODELPATH + "gokuDefinitiu/gokuGran_Definitiu.obj";
            K3D.load(path, function(e){
                Goku.handleLoadedGoku(e,1);
            });

            path = MODELPATH + "gokuDefinitiu/gokuSSJ_Definitiu.obj";
            K3D.load(path, function(e){
                Goku.handleLoadedGoku(e,2);
            });

            path = MODELPATH + "gokuDefinitiu/gokuSSJ3_Definitiu.obj";
            K3D.load(path, function(e){
                Goku.handleLoadedGoku(e,3);
            });

            path = MODELPATH + "gokuDefinitiu/texturaGokuPetit_Definity.jpg";
            Goku.array[0].diffTexture = loadTexture(path);

            path = MODELPATH + "gokuDefinitiu/texturaGokuGran_Definity.jpg";
            Goku.array[1].diffTexture = loadTexture(path);

            path = MODELPATH + "gokuDefinitiu/texturaGokuSSJ_Definity.jpg";
            Goku.array[2].diffTexture = loadTexture(path);

            path = MODELPATH + "gokuDefinitiu/texturaGokuSSJ3_Definity.jpg";
            Goku.array[3].diffTexture = loadTexture(path);


            Goku.array[2].glows = 1.2;
            path = MODELPATH + "gokuDefinitiu/texturaGokuSSJ_Definity.jpg";
            Goku.array[2].glowTexture = loadTexture(path);

             Goku.array[3].glows = 1.0;
            path = MODELPATH + "gokuDefinitiu/texturaGokuSSJ3_Definity.jpg";
            Goku.array[3].glowTexture = loadTexture(path);


            
    },

    handleLoadedGoku: function(data, j){

        var model = K3D.parse.fromOBJ(data);
    
        var normals = K3D.edit.unwrap(model.i_norms , model.c_norms , 3);
        this.array[j].vnBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.array[j].vnBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        this.array[j].vnBuffer.itemSize = 3;
        this.array[j].vnBuffer.numItems = normals.length / 3;

        var vertices = K3D.edit.unwrap(model.i_verts, model.c_verts, 3);
        this.array[j].vpBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.array[j].vpBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        this.array[j].vpBuffer.itemSize = 3;
        this.array[j].vpBuffer.numItems = vertices.length / 3;

        var uvs = K3D.edit.unwrap(model.i_uvt, model.c_uvt, 2);
        this.array[j].textureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.array[j].textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
        this.array[j].textureBuffer.itemSize = 2;
        this.array[j].textureBuffer.numItems = uvs.length / 2;
    },

    pintaGoku: function(){
        if (this.array[this.current].vpBuffer != null && this.array[this.current].vnBuffer != null) {

            this.mouGoku();

            if(this.array[this.current].glows > 0.0){
                //1.GLOW --->glowFrameBuffer
                gl.bindFramebuffer(gl.FRAMEBUFFER, glowFramebuffer);
                gl.viewport(0, 0, glowFramebuffer.width, glowFramebuffer.height);
                gl.clearColor(0.0, 0.0, 0.0, 1.0);
            
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, glowTexture, 0);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
                drawGlow(this.array[this.current]);

                //2. Blur -->glowFrameBuffer
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, blurTexture, 0);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                
                drawBlur(1, glowTexture, this.array[this.current].glows);

                //3. Framebuffer per defecte

                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
                //gl.clearColor(0.0, 0.1, 0.3, 1.0);
                //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                            
                drawBlinnText(this.array[this.current],0.0);

                //4.Blur amb transparencies
                gl.enable(gl.BLEND);
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
                gl.blendEquation(gl.FUNC_ADD);
                
                drawBlur(0, blurTexture, this.array[this.current].glows);
                
                gl.disable(gl.BLEND);
            }else{
                drawBlinnText(this.array[this.current], 0.0);
            }
            
            
        }
    },

    mouGoku: function(){
        mat4.identity(mvMatrix);
        mat4.translate(mvMatrix, mvMatrix, [this.x, this.y, this.z]);
        mat4.rotate(mvMatrix, mvMatrix, degToRad(yRot), [0, 1, 0]);
        mat4.scale(mvMatrix,mvMatrix,[this.scale ,this.scale ,this.scale]);
    },

    transformGoku: function(){
        this.transformArray[this.transformCount].play();
        this.transformCount++;
        if(this.transformCount == this.transformArray.length) this.transformCount = 0;
    }
    

    
}