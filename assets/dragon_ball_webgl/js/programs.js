
var blinnTextProgram;

function createBlinnTextProgram(){
    blinnTextProgram = createProgram("shader-fs-blinn-text", "shader-vs-blinn-text");

    blinnTextProgram.vertexPositionAttribute = gl.getAttribLocation(blinnTextProgram, "aVertexPosition");
    gl.enableVertexAttribArray(blinnTextProgram.vertexPositionAttribute);

    blinnTextProgram.vertexNormalAttribute = gl.getAttribLocation(blinnTextProgram, "aVertexNormal");
    gl.enableVertexAttribArray(blinnTextProgram.vertexNormalAttribute);
    
    blinnTextProgram.textureCoordAttribute = gl.getAttribLocation(blinnTextProgram, "aTextureCoord");
    gl.enableVertexAttribArray(blinnTextProgram.textureCoordAttribute);

    blinnTextProgram.pMatrixUniform = gl.getUniformLocation(blinnTextProgram, "uPMatrix");
    blinnTextProgram.mvMatrixUniform = gl.getUniformLocation(blinnTextProgram, "uMVMatrix");
    blinnTextProgram.nMatrixUniform = gl.getUniformLocation(blinnTextProgram, "uNMatrix");
    blinnTextProgram.intensityUniform = gl.getUniformLocation(blinnTextProgram, "uLightIntensity");
    blinnTextProgram.lightPosUniform = gl.getUniformLocation(blinnTextProgram, "uLightPos");
    blinnTextProgram.ambientUniform = gl.getUniformLocation(blinnTextProgram, "uAmbient");
    blinnTextProgram.diffuseUniform = gl.getUniformLocation(blinnTextProgram, "uDiffuse");
    blinnTextProgram.specularUniform = gl.getUniformLocation(blinnTextProgram, "uSpecular");
    blinnTextProgram.specularExpUniform = gl.getUniformLocation(blinnTextProgram, "uSpecularExp");
    blinnTextProgram.samplerDiffUniform = gl.getUniformLocation(blinnTextProgram, "uSamplerDiff");
    blinnTextProgram.samplerSpecUniform = gl.getUniformLocation(blinnTextProgram, "uSamplerSpec");
}


function drawBlinnText(model, spec){

            gl.useProgram(blinnTextProgram);

            gl.uniformMatrix4fv(blinnTextProgram.pMatrixUniform, false, pMatrix);
            gl.uniformMatrix4fv(blinnTextProgram.mvMatrixUniform, false, mvMatrix);

            gl.uniformMatrix4fv(blinnTextProgram.pMatrixUniform, false, pMatrix);
            gl.uniformMatrix4fv(blinnTextProgram.mvMatrixUniform, false, mvMatrix);
            
            // Matriu modelview de normals
            var normalMatrix = mat3.create();
            mat3.fromMat4(normalMatrix, mvMatrix);
            mat3.invert(normalMatrix, normalMatrix);
            mat3.transpose(normalMatrix, normalMatrix);
            gl.uniformMatrix3fv(blinnTextProgram.nMatrixUniform, false, normalMatrix);

            // Especifica paràmetres de materials i il·luminació
            gl.uniform1f(blinnTextProgram.intensityUniform, 200.0);
            gl.uniform3f(blinnTextProgram.lightPosUniform, 8.0, 5.0, -2.0);
            gl.uniform3f(blinnTextProgram.ambientUniform, 0.2, 0.1, 0.1); // vermell/marro fosc
            gl.uniform3f(blinnTextProgram.diffuseUniform, 1, 1, 1); // blanc
            gl.uniform3f(blinnTextProgram.specularUniform, spec, spec, spec);
            gl.uniform1f(blinnTextProgram.specularExpUniform, 50.0);

            gl.bindBuffer(gl.ARRAY_BUFFER, model.vpBuffer);
            gl.vertexAttribPointer(blinnTextProgram.vertexPositionAttribute, model.vpBuffer.itemSize, gl.FLOAT, false, 0, 0);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, model.vnBuffer);
            gl.vertexAttribPointer(blinnTextProgram.vertexNormalAttribute, model.vnBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, model.textureBuffer);
            gl.vertexAttribPointer(blinnTextProgram.textureCoordAttribute, model.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);      
        
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, model.diffTexture);
            gl.uniform1i(blinnTextProgram.samplerDiffUniform, 0);

            /*gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, ubotSpecTexture);
            gl.uniform1i(shaderProgram.samplerSpecUniform, 1);*/



            gl.drawArrays(gl.TRIANGLES, 0, model.vpBuffer.numItems);

            //gl.disableVertexAttribArray(blinnTextProgram.vertexPositionAttribute);
            //gl.disableVertexAttribArray(blinnTextProgram.vertexNormalAttribute);
            //gl.disableVertexAttribArray(blinnTextProgram.textureCoordAttribute);   
}


