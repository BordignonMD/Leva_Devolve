import React, { useState} from "react";
import logo from "../../assets/logo.svg";
import "./styles.css";
import { FiLogIn, FiUserPlus } from "react-icons/fi";
import { Link, useHistory } from "react-router-dom";
import api from "../../services/api";

const Login = () => {
  const [login, setLogin] = useState('')
  const history = useHistory()
  
  async function handleLogin(e) {
    e.preventDefault();
    try {
      
      const response = await api.post('session', { login });
      
      localStorage.setItem('library_id', response.data.id);
      localStorage.setItem('library_name', response.data.name);
      
      history.push('/home');
    } catch (err) {
      alert('Falha no login, tente novamente.');
    }
  }
  
  return (
    <div id="login">
      <div className="content">
        <header>
          <img src={logo} alt="Leva & Devolve" />
        </header>

        <main>
          <h1>Leva & Devolve</h1>
          <p>Quando estiver cansado da realidade, abra um livro.</p>

          <fieldset>
            <div className="field">
              <label htmlFor="login">Login</label>
              <input
                type="text"
                placeholder="Seu login"
                name="login"
                id="login"
                value={login}
                onChange={e => setLogin(e.target.value)}
              />
            </div>
          </fieldset>

          <button className="button" type="submit" onClick={handleLogin}>
             <span>
                <FiLogIn />
             </span>
             <strong>Entrar</strong>
          </button>
          
          <Link to="/register">
            <span>
              <FiUserPlus />
            </span>
            <strong>Criar cadastro (Bibliotecário)</strong>
          </Link>
        </main>
      </div>
    </div>
  );
};

export default Login;
