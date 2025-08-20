import React from 'react'
import { useEffect, useState } from "react";

const API_KEY = process.env.REACT_APP_OPENWEATHER_KEY || "195059bac3df18df352c6e74cbbfdaec";
export const Weather = () => {

    const [query, setQuery] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    useEffect(() => {
        fetchWeather("London");
    }, []);


    async function fetchWeather(city) {
        if (!API_KEY || API_KEY === "YOUR_API_KEY") {
            setError("Please set your OpenWeather API key in .env");
            return;
        }
        if (!city) return;


        try {
            setLoading(true);
            setError("");
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );
            if (!res.ok) throw new Error("City not found");
            const json = await res.json();
            setData(json);
        } catch (e) {
            setData(null);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }


    function onSearch() {
        if (query.trim()) fetchWeather(query.trim());
    }

    return (
        <div className="d-flex justify-content-center align-items-center custom-color rounded">
            <div className="card shadow-lg text-white bg-gradient" style={{ width: "22rem", background: "linear-gradient(160deg, #4c66ff, #6a3dff, #6d34ff)" }}>
                <div className="card-body">
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search city"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && onSearch()}
                        />
                        <button className="btn btn-light" onClick={onSearch}>🔍</button>
                    </div>


                    <div className="d-flex justify-content-center mb-3">
                        <div style={{ fontSize: "3rem", color: "#FFCA28" }}>☀️</div>
                    </div>


                    {loading ? (
                        <p className="text-center">Loading...</p>
                    ) : error ? (
                        <p className="text-center bg-dark p-2 rounded">{error}</p>
                    ) : data ? (
                        <>
                            <h1 className="display-3 fw-bold text-center">{Math.round(data.main.temp)}°c</h1>
                            <h4 className="text-center mb-4">{data.name}</h4>


                            <div className="d-flex justify-content-between px-3">
                                <div className="text-center">
                                    <div style={{ fontSize: "1.5rem" }}>💧</div>
                                    <div className="fw-bold">{data.main.humidity}%</div>
                                    <small>Humidity</small>
                                </div>
                                <div className="text-center">
                                    <div style={{ fontSize: "1.5rem" }}>💨</div>
                                    <div className="fw-bold">{(data.wind.speed * 3.6).toFixed(1)} Km/h</div>
                                    <small>Wind Speed</small>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-center">Search a city to see weather</p>
                    )}
                </div>
            </div>
        </div>
    )
}
