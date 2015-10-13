import peristream from 'peristream/browser';
import participantColors from 'periscope-participant-colors';
import React, { Component } from 'react';
import { render } from 'react-dom';

const Message = ({color}) => <div className='message' style={{backgroundColor: color.hex}}></div>

const MessageList = ({messageList}) => {
  const messages = messageList.map(({color}, i) => <Message color={color} key={i}/>)
  return <div>{messages}</div>;
};

class MessagesContainer extends Component {
  constructor() {
    super();
    this.state = {
      messageList: [],
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
        this.addMsg(message);
      }.bind(this));
    }.bind(this));
  }

  addMsg(message) {
    message.color = participantColors(message.participant_index);

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
      link = <a href="https://twitter.com/hashtag/Periscope?src=hash">Find periscope.tv a url here</a>;
    }

    return (
      <div>
        <h1>RainbowScope</h1>
        <input onChange={this.setUrl}></input>
        <button onClick={this.switchToCurrentUrl} disabled={connecting}>Make it shine</button>
        { link }
        <MessageList messageList={messageList}/>
      </div>
    );
  }
}

render(
  <MessagesContainer/>,
  document.getElementById('app')
);
