/** @format */

import { useState, useRef } from "react";
import profilePic from "./assets/image.jpeg";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import { QRCodeCanvas } from "qrcode.react";
import "./Card.css";

const initialState = {
  name: "Emily J. Miller",
  title: "Digital Marketing Specialist",
  email: "emily.miller@example.com",
  phone: "123-456-7890",
  linkedin: "https://linkedin.com/in/emilyjmiller",
  website: "https://emilyjmiller.com",
  aboutMe:
    "Passionate about digital marketing and helping businesses grow online.",
  profileImage: profilePic,
  cardColor: "#FFFFFF",
  textColor: "#000000",
  fontFamily: "Arial",
  fontSize: "16px", // Default font size
};

function Card() {
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const cardRef = useRef(null);
  const fileInputRef = useRef(null);
  const qrCodeRef = useRef(null);

  const suggestTextColor = (bgColor) => {
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    };

    const rgb = hexToRgb(bgColor);
    if (!rgb) return "#000000";

    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  };

  const suggestColors = () => {
    const randomColor1 =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");
    const randomColor2 =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");
    const gradient = `linear-gradient(135deg, ${randomColor1}, ${randomColor2})`;
    setState((prevState) => ({
      ...prevState,
      cardColor: gradient,
      textColor: suggestTextColor(randomColor1),
    }));
  };

  const handleDownload = () => {
    if (cardRef.current) {
      setLoading(true);
      const scale = 2; // Double the pixel ratio
      const options = {
        quality: 1, // Maximum quality
        width: cardRef.current.offsetWidth * scale,
        height: cardRef.current.offsetHeight * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        },
      };
      domtoimage
        .toJpeg(cardRef.current, options)
        .then((dataUrl) => {
          saveAs(dataUrl, "card.jpeg");
          setLoading(false);
        })
        .catch((error) => {
          console.error("oops, something went wrong!", error);
          setLoading(false);
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "fontSize") {
      const numericValue = parseInt(value, 10);
      if (numericValue >= 10 && numericValue <= 30) {
        setState((prevState) => ({
          ...prevState,
          fontSize: `${numericValue}px`,
        }));
      }
    } else {
      setState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setState((prevState) => ({
        ...prevState,
        profileImage: URL.createObjectURL(e.target.files[0]),
      }));
    }
  };

  const handleClickImage = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="container" style={{ fontFamily: state.fontFamily }}>
      <div
        className="card"
        ref={cardRef}
        style={{
          background: state.cardColor,
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.3s ease-in-out",
          maxWidth: "500px",
          margin: "20px auto",
          fontSize: state.fontSize,
        }}
      >
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
          ref={fileInputRef}
        />
        <img
          className="card-image"
          src={state.profileImage}
          alt="profile picture"
          onClick={handleClickImage}
        />

        <h2 className="card-name" style={{ color: state.textColor }}>
          {state.name}
        </h2>
        <h3 className="card-title" style={{ color: state.textColor }}>
          {state.title}
        </h3>
        <div className="contact__content">
          <p style={{ color: state.textColor }}>
            {" "}
            <span>Email:</span>{" "}
            <a
              href={`mailto:${state.email}`}
              style={{ color: state.textColor }}
            >
              {state.email}
            </a>
          </p>
          <p style={{ color: state.textColor }}>
            {" "}
            <span> Phone:</span> {state.phone}
          </p>
          <p style={{ color: state.textColor }}>
            {" "}
            <span>LinkedIn:</span>{" "}
            <a
              href={state.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: state.textColor }}
            >
              {state.linkedin}
            </a>
          </p>
          <p style={{ color: state.textColor }}>
            {" "}
            <span>Website:</span>
            <a
              href={state.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: state.textColor }}
            >
              {state.website}
            </a>
          </p>
        </div>
        <div className="footer">
          <p
            className="about-me"
            style={{ color: state.textColor, fontSize: "1.25rem" }}
          >
            {state.aboutMe}
          </p>
          <div className="QR">
            <div
              ref={qrCodeRef}
              style={{
                marginTop: "20px",
                backgroundColor: "#ffffff", // Ensure white background
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <QRCodeCanvas
                value={state.website}
                size={150}
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="H"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="inputs">
        <div className="into">
          <input
            type="text"
            name="name"
            value={state.name}
            onChange={handleInputChange}
            placeholder="Name"
          />
          <input
            type="text"
            name="title"
            value={state.title}
            onChange={handleInputChange}
            placeholder="Title"
          />
          <input
            type="text"
            name="email"
            value={state.email}
            onChange={handleInputChange}
            placeholder="Email"
          />
          <input
            type="text"
            name="phone"
            value={state.phone}
            onChange={handleInputChange}
            placeholder="Phone"
          />
          <input
            type="text"
            name="linkedin"
            value={state.linkedin}
            onChange={handleInputChange}
            placeholder="LinkedIn"
          />
          <input
            type="text"
            name="website"
            value={state.website}
            onChange={handleInputChange}
            placeholder="Website"
          />
          <textarea
            name="aboutMe"
            value={state.aboutMe}
            onChange={handleInputChange}
            placeholder="About Me"
          />
        </div>
        {/* brake */}
        <div className="select">
          <div>
            <label htmlFor="cardColor">Card Color:</label>
            <input
              type="color"
              id="cardColor"
              name="cardColor"
              value={state.cardColor}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="textColor">Text Color:</label>
            <input
              type="color"
              id="textColor"
              name="textColor"
              value={state.textColor}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="fontFamily">Font:</label>
            <select
              id="fontFamily"
              name="fontFamily"
              value={state.fontFamily}
              onChange={handleInputChange}
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Verdana">Verdana</option>
              <option value="Poppins">Poppins</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Playfair Display">Playfair Display</option>
              <option value="Lato">Lato</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Cabin">Cabin</option>
              <option value="Oswald">Oswald</option>
              <option value="Fira Sans">Fira Sans</option>
              <option value="Merriweather">Merriweather</option>
              <option value="Georgia">Georgia</option>
              <option value="System UI">System UI</option>
            </select>
          </div>
          <div>
            <label htmlFor="fontSize">Font Size:</label>
            <input
              type="number"
              id="fontSize"
              name="fontSize"
              value={parseInt(state.fontSize, 10)}
              onChange={handleInputChange}
              min="10"
              max="30"
            />
          </div>
        </div>
        <div className="buttons">
          <button className="btn" onClick={handleDownload} disabled={loading}>
            {loading ? "Processing..." : "Download Business Card"}
          </button>
          <button className="btn-secondary" onClick={suggestColors}>
            Generate Random Colors
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
