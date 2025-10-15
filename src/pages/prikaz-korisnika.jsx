import '../App.css';
import ListKnijzare from '../components/ListKnijzare';
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import React, { use, useEffect, useState } from "react";
import { db } from "../firebase-config";
import { getDatabase, ref, set, get, onValue } from "firebase/database";
import ListKnjige from '../components/ListKnjige';
import NavBar from '../components/NavBar';
export function PrikazKorisnika({loggedInUser, setLoggedInUser}){
    const [korisnici, setKorisnici] = useState([]);
    const [editKorisnik, setEditKorisnik] = useState(null);
    const [formData, setFormData] = useState({
        ime: '',
        prezime: '',
        email: '',
        korisnickoIme: '',
        lozinka: '',
        adresa: '',
        datumRodjenja: '',
        telefon: '',
        zanimanje: ''
    });
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [korisnikToDelete, setKorisnikToDelete] = useState(null);

    useEffect(() => {
        getKorisnici();
    }, []);

    function getKorisnici() {
        const korisniciRef = ref(db, 'korisnici');
        get(korisniciRef).then(snapshot => {
            if (snapshot.exists()) {
                const arr = Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data }));
                setKorisnici(arr);
            } else {
                setKorisnici([]);
            }
        });
    }

    function handleEditClick(korisnik) {
        setEditKorisnik(korisnik);
        setFormData({
            ime: korisnik.ime || '',
            prezime: korisnik.prezime || '',
            email: korisnik.email || '',
            korisnickoIme: korisnik.korisnickoIme || '',
            lozinka: korisnik.lozinka || '',
            adresa: korisnik.adresa || '',
            datumRodjenja: korisnik.datumRodjenja || '',
            telefon: korisnik.telefon || '',
            zanimanje: korisnik.zanimanje || ''
        });
        setShowEditModal(true);
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    async function handleSave() {
        if (!editKorisnik) return;
        const korisnikRef = ref(db, `korisnici/${editKorisnik.id}`);
        await set(korisnikRef, {
            ime: formData.ime,
            prezime: formData.prezime,
            email: formData.email,
            korisnickoIme: formData.korisnickoIme,
            lozinka: formData.lozinka,
            adresa: formData.adresa,
            datumRodjenja: formData.datumRodjenja,
            telefon: formData.telefon,
            zanimanje: formData.zanimanje
        });
        setShowEditModal(false);
        setEditKorisnik(null);
        getKorisnici();
    }

    async function handleDeleteKorisnik(id) {
    const korisnikRef = ref(db, `korisnici/${id}`);
    await set(korisnikRef, null);
    setShowDeleteModal(false);
    setKorisnikToDelete(null);
    getKorisnici();
    }

    return(
        <div>
            <NavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>
            <div className="container mt-4">
            <h2 className="mb-4">Korisnici</h2>
            <div className="table-responsive">
            <table className="table table-bordered table-striped" style={{
                backgroundColor: '#f6ecd9',
                border: '2px solid #b88c4a',
                borderRadius: '12px',
                boxShadow: '0 2px 12px rgba(184, 140, 74, 0.12)',
                color: '#5a3e1b',
                fontFamily: 'Georgia, serif',
                overflow: 'hidden'
            }}>
                <thead>
                    <tr style={{backgroundColor: '#e6d8c3', color: '#7c5c2a'}}>
                        <th>Ime</th>
                        <th>Prezime</th>
                        <th>Email</th>
                        <th>Korisničko ime</th>
                        <th>Lozinka</th>
                        <th>Adresa</th>
                        <th>Datum rođenja</th>
                        <th>Telefon</th>
                        <th>Zanimanje</th>
                        <th>Opcije</th>
                    </tr>
                </thead>
                <tbody>
                    {korisnici.map((korisnik, idx) => (
                        <tr key={korisnik.id} style={{backgroundColor: idx % 2 === 0 ? '#f6ecd9' : '#e6d8c3'}}>
                            <td>{korisnik.ime}</td>
                            <td>{korisnik.prezime}</td>
                            <td>{korisnik.email}</td>
                            <td>{korisnik.korisnickoIme}</td>
                            <td>{korisnik.lozinka}</td>
                            <td>{korisnik.adresa}</td>
                            <td>{korisnik.datumRodjenja}</td>
                            <td>{korisnik.telefon}</td>
                            <td>{korisnik.zanimanje}</td>
                            <td>
                                <button className="btn btn-primary btn-sm me-2"  onClick={() => handleEditClick(korisnik)}>Edit</button>
                                <button className="btn btn-danger btn-sm"  onClick={() => { setKorisnikToDelete(korisnik); setShowDeleteModal(true); }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>

            <div className={`modal fade${showDeleteModal ? ' show d-block' : ''}`} tabIndex="-1" aria-labelledby="deleteKorisnikLabel" aria-hidden={!showDeleteModal} style={showDeleteModal ? {background: 'rgba(0,0,0,0.3)'} : {}}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="deleteKorisnikLabel">Potvrda brisanja</h1>
                            <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {korisnikToDelete && (
                                <p>Da li ste sigurni da želite da obrišete korisnika <strong>{korisnikToDelete.korisnickoIme}</strong>?</p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Odustani</button>
                            <button type="button" className="btn btn-danger" onClick={() => handleDeleteKorisnik(korisnikToDelete.id)}>Obriši</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`modal fade${showEditModal ? ' show d-block' : ''}`} tabIndex="-1" aria-labelledby="editKorisnikLabel" aria-hidden={!showEditModal} style={showEditModal ? {background: 'rgba(0,0,0,0.3)'} : {}}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="editKorisnikLabel">Izmeni korisnika</h1>
                            <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} aria-label="Close"></button>
                        </div>
                        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Ime</label>
                                    <input type="text" className="form-control" name="ime" value={formData.ime} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Prezime</label>
                                    <input type="text" className="form-control" name="prezime" value={formData.prezime} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Korisničko ime</label>
                                    <input type="text" className="form-control" name="korisnickoIme" value={formData.korisnickoIme} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Lozinka</label>
                                    <input type="text" className="form-control" name="lozinka" value={formData.lozinka} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Adresa</label>
                                    <input type="text" className="form-control" name="adresa" value={formData.adresa} onChange={handleInputChange} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Datum rođenja</label>
                                    <input type="date" className="form-control" name="datumRodjenja" value={formData.datumRodjenja} onChange={handleInputChange} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Telefon</label>
                                    <input type="text" className="form-control" name="telefon" value={formData.telefon} onChange={handleInputChange} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Zanimanje</label>
                                    <input type="text" className="form-control" name="zanimanje" value={formData.zanimanje} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Close</button>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </div>
        
    );
}