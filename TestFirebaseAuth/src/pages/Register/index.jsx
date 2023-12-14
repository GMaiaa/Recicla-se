import { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import arrowImg from "../../assets/arrow.svg";
import logoImg from "../../assets/logo.jfif";
import { auth, usuariosCollection } from "../../services/firebaseConfig"; // Certifique-se de importar 'db' corretamente
import "./styles.css";
import { addDoc } from "firebase/firestore";


export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name , setName] = useState("")
  const [age , setAge] = useState("")

  

  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

    async function handleSignUp(e) {
      e.preventDefault();
    
      try {
        // Cria o usuário no Firebase Authentication
        await createUserWithEmailAndPassword(email, password);
    
        // Após a autenticação bem-sucedida, cria um documento na coleção 'usuarios'
        await addDoc(usuariosCollection, {
          nome: name,
          idade: age,
        });
    
        console.log(user)

      } catch (error) {
        console.error('Erro ao criar usuário:', error);
      }
    }
    

  if (loading) {
    return <p>carregando...</p>;
  }
  return (
    <div className="container">
      <header className="header">
        <img src={logoImg} alt="Recicla-se Logo" className="logoImg" />
        <span>Por favor digite suas informações de cadastro</span>
      </header>

      <form>
        <div className="inputContainer">
          <label htmlFor="email">E-mail</label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="gabriel@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="inputContainer">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="********************"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="inputContainer">
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Seu nome"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="inputContainer">
          <label htmlFor="age">Idade</label>
          <input
            type="number"
            name="age"
            id="age"
            placeholder="Sua idade"
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        <button onClick={handleSignUp} className="button">
          Cadastrar <img src={arrowImg} alt="->" />
        </button>
        <div className="footer">
          <p>Você já tem uma conta?</p>
          <Link to="/">Acesse sua conta aqui</Link>
        </div>
      </form>
    </div>
  );
}
