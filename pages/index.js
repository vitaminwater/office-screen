import $ from 'jquery';

const colors = [['red', 'blue'], ['green', '#ff00ff'], ['#efefef', '#222222'], ['#12e923', 'orange'], ['#32e2f3', 'blue'], ['#982292', '#1288e2'], ['#ef9922', '#1193af']];

export default class extends React.Component {

  constructor() {
    super();

    this.state = {};
  }

  componentDidMount() {
    const ws = new WebSocket('ws://node.local:7379/.json');

    ws.addEventListener('open', () => {
      ws.send(JSON.stringify(['PSUBSCRIBE', '*']));
    });

    ws.addEventListener('message', (data) => {
      try {
        data = JSON.parse(data.data);
        if (data.PSUBSCRIBE) {
          const evt = JSON.parse(data.PSUBSCRIBE[3]);
          const st = {};
          st[data.PSUBSCRIBE[2]] = evt;
          this.setState(st);

          if (data.PSUBSCRIBE[2].indexOf('midi.SOFT_LAB.LPD81.PAD_ON.') == 0) {
            this.setState({pad: evt.id});
          }
        } else {
          console.log(data);
        }
      } catch (e) {
        console.log(e);
      }
    });
  }
  
  render() {
    const { pad } = this.state;
    const control1 = this.state['midi.SOFT_LAB.LPD81.CONTROL_CHANGE.1'];
    const control2 = this.state['midi.SOFT_LAB.LPD81.CONTROL_CHANGE.2'];
    const control3 = this.state['midi.SOFT_LAB.LPD81.CONTROL_CHANGE.3'];
    const color = colors[pad - 1] || ['red', 'green'];
    return (
      <div style={{transform: `rotate(${control3 ? control3.val : 0}deg)`}}>
        <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: ((control1 && control1.val*5) || '0') + 'px', backgroundColor: color[0]}}></div>
        <div style={{position: 'absolute', top: ((control1 && control1.val*5) || '0') + 'px', left: 0, width: '100%', height: ((control2 && control2.val*5) || '0') + 'px', backgroundColor: color[1]}}></div>
        <div style={{zIndex: 1000, position: 'absolute', top: 0, left: 0, width: '100%', height:'100%', fontFamily: 'HelveticaNeue', fontSize: '1.2em'}}>
          {
            Object.keys(this.state).map(k => <div key={k}>{k}: {JSON.stringify(this.state[k])}</div>)
          }
        </div>
      </div>
    );
  }
  
}
