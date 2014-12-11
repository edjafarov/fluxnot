var React = require('react');
var Router = require('react-router');


module.exports = React.createClass({
  mixins: [ Router.State ],
  render: function () {
    return (
      <div className="User">
        <h3>{this.props.name}</h3>
        <div><label>age:</label>{this.props.age}</div>
        <h4>Bio:</h4>
        <p>{this.props.bio}</p>
      </div>
    );
  }
});