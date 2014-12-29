var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link, Navigation } = Router;
var ContextMixin = require("../theLib/ContextMixin");

module.exports = React.createClass({
  displayName: "NewUserForm",
  mixins: [ require("../theLib/LinkDataStateMixin"),  Navigation, ContextMixin],
  getInitialState: function(){
  	return this.context.stores.UserFormStore.get();
  },
  componentDidMount: function() {
    this.context.stores.UserFormStore.on('change', this.change);
  },	  
  change: function(data){
    if(!this.isMounted()) return;
    this.replaceState(data);
  },
  submit: function(){
		this.context.doAction('submit:newUser', this.state.data);
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
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" className="form-control" valueLink={this.linkDataState('name')} placeholder="name" />
        </div>        
         <div className="form-group">
          <label htmlFor="age">Age</label>
          <input type="text" name="age" className="form-control" valueLink={this.linkDataState('age')} placeholder="age" />
        </div>  
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <input type="text" name="bio" className="form-control" valueLink={this.linkDataState('bio')} placeholder="bio" />
        </div>           
        
        
        <input type="button" className="btn btn-default" value="Submit" onClick={this.submit}/>
      </form>
    );
  }
});