var blinnNormalProgram;


function createBlinnNormalProgram(){
        blinnNormalProgram = createProgram("shader-fs-blinn", "shader-vs-blinn");

        blinnNormalProgram.vertexPositionAttribute = gl.getAttribLocation(blinnNormalProgram, "aVertexPosition");
        gl.enableVertexAttribArray(blinnNormalProgram.vertexPositionAttribute);
        blinnNormalProgram.vertexNormalAttribute = gl.getAttribLocation(blinnNormalProgram, "aVertexNormal");
        gl.enableVertexAttribArray(blinnNormalProgram.vertexNormalAttribute);
        blinnNormalProgram.pMatrixUniform = gl.getUniformLocation(blinnNormalProgram, "uPMatrix");
        blinnNormalProgram.mvMatrixUniform = gl.getUniformLocation(blinnNormalProgram, "uMVMatrix");
        blinnNormalProgram.nMatrixUniform = gl.getUniformLocation(blinnNormalProgram, "uNMatrix");
        blinnNormalProgram.intensityUniform = gl.getUniformLocation(blinnNormalProgram, "uLightIntensity");
        blinnNormalProgram.lightPosUniform = gl.getUniformLocation(blinnNormalProgram, "uLightPos");
        blinnNormalProgram.ambientUniform = gl.getUniformLocation(blinnNormalProgram, "uAmbient");
        blinnNormalProgram.diffuseUniform = gl.getUniformLocation(blinnNormalProgram, "uDiffuse");
        blinnNormalProgram.specularUniform = gl.getUniformLocation(blinnNormalProgram, "uSpecular");
        blinnNormalProgram.specularExpUniform = gl.getUniformLocation(blinnNormalProgram, "uSpecularExp");
}


