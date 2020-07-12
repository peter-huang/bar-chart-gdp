import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./frontend/css/main.css";
import * as d3 from "d3";

const App = () => {
  const [data, setData] = useState([]);

  const getData = () => {
    console.log("parent getData");

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
            const data = [
              ["1950-01-01", 47],
              ["1950-04-01", 52],
              ["1950-07-01", 70],
              ["1950-10-01", 75],
              ["1951-01-01", 47],
              ["1951-04-01", 52],
              ["1951-07-01", 70],
              ["1951-10-01", 75],
              ["1952-01-01", 47],
              ["1952-04-01", 52],
              ["1952-07-01", 70],
              ["1952-10-01", 75],
              ["1953-01-01", 47],
              ["1953-04-01", 52],
              ["1953-07-01", 70],
              ["1953-10-01", 75],
            ];

            let f = [];

            e.data.forEach((d) => {
              f.push([d[0], d[1], formatYear(d[0]), formatDate(d[0])]);
            });
            /*
            data.forEach((d) => {
              f.push([formatYear(d[0]), d[1], formatDate(d[0])]);
            });
            */

            setData(() => f);
          }
        }
      };

      req.send();
    };

    fetchData();
  };

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

  const formatDate = (date, val) => {
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

  const drawBarChart = (gdpData) => {
    let data = gdpData;
    let years = [];
    data.forEach((e) => years.push(e[2]));
    console.log(years);

    // chart settings
    const width = 800;
    const height = 500;
    const padding = 50;
    const margin = 10;

    // bar settings
    const barWidth = 2;
    const barHeight = 2;

    // scales
    const xScale = d3.scaleBand();
    xScale.domain(years);
    xScale.range([padding, width - padding]);

    const yScale = d3.scaleLinear();
    yScale.domain([0, d3.max(data, (d) => d[1])]);
    yScale.range([height - padding, padding]);

    const xTimeScale = d3.scaleTime();
    xTimeScale.domain([
      d3.min(data, (d) => new Date(d[2])),
      d3.max(data, (d) => new Date(d[2])),
    ]);
    xTimeScale.range([padding, width - padding]);

    // axis
    const xAxis = d3
      .axisBottom(xScale)
      .tickFormat((d) => (d.toString().indexOf(".") < 0 ? d : ""))
      .tickValues(
        xScale.domain().filter((d, i) => {
          return !(i % 10);
        })
      );
    const yAxis = d3.axisLeft(yScale);

    // setting up title
    d3.select("#chart")
      .append("div")
      .attr("id", "title")
      .text("United States GDP");

    // setting up svg
    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // title
    svg
      .append("text")
      .style("font-size", "2em")
      .attr("id", "chart")
      .text("United States GDP");

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("data-date", (d) => d[0])
      .attr("data-gdp", (d) => d[1])
      .attr("x", (d) => xScale(d[2]))
      .attr("y", (d) => yScale(d[1]))
      .attr("width", xScale.bandwidth())
      .attr("height", (d, i) => {
        return height - padding - yScale(d[1]);
      });
    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", "translate(0," + (height - padding) + ")")
      .call(xAxis);
    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);
  };

  return (
    <div id="chart-container">
      <div id="chart"></div>
    </div>
  );
};

export default App;
