
import { useState } from "react";
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../css/addform.css"; // Importing CSS for styling
import { db } from "../fireBaseInit"; // Importing Firebase instance
import { collection,getDocs, addDoc } from "firebase/firestore"; // Importing Firestore functions

export default function AddAlbumForm(props) {
  // State variable to manage album name input
  const [albmName, setAlbmName] = useState("");

  // Destructuring props to access showAlbmForm boolean
  const { showAlbmForm } = props;
  
  // Function to handle form submission
  async function handleSubmit(e) {
    const albumsRef = collection(db, "albums");
  const snapshot = await getDocs(albumsRef);
  const albums = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log(albums);
    const index=albums.findIndex((albm)=>{
      return albm.albmName===albmName;
     });
     console.log(index);
     if(index<0){
      toast.success("album added successfully!"); //to notify user 
      await addDoc(collection(db, "albums"),{
        albmName:albmName
      })
    }else{
      toast.error("album already exists!");
    }
    
// Clearing the input field after submission
setAlbmName("");

   
  }

  // Function to clear the input field
  function clearField() {
    setAlbmName("");
  }

  return (
    <div>
      {/* Conditionally rendering the form based on showAlbmForm */}
      {showAlbmForm ? (
        <form className="albumForm">
          {/* Form for creating a new album */}
          <label className="h2 fw-bold">Create an album</label> <br />
          {/* Input field for entering album name */}
          <input
            className="input form-control fs-5"
            type="text"
            value={albmName}
            placeholder="Album Name"
            onChange={(e) => setAlbmName(e.target.value)}
          />
          {/* Button to clear the input field */}
          <button
            type="button"
            className="btn btn-danger mx-2 h1 fs-5 fw-bolder"
            onClick={clearField}
          >
            Clear
          </button>
          {/* Button to submit the form */}
          <button
            type="button"
            className="btn btn-primary h1 fs-5 fw-bolder"
            onClick={()=>{handleSubmit();}}
          >
            Create
          </button>
         
        </form>
      ) : null}
    </div>
  );
}
