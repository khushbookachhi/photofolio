
import { useEffect, useState } from "react";
import "../css/albumlist.css";
import gallery from "../static/gallery.jpg";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../fireBaseInit";
import AddAlbumForm from "./AddAlbumForm";
import ImageList from "./ImageList";

export default function AlbumList(props) {
  // State variables for managing visibility of image list and album form, and storing current album ID
  const [showImgList, setShowImgList] = useState(false);
  const [showAlbmForm, setShowAlbmForm] = useState(false);
  const [albmId, setAlbmId] = useState('0');

  // Destructuring props to access albums array and setAlbums function
  const { albums, setAlbums } = props;

  // useEffect hook to fetch albums data from Firebase Firestore on component mount
  useEffect(() => {
    onSnapshot(collection(db, "albums"), (snapshot) => {
      const albums = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      console.log(albums);
      setAlbums(albums);
    });
  }, [setAlbums]); // Dependency array to run effect only when setAlbums function changes

  return (
    <div className="container">
      {/* Conditional rendering of ImageList component based on showImgList state */}
      {showImgList ? 
        <ImageList setShowImgList={setShowImgList} albmId={albmId} />
       : 
        <div className="albumList my-3">
          <div className="container">
            {/* Render AddAlbumForm component */}
            {<AddAlbumForm showAlbmForm={showAlbmForm} albums={albums} />}
            <div className="album">
              <h2 className="fw-bold">Your Albums</h2>
              {/* Button to toggle visibility of Add Album form */}
              <button
                type="button"
                className={`btn fw-bold ${
                  !showAlbmForm ? "btn-outline-primary" : "btn-outline-danger"
                }`}
                onClick={() => {
                  setShowAlbmForm((prevState) => !prevState);
                 
                }}
              >
                {!showAlbmForm ? "Add Album" : "Cancel"}
              </button>
              
            </div>
          </div>

          {/* Mapping over albums array to render album cards */}
          {albums.map((album, i) => (
            <div
              className="card mx-2 my-2 bg-primary-subtle"
              style={{ width: "12.1rem" }}
              key={i}
              onClick={() => {
                setShowImgList(!showImgList);
                setAlbmId(album.id);
              }}
            >
              <img
                src={gallery}
                className="card-img-top "
                alt="..."
                style={{ width: "11.97rem", height: "8rem" }}
              />
              <div className="card-body">
                <h5 className="card-title fw-bold">{album.albmName}</h5>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}
