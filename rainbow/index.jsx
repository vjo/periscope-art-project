var peristream = require('peristream/browser');
var participantColors = require('periscope-participant-colors');

var stream = peristream('https://www.periscope.tv/w/1rmGPZRWyBMxN');

var Message = React.createClass({
  render() {
    return <div className='message' style={{backgroundColor: this.props.color.hex}}></div>
  }
});
var MessageList = React.createClass({
  render() {
    var messages = this.props.messageList.map(function(message) {
      return <Message color={message.color} />;
    });
    return (
      <div>
        {messages}
      </div>
    );
  }
});
var MessagesContainer = React.createClass({
  getInitialState() {
    return {messageList: []};
  },
  componentWillMount() {
    var self = this;
    stream.connect().then(function(emitter){
      emitter.on(peristream.HEARTS, function(message){
        self.addMsg(message);
      });
    });
  },
  addMsg(message) {
    message.color = participantColors(message.participant_index);
    var messageList = this.state.messageList;
    this.setState({messageList: messageList.concat(message)});
  },
  render() {
    return (
      <div>
        <h1>RainbowScope</h1>
        <MessageList messageList={this.state.messageList}/>
      </div>
    );
  }
});

React.render(
  <MessagesContainer/>,
  document.body
);
