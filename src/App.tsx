import React from 'react';
import ChartComponent from "./Components/Chart";
import { dataApp } from "./data/dataApp"

function App() {

  return (
    <div className="App">
        {dataApp.length && dataApp.map(chart =>  <ChartComponent key={chart.ChunkStart} barsData={chart.Bars} startTime={chart.ChunkStart} />)}
    </div>
  );
}

export default App;
