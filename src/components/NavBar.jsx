import '../App.css';
import ListKnijzare from '../components/ListKnijzare';
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import React, { use, useEffect, useState } from "react";
import { db } from "../firebase-config";
import { getDatabase, ref, set, get, onValue } from "firebase/database";
import ListKnjige from '../components/ListKnjige';

export default function NavBar({loggedInUser, setLoggedInUser}) {
    const navStyle = {
    
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
    };
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [loginData, setLoginData] = useState({ korisnickoIme: '', lozinka: '' });
    const [registerData, setRegisterData] = useState({
        ime: '',
        prezime: '',
        korisnickoIme: '',
        email: '',
        lozinka: '',
        datumRodjenja: '',
        adresa: '',
        telefon: '',
        zanimanje: ''
    });
    const [registerErrors, setRegisterErrors] = useState({});
    
    async function handleLoginSubmit(e) {
        e.preventDefault();
        const korisniciRef = ref(db, 'korisnici');
        const snapshot = await get(korisniciRef);
        if (snapshot.exists()) {
            const korisnici = Object.values(snapshot.val());
            const user = korisnici.find(k => k.korisnickoIme === loginData.korisnickoIme && k.lozinka === loginData.lozinka);
            if (user) {
                setLoggedInUser(user.korisnickoIme);
                setShowLogin(false);
                setLoginData({ korisnickoIme: '', lozinka: '' });
            } else {
                alert('Pogrešno korisničko ime ili lozinka!');
            }
        } else {
            alert('Nema korisnika u bazi!');
        }
    }

    function handleLogout() {
        setLoggedInUser(null);
    }

    function validateRegister(data) {
        const errors = {};
        if (!data.ime.trim()) errors.ime = 'Ime je obavezno.';
        if (!data.prezime.trim()) errors.prezime = 'Prezime je obavezno.';
        if (!data.korisnickoIme.trim()) errors.korisnickoIme = 'Korisničko ime je obavezno.';
        if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Email nije validan.';
        if (!data.lozinka.trim() || data.lozinka.length < 6) errors.lozinka = 'Lozinka mora imati bar 6 karaktera.';
        if (!data.datumRodjenja.trim()) errors.datumRodjenja = 'Datum rođenja je obavezan.';
        if (!data.adresa.trim()) errors.adresa = 'Adresa je obavezna.';
        if (!data.telefon.trim() || !/^\d{6,}$/.test(data.telefon)) errors.telefon = 'Telefon mora imati bar 6 cifara.';
        if (!data.zanimanje.trim()) errors.zanimanje = 'Zanimanje je obavezno.';
        return errors;
    }

    async function handleRegisterSubmit(e) {
        e.preventDefault();
        const errors = validateRegister(registerData);
        setRegisterErrors(errors);
        if (Object.keys(errors).length > 0) return;
        const korisniciRef = ref(db, 'korisnici');
        const snapshot = await get(korisniciRef);
        if (snapshot.exists()) {
            const korisnici = Object.values(snapshot.val());
            if (korisnici.some(k => k.korisnickoIme === registerData.korisnickoIme)) {
                setRegisterErrors({ korisnickoIme: 'Korisničko ime već postoji.' });
                return;
            }
        }
        
        const newId = Date.now().toString();
        const korisnikRef = ref(db, `korisnici/${newId}`);
        await set(korisnikRef, registerData);
        setShowRegister(false);
        setRegisterData({ ime: '', prezime: '', korisnickoIme: '',email: '' ,lozinka: '', datumRodjenja: '', adresa: '', telefon: '', zanimanje: '' });
        setRegisterErrors({});
        alert('Uspešna registracija!');
    }
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light border-gray" style={navStyle}>
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">KnjizareAndrej</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">Pocetna</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#/prikaz-knjizare">Prikaz Knjizara</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#/prikaz-korisnika">Prikaz Korisnika</a>
                            </li>
    
                        </ul>
                        <div className="d-flex align-items-center gap-2">
                            {loggedInUser ? (
                                <>
                                    <span className="fw-bold me-3">Prijavljen: {loggedInUser}</span>
                                    <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                                </>
                            ) : (
                                <>
                                    <button className="btn btn-outline-primary" onClick={() => setShowLogin(true)}>Login</button>
                                    <button className="btn btn-outline-success ms-2" onClick={() => setShowRegister(true)}>Registruj se</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
   
            <div className={`modal fade${showRegister ? ' show d-block' : ''}`} tabIndex="-1" aria-labelledby="registerLabel" aria-hidden={!showRegister} style={showRegister ? {background: 'rgba(0,0,0,0.3)'} : {}}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="registerLabel">Registracija</h1>
                            <button type="button" className="btn-close" onClick={() => setShowRegister(false)} aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleRegisterSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Ime</label>
                                    <input type="text" className="form-control" name="ime" value={registerData.ime} onChange={e => setRegisterData(prev => ({...prev, ime: e.target.value}))} required />
                                    {registerErrors.ime && <div className="text-danger small">{registerErrors.ime}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Prezime</label>
                                    <input type="text" className="form-control" name="prezime" value={registerData.prezime} onChange={e => setRegisterData(prev => ({...prev, prezime: e.target.value}))} required />
                                    {registerErrors.prezime && <div className="text-danger small">{registerErrors.prezime}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Korisničko ime</label>
                                    <input type="text" className="form-control" name="korisnickoIme" value={registerData.korisnickoIme} onChange={e => setRegisterData(prev => ({...prev, korisnickoIme: e.target.value}))} required />
                                    {registerErrors.korisnickoIme && <div className="text-danger small">{registerErrors.korisnickoIme}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="text" className="form-control" name="email" value={registerData.email} onChange={e => setRegisterData(prev => ({...prev, email: e.target.value}))} required />
                                    {registerErrors.email && <div className="text-danger small">{registerErrors.email}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Lozinka</label>
                                    <input type="password" className="form-control" name="lozinka" value={registerData.lozinka} onChange={e => setRegisterData(prev => ({...prev, lozinka: e.target.value}))} required />
                                    {registerErrors.lozinka && <div className="text-danger small">{registerErrors.lozinka}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Datum rođenja</label>
                                    <input type="date" className="form-control" name="datumRodjenja" value={registerData.datumRodjenja} onChange={e => setRegisterData(prev => ({...prev, datumRodjenja: e.target.value}))} required />
                                    {registerErrors.datumRodjenja && <div className="text-danger small">{registerErrors.datumRodjenja}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Adresa</label>
                                    <input type="text" className="form-control" name="adresa" value={registerData.adresa} onChange={e => setRegisterData(prev => ({...prev, adresa: e.target.value}))} required />
                                    {registerErrors.adresa && <div className="text-danger small">{registerErrors.adresa}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Telefon</label>
                                    <input type="text" className="form-control" name="telefon" value={registerData.telefon} onChange={e => setRegisterData(prev => ({...prev, telefon: e.target.value}))} required />
                                    {registerErrors.telefon && <div className="text-danger small">{registerErrors.telefon}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Zanimanje</label>
                                    <input type="text" className="form-control" name="zanimanje" value={registerData.zanimanje} onChange={e => setRegisterData(prev => ({...prev, zanimanje: e.target.value}))} required />
                                    {registerErrors.zanimanje && <div className="text-danger small">{registerErrors.zanimanje}</div>}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowRegister(false)}>Close</button>
                                <button type="submit" className="btn btn-success">Register</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className={`modal fade${showLogin ? ' show d-block' : ''}`} tabIndex="-1" aria-labelledby="loginLabel" aria-hidden={!showLogin} style={showLogin ? {background: 'rgba(0,0,0,0.3)'} : {}}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="loginLabel">Login</h1>
                            <button type="button" className="btn-close" onClick={() => setShowLogin(false)} aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleLoginSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Korisničko ime</label>
                                    <input type="text" className="form-control" name="korisnickoIme" value={loginData.korisnickoIme} onChange={e => setLoginData(prev => ({...prev, korisnickoIme: e.target.value}))} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Lozinka</label>
                                    <input type="password" className="form-control" name="lozinka" value={loginData.lozinka} onChange={e => setLoginData(prev => ({...prev, lozinka: e.target.value}))} required />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowLogin(false)}>Close</button>
                                <button type="submit" className="btn btn-primary">Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        
    );
}