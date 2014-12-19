var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;
var UsersStore = require('../stores/UsersStore');
var UserItem = require('./UserItem');
var NewUserForm = require('./NewUserForm');

module.exports = React.createClass({
  mixins: [ Router.State ],
  getInitialState: function(){
  	return {users: UsersStore.get()};
  },
  componentDidMount: function() {
    UsersStore.on('change', this.onUsersChage);
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
        	return <li><Link to="user" params={{userId: user.id}} >{user.name}</Link></li>
        })}
        </ol>
        <RouteHandler/>
        <NewUserForm/>
      </div>
    );
  }
});