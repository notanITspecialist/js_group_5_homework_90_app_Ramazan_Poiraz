import React, {createRef} from 'react';

class App extends React.Component {
    state = {
        color: '#000000',
        isDrawing: false
    };

    canvas = createRef();

    // drawLine(context, x1, y1, x2, y2) {
    //     context.beginPath();
    //     context.strokeStyle = 'black';
    //     context.lineWidth = 1;
    //     context.moveTo(x1, y1);
    //     context.lineTo(x2, y2);
    //     context.stroke();
    //     context.closePath();
    // }

    componentDidMount() {
        this.websoket = new WebSocket('ws://localhost:8000/canvas');
        const ctx = this.canvas.current.getContext('2d');

        this.canvas.current.addEventListener('mousedown', e => {
            this.websoket.send(JSON.stringify({type: 'ADD_CIRCLE',x: e.clientX, y: e.clientY, color: this.state.color}));
            this.setState({
                isDrawing: true
            })
        });

        this.canvas.current.addEventListener('mousemove', e => {
            if (this.state.isDrawing === true) {
                this.websoket.send(JSON.stringify({type: 'ADD_CIRCLE',x: e.clientX, y: e.clientY, color: this.state.color}));
            }
        });

        window.addEventListener('mouseup', e => {
            if (this.state.isDrawing === true) {
                this.websoket.send(JSON.stringify({type: 'ADD_CIRCLE',x: e.clientX, y: e.clientY, color: this.state.color}));
                this.setState({
                    isDrawing: false
                });
            }
        });
        this.websoket.onopen = () => {
            this.websoket.send(JSON.stringify({type: 'GET_ALL'}))
        };
        this.websoket.onmessage = (m) => {
            try {
                const data = JSON.parse(m.data);
                ctx.beginPath ();
                ctx.arc (data.x, data.y, 5, 0, Math.PI * 2, false);
                ctx.lineWidth = 3;
                ctx.fillStyle = data.color;
                ctx.fill();
            } catch (e) {
                console.log(e)
            }
        }
    }

    // drawingCanvas = async e => {
    //     this.websoket.send(JSON.stringify({type: 'ADD_CIRCLE',x: e.clientX, y: e.clientY, color: this.state.color}));
    // };

    changeColor = e => {
      this.setState({color: e.target.value})
    };

    render() {
        return (
            <div>
                <div className='position-absolute' style={{zIndex: '1000'}}>
                    <input type='color' value={this.state.color} onChange={this.changeColor} style={{margin: '20px'}}/>
                </div>
                <canvas className='position-relative' ref={this.canvas} width={window.innerWidth} height={window.innerHeight - 7} />
            </div>
        )
    }
}

export default App;
