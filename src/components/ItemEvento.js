import React, { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { BsTrash } from "react-icons/bs";
import { FiEdit2 } from "react-icons/fi";
import { db } from "../services/Firebase";
import "../styles/ItemEvento.css";
import { VscAdd } from "react-icons/vsc";
import { TiArrowSortedDown } from "react-icons/ti";
import { SiFacebook, SiTwitter, SiWhatsapp } from "react-icons/si";
import { useLocation } from "react-router-dom";
import { useStateValue } from "../providers/StateProvider";

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
  const [INPUTlocalEvento, setINPUTlocalEvento] = useState("");
  const [INPUThorarioEvento, setINPUThorarioEvento] = useState("");
  const [INPUTinfoextraEvento, setINPUTinfoextraEvento] = useState("");

  //

  const [selectOrgazinacao, setSelectOrgazinacao] = useState(null);
  const [organizacoes, setOrganizacoes] = useState([]);
  const [modalSelect, setModalSelect] = useState(false);
  const [selectUnidade, setSelectUnidade] = useState({});

  useEffect(() => {
    setOrganizacoes(props.organizacoes);
    setINPUTmesEvento(props.evento.mes);
    setINPUTnomeEvento(props.evento.nome);
    setINPUTlocalEvento(props.evento?.local ? props.evento?.local : "");
    setINPUThorarioEvento(props.evento?.horario ? props.evento?.horario : "");
    setINPUTinfoextraEvento(
      props.evento?.infoextra ? props.evento?.infoextra : ""
    );
    setINPUTdiaEvento(props.evento.dia);
    setINPUTlinksEvento(props.evento?.links ? props.evento?.links : []);
    setSelectOrgazinacao(props.evento?.selectOrgazinacao);
    setSelectUnidade(props.evento?.unidade ? props.evento?.unidade : {});
  }, [props.evento, props.organizacoes]);

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

  const [{ user }] = useStateValue();

  // -- UPDATE --
  const updateEvento = (e, id) => {
    e.preventDefault();

    const objEvento = {
      mes: INPUTmesEvento,
      dia: INPUTdiaEvento,
      nome: INPUTnomeEvento,
      local: INPUTlocalEvento,
      horario: INPUThorarioEvento,
      infoextra: INPUTinfoextraEvento,
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
    setINPUTlocalEvento("");
    setINPUThorarioEvento("");
    setINPUTinfoextraEvento("");
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

  var pularLinha = "%0A";
  var textoPequeno = "```";

  return (
    <div id={`${props.evento.id}`} className="calendario__mes-eventos--item">
      <a
        href={`#${props.evento.id}`}
        onClick={() => {
          window.open(
            `https://api.whatsapp.com/send?text=${
              selectUnidade?.email === "estacapacajussiao@gmail.com"
                ? `${textoPequeno}Nível Estaca${textoPequeno}`
                : `${textoPequeno}Nível Ala${textoPequeno}`
            }${pularLinha}*${props.evento.dia} de ${props.evento.mes}* _(${
              props.evento?.selectOrgazinacao?.organizacao
            })_${pularLinha}${
              props.evento.nome
            }${pularLinha}${pularLinha}*Atividade do calendário anual da Estaca Pacajus Brasil 2022 https://calendarioindicadoresestacas.web.app/${
              props.evento.id
            }*`
          );
        }}
      >
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 16 16"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"></path>
        </svg>
      </a>

      {selectUnidade?.email ? (
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
      {/* INFOS */}
      <div
        className="calendario__mes-eventos--item_infos"
        style={{
          marginBottom:
            props.user?.email === "estacapacajussiao@gmail.com" ||
            props.user?.email === props.emailESTACAPACAJUS
              ? ""
              : 2,
        }}
      >
        <p>
          {props.evento?.local && props.evento?.horario && <b>Evento:</b>}
          {props.evento?.nome}
        </p>
        {props.evento?.local && (
          <p>
            <b>Local:</b> {props.evento?.local}
          </p>
        )}
        {props.evento?.horario && (
          <p>
            <b>Horário:</b> {props.evento?.horario}
          </p>
        )}
        {props.evento?.infoextra && (
          <>
            <hr></hr>
            <p>
              <b>{props.evento?.infoextra}</b>
            </p>
          </>
        )}
      </div>

      {INPUTlinksEvento?.length !== 0 ? (
        <div className="calendario--alterar__evento--content__links">
          {INPUTlinksEvento?.map((link) => (
            <div
              style={{
                margin: 0,
                marginBottom:
                  props.user?.email === "estacapacajussiao@gmail.com" ||
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

      {props.user?.email === "estacapacajussiao@gmail.com" ||
      props.user?.email === props.emailESTACAPACAJUS ? (
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
            <input
              placeholder="Local do evento"
              value={INPUTlocalEvento}
              onChange={(e) => setINPUTlocalEvento(e.target.value)}
            />
            <input
              placeholder="Horário do evento"
              value={INPUThorarioEvento}
              onChange={(e) => setINPUThorarioEvento(e.target.value)}
            />
            <input
              placeholder="Informação extra do evento (Opicional)"
              value={INPUTinfoextraEvento}
              onChange={(e) => setINPUTinfoextraEvento(e.target.value)}
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
          INPUTlocalEvento !== props.evento?.local ||
          INPUThorarioEvento !== props.evento?.horario ||
          INPUTinfoextraEvento !== props.evento?.infoextra ||
          INPUTdiaEvento !== props.evento.dia ||
          INPUTmesEvento !== props.evento.mes ||
          INPUTlinksEvento !== props.evento?.links ||
          selectOrgazinacao?.organizacao !==
            props.evento?.selectOrgazinacao?.organizacao ? (
            <button onClick={(e) => updateEvento(e, props.evento.id)}>
              Salvar Alteração
            </button>
          ) : (
            <button disabled={true}>Salvar Alteração</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemEvento;
