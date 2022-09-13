import React, { useState, useEffect, useMemo } from "react";
import { BiLogOut, BiUserCircle } from "react-icons/bi";
import { CgClose, CgSearch } from "react-icons/cg";
import { HiOutlineUser } from "react-icons/hi";
import { TiArrowSortedDown } from "react-icons/ti";
import ItemMissionario from "./components/ItemMissionario";
import { actionTypes } from "./providers/reducer";
import { useStateValue } from "./providers/StateProvider";
import { auth, db, storage } from "./services/Firebase";
import "./styles/missionarios.css";

function Missionarios({ unidades, loginGoogle }) {
  const [{ user }, dispatch] = useStateValue();
  const [selectUnidade, setSelectUnidade] = useState("Todos");
  const [modalUnidades, setModalUnidades] = useState(false);

  const [modalAdd, setModalAdd] = useState(false);

  const getUnidadeEstaca = () => {
    var filter = unidades?.filter((uni) => {
      return uni?.estaca === true;
    });

    return filter[0];
  };
  const isAdmin = () => {
    if (user?.email === "estacapacajussiao@gmail.com") {
      return true;
    } else if (user?.email === selectUnidade?.email) {
      var filter = unidades?.filter((uni) => {
        return uni?.email === user?.email;
      });
      return filter?.length > 0;
    } else {
      return false;
    }
  };

  const [filters, setFilters] = useState([
    "No campo",
    "Em perspectiva",
    "Retornado",
  ]);
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [search, setSearch] = useState("");

  const [missionarios, setMissionarios] = useState([]);

  useEffect(() => {
    db.collection("missionarios").onSnapshot((snapshot) => {
      setMissionarios(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });
  }, []);

  const missionariosfilter = useMemo(() => {
    let estacafilter = missionarios?.filter((missionario) => {
      return missionario?.estaca === getUnidadeEstaca()?.estacaUID;
    });
    if (selectUnidade === "Todos") {
      return estacafilter;
    } else {
      return estacafilter?.filter((missionario) => {
        return missionario?.unidade?.id === selectUnidade?.id;
      });
    }
  }, [missionarios, getUnidadeEstaca, selectUnidade]);

  const filterSearch = useMemo(() => {
    return missionariosfilter?.filter((missionario) => {
      return `${missionario?.nome?.type} ${missionario?.nome?.sobrenome}`
        ?.toLocaleLowerCase()
        ?.includes(search.toLocaleLowerCase());
    });
  }, [search, missionariosfilter]);

  const filterMissionarios = useMemo(() => {
    return filterSearch?.filter((missionario) => {
      return missionario?.type === activeFilter;
    });
  }, [filterSearch, activeFilter]);

  const [modalSelect, setModalSelect] = useState(false);
  const [typeMissionario, setTypeMissionario] = useState("Sister");
  const [sobrenome, setSobrenome] = useState("");
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [dataRetorno, setDataRetorno] = useState("");
  const [dataIda, setDataIda] = useState("");
  const [description, setDescription] = useState("");
  const [localMissao, setLocalMissao] = useState("");

  //
  const [uploadImgMissionario, setUploadImgMissionario] = useState(null);
  const [uploadImgMissionarioView, setUploadImgMissionarioView] =
    useState(null);

  if (uploadImgMissionario) {
    const reader = new FileReader();

    reader.onload = function () {
      const result = reader.result;

      setUploadImgMissionarioView(result);
    };
    reader.readAsDataURL(uploadImgMissionario);
  }

  const changeImageUpload = (e, uploads) => {
    if (e.target.files?.length === 0) {
      return;
    }
    uploads(e.target.files[0]);
  };
  //
  const [loading, setLoading] = useState(false);

  const addMissionario = (e) => {
    e.preventDefault();
    setLoading(true);

    if (uploadImgMissionario) {
      var imgUpload = uploadImgMissionario;

      var letters = "abcdefghijklmnopqrstuvwxyz";
      var _id =
        letters.charAt(Math.floor(Math.random() * letters.length)) +
        (Math.random() + 1).toString(36).substr(2, 9);
      const uploadTask = storage
        .ref("missionarios")
        .child(`missionario-${_id}-${imgUpload.name}`)
        .put(imgUpload);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
          setLoading(false);
        },
        () => {
          storage
            .ref("missionarios")
            .child(`missionario-${_id}-${imgUpload.name}`)
            .getDownloadURL()
            .then((url) => {
              db.collection("missionarios").add({
                estaca: getUnidadeEstaca()?.estacaUID,
                nome: { type: typeMissionario, sobrenome },
                unidade: selectUnidade,
                status: isAdmin() ? 1 : 2,
                foto: url,
                type: activeFilter,
                citacao: description?.replace(/\n/g, "<br/>"),
                localMissao,
                nascimento: {
                  dia,
                  mes,
                  ano,
                },
                dataIda,
                dataRetorno,
              });
              setModalAdd(false);
              setUploadImgMissionario(null);
              setUploadImgMissionarioView(null);
              setSobrenome("");
              setDescription("");
              setDia("");
              setMes("");
              setAno("");
              setDataIda("");
              setDataRetorno("");
              if (!isAdmin()) {
                window.alert(
                  "O missionário foi adicionado, mas falta ser verificado pela estaca ou unidade selecionada."
                );
              }
              setLoading(false);
            })
            .catch((e) => {
              var errorCode = e.code;
              var errorMessage = e.message;
              setLoading(false);
              alert(
                "Erro ao fazer upload na imagem. Tente novamente. " +
                  errorMessage
              );
            });
        }
      );
    }
  };

  const getIdade = (n) => {
    return new Date()?.getFullYear() - parseFloat(n?.ano);
  };

  const month = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  const getPrevisao = (n, type) => {
    let idademissao = type === "Sister" ? 19 : 18;
    let ano = new Date()?.getFullYear() + (idademissao - getIdade(n));
    return `${n?.dia} de ${month[parseFloat(n?.mes) - 1]}, ${ano}`;
  };

  return (
    <main className="missionarios">
      <div
        style={{
          opacity: modalAdd ? 5 : 0,
          visibility: modalAdd ? "visible" : "hidden",
        }}
        className="calendario--modal"
      >
        <div
          style={{
            transform: modalAdd ? "scale(1)" : "scale(0)",
          }}
          className="calendario--alterar__evento"
        >
          <div className="calendario--alterar__evento--header">
            <CgClose onClick={() => setModalAdd(null)} />

            <p>Adicionar missionário</p>
          </div>

          <div className="missionarios--edit-type--filter">
            {filters.map((filter) => (
              <button
                onClick={() => setActiveFilter(filter)}
                style={{
                  color: filter === activeFilter ? "" : "rgb(56, 57, 63)",
                  background:
                    filter === activeFilter ? "rgba(14, 57, 86, 1)" : "#fff",
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="calendario--alterar__evento--content">
            <section className="missionarios--edit-foto--content">
              <input
                onChange={(e) => changeImageUpload(e, setUploadImgMissionario)}
                style={{ display: "none" }}
                type="file"
                id="upload-img-missionario"
              />

              {!uploadImgMissionario ? (
                <label htmlFor="upload-img-missionario">
                  <BiUserCircle />
                  <p>Sua foto padrão missionário</p>
                </label>
              ) : (
                <div>
                  <CgClose
                    onClick={() => {
                      setUploadImgMissionario(null);
                      setUploadImgMissionarioView(null);
                    }}
                  />

                  <img src={uploadImgMissionarioView} alt="" />
                </div>
              )}
            </section>

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
                {selectUnidade === "Todos"
                  ? "Selecione a unidade do missionário..."
                  : selectUnidade?.nome}
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
              {unidades.map((item) => (
                <div
                  style={{
                    background:
                      selectUnidade?.nome === item.nome
                        ? "rgb(238, 240, 243)"
                        : "",
                  }}
                  onClick={() => {
                    setSelectUnidade(item);
                    setModalUnidades(false);
                    setModalSelect(false);
                  }}
                >
                  <p>{item.nome}</p>
                </div>
              ))}
            </div>

            <section className="missionarios--edit-name--content">
              <div className="missionarios--edit-type--filter">
                <button
                  onClick={() => setTypeMissionario("Sister")}
                  style={{
                    color:
                      typeMissionario === "Sister" ? "" : "rgb(56, 57, 63)",
                    background:
                      typeMissionario === "Sister"
                        ? "rgba(14, 57, 86, 1)"
                        : "#fff",
                  }}
                >
                  Sister
                </button>
                <button
                  onClick={() => setTypeMissionario("Elder")}
                  style={{
                    color: typeMissionario === "Elder" ? "" : "rgb(56, 57, 63)",
                    background:
                      typeMissionario === "Elder"
                        ? "rgba(14, 57, 86, 1)"
                        : "#fff",
                  }}
                >
                  Elder
                </button>
              </div>
              <input
                style={{ marginLeft: 10 }}
                placeholder="Sobrenome missionário"
                value={sobrenome}
                type="text"
                onChange={(e) => setSobrenome(e.target.value)}
              />
            </section>

            {activeFilter === "Em perspectiva" ? (
              <section className="missionarios--edit-nascimento--content">
                <p>Data de nascimento</p>
                <div>
                  <input
                    placeholder="Dia"
                    value={dia}
                    type="number"
                    maxLength={2}
                    onChange={(e) => setDia(e.target.value)}
                  />
                  <p>/</p>
                  <input
                    placeholder="Mês"
                    value={mes}
                    type="number"
                    maxLength={2}
                    onChange={(e) => setMes(e.target.value)}
                  />
                  <p>/</p>
                  <input
                    placeholder="Ano"
                    value={ano}
                    type="number"
                    maxLength={4}
                    onChange={(e) => setAno(e.target.value)}
                  />
                </div>
              </section>
            ) : (
              <>
                <div className="missionarios--edit-description--content">
                  <p>Local de sua missão:</p>
                  <input
                    placeholder="Local..."
                    value={localMissao}
                    type="text"
                    onChange={(e) => setLocalMissao(e.target.value)}
                  />
                </div>

                <section className="missionarios--edit-data--content">
                  <p>Ida</p>
                  <input
                    // placeholder="Mês/Ano"
                    placeholder="Ano"
                    value={dataIda}
                    type="number"
                    onChange={(e) => setDataIda(e.target.value)}
                  />
                  <p>Retorno</p>
                  <input
                    // placeholder="Mês/Ano"
                    placeholder="Ano"
                    value={dataRetorno}
                    type="number"
                    onChange={(e) => setDataRetorno(e.target.value)}
                  />
                </section>
              </>
            )}
            <div className="missionarios--edit-description--content">
              <p>Citação ou escritura favorita:</p>
              <textarea
                placeholder="..."
                value={description}
                type="text"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <button disabled>Carregando...</button>
          ) : sobrenome !== "" &&
            description !== "" &&
            uploadImgMissionarioView ? (
            activeFilter === "Em perspectiva" ? (
              dia !== "" && mes !== "" && ano !== "" ? (
                <button onClick={(e) => addMissionario(e)}>Adicionar</button>
              ) : (
                <button disabled>Adicionar</button>
              )
            ) : dataIda !== "" && dataRetorno !== "" ? (
              <button onClick={(e) => addMissionario(e)}>Adicionar</button>
            ) : (
              <button disabled>Adicionar</button>
            )
          ) : (
            <button disabled>Adicionar</button>
          )}
        </div>
      </div>

      <div
        style={{
          height: 260,
          backgroundImage:
            "url(https://firebasestorage.googleapis.com/v0/b/calendarioestacapacajus.appspot.com/o/missionarioscaminhando.jpg?alt=media&token=340f76cd-39e0-4326-82f8-124bce83317a)",
        }}
        className="calendario--banner"
      >
        <div>
          <svg
            onClick={() =>
              (window.location.href = `/${getUnidadeEstaca()?.estacaUID}`)
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

          <p>Relação missionária</p>
          <h6 style={{ marginBottom: 10 }}>{getUnidadeEstaca()?.nome}</h6>

          <div
            onClick={() => setModalUnidades(!modalUnidades)}
            className="calendario--banner__unidade-select"
          >
            <TiArrowSortedDown
              style={{
                transform: modalUnidades ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
            <p>
              {selectUnidade === "Todos"
                ? "Todos"
                : selectUnidade?.nome !== null
                ? selectUnidade?.nome
                : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="calendario">
        <div
          style={{
            opacity: modalUnidades ? 5 : 0,
            visibility: modalUnidades ? "visible" : "hidden",
            height: modalUnidades ? "" : 0,
          }}
          className="calendario--banner__unidade-select--itens"
        >
          <div
            style={{
              background: selectUnidade === "Todos" ? "rgb(238, 240, 243)" : "",
            }}
            onClick={() => {
              setSelectUnidade("Todos");
              setModalUnidades(false);
            }}
          >
            <p>Todos</p>
          </div>

          {unidades.map((item) => (
            <div
              style={{
                background:
                  selectUnidade?.nome === item.nome ? "rgb(238, 240, 243)" : "",
              }}
              onClick={() => {
                setSelectUnidade(item);
                setModalUnidades(false);
              }}
            >
              <p>{item.nome}</p>
            </div>
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

        <button onClick={() => setModalAdd(!modalAdd)}>
          Adicionar missionário
        </button>
      </div>

      <div className="missionarios--filter__search">
        <CgSearch />
        <input
          placeholder="Pesquisar missionários..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="calendario--filter">
        {filters.map((filter) => (
          <button
            onClick={() => setActiveFilter(filter)}
            style={{
              color: filter === activeFilter ? "" : "rgb(56, 57, 63)",
              background:
                filter === activeFilter ? "rgba(14, 57, 86, 1)" : "#fff",
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="missionarios--filter__missionarios">
        {filterMissionarios.length > 0 ? (
          filterMissionarios?.map((missionario) => (
            <ItemMissionario
              missionario={missionario}
              isAdmin={isAdmin}
              getIdade={getIdade}
              getPrevisao={getPrevisao}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              getUnidadeEstaca={getUnidadeEstaca}
              filters={filters}
              unidades={unidades}
              selectUnidade={selectUnidade}
              setSelectUnidade={setSelectUnidade}
            />
          ))
        ) : (
          <p>Sem resultados</p>
        )}
      </div>
    </main>
  );
}

export default Missionarios;
