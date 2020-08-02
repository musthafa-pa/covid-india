import React from "react";
import Navbar from "./Navbar";
import Chart from "chart.js";

let chart;
let death_chart;
let recov_chart;
let mixed_chart;
let india;
let recovs;
let cases = [];
let dates = [];
let deaths = [];
let death_graph = [];
let death_dates = [];
let recov_dates = [];
let recov_cases = [];
let total;
export default class Dashboard extends React.Component {
  casesRef = React.createRef();
  recovRef = React.createRef();
  deathRef = React.createRef();
  chartRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      cases: [],
      dates: [],
      death_dates:[],
      death_cases:[],
      recov_cases:[],
      recov_dates:[],
      confirmed: "",
      recoveries: "",
      deaths: "",
      newrecov: "",
    };
  }
  componentDidMount = () => {
    fetch("https://api.covid19api.com/summary")
      .then((res) => res.json())
      .then((data) => (total = data))
      .then(() => console.log(total));

    setTimeout(() => {
      let result = total["Countries"];
      result = result.filter((item) => {
        return item["Country"] == "India";
      });
      console.log(result);
      let conf, recov, deaths, newrec;
      Object.entries(result).forEach(([key, val]) => {
        conf = val["TotalConfirmed"];
        newrec = val["NewRecovered"];
        recov = val["TotalRecovered"];
        deaths = val["TotalDeaths"];
      });
      this.setState({
        confirmed: conf,
        recoveries: recov,
        deaths: deaths,
        newrecov: newrec,
      });
    }, 1000);

    //confirmed cases
    fetch(
      "https://api.covid19api.com/total/dayone/country/india/status/confirmed"
    )
      .then((res) => res.json())
      .then((data) => (india = data))
      .then(() => console.log(india));

    setTimeout(() => {
      Object.entries(india).forEach(([key, val]) => {
        cases.push(val["Cases"]);
        dates.push(val["Date"]);
      });
      console.log(dates, cases);
      dates = dates.map((item) => {
        return item.substring(0, 10);
      });

      this.setState({ cases: cases, dates: dates });
      this.buildChart(this.state.dates, this.state.cases);
    }, 1500);

    //deaths
    fetch('https://api.covid19api.com/total/country/india/status/deaths')
    .then(res => res.json())
    .then((data) => (deaths = data))

    setTimeout(() => {
      Object.entries(deaths).forEach(([key, val]) => {
        death_graph.push(val["Cases"]);
        death_dates.push(val["Date"]);
      });
      console.log(dates, cases);
      death_dates = death_dates.map((item) => {
        return item.substring(0, 10);
      });

      this.setState({ death_cases: death_graph, death_dates: death_dates });
      this.deathChart(this.state.death_dates, this.state.death_cases);
    }, 1000);

    //Recovered
    fetch('https://api.covid19api.com/total/country/india/status/recovered')
    .then(res => res.json())
    .then((data) => (recovs = data))

    setTimeout(() => {
      Object.entries(recovs).forEach(([key, val]) => {
        recov_cases.push(val["Cases"]);
        recov_dates.push(val["Date"]);
      });
      recov_dates = recov_dates.map((item) => {
        return item.substring(0, 10);
      });

      this.setState({ recov_cases: recov_cases, recov_dates: recov_dates });
      this.recovChart(this.state.recov_dates, this.state.recov_cases);
    }, 1000);

    setTimeout(() => {
      this.mixedChart();
    },1500)
  };

  //confirmed chart
  //chart for cases
  buildChart = (label, data) => {
    const myChartRef = this.casesRef.current.getContext("2d");
    if (typeof chart !== "undefined") chart.destroy();

    chart = new Chart(myChartRef, {
      type: "line",
      data: {
        //Bring in data
        labels: label,
        datasets: [
          {
            label: "Cases",
            data: data,
            fill: false,
            borderColor: "rgba(90, 184, 109, 0.4)",
            backgroundColor: "rgba(90, 184, 109, 0.4)",
            pointBackgroundColor: "rgba(85, 186, 231, 0.1)",
            pointBorderColor: "#55bae7",
            pointHoverBackgroundColor: "#55bae7",
            pointHoverBorderColor: "#55bae7",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 5,
            left: 15,
            right: 15,
            bottom: 15,
          },
        },
        tooltips: {
          backgroundColor: "#FFF",
          titleFontSize: 14,
          titleFontColor: "#091520",
          bodyFontColor: "#000",
          bodyFontSize: 14,
          displayColors: false,
          xPadding: 18,
          yPadding: 18,
        },
      },
      scales: {
        xAxes: [
          {
            type: "time",
            ticks: {
              autoSkip: true,
              maxTicksLimit: 20,
            },
          },
        ],
      },
    });
  };

  //chart for deaths
  deathChart = (label, data) => {
    const myChartRef = this.deathRef.current.getContext("2d");
    if (typeof death_chart !== "undefined") death_chart.destroy();

    death_chart = new Chart(myChartRef, {
      type: "line",
      data: {
        //Bring in data
        labels: label,
        datasets: [
          {
            label: "Deaths",
            data: data,
            fill: false,
            borderColor: "rgba(90, 184, 109, 0.4)",
            backgroundColor: "rgba(90, 184, 109, 0.4)",
            pointBackgroundColor: "rgba(85, 186, 231, 0.1)",
            pointBorderColor: "#55bae7",
            pointHoverBackgroundColor: "#55bae7",
            pointHoverBorderColor: "#55bae7",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 5,
            left: 15,
            right: 15,
            bottom: 15,
          },
        },
        tooltips: {
          backgroundColor: "#FFF",
          titleFontSize: 14,
          titleFontColor: "#091520",
          bodyFontColor: "#000",
          bodyFontSize: 14,
          displayColors: false,
          xPadding: 18,
          yPadding: 18,
        },
      },
      scales: {
        xAxes: [
          {
            type: "time",
            ticks: {
              autoSkip: true,
              maxTicksLimit: 20,
            },
          },
        ],
      },
    });
  };

  //chart for deaths
  recovChart = (label, data) => {
    const myChartRef = this.recovRef.current.getContext("2d");
    if (typeof recov_chart !== "undefined") recov_chart.destroy();

    recov_chart = new Chart(myChartRef, {
      type: "line",
      data: {
        //Bring in data
        labels: label,
        datasets: [
          {
            label: "Recoveries",
            data: data,
            fill: false,
            borderColor: "rgba(90, 184, 109, 0.4)",
            backgroundColor: "rgba(90, 184, 109, 0.4)",
            pointBackgroundColor: "rgba(85, 186, 231, 0.1)",
            pointBorderColor: "#55bae7",
            pointHoverBackgroundColor: "#55bae7",
            pointHoverBorderColor: "#55bae7",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 5,
            left: 15,
            right: 15,
            bottom: 15,
          },
        },
        tooltips: {
          backgroundColor: "#FFF",
          titleFontSize: 14,
          titleFontColor: "#091520",
          bodyFontColor: "#000",
          bodyFontSize: 14,
          displayColors: false,
          xPadding: 18,
          yPadding: 18,
        },
      },
      scales: {
        xAxes: [
          {
            type: "time",
            ticks: {
              autoSkip: true,
              maxTicksLimit: 20,
            },
          },
        ],
      },
    });
  };

    //chart for Mixed
    mixedChart = () => {
      const myChartRef = this.chartRef.current.getContext("2d");
      if (typeof mixed_chart !== "undefined") mixed_chart.destroy();
  
      mixed_chart = new Chart(myChartRef, {
        type: "line",
        data: {
          //Bring in data
          labels: this.state.dates,
          datasets: [
            {
              label: "Cases",
              data: this.state.cases,
              fill: false,
              borderColor: "rgba(90, 184, 109, 0.4)",
              backgroundColor: "rgba(90, 184, 109, 0.4)",
              pointBackgroundColor: "rgba(85, 186, 231, 0.1)",
              pointBorderColor: "#55bae7",
              pointHoverBackgroundColor: "#55bae7",
              pointHoverBorderColor: "#55bae7",
            },
            {
              label: "Recoveries",
              data: this.state.recov_cases,
              fill: false,
              borderColor: "rgba(90, 184, 109, 0.4)",
              backgroundColor: "rgba(90, 184, 109, 0.4)",
              pointBackgroundColor: "rgba(85, 186, 231, 0.1)",
              pointBorderColor: "#55bae7",
              pointHoverBackgroundColor: "#55bae7",
              pointHoverBorderColor: "#55bae7",
            },
            {
              label: "Deaths",
              data: this.state.death_cases,
              fill: false,
              borderColor: "rgba(90, 184, 109, 0.4)",
              backgroundColor: "#e74c3c",
              pointBackgroundColor: "#e74c3c",
              pointBorderColor: "#55bae7",
              pointHoverBackgroundColor: "#55bae7",
              pointHoverBorderColor: "#55bae7",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              top: 5,
              left: 15,
              right: 15,
              bottom: 15,
            },
          },
          tooltips: {
            backgroundColor: "#FFF",
            titleFontSize: 14,
            titleFontColor: "#091520",
            bodyFontColor: "#000",
            bodyFontSize: 14,
            displayColors: false,
            xPadding: 18,
            yPadding: 18,
          },
        },
        scales: {
          xAxes: [
            {
              type: "time",
              ticks: {
                autoSkip: true,
                maxTicksLimit: 20,
              },
            },
          ],
        },
      });
    };
  render() {
    return (
      <div>
        <Navbar />
        <div id="heads">
          <div id="cases">
            <h4>Total Confirmed</h4>
            <p>{this.state.confirmed}</p>
            </div>
          <div id="recoveries">
          <h4>Total Recoveries</h4>
            <p>{this.state.recoveries}</p>
            </div>
          <div id="deaths">
          <h4>Total Deaths</h4>
            <p>{this.state.deaths}</p>
          </div>
          <div id="predictions">
          <h4>Total New confirmed</h4>
            <p>{this.state.newrecov}</p>
            </div>
        </div>
        <div id="reports">
          <div id="graph_1">
            <div id="tot_cases">
              <canvas
                id="myChart"
                ref={this.casesRef}
                height={200}
                width={200}
              />
            </div>
            <div id="tot_recoveries">
              <canvas
                id="myChart"
                ref={this.recovRef}
                height={200}
                width={200}
              />
            </div>
          </div>
          <div id="graph_2">
            <div id="tot_deaths">
              <canvas
                id="myChart"
                ref={this.deathRef}
                height={200}
                width={200}
              />
            </div>
            <div id="tot_predic">
              <canvas
                id="myChart"
                ref={this.chartRef}
                height={200}
                width={200}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
