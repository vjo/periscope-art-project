import peristream from 'peristream/browser';
import participantColors from 'periscope-participant-colors';
import React, { Component } from 'react';
import { render } from 'react-dom';

class SVGComponent extends Component {
  render() {
    return <svg {...this.props}>{this.props.children}</svg>;
  }
};

class Circle extends Component {
  render() {
    return <circle {...this.props}>{this.props.children}</circle>;
  }
};

class DotsContainer extends Component {
  constructor() {
    super();
    this.state = {
      messageList: [],
      width: 800,
      height: 600,
      radius: 10,
      connected: false,
      connecting: false
    };
  }

  setUrl = (event) => {
    var url = event.target.value;
    this.setState({
      url
    });
  }

  switchToCurrentUrl = () => {
    this.disconnect();
    this.connect();
  }

  disconnect() {
    const { stream } = this.state;

    this.setState({
      connected: false,
      connecting: false
    });

    if (stream) {
      stream.disconnect();
    }
  }

  connect() {
    const { url } = this.state;
    const stream = peristream(url);

    this.setState({
      stream,
      messageList: [],
      connecting: true,
      connected: false
    });

    stream.connect().then(function(emitter){
      this.setState({
        connecting: false,
        connected: true
      });
      emitter.on(peristream.HEARTS, function(message){
        this.addDot(message);
      }.bind(this));
    }.bind(this));
  }

  // Returns a random number between min (inclusive) and max (exclusive)
  getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  addDot(message) {
    message.color = participantColors(message.participant_index);
    message.x = this.getRandomNumber(0, this.state.width);
    message.y = this.getRandomNumber(0, this.state.height);
    message.r = this.state.radius;

    const { messageList } = this.state;
    const newMessageList = [...messageList, message];

    this.setState({
      messageList: newMessageList
    });
  }

  render() {
    const { connecting, connected, messageList } = this.state;
    let link;
    if (!connected && !connecting) {
      link = <a href="//twitter.com/hashtag/Periscope?src=hash">Find a periscope.tv url here</a>;
    }

    let dots = messageList.map(function({x, y, r, color}, i) {
      return <Circle cx={x} cy={y} r={r} fill={color.hex} key={i}/>;
    });

    return (
      <div>
        <h1>Color Dots</h1>
        <input onChange={this.setUrl}></input>
        <button onClick={this.switchToCurrentUrl} disabled={connecting}>Do the magic</button>
        { link }
        <div className='center'>
          <SVGComponent width={this.state.width} height={this.state.height}>
            {dots}
          </SVGComponent>
        </div>
      </div>
    );
  }
}

render(
  <DotsContainer/>,
  document.getElementById('app')
);
