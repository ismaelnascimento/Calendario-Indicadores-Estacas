import React, { useEffect, useState } from "react";
import { BiUserCircle } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import { FiEdit2 } from "react-icons/fi";
import { TiArrowSortedDown } from "react-icons/ti";
import { BiCopy } from "react-icons/bi";
import { useStateValue } from "../providers/StateProvider";
import { db, storage } from "../services/Firebase";

function ItemMissionario({
  getUnidadeEstaca,
  //   activeFilter,
  missionario,
  isAdmin,
  getIdade,
  getPrevisao,
  filters,
  //   setActiveFilter,
  unidades,
  //   selectUnidade,
  //   setSelectUnidade
}) {
  const [modalAdd, setModalAdd] = useState(false);
  const [{ user }, dispatch] = useStateValue();
  const [modalUnidades, setModalUnidades] = useState(false);
  const [selectUnidade, setSelectUnidade] = useState("Todos");
  const [activeFilter, setActiveFilter] = useState(filters[0]);

  const remove = (e) => {
    e.preventDefault();

    if (window.confirm("Deletar missionário?")) {
      db.collection("missionarios").doc(missionario?.id).delete();
    }
  };

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
  const [email, setEmail] = useState("");

  //
  const [uploadImgMissionario, setUploadImgMissionario] = useState(null);
  const [uploadImgMissionarioView, setUploadImgMissionarioView] =
    useState(null);

  useEffect(() => {
    setTypeMissionario(missionario?.nome?.type);
    setSobrenome(missionario?.nome?.sobrenome);
    setDia(missionario?.nascimento?.dia);
    setMes(missionario?.nascimento?.mes);
    setAno(missionario?.nascimento?.ano);
    setDataRetorno(missionario?.dataRetorno);
    setDataIda(missionario?.dataIda);
    setLocalMissao(missionario?.localMissao);
    setActiveFilter(missionario?.type);
    setDescription(missionario?.citacao?.replaceAll("<br/>", "\n"));
    setSelectUnidade(missionario?.unidade);
    setUploadImgMissionarioView(missionario?.foto);
    setEmail(missionario?.email ? missionario?.email : "");
  }, [missionario]);

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

  const addMissionario = (e) => {
    e.preventDefault();

    if (uploadImgMissionario) {
      var imgUpload = uploadImgMissionario;

      var letters = "abcdefghijklmnopqrstuvwxyz";
      var _id =
        letters.charAt(Math.floor(Math.random() * letters.length)) +
        (Math.random() + 1).toString(36).substr(2, 9);
      const uploadTask = storage
        .ref("missionarios")
        .child(`missionario-edit-${_id}-${imgUpload.name}`)
        .put(imgUpload);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("missionarios")
            .child(`missionario-edit-${_id}-${imgUpload.name}`)
            .getDownloadURL()
            .then((url) => {
              db.collection("missionarios")
                .doc(missionario?.id)
                .update({
                  nome: { type: typeMissionario, sobrenome },
                  status: isAdmin() ? 1 : 2,
                  foto: url,
                  type: activeFilter,
                  unidade: selectUnidade,
                  citacao: description?.replace(/\n/g, "<br/>"),
                  localMissao,
                  nascimento: {
                    dia,
                    mes,
                    ano,
                  },
                  dataIda,
                  dataRetorno,
                  email,
                });
              setModalAdd(false);
              setUploadImgMissionario(null);
            })
            .catch((e) => {
              var errorCode = e.code;
              var errorMessage = e.message;
              alert(
                "Erro ao fazer upload na imagem. Tente novamente. " +
                  errorMessage
              );
            });
        }
      );
    } else {
      db.collection("missionarios")
        .doc(missionario?.id)
        .update({
          nome: { type: typeMissionario, sobrenome },
          status: isAdmin() ? 1 : 2,
          type: activeFilter,
          unidade: selectUnidade,

          citacao: description?.replace(/\n/g, "<br/>"),
          localMissao,
          nascimento: {
            dia,
            mes,
            ano,
          },
          dataIda,
          dataRetorno,
          email,
        });
      setModalAdd(false);
    }
  };

  const COPY = (text) => {
    if (document.queryCommandSupported("copy")) {
      var textField = document.createElement("textarea");
      textField.innerText = text;
      document.body.appendChild(textField);
      textField.select();
      document.execCommand("copy");
      textField.remove();

      alert("Copiado!");
    }
  };

  return (
    <>
      {!isAdmin() && missionario?.status === 2 ? (
        ""
      ) : (
        <>
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

                <p>Editar missionário</p>
              </div>

              <div className="missionarios--edit-type--filter">
                {filters.map((filter) => (
                  <button
                    onClick={() => setActiveFilter(filter)}
                    style={{
                      color: filter === activeFilter ? "" : "rgb(56, 57, 63)",
                      background:
                        filter === activeFilter
                          ? "rgba(14, 57, 86, 1)"
                          : "#fff",
                    }}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="calendario--alterar__evento--content">
                <section className="missionarios--edit-foto--content">
                  <input
                    onChange={(e) =>
                      changeImageUpload(e, setUploadImgMissionario)
                    }
                    style={{ display: "none" }}
                    type="file"
                    id={"upload-edit-img-missionario" + missionario?.id}
                  />

                  {!uploadImgMissionarioView ? (
                    <label
                      htmlFor={"upload-edit-img-missionario" + missionario?.id}
                    >
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
                      transform: modalSelect
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
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
                        color:
                          typeMissionario === "Elder" ? "" : "rgb(56, 57, 63)",
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
                    {activeFilter === "No campo" ? (
                      <input
                        style={{ marginTop: "15px" }}
                        placeholder="Email missionário"
                        value={email}
                        type="text"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    ) : (
                      ""
                    )}
                  </>
                )}

                <div className="missionarios--edit-description--content">
                  <p>Citação ou escritura favorita:</p>
                  <textarea
                    style={{ whiteSpace: "pre-line" }}
                    placeholder="..."
                    value={description}
                    type="text"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              {sobrenome !== "" &&
              description !== "" &&
              uploadImgMissionarioView ? (
                activeFilter === "Em perspectiva" ? (
                  dia !== "" && mes !== "" && ano !== "" ? (
                    <button onClick={(e) => addMissionario(e)}>Editar</button>
                  ) : (
                    <button disabled>Editar</button>
                  )
                ) : dataIda !== "" && dataRetorno !== "" ? (
                  <button onClick={(e) => addMissionario(e)}>Editar</button>
                ) : (
                  <button disabled>Editar</button>
                )
              ) : (
                <button disabled>Editar</button>
              )}
            </div>
          </div>

          <div
            style={{
              height:
                missionario?.type === "No campo" && email !== "" ? "515px" : "",
            }}
            className="missionarios--filter__missionarios-item"
          >
            {missionario?.status === 2 ? (
              <span
                onClick={() => {
                  db.collection("missionarios")
                    .doc(missionario?.id)
                    .update({ status: 1 });
                }}
              >
                Verificar missionario
              </span>
            ) : (
              ""
            )}
            {isAdmin() ? (
              <>
                <button onClick={(e) => remove(e)}>
                  <BsTrash />
                </button>
                <button
                  style={{ right: 5, left: "initial" }}
                  onClick={() => setModalAdd(true)}
                >
                  <FiEdit2 />
                </button>
              </>
            ) : (
              ""
            )}
            <img
              onClick={() => window.open(missionario?.foto)}
              src={missionario?.foto}
              alt={missionario?.nome?.sobrenome}
            />
            <section>
              <span>{missionario?.unidade?.nome}</span>
              <p>
                {`${missionario?.nome?.type} ${missionario?.nome?.sobrenome}`}{" "}
              </p>
              <div>{missionario?.type}</div>
            </section>
            {missionario?.type === "Em perspectiva" ? (
              <p>
                {getIdade(missionario?.nascimento)} anos{" "}
                <h5>
                  Previsão para ida:{" "}
                  {getPrevisao(
                    missionario?.nascimento,
                    missionario?.nome?.type
                  )}
                </h5>
              </p>
            ) : (
              <>
                <p>
                  {missionario?.localMissao}
                  <h5>
                    {missionario?.dataIda}-{missionario?.dataRetorno}
                  </h5>
                </p>
              </>
            )}
            <div>
              <p>Citação ou escritura favorita:</p>
              <h5 style={{ whiteSpace: "pre-line" }}>
                {missionario?.citacao?.replaceAll("<br/>", "\n")}
              </h5>
            </div>
            {missionario?.type === "No campo" ? (
              <>
                {email !== "" ? (
                  <article>
                    <a onClick={() => window.open(`mailto:${email}`)}>
                      Enviar mensagem
                    </a>
                    <BiCopy onClick={() => COPY(email)} />
                  </article>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
          </div>
        </>
      )}
    </>
  );
}

export default ItemMissionario;
