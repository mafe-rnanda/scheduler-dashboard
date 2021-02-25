import React, { Component } from "react";
import classnames from "classnames";
import Loading from './Loading';
import Panel from './Panel';

const data = [
  {
    id: 1,
    label: "Total Interviews",
    value: 6
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    value: "1pm"
  },
  {
    id: 3,
    label: "Most Popular Day",
    value: "Wednesday"
  },
  {
    id: 4,
    label: "Interviews Per Day",
    value: "2.3"
  }
];

class Dashboard extends Component {
  state = { 
    loading: false,
    focused: null
  }
  
  // Set the value of focused back to null if the value of focused is currently set to a panel
  selectPanel(id) {
    this.setState(previousState => ({
      focused: previousState.focused !== null ? null : id
    }));
  }

  // check to see if there is saved focus state after we render the application the first time
  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    if (focused) {
      this.setState({ focused });
    }
  }
  // listen for changes to the state
  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  
  render() {
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
    });
    
    if (this.state.loading) {
      return <Loading />;
    }
    
    const panels = data
      .filter(
        panel => this.state.focused === null || this.state.focused === panel.id
      )  
      .map(panel => (
          <Panel
            key={panel.id}
            id={panel.id}
            label={panel.label}
            value={panel.value}
            onSelect={event => this.selectPanel(panel.id)} // must use an arrow function to bind "this"
          />
      ));
    
    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;
