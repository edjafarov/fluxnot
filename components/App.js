var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link, Navigation } = Router;
var UsersList = require('./UsersList');

module.exports = React.createClass({
  mixins: [Navigation],
  render: function () {
    return (
      <div className="container">
      	<nav className="navbar navbar-default" role="navigation">
      		<div className="container-fluid">
      			<div className="navbar-header">
      				<Link to="/" className="navbar-brand">app</Link>
      			</div>
		      	<ul className="nav navbar-nav">
		      		<li><Link to="users">Users</Link></li>
		      	</ul>
      		</div>
      	</nav>

        <RouteHandler/>
      </div>
    );
  }
});