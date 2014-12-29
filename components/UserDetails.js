var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link, Navigation } = Router;
var UserItem = require('./UserItem');
var ContextMixin = require("../theLib/ContextMixin");

module.exports = React.createClass({
  displayName: "UserDetails",
  mixins: [ Router.State,  Navigation, ContextMixin ],
  getInitialState: function(){
  	return {user: this.context.stores.UserStore.get()};
  },
  componentDidMount: function() {
    this.context.stores.UserStore.on('change', this.onUserChage);
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