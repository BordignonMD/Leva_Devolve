import React, { useState, ChangeEvent, FormEvent } from "react";
import logo from "../../assets/logo.svg";
import { Link, useHistory } from "react-router-dom";
import "./styles.css";
import { FiArrowLeft } from "react-icons/fi";
import api from "../../services/api";
import Dropzone from "../../components/Dropzone";
import Search from './Search/index';

interface Book {
  id: string;
  title: string;
  author: string;
  image: string;
  description: string;
  publisher: string;
  publishedDate: string;
  pageCount: number;
}

const AddBook: React.FC = () => {
  const library_id = localStorage.getItem('library_id');
  
  const history = useHistory();
  const dateToday = new Date();
  const dateTodayFormat = dateToday.getFullYear().toString() + '-' + (dateToday.getMonth() + 1).toString().padStart(2, '0') + '-' + dateToday.getDate().toString().padStart(2, '0');

  const [selectedBook, setSelectedBook] = useState<Book>({
    id: "",
    title: "",
    author: "",
    image: "",
    description: "",
    publisher: "",
    publishedDate: dateTodayFormat,
    pageCount: 1
  });
  const [selectedFile, setSelectedFile] = useState<File>();
  const [selectedImage, setSelectedImage] = useState<string>();

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setSelectedBook({ ...selectedBook, [name]: value});
  }

  function handleTextAreaChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = event.target;

    setSelectedBook({ ...selectedBook, [name]: value});
  }

  function handleSelectedBook(book: Book, event: MouseEvent) {
    event.preventDefault();
    
    setSelectedBook(book);
    setSelectedImage(book.image);
    handleGenerateFile(event, book.image);
  }

  function handleGenerateFile(event: MouseEvent, imageDataUrl: string) {
      // No momento não é possível fazer o download da imagem fornecida pela API do Google.
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { title, author, description, publisher, publishedDate, pageCount } = selectedBook;

    const data = new FormData();

    data.append("title", title);
    data.append("author", author);
    data.append("description", description);
    data.append("pageCount", String(pageCount));
    data.append("publisher", publisher);
    data.append("publishedDate", publishedDate);
    
    if (selectedFile) {
      data.append("image", selectedFile);
    }

    try  {
      await api.post('/book', data, {
       headers: {
         Authorization: library_id,
       }
      })
      
      alert('Livro adicionado com sucesso!');

      history.push('/home')
    } catch (err) {
      alert('Erro ao adicionar livro, tente novamente.')
    } 
  }

  return (
    <div id="add-book">
      <header>
        <img src={logo} alt="Leva & Devolve" />
        <Link to="/home">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <div className="search">
        <Search handleBookSelect={handleSelectedBook} />
      </div>

      <form onSubmit={handleSubmit}>
        <h1>
          Cadastro de livro
        </h1>

        <div style={css_divImageUpload}>
          <img
            src={selectedImage}
            alt="Point thumbnail"
            style={selectedImage ? css_imageUploadShow : css_imageUploadHide}
          />

          <div style={selectedImage ? css_dropzoneHide : css_dropzoneShow}>
            <Dropzone
              onFileUploaded={setSelectedFile}
              onImageUpload={setSelectedImage}
            />
          </div>
        </div>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="title">Título do livro</label>
            <input
              type="text"
              name="title"
              id="title"
              onChange={handleInputChange}
              value={selectedBook?.title || ""}
            />
          </div>

          <div className="field">
            <label htmlFor="author">Autor(es)</label>
            <input
              type="text"
              name="author"
              id="author"
              onChange={handleInputChange}
              value={selectedBook?.author || ""}
            />
          </div>

          <div className="field">
            <label htmlFor="description">Descrição</label>
            <textarea 
              name="description" 
              id="description" 
              cols={30}
              rows={10}
              onChange={handleTextAreaChange}
              value={selectedBook?.description } 

            >
            </textarea>
          </div>

          <div className="field">
            <label htmlFor="pageCount">Número de Páginas</label>
            <input 
              type="number"
              name="pageCount"
              id="pageCount"
              onChange={handleInputChange}
              value={selectedBook?.pageCount || ""}
            />
          </div>

          <div className="field">
            <label htmlFor="publisher">Editora</label>
            <input 
              type="text"
              name="publisher"
              id="publisher"
              onChange={handleInputChange}
              value={selectedBook?.publisher || ""}
            />
          </div>

          <div className="field">
            <label htmlFor="publishedDate">Data de Publicação</label>
            <input 
              type="date"
              name="publishedDate"
              id="publishedDate"
              onChange={handleInputChange}
              value={selectedBook?.publishedDate}
              max={dateTodayFormat}
            />
          </div>
        </fieldset>

        <button type="submit" onClick={handleSubmit}>Cadastrar livro</button>
      </form>
    </div>
  );
};

const css_divImageUpload: React.CSSProperties = {
  height: "300px",
  marginBottom: 20,
  borderRadius: "10px"
};

const css_imageUploadShow: React.CSSProperties = {
  maxWidth: "80%",
  height: "300px",
  position: "absolute",
  objectFit: "cover",
  borderRadius: "10px",
  marginRight: "20px",
  border: "1px dashed #4ecb79"
};

const css_imageUploadHide: React.CSSProperties = {
  width: "100%",
  height: "100%",
  position: "relative",
  objectFit: "cover",
  opacity: 0
};

const css_dropzoneShow: React.CSSProperties = {
  position: "relative"
};

const css_dropzoneHide: React.CSSProperties = {
  position: "relative",
  opacity: 0
};

export default AddBook;
