var Escenari = {
        
    num : 1,
    array: [],
    current:0,
    x:0,
    y:0,
    z:0,
    scale: 20,
    
    load: function(){
            for (i = 0; i < this.num; i++){
                this.array[i] = [];
                this.array[i].inScene = false;
                this.array[i].vnBuffer = null;
                this.array[i].vpBuffer = null;
                this.array[i].textureBuffer = null;
                this.array[i].diffTexture = null;
            }   

            path = MODELPATH + "escenari/geosphere.obj";
            K3D.load(path, function(e){
                Escenari.handleLoadedEscenari(e,0);
            });

    },

    handleLoadedEscenari: function(data, j){
        
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

    pintaEscenari: function(){
        if (this.array[this.current].vpBuffer != null && this.array[this.current].vnBuffer != null) {

            this.mouEscenari();
            drawStorm(this.array[this.current]);
        }
    },

    mouEscenari: function(){
        mat4.identity(mvMatrix);
        mat4.translate(mvMatrix, mvMatrix, [this.x, this.y, this.z]);
        mat4.rotate(mvMatrix, mvMatrix, degToRad(yRot), [0, 1, 0]);
        mat4.scale(mvMatrix,mvMatrix,[this.scale ,this.scale ,this.scale]);
    },
    

    
}