import '../App.css';
import ListKnijzare from '../components/ListKnijzare';
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import React, { use, useEffect, useState } from "react";
import { db } from "../firebase-config";
import { getDatabase, ref, set, get, onValue } from "firebase/database";
import ListKnjige from '../components/ListKnjige';
import NavBar from '../components/NavBar';
export function PrikazKnjizare({loggedInUser, setLoggedInUser}){

    const [showAddKnjizara, setShowAddKnjizara] = useState(false);
    const [newKnjizara, setNewKnjizara] = useState({ naziv: '', adresa: '', logo: '', knjige: '', godinaOsnivanja: '' });
    const [knjizare, setKnjizare] = useState([]);
    const [editKnjizara, setEditKnjizara] = useState(null);
    const [formData, setFormData] = useState({ naziv: '', adresa: '', logo: '', knjige: '', godinaOsnivanja: '' });
    const [showAddKnjiga, setShowAddKnjiga] = useState(false);
        const [newKnjiga, setNewKnjiga] = useState({ naziv: '', autor: '', godina: '', cena: '', slika: '', opis: '', brojStrana: '', zanr: '', format: '' });
        const [newKnjigaError, setNewKnjigaError] = useState('');
    const [knjigeList, setKnjigeList] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [knjizaraToDelete, setKnjizaraToDelete] = useState(null);
    const [showDeleteKnjigaModal, setShowDeleteKnjigaModal] = useState(false);
    const [knjigaToDelete, setKnjigaToDelete] = useState(null);

    async function handleDeleteKnjizara(knjizaraId) {
    const knjizaraRef = ref(db, `knjizare/${knjizaraId}`);
    await set(knjizaraRef, null);
    setShowDeleteModal(false);
    setKnjizaraToDelete(null);
    setKnjizare(prev => prev.filter(knjizara => knjizara.id !== knjizaraId));
    }

    async function handleAddKnjizara() {
        const newId = Date.now().toString();
        
        const knjigeCollectionId = `knjige_${newId}`;
        const knjigeRef = ref(db, `knjige/${knjigeCollectionId}`);
        await set(knjigeRef, {}); 
        
        const knjizaraRef = ref(db, `knjizare/${newId}`);
        await set(knjizaraRef, {
            naziv: newKnjizara.naziv,
            adresa: newKnjizara.adresa,
            logo: newKnjizara.logo,
            knjige: knjigeCollectionId,
            godinaOsnivanja: newKnjizara.godinaOsnivanja
        });
        setShowAddKnjizara(false);
        setNewKnjizara({ naziv: '', adresa: '', logo: '', knjige: '', godinaOsnivanja: '' });
        getKnjizare();
    }

      const navStyle = {
  backgroundColor: '#FFE797' 
  };
    

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

    function handleEditClick(knjizara) {
        setEditKnjizara(knjizara);
        setFormData({
            naziv: knjizara.naziv || '',
            adresa: knjizara.adresa || '',
            logo: knjizara.logo || '',
            knjige: knjizara.knjige || '',
            godinaOsnivanja: knjizara.godinaOsnivanja || ''
        });
        
        if (knjizara.knjige) {
            const knjigeRef = ref(db, `knjige/${knjizara.knjige}`);
            get(knjigeRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const knjigeArr = Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data }));
                    setKnjigeList(knjigeArr);
                } else {
                    setKnjigeList([]);
                }
            });
        } else {
            setKnjigeList([]);
        }
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function handleSave() {
        if (!editKnjizara) return;
        const knjizaraRef = ref(db, `knjizare/${editKnjizara.id}`);
        set(knjizaraRef, {
            ...editKnjizara,
            naziv: formData.naziv,
            adresa: formData.adresa,
            logo: formData.logo,
            knjige: formData.knjige,
            godinaOsnivanja: formData.godinaOsnivanja
        }).then(() => {
            getKnjizare();
            setEditKnjizara(null);
        }).catch((error) => console.log(error.message));
    }

    async function handleDeleteKnjiga(knjigaId) {
    if (!editKnjizara) return;
    const knjigaRef = ref(db, `knjige/${editKnjizara.knjige}/${knjigaId}`);
    await set(knjigaRef, null);
    setShowDeleteKnjigaModal(false);
    setKnjigaToDelete(null);
    setKnjigeList(prev => prev.filter(knjiga => knjiga.id !== knjigaId));
    }

    return (
        <div>
            <NavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>
            <div className="d-flex align-items-center mb-3">
                <div className='mx-auto flex'>
                        <h2 className="fw-bold margin16px">Knjizare</h2>
                        <button className="btn btn-success margin16px" onClick={() => setShowAddKnjizara(true)}>
                            Dodaj Knjizaru
                        </button>
                    </div>
                </div>

            <div className="mx-auto flex margin-top64px" >
                    
                <table className="table table-striped" style={{
                    width: '70vw',
                    backgroundColor: '#f6ecd9',
                    border: '2px solid #b88c4a',
                    borderRadius: '12px',
                    boxShadow: '0 2px 12px rgba(184, 140, 74, 0.12)',
                    color: '#5a3e1b',
                    fontFamily: 'Georgia, serif',
                    overflow: 'hidden',
                    padding: '20px'
                }}>
                    <thead>
                        <tr style={{backgroundColor: '#e6d8c3', color: '#7c5c2a'}}>
                            <th scope="col"></th>
                            <th scope="col">Naziv</th>
                            <th scope="col">Adresa</th>
                            <th scope="col">God. Osnivanja</th>
                            <th scope="col">Opcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {knjizare.map((knjizara, idx) => (
                            <tr key={knjizara.id} style={{backgroundColor: idx % 2 === 0 ? '#f6ecd9' : '#e6d8c3'}}>
                                <td>
                                    <img src={knjizara.logo} className="card-img-top" alt="..." style={{width: '50px', height: '50px', borderRadius: '8px', border: '1px solid #b88c4a'}} />
                                </td>
                                <td>{knjizara.naziv}</td>
                                <td>{knjizara.adresa}</td>
                                <td>{knjizara.godinaOsnivanja}</td>
                                <td className="">
                                    <button
                                        className="btn btn-primary"
                                        data-bs-toggle="modal"
                                        data-bs-target="#editModal"
                                        onClick={() => handleEditClick(knjizara)}
                                    >Edit</button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => { setKnjizaraToDelete(knjizara); setShowDeleteModal(true); }}
                                    >Delete</button>
                                </td>
           
            <div className={`modal fade${showAddKnjizara ? ' show d-block' : ''}`} tabIndex="-1" aria-labelledby="addKnjizaraLabel" aria-hidden={!showAddKnjizara} style={showAddKnjizara ? {background: 'rgba(0,0,0,0.3)'} : {}}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="addKnjizaraLabel">Dodaj Knjizaru</h1>
                            <button type="button" className="btn-close" onClick={() => setShowAddKnjizara(false)} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Naziv</label>
                                    <input type="text" className="form-control" name="naziv" value={newKnjizara.naziv} onChange={e => setNewKnjizara(prev => ({...prev, naziv: e.target.value}))} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Adresa</label>
                                    <input type="text" className="form-control" name="adresa" value={newKnjizara.adresa} onChange={e => setNewKnjizara(prev => ({...prev, adresa: e.target.value}))} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Logo URL</label>
                                    <input type="text" className="form-control" name="logo" value={newKnjizara.logo} onChange={e => setNewKnjizara(prev => ({...prev, logo: e.target.value}))} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Knjige (ID kolekcije)</label>
                                    <input type="text" className="form-control" name="knjige" value={newKnjizara.knjige} onChange={e => setNewKnjizara(prev => ({...prev, knjige: e.target.value}))} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Godina osnivanja</label>
                                    <input type="text" className="form-control" name="godinaOsnivanja" value={newKnjizara.godinaOsnivanja} onChange={e => setNewKnjizara(prev => ({...prev, godinaOsnivanja: e.target.value}))} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowAddKnjizara(false)}>Close</button>
                            <button type="button" className="btn btn-success" onClick={handleAddKnjizara}>Dodaj</button>
                        </div>
                    </div>
                </div>
            </div>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            

            
            <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="editModalLabel">Izmeni Knjizaru</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {editKnjizara && (
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label">Naziv</label>
                                        <input type="text" className="form-control" name="naziv" value={formData.naziv} onChange={handleInputChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Adresa</label>
                                        <input type="text" className="form-control" name="adresa" value={formData.adresa} onChange={handleInputChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Logo URL</label>
                                        <input type="text" className="form-control" name="logo" value={formData.logo} onChange={handleInputChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Knjige </label>
                                        <input type="text" className="form-control" name="knjige" value={formData.knjige} onChange={handleInputChange} />
                                        <div className="mb-3">
                                            <label className="form-label">Godina osnivanja</label>
                                            <input type="text" className="form-control" name="godinaOsnivanja" value={formData.godinaOsnivanja} onChange={handleInputChange} />
                                        </div>
                                        {knjigeList.length > 0 ? (
                                            <div className="mt-2">
                                                <label className="form-label">Knjige u kolekciji:</label>
                                                {knjigeList.map(knjiga => (
                                                    <div key={knjiga.id} className="border rounded p-2 mb-2 d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <strong>{knjiga.naziv}</strong> <span className="text-muted">({knjiga.autor})</span>
                                                            <br />Cena: {knjiga.cena} RSD
                                                        </div>
                                                        <button type="button" className="btn btn-sm btn-danger" onClick={() => { setKnjigaToDelete(knjiga); setShowDeleteKnjigaModal(true); }}>
                                                            Obriši
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-muted">Nema knjiga u kolekciji.</div>
                                        )}
            
            {showDeleteKnjigaModal && (
                <div className={`modal fade show d-block`} tabIndex="-1" aria-labelledby="deleteKnjigaLabel" aria-hidden={!showDeleteKnjigaModal} style={{background: 'rgba(0,0,0,0.3)'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="deleteKnjigaLabel">Potvrda brisanja knjige</h1>
                                <button type="button" className="btn-close" onClick={() => setShowDeleteKnjigaModal(false)} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                {knjigaToDelete && (
                                    <p>Da li ste sigurni da želite da obrišete knjigu <strong>{knjigaToDelete.naziv}</strong>?</p>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteKnjigaModal(false)}>Odustani</button>
                                <button type="button" className="btn btn-danger" onClick={() => handleDeleteKnjiga(knjigaToDelete.id)}>Obriši</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
                                    </div>
                                    <div className="mb-3">
                                        <button type="button" className="btn btn-success" onClick={() => setShowAddKnjiga(true)}>
                                            Dodaj novu knjigu
                                        </button>
                                    </div>
                                    {showAddKnjiga && (
                                        <div className="border rounded p-3 mb-3" style={{background: '#f8f9fa'}}>
                                            <h5>Nova knjiga</h5>
                                            <div className="mb-2">
                                                <label className="form-label">Naziv</label>
                                                <input type="text" className="form-control" name="naziv" value={newKnjiga.naziv} onChange={e => setNewKnjiga(prev => ({...prev, naziv: e.target.value}))} />
                                            </div>
                                            <div className="mb-2">
                                                <label className="form-label">Autor</label>
                                                <input type="text" className="form-control" name="autor" value={newKnjiga.autor} onChange={e => setNewKnjiga(prev => ({...prev, autor: e.target.value}))} />
                                            </div>
                                            <div className="mb-2">
                                                <label className="form-label">Opis</label>
                                                <input type="text" className="form-control" name="opis" value={newKnjiga.opis} onChange={e => setNewKnjiga(prev => ({...prev, opis: e.target.value}))} />
                                            </div>
                                            <div className="mb-2">
                                                <label className="form-label">Cena</label>
                                                <input type="text" className="form-control" name="cena" value={newKnjiga.cena} onChange={e => setNewKnjiga(prev => ({...prev, cena: e.target.value}))} />
                                            </div>
                                            <div className="mb-2">
                                                <label className="form-label">Slika URL</label>
                                                <input type="text" className="form-control" name="slika" value={newKnjiga.slika} onChange={e => setNewKnjiga(prev => ({...prev, slika: e.target.value}))} />
                                            </div>
                                            <div className="mb-2">
                                                <label className="form-label">Br Strana</label>
                                                <input type="text" className="form-control" name="brojStrana" value={newKnjiga.brojStrana} onChange={e => setNewKnjiga(prev => ({...prev, brojStrana: e.target.value}))} />
                                            </div>
                                            <div className="mb-2">
                                                <label className="form-label">Zanr</label>
                                                <input type="text" className="form-control" name="zanr" value={newKnjiga.zanr} onChange={e => setNewKnjiga(prev => ({...prev, zanr: e.target.value}))} />
                                            </div>
                                            <div className="mb-2">
                                                <label className="form-label">Format</label>
                                                <input type="text" className="form-control" name="format" value={newKnjiga.format} onChange={e => setNewKnjiga(prev => ({...prev, format: e.target.value}))} />
                                            </div>
                                            {newKnjigaError && (
                                                <div className="alert alert-danger py-1 my-2">{newKnjigaError}</div>
                                            )}
                                            <button type="button" className="btn btn-primary mt-2" onClick={async () => {
                                                // Validation
                                                if (!newKnjiga.naziv || !newKnjiga.autor || !newKnjiga.opis || !newKnjiga.cena || !newKnjiga.brojStrana || !newKnjiga.zanr || !newKnjiga.format) {
                                                    setNewKnjigaError('Popunite sva polja za knjigu.');
                                                    return;
                                                }
                                                if (isNaN(Number(newKnjiga.cena)) || Number(newKnjiga.cena) <= 0) {
                                                    setNewKnjigaError('Cena mora biti pozitivan broj.');
                                                    return;
                                                }
                                                if (isNaN(Number(newKnjiga.brojStrana)) || Number(newKnjiga.brojStrana) <= 0) {
                                                    setNewKnjigaError('Broj strana mora biti pozitivan broj.');
                                                    return;
                                                }
                                                setNewKnjigaError('');
                                                const knjigaId = Date.now().toString();
                                                const knjigaRef = ref(db, `knjige/${editKnjizara.knjige}/${knjigaId}`);
                                                await set(knjigaRef, {
                                                    naziv: newKnjiga.naziv,
                                                    autor: newKnjiga.autor,
                                                    opis: newKnjiga.opis,
                                                    cena: newKnjiga.cena,
                                                    slike: [newKnjiga.slika],
                                                    brojStrana: newKnjiga.brojStrana,
                                                    zanr: newKnjiga.zanr,
                                                    format: newKnjiga.format
                                                });
                                                setShowAddKnjiga(false);
                                                setNewKnjiga({ naziv: '', autor: '', opis: '', cena: '', slika: '', brojStrana: '', zanr: '', format: ''});
                                            }}>
                                                Sačuvaj knjigu
                                            </button>
                                            <button type="button" className="btn btn-outline-secondary ms-2" onClick={() => setShowAddKnjiga(false)}>
                                                Odustani
                                            </button>
                                        </div>
                                    )}
                                </form>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSave}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}