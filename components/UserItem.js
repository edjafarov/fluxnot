var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link, Navigation } = Router;
var ContextMixin = require("../theLib/ContextMixin");

module.exports = React.createClass({
  displayName: "UserItem",
  mixins: [ Router.State,  Navigation, ContextMixin],
  render: function () {

    return (
      <div className="User">
        <h3>Name: {this.props.name}</h3>
        <div><label>age:</label>{this.props.age}</div>
        <h4>Bio:</h4>
        <p>{this.props.bio}</p>
      </div>
    );
  }
});