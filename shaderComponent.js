
class ShaderComponent {
    getShaderText(id) {
        switch(id) {
            case 1:
                const vertexShaderCode = ` 
                    attribute vec2 a_position; 
                    uniform float u_pointSize;
                
                    void main() {
                 
                        gl_Position = vec4(a_position, 0, 1);
                        gl_PointSize = u_pointSize;
                    }
                `;
                const fragmentShaderCode = ` 
                    precision mediump float;
                    void main(){ 
                        gl_FragColor = vec4(1, 0, 0.5, 1);  
                    }
                `;
                return { vertexShaderCode, fragmentShaderCode };
        }
    }
}