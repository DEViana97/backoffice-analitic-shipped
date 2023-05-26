import React, { useEffect, useState } from "react";
import { getImages } from "./service/imagesAcess";
// import { FormImg } from "./FormImg";
import "./App.css";

const App = () => {
  const [images, setImages] = useState([]);
  const [date, setDate] = useState("");
  const [route, setRoute] = useState("");
  const [formData, setFormData] = useState([]);
  const [nextImage, setNextImage] = useState(0);

  const car = "car-1";
  const id = "event01";
  const type = "lixo";

  useEffect(() => {
    getImages().then(async (data) => {
      setImages(data);
    });
  }, []);

  useEffect(() => {
    const savedFormData = localStorage.getItem("formData");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    const savedNextImage = localStorage.getItem("nextImage");
    if (savedNextImage) {
      setNextImage(parseInt(savedNextImage));
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    const newFormData = {
      car: car,
      date: date,
      id: id,
      image_link: images[nextImage],
      route_id: route,
      type: type,
    };

    const updatedFormData = [...formData, newFormData];
    setFormData(updatedFormData);
    setDate("");
    setRoute("");

    localStorage.setItem("formData", JSON.stringify(updatedFormData));
    localStorage.setItem("nextImage", nextImage.toString());
  }

  return (
    <form>
      <div className="formContainer">
        <img src={images[nextImage]} alt="imagem de um lixo" />
        <div className="inputForm">
          <label>
            Data e Hora:
            <input
              onChange={(e) => setDate(e.target.value)}
              type="text"
              placeholder="00/00/00 00:00:00"
              value={date}
            />
          </label>
          <label>
            Rota:
            <input
              onChange={(e) => setRoute(e.target.value)}
              type="text"
              placeholder="Rota-0"
              value={route}
            />
          </label>
          <button onClick={handleSubmit}>Cadastrar</button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setNextImage((prevImage) => prevImage - 1);
            }}
            disabled={nextImage === 0 ? true : false}
          >
            Prev
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setNextImage((prevImage) => prevImage + 1);
            }}
          >
            Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default App;
