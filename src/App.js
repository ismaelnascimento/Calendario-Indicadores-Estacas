import React, { useEffect, useState } from "react";
import Calendario from "./Calendario";
import Metas from "./Metas";

import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { auth, db, firebase, providerGoogle } from "./services/Firebase";
import { useStateValue } from "./providers/StateProvider";
import { actionTypes } from "./providers/reducer";
import Home from "./Home";
import CalendarioApp from "./Apps/CalendarioApp";
import MetasApp from "./Apps/MetasApp";
import Estacas from "./Estacas";

function App() {
  const [unidades, setUnidades] = useState([]);
  const [notCadastro, setNotCadastro] = useState(true);
  const [eventosget, setEventosget] = useState([]);

  useEffect(() => {
    db.collection("unidades").onSnapshot((snapshot) => {
      setUnidades(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  useEffect(() => {
    db.collection("calendario")
      .doc("anual")
      .collection("eventos")
      .onSnapshot((snapshot) => {
        setEventosget(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      });
  }, []);

  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch({
          type: actionTypes.SET_USER,
          user: authUser,
        });
      } else {
        auth.signOut();
      }
    });
  }, [user, auth]);

  const loginGoogle = () => {
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        auth
          .signInWithPopup(providerGoogle)
          .catch((e) => {
            var errorCode = e.code;
            var errorMessage = e.message;

            alert(errorMessage);
          })
          .then(() => {
            setNotCadastro(true);
          });
      })
      .catch((e) => {
        var errorCode = e.code;
        var errorMessage = e.message;

        alert(errorMessage);
      });
  };

  const getEstaca = () => {
    var uni = unidades?.filter((uni) => {
      return uni?.email === user?.email;
    });
    return uni[0];
  };

  return (
    <>
      <Router>
        <div>
          <Routes>
            <Route
              exact
              path="/"
              element={
                user && notCadastro && getEstaca() ? (
                  <Navigate to={`/${getEstaca()?.estacaUID}`} />
                ) : (
                  <Home
                    loginGoogle={loginGoogle}
                    setNotCadastro={setNotCadastro}
                  />
                )
              }
            />
            <Route path="/estacas" element={<Estacas unidades={unidades} />} />
            <Route
              exact
              path="/:estacaUID"
              element={
                <CalendarioApp
                  getEstaca={getEstaca}
                  unidades={unidades}
                  eventos={eventosget}
                  loginGoogle={loginGoogle}
                />
              }
            />
            <Route
              path="/:estacaUID/:idEvento"
              element={
                <CalendarioApp
                  getEstaca={getEstaca}
                  unidades={unidades}
                  eventos={eventosget}
                  loginGoogle={loginGoogle}
                />
              }
            />
            <Route
              path="/:estacaUID/metas"
              element={
                <MetasApp
                  getEstaca={getEstaca}
                  unidades={unidades}
                  eventos={eventosget}
                  loginGoogle={loginGoogle}
                />
              }
            />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
