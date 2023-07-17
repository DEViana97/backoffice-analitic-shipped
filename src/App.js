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
  const [directory, setDirectory] = useState("");
  const [subdirectory, setSubdirectory] = useState("");
  const [imagesLength, setImagesLength] = useState(0);
  const [dateFromImg, setDateFromImg] = useState("");
  const [autoSubmitActive, setAutoSubmitActive] = useState(false);

  const car = "car-1";

  useEffect(() => {
    getImages(directory, subdirectory).then((data) => {
      setImages(data);
      setImagesLength(data.length);
    });
  }, [directory, subdirectory]);

  const getDateFromImg = useCallback(async () => {
    if (nextImage >= 0 && images[nextImage]) {
      try {
        const response = await api.post("/extract_date", {
          url: images[nextImage],
        });
        setDateFromImg(response.data.date);
      } catch (error) {
        setAutoSubmitActive(false);
        setDateFromImg("");
        alert("Digite manualmente");
      }
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

    const savedDirectory = localStorage.getItem("Directory");
    if (savedDirectory) {
      setDirectory(savedDirectory);
    }
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      if (e) {
        e.preventDefault();
      }
      const newFormData = {
        car: car,
        date: `${directory.slice(0, 2)}-${directory.slice(
          2
        )}-2023 ${dateFromImg}`,
        id: eventId,
        image_link: images[nextImage],
        route_id: `rota-${route}`,
        type: eventType,
      };

      const updatedFormData = [...formData, newFormData];
      setFormData(updatedFormData);

      localStorage.setItem("formData", JSON.stringify(updatedFormData));
      localStorage.setItem("nextImage", nextImage.toString());
      localStorage.setItem("directory", directory);
      setNextImage((prevNextImage) => prevNextImage + 1);
      setImagesLength((prevImageLength) => prevImageLength - 1);
    },
    [
      directory,
      dateFromImg,
      eventId,
      images,
      nextImage,
      route,
      eventType,
      formData,
    ]
  );

  useEffect(() => {
    let timer;

    if (autoSubmitActive) {
      timer = setInterval(handleSubmit, 8000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [autoSubmitActive, handleSubmit]);

  function handleNext(e) {
    e.preventDefault();
    setNextImage((prevNextImage) => prevNextImage + 1);
    setImagesLength((prevImageLength) => prevImageLength - 1);
  }

  function handlePrev(e) {
    e.preventDefault();

    const updatedFormData = [...formData];
    updatedFormData.pop();
    setFormData(updatedFormData);

    getDateFromImg();
    setNextImage((prevImage) => prevImage - 1);
    setImagesLength((prevImage) => prevImage + 1);

    localStorage.setItem("formData", JSON.stringify(updatedFormData));
  }

  function handleAutoSubmit() {
    setAutoSubmitActive((prevAutoSubmitActive) => !prevAutoSubmitActive);
  }

  return (
    <form>
      <div className="formContainer">
        <div>
          {directory && <span>Imagens restantes: {imagesLength}</span>}
          <img src={images[nextImage]} alt="Evento" />
        </div>
        <div className="inputForm">
          <label className="time">
            Hora:
            <InputMask
              onChange={(e) => setDateFromImg(e.target.value)}
              type="text"
              mask="99:99:99"
              maskChar={""}
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
          <label className="day">
            Data do evento:
            <input
              onChange={(e) => setDirectory(e.target.value)}
              type="text"
              placeholder="Nome do diretório"
              value={directory}
            />
          </label>

          <label className="day">
            Tipo de evento:
            <input
              onChange={(e) => setSubdirectory(e.target.value)}
              type="text"
              placeholder="Ex: lixo"
              value={subdirectory}
            />
          </label>
          <div className="event">
            <button
              onClick={(e) => {
                e.preventDefault();
                setEventType("placa");
                setEventId("event02");
              }}
              style={{ background: eventType === "placa" && "#EA906C" }}
            >
              Placa
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();

                setEventType("lixo");
                setEventId("event01");
              }}
              style={{ background: eventType === "lixo" && "#EA906C" }}
            >
              Lixo
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setEventType("polda");
                setEventId("event03");
              }}
              style={{ background: eventType === "polda" && "#EA906C" }}
            >
              Polda
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setEventType("entulho");
                setEventId("event04");
              }}
              style={{ background: eventType === "entulho" && "#EA906C" }}
            >
              Entulho
            </button>
          </div>
        </div>
      </div>
      {directory && (
        <div className="buttonsContainer">
          <button
            onClick={handlePrev}
            disabled={nextImage === 0 ? true : false}
          >
            Prev
          </button>
          <button onClick={handleNext}>Next</button>

          <button
            onClick={(e) => handleSubmit(e)}
            disabled={dateFromImg && route ? false : true}
            className="submitButton"
          >
            Cadastrar
          </button>

          {!autoSubmitActive && (
            <button onClick={handleAutoSubmit}>Auto Submit</button>
          )}

          {autoSubmitActive && (
            <button
              style={{ background: autoSubmitActive && "#EA906C" }}
              onClick={(e) => handleSubmit(e)}
            >
              Stop Auto Submit
            </button>
          )}
        </div>
      )}
    </form>
  );
};

export default App;
