import { useState } from 'react';
import './App.css';
import AlbumList from './components/AlbumList';
import Navbar from './components/Navbar';

function App() {
  // Define state for albums using useState hook
  const [albums, setAlbums] = useState([]);

  return (
    <div className="App">
      {/* Render Navbar component */}
      <Navbar />
      
      {/* Render AlbumList component, passing albums state and setAlbums function */}
      <AlbumList albums={albums} setAlbums={setAlbums} />
    </div>
  );
}

export default App;