function drawBlinnNormal(model){
    gl.useProgram(blinnNormalProgram);
    
    gl.uniformMatrix4fv(blinnNormalProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(blinnNormalProgram.mvMatrixUniform, false, mvMatrix);
    
    // Matriu modelview de normals
    var normalMatrix = mat3.create();
    mat3.fromMat4(normalMatrix, mvMatrix);
    mat3.invert(normalMatrix, normalMatrix);
    mat3.transpose(normalMatrix, normalMatrix);
    gl.uniformMatrix3fv(blinnNormalProgram.nMatrixUniform, false, normalMatrix);

    // Especifica paràmetres de materials i il·luminació
    gl.uniform1f(blinnNormalProgram.intensityUniform, 200.0);
    gl.uniform3f(blinnNormalProgram.lightPosUniform, 8.0, 5.0, -2.0);
    gl.uniform3f(blinnNormalProgram.ambientUniform, 0.2, 0.1, 0.1);
    gl.uniform3f(blinnNormalProgram.diffuseUniform, 0.8, 0.5, 0.5);
    gl.uniform3f(blinnNormalProgram.specularUniform, 1.0, 1.0, 1.0);
    gl.uniform1f(blinnNormalProgram.specularExpUniform, 50.0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, model.vpBuffer);
    gl.vertexAttribPointer(blinnNormalProgram.vertexPositionAttribute, model.vpBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, model.vnBuffer);
    gl.vertexAttribPointer(blinnNormalProgram.vertexNormalAttribute, model.vnBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, model.vpBuffer.numItems);
}


var stormProgram;

function createStormProgram(){
    stormProgram = createProgram("shader-fs-storm", "shader-vs-blinn-text");

    stormProgram.vertexPositionAttribute = gl.getAttribLocation(stormProgram, "aVertexPosition");
    gl.enableVertexAttribArray(stormProgram.vertexPositionAttribute);

    stormProgram.vertexNormalAttribute = gl.getAttribLocation(stormProgram, "aVertexNormal");
    gl.enableVertexAttribArray(stormProgram.vertexNormalAttribute);
    
    stormProgram.textureCoordAttribute = gl.getAttribLocation(stormProgram, "aTextureCoord");
    gl.enableVertexAttribArray(stormProgram.textureCoordAttribute);

    stormProgram.pMatrixUniform = gl.getUniformLocation(stormProgram, "uPMatrix");
    stormProgram.mvMatrixUniform = gl.getUniformLocation(stormProgram, "uMVMatrix");
    stormProgram.nMatrixUniform = gl.getUniformLocation(stormProgram, "uNMatrix");
    stormProgram.intensityUniform = gl.getUniformLocation(stormProgram, "uLightIntensity");
    stormProgram.lightPosUniform = gl.getUniformLocation(stormProgram, "uLightPos");
    stormProgram.ambientUniform = gl.getUniformLocation(stormProgram, "uAmbient");
    stormProgram.diffuseUniform = gl.getUniformLocation(stormProgram, "uDiffuse");
    stormProgram.specularUniform = gl.getUniformLocation(stormProgram, "uSpecular");
    stormProgram.timeUniform = gl.getUniformLocation(stormProgram, "iGlobalTime");
}


function drawStorm(model){
    gl.useProgram(stormProgram);

    gl.uniformMatrix4fv(stormProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(stormProgram.mvMatrixUniform, false, mvMatrix);

    gl.uniformMatrix4fv(stormProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(stormProgram.mvMatrixUniform, false, mvMatrix);
    
    // Matriu modelview de normals
    var normalMatrix = mat3.create();
    mat3.fromMat4(normalMatrix, mvMatrix);
    mat3.invert(normalMatrix, normalMatrix);
    mat3.transpose(normalMatrix, normalMatrix);
    gl.uniformMatrix3fv(stormProgram.nMatrixUniform, false, normalMatrix);

    // Especifica paràmetres de materials i il·luminació
    gl.uniform1f(stormProgram.intensityUniform, 200.0);
    gl.uniform3f(stormProgram.lightPosUniform, 8.0, 5.0, -2.0);
    gl.uniform3f(stormProgram.ambientUniform, 0.2, 0.1, 0.1); // vermell/marro fosc
    gl.uniform3f(stormProgram.diffuseUniform, 1, 1, 1); // blanc
    gl.uniform3f(stormProgram.specularUniform, 0.0, 0.0, 0.0);
    gl.uniform1f(stormProgram.specularExpUniform, 50.0);

    //globalTime = new Date().getTime();

    gl.uniform1f(stormProgram.timeUniform, (lastTime%100000)/1000.0 );

    gl.bindBuffer(gl.ARRAY_BUFFER, model.vpBuffer);
    gl.vertexAttribPointer(stormProgram.vertexPositionAttribute, model.vpBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, model.vnBuffer);
    gl.vertexAttribPointer(stormProgram.vertexNormalAttribute, model.vnBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.textureBuffer);
    gl.vertexAttribPointer(stormProgram.textureCoordAttribute, model.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);      

    /*gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, model.diffTexture);
    gl.uniform1i(stormProgram.samplerDiffUniform, 0);*/

            /*gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, ubotSpecTexture);
            gl.uniform1i(shaderProgram.samplerSpecUniform, 1);*/



    gl.drawArrays(gl.TRIANGLES, 0, model.vpBuffer.numItems);
	
}	
	
	var lightBallProgram;

	function createlightBallProgram(){
    lightBallProgram = createProgram("shader-fs-ball-light", "shader-vs-blinn-text");

    lightBallProgram.vertexPositionAttribute = gl.getAttribLocation(lightBallProgram, "aVertexPosition");
    gl.enableVertexAttribArray(lightBallProgram.vertexPositionAttribute);

    lightBallProgram.vertexNormalAttribute = gl.getAttribLocation(lightBallProgram, "aVertexNormal");
    gl.enableVertexAttribArray(lightBallProgram.vertexNormalAttribute);
    
    lightBallProgram.textureCoordAttribute = gl.getAttribLocation(lightBallProgram, "aTextureCoord");
    gl.enableVertexAttribArray(lightBallProgram.textureCoordAttribute);

    lightBallProgram.pMatrixUniform = gl.getUniformLocation(lightBallProgram, "uPMatrix");
    lightBallProgram.mvMatrixUniform = gl.getUniformLocation(lightBallProgram, "uMVMatrix");
    lightBallProgram.nMatrixUniform = gl.getUniformLocation(lightBallProgram, "uNMatrix");
    lightBallProgram.intensityUniform = gl.getUniformLocation(lightBallProgram, "uLightIntensity");
    lightBallProgram.lightPosUniform = gl.getUniformLocation(lightBallProgram, "uLightPos");
    lightBallProgram.ambientUniform = gl.getUniformLocation(lightBallProgram, "uAmbient");
    lightBallProgram.diffuseUniform = gl.getUniformLocation(lightBallProgram, "uDiffuse");
    lightBallProgram.specularUniform = gl.getUniformLocation(lightBallProgram, "uSpecular");
    lightBallProgram.timeUniform = gl.getUniformLocation(lightBallProgram, "iGlobalTime");
}


	function DrawlightBall(model,spec){
    
	gl.useProgram(lightBallProgram);

    gl.uniformMatrix4fv(lightBallProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(lightBallProgram.mvMatrixUniform, false, mvMatrix);

    gl.uniformMatrix4fv(lightBallProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(lightBallProgram.mvMatrixUniform, false, mvMatrix);
    
    // Matriu modelview de normals
    var normalMatrix = mat3.create();
    mat3.fromMat4(normalMatrix, mvMatrix);
    mat3.invert(normalMatrix, normalMatrix);
    mat3.transpose(normalMatrix, normalMatrix);
    gl.uniformMatrix3fv(lightBallProgram.nMatrixUniform, false, normalMatrix);

    // Especifica paràmetres de materials i il·luminació
    gl.uniform1f(lightBallProgram.intensityUniform, 200.0);
    gl.uniform3f(lightBallProgram.lightPosUniform, 8.0, 5.0, -2.0);
    gl.uniform3f(lightBallProgram.ambientUniform, 0.2, 0.1, 0.1); // vermell/marro fosc
    gl.uniform3f(lightBallProgram.diffuseUniform, 1, 1, 1); // blanc
    gl.uniform3f(lightBallProgram.specularUniform, 0.0, 0.0, 0.0);
    gl.uniform1f(lightBallProgram.specularExpUniform, 50.0);

    //globalTime = new Date().getTime();

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    gl.uniform1f(lightBallProgram.timeUniform, (lastTime%100000)/1000.0 );

    gl.bindBuffer(gl.ARRAY_BUFFER, model.vpBuffer);
    gl.vertexAttribPointer(lightBallProgram.vertexPositionAttribute, model.vpBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, model.vnBuffer);
    gl.vertexAttribPointer(lightBallProgram.vertexNormalAttribute, model.vnBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.textureBuffer);
    gl.vertexAttribPointer(lightBallProgram.textureCoordAttribute, model.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);      

    /*gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, model.diffTexture);
    gl.uniform1i(lightBallProgram.samplerDiffUniform, 0);*/

            /*gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, ubotSpecTexture);
            gl.uniform1i(shaderProgram.samplerSpecUniform, 1);*/



    gl.drawArrays(gl.TRIANGLES, 0, model.vpBuffer.numItems);

    gl.disable(gl.BLEND);

}

var glowProgram;

function createGlowProgram(){
    glowProgram = createProgram("glow-shader-fs", "glow-shader-vs");
        
    glowProgram.vertexPositionAttribute = gl.getAttribLocation(glowProgram, "aVertexPosition");
    glowProgram.textureCoordAttribute = gl.getAttribLocation(glowProgram, "aTextureCoord");
    glowProgram.pMatrixUniform = gl.getUniformLocation(glowProgram, "uPMatrix");
    glowProgram.mvMatrixUniform = gl.getUniformLocation(glowProgram, "uMVMatrix");
    glowProgram.samplerGlowUniform = gl.getUniformLocation(glowProgram, "uSamplerGlow");
}

function drawGlow(model){
    gl.useProgram(glowProgram);
    
    gl.uniformMatrix4fv(glowProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(glowProgram.mvMatrixUniform, false, mvMatrix);
            
    gl.bindBuffer(gl.ARRAY_BUFFER, model.vpBuffer);
    gl.vertexAttribPointer(glowProgram.vertexPositionAttribute, model.vpBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(glowProgram.vertexPositionAttribute);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, model.textureBuffer);
    gl.vertexAttribPointer(glowProgram.textureCoordAttribute, model.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);                
    gl.enableVertexAttribArray(glowProgram.textureCoordAttribute);  
    
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, model.glowTexture);
    gl.uniform1i(glowProgram.samplerDiffUniform, 0);

    gl.drawArrays(gl.TRIANGLES, 0, model.vpBuffer.numItems);

    //gl.disableVertexAttribArray(glowProgram.vertexPositionAttribute);
    //gl.disableVertexAttribArray(glowProgram.textureCoordAttribute); 
}


var blurProgram;
function createBlurProgram(){
    blurProgram = createProgram("blur-shader-fs", "blur-shader-vs");

    blurProgram.vertexPositionAttribute = gl.getAttribLocation(blurProgram, "aVertexPosition");
    blurProgram.textureCoordAttribute = gl.getAttribLocation(blurProgram, "aTextureCoord");
    blurProgram.pMatrixUniform = gl.getUniformLocation(blurProgram, "uPMatrix");
    blurProgram.mvMatrixUniform = gl.getUniformLocation(blurProgram, "uMVMatrix");
    blurProgram.samplerBlurUniform = gl.getUniformLocation(blurProgram, "uSamplerBlur");
    blurProgram.samplerIsHorizontalUniform = gl.getUniformLocation(blurProgram, "uIsHorizontal");
    blurProgram.samplerTexelSizeUniform = gl.getUniformLocation(blurProgram, "uTexelSize");
    blurProgram.intensity = gl.getUniformLocation(blurProgram, "intensity");
}

function drawBlur(isHorizontal, textureOrig, intensity){

        gl.useProgram(blurProgram);
    
        gl.uniform1i(blurProgram.samplerIsHorizontalUniform, isHorizontal);
        gl.uniform2f(blurProgram.samplerTexelSizeUniform, 1.0/glowFramebuffer.width, 1.0/glowFramebuffer.height);
        gl.uniform1f(blurProgram.intensity, intensity);
        

        //BOX vertex position buffer???
        gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexPositionBuffer);
        gl.vertexAttribPointer(blurProgram.vertexPositionAttribute, boxVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(blurProgram.vertexPositionAttribute);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexTextureCoordBuffer);
        gl.vertexAttribPointer(blurProgram.textureCoordAttribute, boxVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);             
        gl.enableVertexAttribArray(blurProgram.textureCoordAttribute);  
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureOrig);
        gl.uniform1i(blurProgram.samplerBlurUniform, 0);

        gl.drawArrays(gl.TRIANGLES, 0, boxVertexPositionBuffer.numItems);

        //gl.disableVertexAttribArray(blurProgram.vertexPositionAttribute);
        //gl.disableVertexAttribArray(blurProgram.textureCoordAttribute); 
}


