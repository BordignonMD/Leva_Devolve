import React, {useState, useEffect} from "react";
import logo from "../../assets/logo.svg";
import "./styles.css";
import { FiTrash2, FiPower, FiPlusCircle } from "react-icons/fi";
import { Link, useHistory } from "react-router-dom";
import api from '../../services/api';

interface Book {
  title: string,
  id: string,
  author: string,
  description: string,
  publisher: string
}

const Home = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const history = useHistory();
  const library_id = localStorage.getItem('library_id');
  const library_name = localStorage.getItem('library_name');

  useEffect(() => {
    api.get('profile', {
      headers: {
        authorization: library_id,
      }
    }).then(response => {
      setBooks(response.data)
    })
  }, [library_id])

  async function handleDeleteBook(book_id) {
    try {
      await api.delete(`book/${book_id}`, {
        headers: {
          Authorization: library_id,
        }
      })
      
      setBooks(books.filter(book => book.id !== book_id));
    } catch (err) {
      alert('Erro ao deletar livro, tente novamente.');
    }
  }

  function handleLogout() {
    localStorage.clear()
    history.push('/')
  }

  return (
    <div id="home">
      <div className="content">
        <header>
          <img src={logo} alt="Leva & Devolve" />
          <span>Bem vinda, {library_name}</span>
          
          <Link to="/add-book">
            <span>
              <FiPlusCircle />
            </span>
            <strong>Adicione um novo livro</strong>
          </Link>

          <button type="button" onClick={handleLogout}>
            <FiPower size={18} color="#669f77" />
          </button>
        </header>

        <h1>Livros cadastrados</h1>

        <ul>
          {books.map(book => (
            <li key={book.id}>
              <strong> LIVRO: </strong>
              <p> {book.title} </p>
      
              <strong> AUTOR(ES): </strong>
              <p> {book.author} </p>
      
              <strong> EDITORA: </strong>
              <p > {book.publisher} </p>

              <strong> DESCRIÇÃO:</strong>
              <p id="description"> {book.description}</p>
      
              <button onClick={() => handleDeleteBook(book.id)} type="button">
                <FiTrash2 size={20} color="#a8a8b3" />
              </button>
            </li>
          ))}
        </ul>
       
        </div>
    </div>
  );
};

export default Home;
