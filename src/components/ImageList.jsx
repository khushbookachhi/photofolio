import React, { useEffect, useState } from "react";
import {toast } from 'react-toastify';
import "../css/imgList.css"; // Importing CSS for styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Importing FontAwesome icons
import { faArrowLeft, faPen, faTrash } from "@fortawesome/free-solid-svg-icons"; // Importing specific FontAwesome icons
import ImageForm from "./imageForm"; // Importing the ImageForm component
import { db } from "../fireBaseInit"; // Importing Firebase instance
import {doc, getDoc, updateDoc } from "firebase/firestore"; // Importing Firestore functions

export default function ImageList(props) {
  // State variables for managing image form visibility, hiding add button, update form, 
  // album object, temporary album object, new image array, and hover cards
  const [imageForm, setImageForm] = useState(false);
 const [hideAdd,setHideAdd]=useState(false);
  const [updateForm,setUpdateForm]=useState(false);
  const [albmObj, setAlbmObj] = useState({
    albmName: "",
    imgArr: [],
  });
  const [imageObj,setImageObj]=useState("");
  const [tempAlbmObj,setTempAlbmObj]=useState("");
  const [newImgArr,setNewImgArr]=useState([]);
  const [hoverCards,setHoverCards]=useState(Array(1||albmObj.imgArr.length).fill(false));

  // Destructuring props to access setShowImgList and albmId
  const { setShowImgList, albmId } = props;
//Function to delete images in album
async function deleteImage(i){
  const docRef = doc(db, "albums", albmId);
  const docSnap = await getDoc(docRef);
  const albmData=docSnap.data();
    if(albmData.imgArr){
    albmData.imgArr.splice(i,1);
    }
    await updateDoc(docRef,{imgArr:albmData.imgArr});
    toast.success("image deleted successfully!");
    setAlbmObj({albmName:albmData.albmName,imgArr:albmData.imgArr});
  }



  // Function to handle mouse enter event for hover cards
function handleMouseEnter(i){
  setHoverCards(prevState => {
    const newHoverCards = [...prevState];
    newHoverCards[i] = true;
    return newHoverCards;
  });
}
// Function to handle mouse leave event for hover cards
function handleMouseLeave(i){
  setHoverCards(prevState => {
    const newHoverCards = [...prevState];
    newHoverCards[i] = false;
    return newHoverCards;
  });
}
 // Function to handle search based on target value
function handleSearch(targetValue){
console.log(tempAlbmObj);
if(tempAlbmObj.imgArr && targetValue){
  setNewImgArr(
   tempAlbmObj.imgArr.filter((image)=>(
     image.title.toLowerCase().includes(targetValue.toLowerCase())))  
  ) 
}else{
  setAlbmObj(tempAlbmObj);
  console.log(tempAlbmObj);
}
}
// Effect hook to update album object when new image array changes
useEffect(()=>{
  if(newImgArr.length>0){
    const albmName=albmObj.albmName;
    setAlbmObj({albmName, imgArr:newImgArr});
  
  }
}, [newImgArr,albmObj.albmName])
// Effect hook to fetch album data from Firestore based on album ID
  useEffect(() => {
    const fetchDocumentData = async () => {
      const docRef = doc(db, "albums", albmId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("ImageList",docSnap.data());
        const { albmName,imgArr} = docSnap.data();
        setAlbmObj({albmName:albmName,imgArr:imgArr});
        setTempAlbmObj({albmName:albmName,imgArr:imgArr});
      } 
    };
    fetchDocumentData();
  }, [albmId]);
 useEffect(()=>{
  console.log("imageobject is ",imageObj);
 },[imageObj])
  return (
    <div className="container">
      <div className="imageList my-3">
      {/* <!-- Button trigger modal --> */}


 {/* Modal for displaying images */}
<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-lg">
    <div className="modal-content">
      <div className="modal-header">
       
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
       {/* Carousel for displaying images */}
      <div id="carouselExampleIndicators" className="carousel slide">
  <div className="carousel-inner">
    {/* mapping over imgarray */}
    {albmObj.imgArr?albmObj.imgArr.map((image,i)=>(
      imageObj.imageUrl===image.imageUrl? <div className="carousel-item active" key={i}>
      <img src={image.imageUrl} className="d-block w-100" alt="..."/>
    </div>:
       <div className="carousel-item" key={i}>
       <img src={image.imageUrl} className="d-block w-100" alt="..."/>
     </div>
    )):null}
   

  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>
      </div>
     
    </div>
  </div>
</div>
        <div className="container">
           {/* ImageForm component */}
          {<ImageForm showImgForm={imageForm} showUpdateForm={updateForm} imageObj={imageObj} setImageObj={setImageObj}
           hideAdd={hideAdd} albmId={albmId} setHideAdd={setHideAdd} setUpdateForm={setUpdateForm}
            albmObj={albmObj} setAlbmObj={setAlbmObj}/>}
         
          <div className="album-img">
              {/* Button to go back to album list */}
            <button
              className="left-arrow"
              onClick={() => {
                setShowImgList(false);
              }}
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                style={{ fontSize: "2.5rem" }}
              />
            </button>
              {/* Displaying album name and search input */}
            <h2 className="fw-bold mx-3">
              {albmObj.imgArr && albmObj.imgArr.length
                ? `images in ${albmObj.albmName}`
                : "No Images found in the album"}
            </h2>
        <div className="d-flex search-control">
        <input className="form-control me-2 search" type="search" placeholder="Search"
        onChange={(e)=>{handleSearch(e.target.value)}}/>
        {/* Button to add images */}
            <button
              type="button"
              className={`btn fw-bold
                ${!hideAdd? "btn-outline-primary" :"btn-outline-danger"}`}
              onClick={() => {
                setImageForm((prevState)=>!prevState)
                if(updateForm){
                  setHideAdd(false)
                  setImageForm((prevState)=>!prevState)
                }else{
                  setHideAdd((prevState)=>!prevState)
                }
               setUpdateForm(false)
              }}
            >
              {!hideAdd?"Add Images":"Cancel"}
            
            </button>
        </div>
        
            
          </div>
        </div>
        {/* show image list here  */}
       {albmObj.imgArr?albmObj.imgArr.map((image,i)=>(
        // button 
    <div className="position-relative my-3"
    onMouseEnter={()=>handleMouseEnter(i)}
    onMouseLeave={()=>handleMouseLeave(i)} key={i}>
        {hoverCards[i] &&
          <div>
           <span className="position-absolute update top-0 rounded-pill translate-middle badge bg-primary"
        //  update button 
         onClick={()=>{setUpdateForm(true);setHideAdd(true);
          setImageForm(false);setImageObj(image)
         }}>
           <FontAwesomeIcon icon={faPen} />
  </span>
  <span className=" position-absolute margin top-0 start-100 rounded-pill translate-middle badge bg-danger"
   onClick={()=>{deleteImage(i)}}>
  <FontAwesomeIcon icon={faTrash} />
  </span>
            </div>}

      <div className="card my-2 mx-3"  data-bs-toggle="modal" data-bs-target="#exampleModal" key={i}
        
         onClick={()=>{setImageObj(image)}}
         >
         <img
           src={image.imageUrl}
           className="card-img-top"
           alt="..."
         />
         <div className="card-body">
           <h5 className="card-title">{image.title}</h5>
         </div>
       </div>
    </div>
   
      //  </button>
        )):null}
        
      </div>

        
      {/* button  */}
    </div>
  );
}
