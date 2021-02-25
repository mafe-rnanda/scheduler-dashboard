import React, { Component } from "react";
import classnames from "classnames";
import Loading from './Loading';
import Panel from './Panel';
import axios from 'axios';
import {
  getTotalInterviews,
  getLeastPopularTimeSlot,
  getMostPopularDay,
  getInterviewsPerDay
} from "helpers/selectors";

const data = [
  {
    id: 1,
    label: "Total Interviews",
    getValue: 6
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    getValue: "1pm"
  },
  {
    id: 3,
    label: "Most Popular Day",
    getValue: "Wednesday"
  },
  {
    id: 4,
    label: "Interviews Per Day",
    getValue: "2.3"
  }
];

class Dashboard extends Component {
  state = { 
    loading: true,
    focused: null,
    days: [],
    appointments: {},
    interviewers: {}
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
    
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(([days, appointments, interviewers]) => {
      this.setState({
        loading: false,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      });
    });
  }
  // listen for changes to the state
  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  render() {
    console.log("this.state: ", this.state)
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
            value={panel.getValue[this.state]}
            onSelect={event => this.selectPanel(panel.id)} // must use an arrow function to bind "this"
          />
      ));
    
    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;
