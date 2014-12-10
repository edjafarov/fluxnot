var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;
var UsersList = require('./components/UsersList');

module.exports = React.createClass({
  render: function () {
    return (
      <div><Link to="users">Open Users</Link>
        <RouteHandler/>
      </div>
    );
  }
});