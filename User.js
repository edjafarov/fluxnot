var React = require('react');
var Router = require('react-router');
var UserStore = require('./UserStore');

module.exports = React.createClass({
  mixins: [ Router.State ],
  getInitialState: function(){
  	return {user: UserStore.get()};
  },
  componentDidMount: function() {
    UserStore.on('change', this.onUserChage);
  },
  onUserChage: function(user){
  	this.setState({user:user})
  },
  render: function () {
    return (
      <div className="User">
        <h1>User id: {this.state.user.uid}</h1>
        {this.state.user.age}
      </div>
    );
  }
});