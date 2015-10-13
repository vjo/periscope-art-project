const peristream = require('peristream/browser');
const participantColors = require('periscope-participant-colors');

const Message = React.createClass({
  render() {
    return <div className='message' style={{backgroundColor: this.props.color.hex}}></div>
  }
});

const MessageList = React.createClass({
  render() {
    const messages = this.props.messageList.map(function(message) {
      return <Message color={message.color} />;
    });
    return (
      <div>
        {messages}
      </div>
    );
  }
});

const MessagesContainer = React.createClass({
  getInitialState() {
    return {
      messageList: [],
      connected: false,
      connecting: false
    };
  },
  componentWillMount() {
    this.setUrl = this.setUrl.bind(this);
    this.switchToCurrentUrl = this.switchToCurrentUrl.bind(this);
  },
  setUrl(event) {
    var url = event.target.value;
    this.setState({
      url
    });
  },
  switchToCurrentUrl() {
    this.disconnect();
    this.connect();
  },
  disconnect() {
    const { stream } = this.state;

    this.setState({
      connected: false,
      connecting: false
    });

    if (stream) {
      stream.disconnect();
    }

  },
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
  },

  addMsg(message) {
    message.color = participantColors(message.participant_index);

    const { messageList } = this.state;
    const newMessageList = [...messageList, message];

    this.setState({
      messageList: newMessageList
    });

  },
  render() {

    const { connecting, connected } = this.state;

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
        <MessageList messageList={this.state.messageList}/>
      </div>
    );
  }
});

React.render(
  <MessagesContainer/>,
  document.body
);
