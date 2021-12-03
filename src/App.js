import React, { useEffect, useMemo, useState } from "react";
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
import Footer from "./components/footer";

function App() {
  const [top, setTop] = useState(false);

  useEffect(() => {
    const eventScrool = () => {
      if (window.scrollY > 100) {
        setTop(true);
      } else {
        setTop(false);
      }
    };

    window.addEventListener("scroll", eventScrool);
    return () => {
      window.removeEventListener("scroll", eventScrool);
    };
  }, []);

  const mesesTODOS = [
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
  const meses = [
    "Todos",
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

  const [activeMes, setActiveMes] = useState(meses[0]);

  const mesesFilter = useMemo(() => {
    if (activeMes === "Todos") {
      return mesesTODOS;
    } else {
      return meses.filter((mes) => {
        return mes === activeMes;
      });
    }
  }, [activeMes, meses, mesesTODOS]);

  return (
    <>
      <div className="calendario--banner">
        <div>
          <svg
            onClick={() =>
              (window.location.href =
                "https://www.estacapacajus.com/calend%C3%A1rio-da-estaca")
            }
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.5 19L8.5 12L15.5 5"
              stroke="#130F26"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <p>CALENDÁRIO ANUAL DA ESTACA PACAJUS BRASIL 2022</p>
        </div>
      </div>

      <div className="calendario">
        <div className="calendario--filter">
          {meses.map((mes) => (
            <button
              onClick={() => setActiveMes(mes)}
              style={{
                color: mes === activeMes ? "" : "rgb(56, 57, 63)",
                background: mes === activeMes ? "rgba(14, 57, 86, 1)" : "#fff",
              }}
            >
              {mes}
            </button>
          ))}
        </div>

        <div className="calendario--meses">
          {mesesFilter.map((mes) => (
            <ItemMes
              mes={mes}
              user={user}
              emailESTACAPACAJUS={emailESTACAPACAJUS}
            />
          ))}
        </div>

        {user ? (
          <button
            style={{ top: 12, height: "fit-content" }}
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
            style={{ top: 12, height: "fit-content" }}
            onClick={() => loginGoogle()}
          >
            <HiOutlineUser className="calendario--button-icon" />
            Login
          </button>
        )}

        <button
          style={{
            bottom: top ? (user ? 65 : 12) : -70,
            height: "fit-content",
            padding: "10px",
            borderRadius: "100%",
            transition: "all 0.3s ease",
          }}
          onClick={() => window.scrollTo({ top: 0 })}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.4"
              d="M11.7256 4.25L11.7256 19.25"
              stroke="#fff"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M5.70124 10.2998L11.7252 4.2498L17.7502 10.2998"
              stroke="#fff"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

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

      <Footer />
    </>
  );
}

export default App;
