import { useState } from "react";
import "./App.css";
import axios from "axios";
import Map from "./components/Map";
import UserInput from "./components/UserInput";
import BarChart from "./components/BarChart";
import CircularProgress from "@mui/material/CircularProgress";
import StateTable from "./components/StateTable";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Paper } from "@mui/material";

function App() {
  const URL = "https://helloklow-natural-disasters.onrender.com";
  const [year, setYear] = useState(new Date().getFullYear());
  const [view, setView] = useState("Fire");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setisLoading] = useState(false);

  const fetchData = async (inputYear) => {
    try {
      setisLoading(true);
      const response = await axios.get(
        `${URL}predict_disasters?year=${inputYear}`
      );
      setisLoading(false);
      setYear(inputYear);
      setData(response.data);
      setError(null); // Reset error state if data is fetched successfully
    } catch (error) {
      setError(true); // Set error message
      setisLoading(false);
    }
  };

  return (
    <div id="app">
      <h1>U.S. Natural Disaster Predictions</h1>

      {/* User Input */}
      <UserInput
        view={view}
        setView={setView}
        setYear={setYear}
        fetchData={fetchData}
        isLoading={isLoading}
      />

      {/* Error Display */}
      {/* Error view */}
      {error && (
        <div className="error-view">
          <Alert severity="error" className="error_message">
            <AlertTitle>Error</AlertTitle>
            <p>The server has reached it's usage limit :'(</p>
          </Alert>
        </div>
      )}

      {/* D3 Map */}
      {data ? (
        <>
          <Paper id="section-map" className="map">
            <Map data={data} view={view} year={year} />
          </Paper>
          <Paper id="section-bar">
            <BarChart data={data} view={view} year={year} />
          </Paper>
          <StateTable data={data} />
        </>
      ) : (
        <div className={`user-info ${error && "hidden"}`}>
          <Alert severity="error">
            {/* <AlertTitle>Info</AlertTitle> */}
            Please enter year and select disaster to view map.
          </Alert>
        </div>
      )}

      {isLoading && (
        <div className="loader">
          <CircularProgress />
          <span className="loading-text">
            Loading prediction...
          </span>
        </div>
      )}

      <div id="disclaimer" className={data ? "show_bottom" : "show_top"}>
        {/* <Alert className="disclaimer_box" severity="info">
          US Natural Disaster Declarations dataset provided via{" "}
          <a href="https://www.kaggle.com/datasets/headsortails/us-natural-disaster-declarations">
            Kaggle
          </a>
          .
        </Alert> */}
      </div>
    </div>
  );
}

export default App;