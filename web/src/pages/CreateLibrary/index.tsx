import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import logo from "../../assets/logo.svg";
import { Link, useHistory } from "react-router-dom";
import "./styles.css";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";
import api from "../../services/api";
import { LeafletMouseEvent } from "leaflet";
import Dropzone from "../../components/Dropzone";
import axios from "axios";

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const CreateLibrary: React.FC = () => {
  const history = useHistory();

  const [selectedFile, setSelectedFile] = useState<File>();
  const [selectedImage, setSelectedImage] = useState<string>();
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
  const [initialPosition, setInitionPosition] = useState<[number, number]>([0, 0]);
  const [formData, setFormData] = useState({
    name: '',
    login: '',
    email: '',
    phone: ''
  });
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setInitionPosition([latitude, longitude]);
    });
  });

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then(response => {
        const ufInitials = response.data.map(uf => uf.sigla);
        setUfs(ufInitials.sort());
      });
  }, []);

  useEffect(() => {
    if (selectedUf === "0") return;

    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then(response => {
        const cityNames = response.data.map(city => city.nome);
        setCities(cityNames.sort());
      });
  }, [selectedUf]);

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedUf(event.target.value);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedCity(event.target.value);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat: latidude, lng: longitude } = event.latlng;
    setSelectedPosition([latidude, longitude]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, login, email, phone } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    
    const data = new FormData();

    data.append("name", name);
    data.append("login", login);
    data.append("email", email);
    data.append("phone", phone);
    data.append("city", city);
    data.append("uf", uf);
    data.append("latitude", String(latitude));
    data.append("longitude", String(longitude));

    if (selectedFile) {
      data.append("image", selectedFile);
    }

    await api.post("/library", data);

    alert('Cadastro criado com sucesso!');

    history.push("/");
  }

  return (
    <div id="page-create-library">
      <header>
        <img src={logo} alt="Leva & Devolve" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para Login
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro de Biblioteca</h1>

        <Dropzone onFileUploaded={setSelectedFile} onImageUpload={setSelectedImage} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da biblioteca</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>

          <div className="field">
            <label htmlFor="login">Login</label>
            <input
              type="text"
              name="login"
              id="login"
              onChange={handleInputChange}
            />
          </div>
          
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleInputChange}
            />
          </div>

          <div className="field">
            <label htmlFor="phone">Telefone</label>
            <input
              type="number"
              name="phone"
              id="phone"
              onChange={handleInputChange}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedPosition} />
          </Map>
          
          <div className="field">
            <label htmlFor="uf">Estado (UF)</label>
            <select
              name="uf"
              id="uf"
              value={selectedUf}
              onChange={handleSelectUf}
            >
              <option value="0">Selecione uma UF</option>
              {ufs.map(uf => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="city">Cidade</label>
            <select
              name="city"
              id="city"
              value={selectedCity}
              onChange={handleSelectCity}
            >
              <option value="0">Selecione uma Cidade</option>
              {cities.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        <button type="submit">Cadastrar biblioteca</button>
      </form>
    </div>
  );
};

export default CreateLibrary;
