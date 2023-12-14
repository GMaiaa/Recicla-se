import "./styles.css";
import User from "../../assets/user.png";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, usuariosCollection } from "../../services/firebaseConfig";

export function Dashboard() {
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedAge, setEditedAge] = useState("");

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usuariosCollection);
      console.log(data);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUsers();
  }, []);

  async function handleSearchUser() {
    if (userSearch.trim() !== "") {
      try {
        const userDoc = await getDoc(doc(db, "usuarios", userSearch));
        if (userDoc.exists()) {
          setSearchedUser({ id: userDoc.id, ...userDoc.data() });
          setEditing(false); // Ao pesquisar, o modo de edição é desativado
        } else {
          console.log("Usuário não encontrado");
          setSearchedUser(null);
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    } else {
      console.log("Por favor, insira um ID de usuário válido");
    }
  }

  async function handleStatusBi() {
    if (searchedUser) {
      try {
        const profileConfigRef = collection(
          db,
          "usuarios",
          searchedUser.id,
          "profile-config"
        );
        await addDoc(profileConfigRef, { Bi: "Ativo" });
        console.log("Bi ativado para o usuário:", searchedUser.id);
      } catch (error) {
        console.error("Erro ao ativar o Bi para o usuário:", error);
      }
    } else {
      console.log("Nenhum usuário encontrado para ativar o Bi");
    }
  }

  async function handleEditUser() {
    setEditing(true);
    setEditedName(searchedUser.nome);
    setEditedAge(searchedUser.idade);
  }

  async function handleSaveEdit() {
    if (searchedUser) {
      try {
        const userRef = doc(db, "usuarios", searchedUser.id);

        await updateDoc(userRef, {
          nome: editedName,
          idade: editedAge,
        });

        console.log("Alterações salvas:", editedName, editedAge);

        setSearchedUser({
          ...searchedUser,
          nome: editedName,
          idade: editedAge,
        });

        setEditing(false);
      } catch (error) {
        console.error("Erro ao salvar as alterações:", error);
      }
    } else {
      console.log("Nenhum usuário encontrado para editar");
    }

    setEditing(false);
  }

  return (
    <div className="containerProfile">
      <table>
        <thead>
          <tr>
            <th>Nome Completo</th>
            <th>Idade</th>
          </tr>
        </thead>
        <tbody className="users">
          {Array.isArray(users) &&
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.nome}</td>
                <td>{user.idade}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="search">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Digite o Id do Usuário para obter as informações"
          onChange={(e) => setUserSearch(e.target.value)}
        />
        <div className="buttons">
          <button onClick={handleSearchUser}>Pesquisar</button>
          <button onClick={handleStatusBi}>Ativar o Bi desse usuário</button>
          <button onClick={handleEditUser}>Editar Usuário</button>
        </div>
      </div>

      {searchedUser && (
        <div className="userDetails">
          <h2>Detalhes do Usuário</h2>
          {editing ? (
            <div className="editForm">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
              <input
                type="text"
                value={editedAge}
                onChange={(e) => setEditedAge(e.target.value)}
              />
              <button onClick={handleSaveEdit}>Salvar</button>
            </div>
          ) : (
            <>
              <p>ID: {searchedUser.id}</p>
              <p>Nome: {searchedUser.nome}</p>
              <p>Idade: {searchedUser.idade}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
