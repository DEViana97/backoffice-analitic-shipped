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
  // const [subdirectory, setSubdirectory] = useState("");
  const [imagesLength, setImagesLength] = useState(0);
  const [dateFromImg, setDateFromImg] = useState("");
  const [autoSubmitActive, setAutoSubmitActive] = useState(false);
  const [typeEvent, setTypeEvent] = useState("");

  const car = "carro-1";

  const [monthSelected, setMonthSelected] = useState("");

  const [daySelected, setDaySelected] = useState("");

  const [yearSelected, setYearSelected] = useState("");

  const handleChangeDay = (event) => {
    setDaySelected(event.target.value);
  };

  const diasDoMes = Array.from({ length: 31 }, (_, index) => index + 1);

  const handleChange = (event) => {
    setMonthSelected(event.target.value);
  };

  useEffect(() => {
    if (typeEvent) {
      getImages(yearSelected, monthSelected, daySelected, typeEvent).then(
        (data) => {
          setImages(data);
          setImagesLength(data.length);
          setNextImage(0);
        }
      );
    }
  }, [yearSelected, monthSelected, daySelected, typeEvent]);

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

    const savedDirectory = localStorage.getItem("directory");
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
        date: `${dateFromImg}`,
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
    setAutoSubmitActive((prevAutoSubmitState) => !prevAutoSubmitState);
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

          <label>
            <select
              value={yearSelected}
              onChange={(e) => setYearSelected(e.target.value)}
            >
              <option value="">Selecione o ano</option>
              <option value="2023">2023</option>
            </select>
          </label>
          <select value={monthSelected} onChange={handleChange}>
            <option value="01">Janeiro</option>
            <option value="02">Fevereiro</option>
            <option value="03">Março</option>
            <option value="04">Abril</option>
            <option value="05">Maio</option>
            <option value="06">Junho</option>
            <option value="07">Julho</option>
            <option value="08">Agosto</option>
            <option value="09">Setembro</option>
            <option value="10">Outubro</option>
            <option value="11">Novembro</option>
            <option value="12">Dezembro</option>
          </select>

          <select value={daySelected} onChange={handleChangeDay}>
            {diasDoMes.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <label className="day">
            Tipo de evento:
            <input
              onChange={(e) => setTypeEvent(e.target.value)}
              type="text"
              placeholder="Ex: lixo"
              value={typeEvent}
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
                setEventType("poda");
                setEventId("event03");
              }}
              style={{ background: eventType === "poda" && "#EA906C" }}
            >
              poda
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
              onClick={handleAutoSubmit}
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
