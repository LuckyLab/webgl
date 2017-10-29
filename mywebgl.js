class MyWebgl {
    // constructor function
    constructor(canvas) {
        this.vertexShaderSource = '';
        this.fragmentShaderSource = '';
        this.vertexShader = null;
        this.fragmentShader = null;
        this.program = null;
        this.positions = [];
        this.positionBuffer = null;
        
        try {
            this.gl = canvas.getContext('webgl') || canvas.getContext('experiment-webgl');
            this.gl.viewportWidth = canvas.width;
            this.gl.viewportHeght = canvas.height;
        } catch (e) {
            console.error(e);
        }

        if (!this.gl) {
            alert('initial webgl failed, check your broswer version');
        } else {
            console.log(this.gl);
        }
    }

    createVertexShader() {
        let s;
        try {
            s = this.gl.createShader(this.gl.VERTEX_SHADER);
            this.gl.shaderSource(s, this.vertexShaderSource);
            this.gl.compileShader(s);
            var success = this.gl.getShaderParameter(s, this.gl.COMPILE_STATUS);
        } catch (e) {
            console.error(e);
        }
        if (success) {
            console.log('vertexShader: ' ,s);
            this.vertexShader = s;
        } else {
            console.warn('vertexShader compile failed!');
        }
        
    }

    createFragmentShader() {
        let s;
        try {
            s = this.gl.createShader(this.gl.FRAGMENT_SHADER);
            this.gl.shaderSource(s, this.fragmentShaderSource);
            this.gl.compileShader(s);
            var success = this.gl.getShaderParameter(s, this.gl.COMPILE_STATUS);            
        } catch (e) {
            console.error(e);
        }
        if (success) {
            console.log('fragmentShader: ', s);
            this.fragmentShader = s;
        } else {          
            console.warn('vertexShader compile failed!');
        }
    }

    createProgram() {
        let p;
        try {
            p = this.gl.createProgram();
            this.gl.attachShader(p, this.vertexShader);
            this.gl.attachShader(p, this.fragmentShader);
            this.gl.linkProgram(p);
            var success = this.gl.getProgramParameter(p, this.gl.LINK_STATUS);
            
        } catch (e) {
            console.log(e);
        }
        if (success) {
            console.log('program: ', p);
            this.program = p;
        } else {
            console.warn('program link failed');
        }
    }

    createPositionBuffer() {
        let b = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, b);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.positions), this.gl.STATIC_DRAW);
        this.positionBuffer = b;
    }

    parser() {
        let vs = this.vertexShaderSource;
        let fs = this.fragmentShaderSource;
        (vs + fs).replace(
            /\b(attribute|uniform)\b[^;]+?(\w+)\s+(\w+)\s*;/g,
            function ($0, $1, $2, $3) {
                let data, location, size;
                size = $2.match(/\d+$|$/g, '')[0] | 0 || 1;
                if ($1 == 'attribute') {
                    location = this.gl.getAttribLocation(this.program, $3);
                    this.gl.enableVertexAttribArray(location);
                    this.gl.vertexAttribPointer(location, size, this.gl.FLOAT, false, 0, 0);
                } else {
                    location = this.gl.getUniformLocation(this.program, $3);
                    this.gl.uniform2f(location, this.gl.canvas.width, this.gl.canvas.height);
                }
            }.bind(this)
        )
    }

    render() {
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clearColor(0,0,0,0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.useProgram(this.program);
        this.parser();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        console.log("test")
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
    }
}