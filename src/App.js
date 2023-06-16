import React, { useCallback, useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { getImages } from "./service/imagesAcess";
import "./App.css";
import { api } from "./api";

const App = () => {
  const [images, setImages] = useState([]);
  const [date, setDate] = useState("");
  const [route, setRoute] = useState("");
  const [formData, setFormData] = useState([]);
  const [nextImage, setNextImage] = useState(0);
  const [subdirectory, setSubdirectory] = useState("");
  const [imagesLength, setImagesLength] = useState(0);
  const [dateFromImg, setDateFromImg] = useState("");

  const car = "car-1";
  const id = "event01";
  const type = "lixo";

  useEffect(() => {
    getImages(subdirectory).then((data) => {
      setImages(data);
      setImagesLength(data.length);
    });
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
      date: dateFromImg,
      id: id,
      image_link: images[nextImage],
      route_id: `rota-${route}`,
      type: type,
    };

    const updatedFormData = [...formData, newFormData];
    setFormData(updatedFormData);
    // setDate("");
    setRoute("");

    localStorage.setItem("formData", JSON.stringify(updatedFormData));
    localStorage.setItem("nextImage", nextImage.toString());
    localStorage.setItem("subdirectory", subdirectory);

    getDateFromImg();
  }

  function handleNext(e) {
    e.preventDefault();
    setNextImage((prevNextImage) => prevNextImage + 1);
    setImagesLength((prevImageLength) => prevImageLength - 1);
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
          <img src={images[nextImage]} alt="imagem de um lixo" />
        </div>
        <div className="inputForm">
          <label className="time">
            Data:
            <InputMask
              onChange={(e) => setDateFromImg(e.target.value)}
              type="text"
              value={dateFromImg}
            />
          </label>
          <label className="route">
            Rota:
            <input
              onChange={(e) => setRoute(e.target.value)}
              type="text"
              placeholder="Rota-0"
              value={route}
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
              onClick={handleNext}
              disabled={nextImage === imagesLength ? true : false}
            >
              Next
            </button>
            <button onClick={handleSubmit} disabled={route ? false : true}>
              {" "}
              Cadastrar{" "}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default App;
