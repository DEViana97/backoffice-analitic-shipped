import React, { useCallback, useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { getImages } from "./service/imagesAcess";
import "./App.css";
import { api } from "./api";

const App = () => {
  const [images, setImages] = useState([]);
  const [route, setRoute] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventId, setEventId] = useState("");
  const [formData, setFormData] = useState([]);
  const [nextImage, setNextImage] = useState(0);
  const [subdirectory, setSubdirectory] = useState("");
  const [imagesLength, setImagesLength] = useState(0);
  const [dateFromImg, setDateFromImg] = useState("");

  const car = "car-1";

  useEffect(() => {
    getImages(subdirectory).then((data) => {
      setImages(data);
      setImagesLength(data.length);
    });
    setRoute("");
  }, [subdirectory]);

  const getDateFromImg = useCallback(async () => {
    try {
      const response = await api.post("/extract_date", {
        url: images[nextImage],
      });
      setDateFromImg(response.data.date);
    } catch (error) {
      setDateFromImg("Insira a data manualmente");
    }
    console.log("aqui");
  }, [images, nextImage]);

  useEffect(() => {
    getDateFromImg();
  }, [getDateFromImg]);

  useEffect(() => {
    const savedFormData = localStorage.getItem("formData");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }

    const savedNextImage = localStorage.getItem("nextImage");
    if (savedNextImage) {
      setNextImage(parseInt(savedNextImage));
    }

    const savedSubdirectory = localStorage.getItem("subdirectory");
    if (savedSubdirectory) {
      setSubdirectory(savedSubdirectory);
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    const newFormData = {
      car: car,
      date: `${subdirectory.slice(0, 2)}-${subdirectory.slice(
        2
      )}-2023 ${dateFromImg}`,
      id: eventType === "lixo" ? "event01" : "event02",
      image_link: images[nextImage],
      route_id: `rota-${route}`,
      type: eventType,
    };

    const updatedFormData = [...formData, newFormData];
    setFormData(updatedFormData);
    setEventType("");
    setEventId("");

    localStorage.setItem("formData", JSON.stringify(updatedFormData));
    localStorage.setItem("nextImage", nextImage.toString());
    localStorage.setItem("subdirectory", subdirectory);

    setNextImage((prevNextImage) => prevNextImage + 1);
    setImagesLength((prevImageLength) => prevImageLength - 1);

    getDateFromImg();
  }

  function handlePrev(e) {
    e.preventDefault();
    setNextImage((prevImage) => prevImage - 1);
    setImagesLength((prevImage) => prevImage + 1);
  }

  return (
    <form>
      <div className="formContainer">
        <div>
          {subdirectory && <span>Imagens restantes: {imagesLength}</span>}
          <img
            src={images[nextImage]}
            alt="imagem de um evento de lixo ou buraco"
          />
        </div>
        <div className="inputForm">
          <label className="time">
            Hora:
            <InputMask
              onChange={(e) => setDateFromImg(e.target.value)}
              type="text"
              placeholder="00:00:00"
              value={dateFromImg}
            />
          </label>
          <label className="route">
            Rota:
            <input
              onChange={(e) => setRoute(e.target.value)}
              type="text"
              placeholder="rota-0"
              value={route}
              required
            />
          </label>
          <label className="event">
            Tipo de evento:
            <input
              onChange={(e) => setEventType(e.target.value)}
              type="text"
              placeholder="ex: lixo"
              value={eventType}
              required
            />
          </label>
          <label className="day">
            Subdiretório:
            <input
              onChange={(e) => setSubdirectory(e.target.value)}
              type="text"
              placeholder="Nome do subdiretório"
              value={subdirectory}
            />
          </label>

          <div className="buttonsContainer">
            <button
              onClick={handlePrev}
              disabled={nextImage === 0 ? true : false}
            >
              Prev
            </button>
            <button
              onClick={handleSubmit}
              disabled={dateFromImg && route && eventType ? false : true}
            >
              {dateFromImg && route && eventType ? "Cadastrar" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default App;
