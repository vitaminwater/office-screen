import $ from 'jquery';

export default class extends React.Component {

  constructor() {
    super();

    this.state = {};
  }

  componentDidMount() {
    const ws = new WebSocket('ws://node.local:7379/.json');

    ws.addEventListener('open', () => {
      ws.send(JSON.stringify(['PSUBSCRIBE', 'midi.SOFT_LAB.LPD81.*']));
    });

    ws.addEventListener('message', (data) => {
      try {
        data = JSON.parse(data.data);
        if (data.PSUBSCRIBE) {
          const evt = JSON.parse(data.PSUBSCRIBE[3]);
          const st = {};
          st[data.PSUBSCRIBE[2]] = evt;
          this.setState(st);
        }
      } catch (e) {
        console.log(e);
      }
    });
  }
  
  render() {
    const control1 = this.state['midi.SOFT_LAB.LPD81.CONTROL_CHANGE.1'];
    const control2 = this.state['midi.SOFT_LAB.LPD81.CONTROL_CHANGE.2'];
    return (
      <div>
        <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: ((control1 && control1.val*5) || '0') + 'px', backgroundColor: 'red'}}></div>
        <div style={{position: 'absolute', top: ((control1 && control1.val*5) || '0') + 'px', left: 0, width: '100%', height: ((control2 && control2.val*5) || '0') + 'px', backgroundColor: 'blue'}}></div>
      </div>
    );
  }
  
}
