var React = require('react');
var Router = require('react-router');
var UserStore = require('../stores/UserStore');
var UserItem = require('./UserItem');

module.exports = React.createClass({
  mixins: [ Router.State ],
  getInitialState: function(){
  	return {user: UserStore.get()};
  },
  componentDidMount: function() {
    UserStore.on('change', this.onUserChage);
  },
  onUserChage: function(user){
    if(!this.isMounted()) return;
  	this.setState({user:user});
  },
  render: function () {
    return (
      <div className="UserDetails">
        {UserItem(this.state.user)}
      </div>
    );
  }
});