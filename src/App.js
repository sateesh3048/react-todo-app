import React, { Component } from 'react';
import './App.css';
import List from './containers/List/List';
import { Switch, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route path="/active" component={List} />  
          <Route path="/completed" component={List} />  
          <Route path="/clear_completed" component={List} />  
          <Route exact path="/" component={List} />
        </Switch>
      </div>
    );
  }
}

export default App;
