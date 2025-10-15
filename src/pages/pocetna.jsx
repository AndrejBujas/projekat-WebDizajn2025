import '../App.css';
import ListKnijzare from '../components/ListKnijzare';
import NavBar from '../components/NavBar';
import { Link } from 'react-router-dom';
import React, { use, useEffect, useState } from "react";
import { db } from "../firebase-config";
import { getDatabase, ref, set, get, onValue } from "firebase/database";

export function Pocetna({loggedInUser, setLoggedInUser}) {
    const navStyle = {
  backgroundColor: '#FFE797' 
  };

  const [searchTerm, setSearchTerm] = React.useState("");
    
  return (
    <div className="App">
      
      <NavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>

      <main class="margin-top64px">
        <h1>Lista Knjižara</h1>
        <div class="width70 border-top-lg mx-auto">
          <input
            type="text"
            className="form-control mb-3"
            style={{width: "50%", margin: "10px auto"}}
            placeholder="Pretraži knjižare..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <ListKnijzare searchTerm={searchTerm} />
        </div>
      </main>
    </div>
  );
}