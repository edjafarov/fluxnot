var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link, Navigation } = Router;
var UserItem = require('./UserItem');
var NewUserForm = require('./NewUserForm');
var ContextMixin = require("../main").mixin;

module.exports = React.createClass({
  mixins: [ Router.State , Navigation, ContextMixin],
  getInitialState: function(){
  	return {users: this.context.UsersStore.get()};
  },
  componentDidMount: function() {
    this.context.UsersStore.on('change', this.onUsersChage);
  },
  onUsersChage: function(users){
    if(!this.isMounted()) return;
  	this.setState({users:users})
  },
  render: function () {
    return (
      <div className="Users">
        <h3>Users - {this.state.users.length}</h3>
      	<ol>
        {this.state.users.map(function(user){
        	return <li key={user.id}><Link to="user" params={{userId: user.id}} >{user.name}</Link></li>
        })}
        </ol>
        <RouteHandler/>
        <NewUserForm/>
      </div>
    );
  }
});