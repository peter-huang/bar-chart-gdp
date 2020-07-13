import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./frontend/css/main.css";
import * as d3 from "d3";

/*
 * Formats date into unix time in seconds
 *
 * @param data - Date string in YYYY-MM-DD format
 */
const formatDateToSeconds = (date) => {
  let t = new Date(date);
  return t.getTime() / 1000;
};

/*
 * Adds appropriate increment for scaleBand
 *
 * @param data - Date string in YYYY-MM-DD format
 */
const formatYear = (date) => {
  let year = parseInt(date.substring(0, 4));
  let month = parseInt(date.substring(5, 7));

  switch (month) {
    case 1:
      year += 0;
      break;
    case 4:
      year += 0.25;
      break;

    case 7:
      year += 0.5;
      break;
    case 10:
      year += 0.75;
      break;
  }

  return year;
};

/*
 * Adds appropriate Q1, Q2, Q3, Q4 strings based on month value
 *
 * @param data - Date string in YYYY-MM-DD format
 */
const formatDate = (date) => {
  let year = date.substring(0, 4);
  let month = date.substring(5, 7);

  let formatted = year;

  switch (month) {
    case "01":
      formatted += " Q1";
      break;
    case "04":
      formatted += " Q2";
      break;

    case "07":
      formatted += " Q3";
      break;
    case "10":
      formatted += " Q4";
      break;
  }

  return formatted;
};

const App = () => {
  // Sets the initial state
  const [data, setData] = useState([]);

  // Gets json source asynchronously
  const getData = () => {
    const fetchData = async () => {
      const req = new XMLHttpRequest();
      req.open(
        "GET",
        "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",
        true
      );

      req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE) {
          let reqStatus = req.status;

          // request was successful
          if (reqStatus === 0 || (reqStatus = 200 && reqStatus < 400)) {
            let e = JSON.parse(req.responseText);

            let f = [];

            e.data.forEach((d) => {
              f.push([
                d[0],
                d[1],
                formatYear(d[0]),
                formatDate(d[0]),
                formatDateToSeconds(d[0]),
              ]);
            });

            setData(() => f);
          }
        }
      };

      req.send();
    };

    fetchData();
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div class="container h-100">
      <div class="row h-100">
        <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 d-flex flex-column justify-content-center align-items-center">
          <div>
            <BarChart data={data} />
          </div>

          <div class="text-center font-weight-bold text-black mt-2 pt-2 d-none">
            Designed and coded by{" "}
            <a class="credits" href="https://github.com/peter-huang">
              Peter Huang
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const BarChart = ({ data }) => {
  useEffect(() => {
    // draw bar
    if (data != null && data.length > 0) {
      drawBarChart(data);
    }
  }, [data]);

  /*
   * Draws the bar chart
   *
   * @param data - gross domestic data
   */
  const drawBarChart = (gdpData) => {
    let data = gdpData;
    let years = [];
    data.forEach((e) => years.push(e[2]));

    // chart settings
    const width = 800;
    const height = 500;
    const padding = 50;
    const margin = 10;

    // bar settings
    const barWidth = (width - padding) / data.length;
    const barHeight = 2;

    // scales
    const xScale = d3.scaleTime();
    xScale.domain([
      d3.min(data, (d) => new Date(d[0])),
      d3.max(data, (d) => new Date(d[0])),
    ]);
    xScale.range([padding, width - padding]);

    const yScale = d3.scaleLinear();
    yScale.domain([0, d3.max(data, (d) => d[1])]);
    yScale.range([height - padding, padding]);

    const unixScale = d3.scaleLinear();
    unixScale.domain([d3.min(data, (d) => d[4]), d3.max(data, (d) => d[4])]);
    unixScale.range([padding, width - padding]);

    /*
    const xBandScale = d3.scaleBand();
    xBandScale.domain(years);
    xBandScale.range([padding, width - padding]);

    const xAxis = d3
      .axisBottom(xBandScale)
      .tickFormat((d) => (d.toString().indexOf(".") < 0 ? d : ""))
      .tickValues(
        xBandScale.domain().filter((d, i) => {
          return !(i % 10);
        })
    );*/

    // axis
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // setting up title
    d3.select("#chart")
      .append("div")
      .attr("id", "title")
      .text("United States Gross Domestic Product (1947 - 2015)");

    // setting up svg
    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // settings tooltip
    let tooltip = d3
      .select("#chart")
      .append("div")
      .attr("id", "tooltip")
      .attr("style", "position: absolute; opacity: 0;");

    // title
    svg
      .append("text")
      .style("font-size", "2em")
      .attr("id", "chart")
      .text("United States GDP");

    // bars
    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("data-date", (d) => d[0])
      .attr("data-gdp", (d) => d[1])
      .attr("x", (d) => unixScale(d[4]))
      .attr("y", (d) => yScale(d[1]))
      .attr("width", barWidth)
      .attr("height", (d, i) => {
        return height - padding - yScale(d[1]);
      })
      .on("mouseover", (d, i) => {
        let t = d[3] + " " + "$" + d[1] + " Billion";

        let e = document.getElementById("chart").getBoundingClientRect();

        let f = document.getElementById("tooltip").getBoundingClientRect();

        let computedWidth = ((e.width - 2 * padding) / data.length) * i + "px";

        console.log(computedWidth);
        tooltip.transition().duration(100).style("opacity", 1);
        tooltip
          .html(t)
          .style("top", e.height / 2 + "px")
          .style("left", computedWidth)
          .attr("data-date", d[0]);
      })
      .on("mouseout", (d) => {
        tooltip.transition().duration(100).style("opacity", 0.0);
      })
      .on("mousemove", (d) => {});

    // x-axis
    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", "translate(0," + (height - padding) + ")")
      .call(xAxis);

    svg
      .append("text")
      .style("font-size", "0.75em")
      .attr("id", "x-axis-title")
      .attr("x", width - 4 * padding)
      .attr("y", height - padding / 4)
      .style("text-anchor", "middle")
      .text("More Info: http://www.bea.gov/national/pdf/nipaguid.pdf");

    // y-axis
    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);

    svg
      .append("text")
      .style("font-size", "0.75em")
      .attr("id", "y-axis-title")
      .attr("x", width / 2)
      .attr("y", height + 1.75 * padding)
      .style("text-anchor", "middle")
      .attr("transform", "rotate(90," + width / 2 + "," + height / 2 + ")")
      .text("GDP (Billion in dollars)");
  };

  return (
    <div id="chart-container">
      <div id="chart"></div>
    </div>
  );
};

export default App;
