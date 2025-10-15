
import './App.css';
import { HashRouter as Router,Route,Routes } from 'react-router-dom';
import { useState } from 'react';
import { Pocetna } from './pages/pocetna.jsx';
import { Knjizara } from './pages/knjizara.jsx';
import { Knjiga } from './pages/knjiga.jsx';
import { PrikazKorisnika } from './pages/prikaz-korisnika.jsx';
import { PrikazKnjizare } from './pages/prikaz-knjizare.jsx';
function App() {
  const [loggedInUser, setLoggedInUser] = useState(null)
  return (
    <Router>
       <Routes>
        <Route path='/' element={<Pocetna loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>}/>
        <Route path='/knjizara/:id' element={<Knjizara loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>}/>
        <Route path='/knjiga/:idknjizare/:idknjige' element={<Knjiga loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>}/>
        <Route path='/prikaz-knjizare' element={<PrikazKnjizare loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>}/>
        <Route path='/prikaz-korisnika' element={<PrikazKorisnika loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>}/>
      </Routes>
    </Router>
     
    
  );
}

export default App;
