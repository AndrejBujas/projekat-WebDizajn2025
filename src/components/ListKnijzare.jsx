import React, { use, useEffect, useState } from "react";
import { db } from "../firebase-config";
import { getDatabase, ref, set, get, onValue } from "firebase/database";
import { Link } from "react-router-dom";
export default function ListKnijzare({ searchTerm }) {
    const [knjizare, setKnjizare] = useState([]);

    useEffect(() => {
        getKnjizare();
    }, []);

    useEffect(() => {
        console.log(knjizare);
    }, [knjizare]);

    function getKnjizare() {
        const knjizareRef = ref(db, "knjizare");
        get(knjizareRef).then((response) => {
            const knjiz = Object.entries(response.val()).map(([id,data]) => ({
                id,
                ...data,
            }));
            setKnjizare(knjiz);
        }).catch((error) => console.log(error.message));
    }

 
    const filteredKnjizare = searchTerm
        ? knjizare.filter(k => k.naziv.toLowerCase().includes(searchTerm.toLowerCase()))
        : knjizare;

    return (
        <div>
            <ul class="list-group list-group-horizontal flex-wrap justify-content-center">
                {filteredKnjizare.map((knjizara) => (
                    <div class="card card-animation card-knjizara w18rem" key={knjizara.id}>
                        <img src={knjizara.logo} class="card-img-top" alt="..." />
                        <div class="card-body">
                            <h5 class="card-title">{knjizara.naziv}</h5>
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">{knjizara.adresa}</li>
                        </ul>
                        <div class="card-body">
                            <Link to={`/knjizara/${knjizara.id}`} class="card-link"><button class="btn btn-primary">Detaljnije</button></Link>
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    );
}  