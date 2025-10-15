import '../App.css';
import ListKnijzare from '../components/ListKnijzare';
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import React, { use, useEffect, useState } from "react";
import { db } from "../firebase-config";
import { getDatabase, ref, set, get, onValue } from "firebase/database";
import ListKnjige from '../components/ListKnjige';
import { Nav } from 'react-bootstrap';
import NavBar from '../components/NavBar';

export function Knjiga({loggedInUser, setLoggedInUser}) {
    const navStyle = {
  backgroundColor: '#FFE797' 
  };
    console.log("Knjiga props:");
    const [knjiga, setKnjiga] = useState({});
    let { idknjizare, idknjige } = useParams();
    
        
    useEffect(() => {
        getKnjigaById(idknjizare, idknjige);
        }
    , []);

    function getKnjigaById(id) {
            const knjigaRef = ref(db, `knjige/${idknjizare}/${idknjige}`);
            get(knjigaRef)
            .then((snapshot) => {
            if (snapshot.exists()) { 
                console.log(snapshot.val());
                setKnjiga(snapshot.val());
            } else {
                console.log("No data available");
            }
            })
            .catch((error) => {
            console.error(error);
            });
        }    

    return (
        <div className="App">
            <NavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>
            <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8">
                    <div className="card shadow-lg p-4" style={{backgroundColor: '#E6D8C3'}}>
                        <div className="card-body">
                            <h2 className="card-title mb-3" style={{color: '#6B4226'}}>{knjiga.naziv}</h2>
                            <h5 className="card-subtitle mb-2 text-muted">Autor: {knjiga.autor}</h5>
                            <p className="mb-1">Broj strana: {knjiga.brojStrana}</p>
                            <p className="mb-3">Cena: <span className="fw-bold">{knjiga.cena} RSD</span></p>
                            <p className="mb-3">Opis: {knjiga.opis}</p>
                            <p className="mb-3">Format: {knjiga.format}</p>
                            <p className="mb-3">Zanr: {knjiga.zanr}</p>
                            <div className="d-flex flex-wrap mb-3">
                                {knjiga.slike && knjiga.slike.map((slika, index) => (
                                    <img
                                        key={index}
                                        src={slika}
                                        alt={`Slika ${index + 1}`}
                                        className="img-fluid rounded border me-2 mb-2"
                                        style={{maxWidth: '200px', maxHeight: '200px'}}
                                    />
                                ))}
                            </div>
                            <Link to={-1} className="btn btn-secondary mt-2">Nazad</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
        
    );
}