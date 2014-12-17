var React = require('react');
var Router = require('react-router');
var UserFormStore = require('../stores/UserFormStore');
//var Actions = require('../Actions');

module.exports = React.createClass({
  mixins: [ React.addons.LinkedStateMixin ],
  getInitialState: function(){
  	return UserFormStore.get();
  },
  componentDidMount: function() {
    UserFormStore.on('errors', this.onErrors);
  },	  
  onErrors: function(data){
  	this.setState({errors: data});
  },
  submit: function(){
		//Actions.doAction('submit:newUser', {}, this.state);
  },
  render: function () {
  	
  	var errors = this.state.errors && <ul>
      		{this.state.errors.map(function(error){
      			return <li>{error.varName} - {error.type}</li>
      		})}
      	</ul>;
    return (
      <form className="User">
      	{errors}
      	<input type="text" valueLink={this.linkState('id')} placeholder="id" />
        <input type="text" valueLink={this.linkState('name')} placeholder="name" />
        <input type="text" valueLink={this.linkState('age')} placeholder="age" />
        <input type="text" valueLink={this.linkState('bio')} placeholder="bio" />
        <input type="button" value="Submit" onClick={this.submit}/>
      </form>
    );
  }
});