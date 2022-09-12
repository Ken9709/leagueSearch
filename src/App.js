import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { set } from "lodash";

function App() {
    const [SearchText, setSearchText] = useState("");
    const [playerData, setPlayerData] = useState({});
    const [gameList, setGameList] = useState([]);

    function searchForPlayer(event) {
        // handle the API call

        axios
            .get(
                "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" +
                    SearchText +
                    "?api_key=RGAPI-be5563cb-1fa6-4dda-b870-7974a7cb112b",
                { mode: "cors" }
            )
            .then(function (response) {
                setPlayerData(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function getGameData(event) {
        // handle the API call, hit our proxy server

        axios
            .get("http://localhost:4000/past5Games", {params: {username: SearchText}})
            //on success, set game list to the response from the server
            .then(function (response) {
                setGameList(response.data);
                //fail, throw error
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function getChampIcon(champID){
        console.log(champID)
    }
    

    return (
        <div className="App">
            <div className="container">
                <h1>league of legends search</h1>
                <input
                    type="text"
                    onChange={(e) => setSearchText(e.target.value)}
                ></input>
                <button onClick={(e) => searchForPlayer(e)}>
                    Search for player
                </button>
                <button onClick={(e) => getGameData(e)}>
                    champ data
                </button>
                {gameList.length !== 0 ? (
                    <>
                        <p> We have data</p>
                        {gameList.map((gameData, index) => (
                            <>
                                <h2>Game {index + 1}</h2>
                                <div>
                                    {gameData.info.participants.map(
                                        (data, participantIndex) => (
                                            <p>
                                                player {participantIndex + 1}:{" "}
                                                {data.summonerName}, KDA:{" "}
                                                {data.kills} / {data.deaths} /{" "}
                                                {data.assists}
                                                <img width = "100" height= "100" src ={"http://ddragon.leagueoflegends.com/cdn/12.17.1/img/champion/" + data.championName + ".png"}></img>
                                            </p>
                                        )
                                    )}
                                </div>
                            </>
                        ))}
                    </>
                ) : (
                    <>
                        <p>we have no data</p>
                    </>
                )}
            </div>
            {playerData.name != "{}" ? (
                <>
                    <p>Summoner name: {playerData.name}</p>
                    <p>Summoner level: {playerData.summonerLevel}</p>

                    <p>Champ: </p>
                </>
            ) : (
                <>
                    <p>no player data</p>
                </>
            )}
        </div>
    );
}

export default App;
