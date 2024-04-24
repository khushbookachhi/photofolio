import React, {useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../css/addform.css";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../fireBaseInit";

export default function ImageForm(props) {
  const [formData, setFormData] = useState({ title: "", imageUrl: "" });
  const [updateData, setUpdateData] = useState({ title: "", imageUrl: "" });

  // Destructure props for easier access
  const { showImgForm, albmId, albmObj, setAlbmObj, hideAdd, showUpdateForm, imageObj, setHideAdd, setUpdateForm } = props;

  async function handleSubmit() {
    if (albmId && formData.title && formData.imageUrl) {
      const docRef = doc(db, "albums", albmId);

      await updateDoc(docRef, {
        imgArr: arrayUnion({ title: formData.title, imageUrl: formData.imageUrl })
      });

      // Show success message after adding image
      toast.success("Image added successfully!");

      // Fetch data after adding image
      fetchData();
    }
  }

  async function OnClickOnUpdate() {
    setHideAdd((prevState) => !prevState);
    setUpdateForm(false);

    const docRef = doc(db, "albums", albmId);
    const docSnap = await getDoc(docRef);
    const albmData = docSnap.data();

    if (albmData.imgArr) {
      const index = albmData.imgArr.findIndex((obj) =>
        obj.title === imageObj.title && obj.imageUrl === imageObj.imageUrl
      );

      if (index !== -1 && updateData.title && updateData.imageUrl) {
        albmData.imgArr[index].title = updateData.title;
        albmData.imgArr[index].imageUrl = updateData.imageUrl;
      }
    }

    await updateDoc(docRef, { imgArr: albmData.imgArr });

    // Show success message after updating image
    toast.success("Image updated successfully!");

    // Fetch data after updating image
    fetchData();
  }

  useEffect(() => {
    // Fetch data on component mount
    fetchData();
    // eslint-disable-next-line
  }, []); 

  useEffect(() => {
    // Set updateData when imageObj changes
    setUpdateData({ title: imageObj.title, imageUrl: imageObj.imageUrl });
  }, [imageObj]);

  async function fetchData() {
    setFormData({ title: "", imageUrl: "" });

    const docRef = doc(db, "albums", albmId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { albmName, imgArr } = docSnap.data();
      setAlbmObj({ albmName: albmName, imgArr: imgArr });
    }
  }

  return (
    <div>
      {hideAdd ? <form className="albumForm">
        <label className="h2 fw-bold">
          {/* Render appropriate label based on form type */}
          {showImgForm ? `Add images to ${albmObj.albmName}` : showUpdateForm ? `Update image ${imageObj.title}` : null}
        </label> <br />
        {showImgForm ? <input
          className="imgInput form-control fs-5"
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ title: e.target.value, imageUrl: formData.imageUrl })}
          required
        /> : showUpdateForm ? <input
          className="imgInput form-control fs-5"
          type="text"
          placeholder="Title"
          value={updateData.title}
          onChange={(e) => setUpdateData({ title: e.target.value, imageUrl: updateData.imageUrl })}
          required
        /> : null}
        {showImgForm ? <input
          className="imgInput form-control fs-5 my-3"
          type="text"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ title: formData.title, imageUrl: e.target.value })}
          required
        /> : showUpdateForm ? <input
          className="imgInput form-control fs-5 my-3"
          type="text"
          placeholder="Image URL"
          value={updateData.imageUrl}
          onChange={(e) => setUpdateData({ title: updateData.title, imageUrl: e.target.value })}
          required
        /> : null}

        <br />
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-danger mx-2 h1 fs-5 fw-bolder"
            onClick={() => {
              // Clear form data on Clear button click
              setFormData({ title: "", imageUrl: "" });
            }}
          >
            Clear
          </button>
          {showImgForm ? <button
            type="button"
            className="btn btn-primary h1 fs-5 fw-bolder"
            onClick={() => { handleSubmit() }}
          >
            Create
          </button>
            : showUpdateForm ? <button
              type="button"
              className="btn btn-primary h1 fs-5 fw-bolder"
              onClick={() => { OnClickOnUpdate() }}
            >
              Update
            </button> : null}

        </div>
      </form> : null}
    </div>
  );
}
