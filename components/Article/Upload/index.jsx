import React, { useRef, useState } from "react";
import styles from "./upload.module.css";
import uploadImg from "../../../public/Image/upload.png";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Router from "next/router";

const UploadFile = () => {
  const [startDate, setStartDate] = useState("");
  const [file, setFile] = useState();
  const [isUploading, setIsUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    summary: "",
    type: "",
    publishedAt: "",
    acquiredAt: "",
    public: true,
  });

  const uploadFileRef = useRef(null);

  const SelectFileHandler = () => {
    if (uploadFileRef.current !== null) {
      uploadFileRef.current.click();
    }
  };

  const onSelect = (e) => {
    const currfile = e.target.files[0];
    setFile(currfile);
  };

  const toastId = React.useRef(null);
  const notify = () => (toastId.current = toast("Uploading Document..."));
  const dismiss = () => toast.dismiss(toastId.current);

  const submitHandler = async () => {
    notify();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("form", JSON.stringify(form));
    const req = await axios.post(
      "https://nasa-api-x.herokuapp.com/api/article",
      formData
    );
    dismiss();
    Router.push("/articles");
  };

  return (
    <div style={{ margin: 15 }}>
      <h2 className={styles.heading}>Upload File</h2>
      <hr />
      <div style={{ display: "flex" }}>
        <div className={styles.uploadContainer}>
          <div className={styles.upload}>
            <input
              type="file"
              id="file"
              onChange={onSelect}
              ref={uploadFileRef}
              style={{ display: "none" }}
            />
            <div onClick={SelectFileHandler} className={styles.uploadContent}>
              <Image src={uploadImg} alt="upload" layout="responsive" />
              {file ? (
                <p className={styles.link}>{file.name}</p>
              ) : (
                <>
                  <p>Drop Files to upload </p>
                  <p>or</p>
                  <p className={styles.link}>Browse File</p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className={styles.docContainer}>
          <h2 className={styles.heading} style={{ margin: 15 }}>
            Document Details
          </h2>
          <hr />
          <span>
            <input
              style={{ marginLeft: 15 }}
              type="text"
              placeholder="Document Title"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </span>
          <span>
            <input
              style={{ marginLeft: 15 }}
              type="text"
              placeholder="Summary"
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
            />
          </span>
          <span>
            <input
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              style={{ marginLeft: 15 }}
              type="text"
              placeholder="Type"
            />
          </span>

          <span>
            <input
              style={{ marginLeft: 15 }}
              type="text"
              placeholder="Publication"
            />
          </span>
          <span style={{ display: "flex", marginLeft: 15 }}>
            <DatePicker
              value={form.publication}
              selected={startDate}
              placeholderText="Publication Date"
              onChange={(date) => setForm({ ...form, publishedAt: date })}
            />
            <DatePicker
              selected={startDate}
              value={form.acquired}
              placeholderText="Acquired Date"
              onChange={(date) => setForm({ ...form, acquiredAt: date })}
            />
          </span>
          <div>
            <button className={styles.btn} onClick={submitHandler}>
              Submit
            </button>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={false} />
    </div>
  );
};

export default UploadFile;
