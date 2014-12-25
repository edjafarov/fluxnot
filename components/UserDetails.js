var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link, Navigation } = Router;
var UserItem = require('./UserItem');
var ContextMixin = require("../main").mixin;

module.exports = React.createClass({
  mixins: [ Router.State,  Navigation, ContextMixin ],
  getInitialState: function(){
  	return {user: this.context.UserStore.get()};
  },
  componentDidMount: function() {
    this.context.UserStore.on('change', this.onUserChage);
  },
  onUserChage: function(user){
    if(!this.isMounted()) return;
  	this.setState({user:user});
  },
  render: function () {
    return (
      <div className="UserDetails">
        {React.createFactory(UserItem)(this.state.user)}
      </div>
    );
  }
});