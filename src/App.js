import React, { useEffect, useState } from "react";
import ItemMes from "./components/ItemMes";
import { auth, db, firebase, providerGoogle } from "./services/Firebase";
import "./styles/App.css";
import { CgClose } from "react-icons/cg";
import { VscAdd } from "react-icons/vsc";
import { BiLogOut } from "react-icons/bi";
import { HiOutlineUser } from "react-icons/hi";
import { useStateValue } from "./providers/StateProvider";
import { actionTypes } from "./providers/reducer";
import { BsTrash } from "react-icons/bs";
import { TiArrowSortedDown } from "react-icons/ti";

function App() {
  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const [modalAddEvento, setModalAddEvento] = useState(false);
  const [selectOrgazinacao, setSelectOrgazinacao] = useState(null);
  const [organizacoes, setOrganizacoes] = useState([
    {
      color: "#000167",
      organizacao: "Atividades mundiais",
    },
    {
      color: "#42FF4F",
      organizacao: "Atividades do templo e história da família",
    },
    {
      color: "#48EB8B",
      organizacao: "Atividades da Área Brasil",
    },
    {
      color: "#FF895F",
      organizacao: "Atividades da Presidência da Estaca.",
    },
    {
      color: "#3F45EB",
      organizacao: "Sociedade de socorro",
    },
    {
      color: "#E8237D",
      organizacao: "Moças",
    },
    {
      color: "#EBCA49",
      organizacao: "Primária",
    },
    {
      color: "#EB5757",
      organizacao: "Rapazes e Moças",
    },
    {
      color: "#53EBFF",
      organizacao: "Escola Dominical",
    },
  ]);
  const [modalSelect, setModalSelect] = useState(false);
  //
  const [INPUTnomeEvento, setINPUTnomeEvento] = useState("");
  const [INPUTdiaEvento, setINPUTdiaEvento] = useState("");
  const [INPUTmesEvento, setINPUTmesEvento] = useState("");
  // -link-
  const [INPUTlinksEvento, setINPUTlinksEvento] = useState([]);
  const [INPUTlinksNOMEEvento, setINPUTlinksNOMEEvento] = useState("");
  const [INPUTlinksLINKEvento, setINPUTlinksLINKEvento] = useState("");

  // link events :)
  const addLink = () => {
    setINPUTlinksEvento((add) => [
      ...add,
      {
        nome: INPUTlinksNOMEEvento,
        link: INPUTlinksLINKEvento,
      },
    ]);

    setINPUTlinksNOMEEvento("");
    setINPUTlinksLINKEvento("");
  };

  const removeLink = (link) => {
    var links = [...INPUTlinksEvento];
    const index = links.findIndex((x) => x.link === link);

    if (index >= 0) {
      links.splice(index, 1);
      setINPUTlinksEvento(links);
    }
  };

  // -- ADD EVENTO --
  const addEvento = (e) => {
    e.preventDefault();

    const objEvento = {
      mes: INPUTmesEvento,
      dia: INPUTdiaEvento,
      nome: INPUTnomeEvento,
      links: INPUTlinksEvento,
      selectOrgazinacao: selectOrgazinacao,
    };

    db.collection("calendario")
      .doc("anual")
      .collection("eventos")
      .add(objEvento);

    setINPUTmesEvento("");
    setINPUTnomeEvento("");
    setINPUTdiaEvento("");
    setModalAddEvento(!modalAddEvento);
  };

  // Só esse email pode adicionar, atualizar e deletar o evento
  const emailESTACAPACAJUS = "estacapacajussiao@gmail.com";

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

  return (
    <div className="calendario">
      <p>CALENDÁRIO ANUAL DA ESTACA PACAJUS BRASIL 2022</p>

      <div className="calendario--meses">
        {meses.map((mes) => (
          <ItemMes
            mes={mes}
            user={user}
            emailESTACAPACAJUS={emailESTACAPACAJUS}
          />
        ))}
      </div>

      {user ? (
        <button
          style={{ top: 65, height: "fit-content" }}
          onClick={() => {
            auth.signOut();
            dispatch({
              type: actionTypes.SET_USER,
              user: null,
            });
          }}
        >
          <BiLogOut className="calendario--button-icon" />
          Sair
        </button>
      ) : (
        <button
          style={{ top: 65, height: "fit-content" }}
          onClick={() => loginGoogle()}
        >
          <HiOutlineUser className="calendario--button-icon" />
          Login
        </button>
      )}

      {user?.email === emailESTACAPACAJUS ? (
        <button onClick={() => setModalAddEvento(!modalAddEvento)}>
          <VscAdd
            style={{ transform: modalAddEvento ? "rotate(45deg)" : "" }}
            className="calendario--button-icon"
          />{" "}
          Adicionar evento
        </button>
      ) : (
        ""
      )}

      <div
        style={{
          opacity: modalAddEvento ? 5 : 0,
          visibility: modalAddEvento ? "visible" : "hidden",
        }}
        className="calendario--modal"
      >
        <div
          style={{ transform: modalAddEvento ? "scale(1)" : "scale(0)" }}
          className="calendario--alterar__evento"
        >
          <div className="calendario--alterar__evento--header">
            <CgClose onClick={() => setModalAddEvento(!modalAddEvento)} />

            <p>Adicionar evento</p>
          </div>

          <div className="calendario--alterar__evento--content">
            <input
              placeholder="Nome do evento..."
              value={INPUTnomeEvento}
              onChange={(e) => setINPUTnomeEvento(e.target.value)}
            />

            <div
              onClick={() => setModalSelect(!modalSelect)}
              className="calendario--alterar__evento--content-select"
            >
              <TiArrowSortedDown
                style={{
                  transform: modalSelect ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
              <p>
                {!selectOrgazinacao
                  ? "Selecione a organização do evento..."
                  : selectOrgazinacao.organizacao}
              </p>
            </div>

            <div
              style={{
                opacity: modalSelect ? 5 : 0,
                visibility: modalSelect ? "visible" : "hidden",
                height: modalSelect ? "" : 0,
              }}
              className="calendario--alterar__evento--content-select-itens"
            >
              {organizacoes.map((item) => (
                <div
                  style={{
                    background:
                      selectOrgazinacao === item ? "rgb(238, 240, 243)" : "",
                  }}
                  onClick={() => {
                    setSelectOrgazinacao(item);
                    setModalSelect(false);
                  }}
                >
                  <div
                    style={{
                      background: item.color !== "" ? item.color : "#000",
                    }}
                  ></div>
                  <p>{item.organizacao}</p>
                </div>
              ))}
            </div>

            <section>
              <input
                placeholder="Dia"
                value={INPUTdiaEvento}
                onChange={(e) => setINPUTdiaEvento(e.target.value)}
              />
              <p>de</p>
              <select
                value={INPUTmesEvento}
                onChange={(e) => setINPUTmesEvento(e.target.value)}
              >
                <option value={""}>Mês</option>
                {meses.map((mes) => (
                  <option value={mes}>{mes}</option>
                ))}
              </select>
            </section>

            {/* LINKS */}
            <div className="calendario--alterar__evento--content__link-add">
              <p>Links</p>
              <input
                placeholder="Nome do link"
                value={INPUTlinksNOMEEvento}
                onChange={(e) => setINPUTlinksNOMEEvento(e.target.value)}
              />
              <input
                placeholder="URL do link"
                value={INPUTlinksLINKEvento}
                onChange={(e) => setINPUTlinksLINKEvento(e.target.value)}
              />
              {INPUTlinksLINKEvento !== "" ? (
                <button onClick={() => addLink()}>
                  <VscAdd /> Adiconar link
                </button>
              ) : (
                <button disabled>
                  <VscAdd /> Adiconar link
                </button>
              )}
            </div>

            <div className="calendario--alterar__evento--content__links">
              {INPUTlinksEvento.map((link) => (
                <div>
                  <p>
                    <img
                      src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${link.link}`}
                    />
                    {link.nome}
                  </p>
                  <a href={`${link.link}`}>{link.link}</a>
                  <button onClick={() => removeLink(link.link)}>
                    <BsTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {INPUTnomeEvento !== "" &&
          INPUTdiaEvento !== "" &&
          INPUTmesEvento !== "" &&
          selectOrgazinacao !== null ? (
            <button onClick={(e) => addEvento(e)}>Adicionar</button>
          ) : (
            <button disabled={true}>Adicionar</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
