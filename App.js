var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;

module.exports = React.createClass({
  render: function () {
    return (
      <div>
        <ul>
          <li><Link to="user" params={{userID: "123"}}>Bob</Link></li>
          <li><Link to="user" params={{userID: "123"}} query={{showAge: true}}>Bob With Query Params</Link></li>
          <li><Link to="user" params={{userID: "abc"}}>Sally</Link></li>
        </ul>
        <RouteHandler/>
      </div>
    );
  }
});