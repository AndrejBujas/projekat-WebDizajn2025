import '../App.css';
import ListKnijzare from '../components/ListKnijzare';
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import React, { use, useEffect, useState } from "react";
import { db } from "../firebase-config";
import { getDatabase, ref, set, get, onValue } from "firebase/database";
import ListKnjige from '../components/ListKnjige';
import NavBar from '../components/NavBar';
export function Knjizara({loggedInUser, setLoggedInUser}) {
        const navStyle = {
  backgroundColor: '#FFE797' 
  };
    const [knjizara, setKnjizara] = useState({});
    let { id } = useParams();
    
    
    useEffect(() => {
        getKnjizaraById(id);
        }, []);

    function getKnjizaraById(id) {
        const knjizaraRef = ref(db, `knjizare/${id}`);
        get(knjizaraRef)
        .then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            setKnjizara(snapshot.val());
        } else {
            console.log("No data available");
        }
        })
        .catch((error) => {
        console.error(error);
        });
    }    
    const [searchTerm, setSearchTerm] = React.useState("");
    return (
        <div className="App">
            <NavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>
            <div className="container-fluid mt-4">
                <div className="row g-4">
                    <div className="col-12 col-md-4 d-flex justify-content-center align-items-start">
                        <div className="card card-knjizara w-100" style={{maxWidth: '350px'}}>
                            <img src={knjizara.logo} className="card-img-top" alt="..." />
                            <div className="card-body">
                                <h5 className="card-title">{knjizara.naziv}</h5>
                            </div>
                            <ul className="list-group list-group-flush text-start">
                                <li className="list-group-item">Godina Osnovanja: {knjizara.godinaOsnivanja}</li>
                                <li className="list-group-item">Adresa: {knjizara.adresa}</li>
                                <li className="list-group-item">Email: {knjizara.email}</li>
                                <li className="list-group-item">Kontakt telefon: {knjizara.kontaktTelefon}</li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-12 col-md-8">
                        <div className="mt-md-0 mt-4">
                            <ListKnjige id={knjizara.knjige} searchTerm={searchTerm} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}