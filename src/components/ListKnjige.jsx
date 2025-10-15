import React, { use, useEffect, useState } from "react";
import { db } from "../firebase-config";
import { getDatabase, ref, set, get, onValue } from "firebase/database";
import { Link } from "react-router-dom";
import '../App.css';
export default function ListKnjige({id}) {
    const [knjige, setKnjige] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    let knjigeId = id;
    useEffect(() => {
        if (knjigeId){
            getKnjige();
        }
    }, [id]);

    function getKnjige() {
        const knjigeRef = ref(db, `knjige/${knjigeId}`);
        get(knjigeRef).then((response) => {
            if (response.exists()) {
                const knjig =  Object.entries(response.val()).map(([id,data]) => ({
                    id,
                    ...data,
                }));
                setKnjige(knjig);
            } else {
                setKnjige([]);
            }
        }).catch((error) => console.log(error.message));
    }

    
    const filteredKnjige = searchTerm
        ? knjige.filter(k => {
            const terms = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
            return terms.every(term =>
                (k.naziv && k.naziv.toLowerCase().includes(term)) ||
                (k.zanr && k.zanr.toLowerCase().includes(term)) ||
                (k.autor && k.autor.toLowerCase().includes(term))
            );
        })
        : knjige;

    return (
        <div className="mx-auto width70">
            <h4>Knjige u ponudi</h4>
            <input
                type="text"
                className="form-control mb-3"
                style={{width: "50%", margin: "10px auto"}}
                placeholder="Pretraži knjige..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <ul className="list-group list-group-horizontal flex-wrap justify-content-center" style={{backgroundColor: '#E6D8C3', border: '1px solid brown', padding: "20px"}}>
                {filteredKnjige.map((knjiga) => (
                    <div className="card card-knjige-animation card-knjiga" key={knjiga.id}>
                        <img src={knjiga.slike[0]} className="card-img-top" alt="..." />
                        <div className="card-body">
                            <h6 className="card-title">{knjiga.naziv}</h6>
                        </div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">{knjiga.autor}</li>
                            <li className="list-group-item">{knjiga.zanr}</li>
                            <li className="list-group-item">{knjiga.cena} RSD</li>
                        </ul>
                        <div className="card-body">
                            <Link to={`/knjiga/${knjigeId}/${knjiga.id}`} className="card-link"><button className="btn btn-primary">Detaljnije</button></Link>
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    );
}