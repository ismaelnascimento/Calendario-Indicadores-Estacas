import React, { useEffect, useState } from "react";
import Calendario from "./Calendario";
import Metas from "./Metas";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { auth, db, firebase, providerGoogle } from "./services/Firebase";
import { useStateValue } from "./providers/StateProvider";
import { actionTypes } from "./providers/reducer";

function App() {
  const [unidades, setUnidades] = useState([]);

  useEffect(() => {
    db.collection("unidades").onSnapshot((snapshot) => {
      setUnidades(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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
        auth.signInWithPopup(providerGoogle).catch((e) => {
          var errorCode = e.code;
          var errorMessage = e.message;

          alert(errorMessage);
        });
      })
      .catch((e) => {
        var errorCode = e.code;
        var errorMessage = e.message;

        alert(errorMessage);
      });
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
                <Calendario unidades={unidades} loginGoogle={loginGoogle} />
              }
            />
            <Route
              path="/:idEvento"
              element={
                <Calendario unidades={unidades} loginGoogle={loginGoogle} />
              }
            />
            <Route
              path="/metas"
              element={<Metas unidades={unidades} loginGoogle={loginGoogle} />}
            />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
