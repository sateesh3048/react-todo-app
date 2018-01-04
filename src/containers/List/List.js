import React, { Component } from "react";
import classes from "./List.css";
import { NavLink } from 'react-router-dom';

class List  extends Component {
  
  state = {
    items: [],
    inputDate: null
  }

  componenWillMount(){
    let newInputDate = new Date().getMilliseconds();
    this.setState({inputDate: newInputDate});
    
  }
  
  createItem = (event) => {
    if(event.key === "Enter"){
      const newItem = {
         id: new Date().getTime(),
         name: event.target.value,
         status: "Active"
      }
      if(event.target.value.trim().length !== 0){
        this.setState({
          items: this.state.items.concat(newItem)
        });
        event.target.value = '';
      }
    }
  }

  updateItemStatus = (event, item_id)  => {
    let status = "Active";
    if(event.target.checked){
      status = "Completed"
    }
    let updatedItems = this.state.items.map(item => {
      if(item.id !== item_id){
        return item
      }
      return {
        ...item,
        status: status
      } 
    })
    this.setState({items: updatedItems})
  }

  updateItemName = (event, item_id) => {
    let updatedItems = this.state.items.map(item => {
        if(item.id !== item_id){
          return item
        }
        return {
          ...item,
          name: event.target.value
        } 
      })
      this.setState({items: updatedItems})
  }

  removeItem = (item_id) => {
    return () => {
      const updatedItems = this.state.items.filter(item => item.id !== item_id);
      this.setState({items: updatedItems});
    }
  }

  makeEditable = (event) => {
    event.target.readOnly = false;
  }

  filterItemsByStatus = (status) => {
    return this.state.items.filter(item => item.status === status)
  }

  clearCompletedItems = () => {
    const completed_items_count =  this.filterItemsByStatus("Completed");
    if(completed_items_count.length > 0){
      const updatedItems = this.state.items.filter(item => item.status !== "Completed");
      this.setState({items: updatedItems});
      this.props.history.push("/");
    }
  }

  fetch_items_list = (url) => {
    const operation = url.replace(/\//, '');
    return this.performOperations(operation);
  }

  performOperations = (operation) => {
    switch(operation){
      case "all":
        return this.state.items;
      case "active":
        return this.filterItemsByStatus("Active");
      case "completed":
        return this.filterItemsByStatus("Completed");
      case "clear_completed":
        this.clearCompletedItems();
        return this.state.items;
      default:
        return this.state.items;
    }
  }
  
  render(){
    console.log("Calling render");
    const itemsList = this.fetch_items_list(this.props.location.pathname);
    const active_items = this.filterItemsByStatus("Active");
    let listUI = [(
      <li key = {this.state.inputDate} className={classes.Unstyled} >
      <input 
        type="checkbox"
      />
       <input 
         type="text" 
         placeholder="What needs to be done?" 
         className={classes.InputStyle}
         onKeyPress={this.createItem}
        />
      </li>
    )];
    if(this.state.items.length > 0){
      let itemsUI = itemsList.map(item => {
        const InputClassNames = item.status === "Completed" ? [classes.InputStyle, classes.InputStrike] : [classes.InputStyle]
        return(
          <li key = {item.id} className={classes.Unstyled}>
            <input 
              type="checkbox"
              onClick={ (event) => { this.updateItemStatus(event, item.id) }}
            />
            <input 
              type="text"
              className={InputClassNames.join(" ")}
              readOnly = "true"
              value = {item.name}
              onDoubleClick= {(event) => this.makeEditable(event)}
              onChange = { (event) => this.updateItemName(event, item.id)}
            />
            <button onClick={this.removeItem(item.id)}>X</button>
         </li>
        );
      });
      listUI = listUI.concat(itemsUI);
      const itemsLinks = (
        <li key = {new Date().getTime()} className={[classes.Unstyled, classes.LinksOperationStyle].join(" ")}>
          <div className={[classes.Inline, classes.StyleItemsCount].join(" ")}>
            {active_items.length} items left  
          </div>
          <div className={classes.Inline}>
              <NavLink to="/" className={classes.LinkStyle} activeClassName={classes.LinkHighlight} exact>All</NavLink>
              <NavLink to="/active" className={classes.LinkStyle} activeClassName={classes.LinkHighlight}>Active</NavLink>
              <NavLink to="/completed" className={classes.LinkStyle} activeClassName={classes.LinkHighlight}>Completed</NavLink>
              <NavLink to="/clear_completed" className={classes.LinkStyle} activeClassName={classes.LinkHighlight}>Clear completed</NavLink>
          </div>
        </li>);
      listUI = listUI.concat(itemsLinks);
    }
    return(
      <div>
        <h3>Todos List</h3>
        <ul className={classes.List}>
          {listUI}
        </ul>
      </div>
    );
  }
}

export default List;