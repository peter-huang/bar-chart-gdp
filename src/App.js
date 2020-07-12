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
              [2011, 45],
              [2012, 47],
              [2013, 52],
              [2014, 70],
              [2015, 75],
              [2016, 78],
            ];

            setData(() => data);
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
  const [gdp, setGdp] = useState([]);

  useEffect(() => {
    // update data
    setGdp(() => data);

    // draw bar
    if (data != null && data.length > 0) {
      drawBarChart(data);
    }
  }, [data]);

  const drawBarChart = (gdpData) => {
    let data = gdpData;
    let years = [];
    data.forEach((e) => years.push(e[0]));

    // chart settings
    const width = 700;
    const height = 300;
    const padding = 25;
    const margin = 10;

    // bar settings
    const barWidth = 20;
    const barHeight = 2;

    // scales
    const xScale = d3.scaleBand();
    xScale.domain(years);
    // xScale.domain([d3.min(data, (d) => d[0]), d3.max(data, (d) => d[0])]);
    xScale.range([padding, width - padding]);

    const yScale = d3.scaleLinear();
    yScale.domain([0, d3.max(data, (d) => d[1])]);
    yScale.range([height - padding, padding]);

    // axis
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
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
      .attr(
        "x",
        (d, i) => xScale(d[0]) - barWidth / 2 + padding * 2 + barWidth / 4
      )
      .attr("y", (d, i) => height - yScale(d[1]) - padding)
      .attr("width", barWidth)
      .attr("height", (d, i) => yScale(d[1]));
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
