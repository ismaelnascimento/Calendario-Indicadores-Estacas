import React, { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { BsTrash } from "react-icons/bs";
import { FiEdit2 } from "react-icons/fi";
import { db } from "../services/Firebase";
import "../styles/ItemEvento.css";
import { VscAdd } from "react-icons/vsc";
import { TiArrowSortedDown } from "react-icons/ti";

function ItemEvento(props) {
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

  const [modalUpdateEvento, setModalUpdateEvento] = useState(false);

  const [INPUTnomeEvento, setINPUTnomeEvento] = useState("");
  const [INPUTdiaEvento, setINPUTdiaEvento] = useState("");
  const [INPUTmesEvento, setINPUTmesEvento] = useState("");
  const [INPUTlinksEvento, setINPUTlinksEvento] = useState([]);

  //

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
  const [selectUnidade, setSelectUnidade] = useState({});

  useEffect(() => {
    setINPUTmesEvento(props.evento.mes);
    setINPUTnomeEvento(props.evento.nome);
    setINPUTdiaEvento(props.evento.dia);
    setINPUTlinksEvento(props.evento?.links ? props.evento?.links : []);
    setSelectOrgazinacao(props.evento?.selectOrgazinacao);
    setSelectUnidade(props.evento?.unidade ? props.evento?.unidade : {});
  }, [props.evento]);

  // -link-
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

  // EVENTOS events ;D

  // -- UPDATE --
  const updateEvento = (e, id) => {
    e.preventDefault();

    const objEvento = {
      mes: INPUTmesEvento,
      dia: INPUTdiaEvento,
      nome: INPUTnomeEvento,
      links: INPUTlinksEvento,
      selectOrgazinacao: selectOrgazinacao,
      unidade: selectUnidade,
    };

    db.collection("calendario")
      .doc("anual")
      .collection("eventos")
      .doc(id)
      .update(objEvento);

    setINPUTmesEvento("");
    setINPUTnomeEvento("");
    setINPUTdiaEvento("");
    setModalUpdateEvento(!modalUpdateEvento);
  };

  // -- DELETE --
  const deleteEvento = (e, id) => {
    e.preventDefault();

    if (window.confirm("Quer mesmo deletar?")) {
      db.collection("calendario")
        .doc("anual")
        .collection("eventos")
        .doc(id)
        .delete();
    }
  };

  const [viewOrganizacao, setViewOrganizacao] = useState(false);

  return (
    <div className="calendario__mes-eventos--item">
      {selectUnidade !== {} ? (
        <h6>
          {selectUnidade?.email === "estacapacajussiao@gmail.com"
            ? "Nível Estaca"
            : "Nível Ala"}
        </h6>
      ) : (
        ""
      )}
      <p>
        {props.evento.dia} de {props.evento.mes}
        {props.evento?.selectOrgazinacao ? (
          <div
            style={{
              background: props.evento?.selectOrgazinacao?.color,
              padding: viewOrganizacao ? "6px 10px" : "4px",
            }}
            onClick={() => setViewOrganizacao(!viewOrganizacao)}
          >
            {viewOrganizacao
              ? props.evento?.selectOrgazinacao?.organizacao
              : ""}
          </div>
        ) : (
          ""
        )}
      </p>
      <h5
        style={{
          marginBottom: props.user?.email === props.emailESTACAPACAJUS ? "" : 2,
        }}
      >
        {props.evento.nome}
      </h5>

      {INPUTlinksEvento?.length !== 0 ? (
        <div className="calendario--alterar__evento--content__links">
          {INPUTlinksEvento?.map((link) => (
            <div
              style={{
                margin: 0,
                marginBottom:
                  props.user?.email === props.emailESTACAPACAJUS
                    ? "15px"
                    : "5px",
                padding: 0,
              }}
            >
              <p>
                <img
                  src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${link?.link}`}
                />
                {link?.nome}
              </p>
              <a rel="noreferrer" target="_blank" href={`${link?.link}`}>
                {link?.link}
              </a>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}

      {props.user?.email === props.emailESTACAPACAJUS ? (
        <section>
          <button onClick={(e) => deleteEvento(e, props.evento.id)}>
            <BsTrash /> Deletar evento
          </button>
          <button onClick={() => setModalUpdateEvento(!modalUpdateEvento)}>
            <FiEdit2 /> Alterar evento
          </button>
        </section>
      ) : (
        ""
      )}

      <div
        style={{
          opacity: modalUpdateEvento ? 5 : 0,
          visibility: modalUpdateEvento ? "visible" : "hidden",
        }}
        className="calendario--modal"
      >
        <div
          style={{ transform: modalUpdateEvento ? "scale(1)" : "scale(0)" }}
          className="calendario--alterar__evento"
        >
          <div className="calendario--alterar__evento--header">
            <CgClose onClick={() => setModalUpdateEvento(!modalUpdateEvento)} />

            <p>Alterar evento</p>
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
              {INPUTlinksEvento?.map((link) => (
                <div>
                  <p>
                    <img
                      src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${link.link}`}
                    />
                    {link.nome}
                  </p>
                  <a rel="noreferrer" target="_blank" href={`${link.link}`}>
                    {link.link}
                  </a>
                  <button onClick={() => removeLink(link.link)}>
                    <BsTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {INPUTnomeEvento !== props.evento.nome ||
          INPUTdiaEvento !== props.evento.dia ||
          INPUTmesEvento !== props.evento.mes ||
          INPUTlinksEvento !== props.evento?.links ||
          selectOrgazinacao?.organizacao !== props.evento?.selectOrgazinacao ? (
            <button onClick={(e) => updateEvento(e, props.evento.id)}>
              Alterar
            </button>
           ) : (
            <button disabled={true}>Alterar</button>
          )} 
        </div>
      </div>
    </div>
  );
}

export default ItemEvento;
