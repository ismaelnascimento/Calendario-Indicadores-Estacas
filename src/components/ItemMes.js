import React, { useEffect, useMemo, useState } from "react";
import ItemEvento from "./ItemEvento";
import "../styles/ItemMes.css";
import { FiSearch } from "react-icons/fi";
import { organizations } from "../providers/reducer";
import { AiOutlineClose } from "react-icons/ai";

function ItemMes(props) {
  const [itemmes, setItemmes] = useState(props.mes);
  const [activeOrganizations, setActiveOrganizations] = useState([]);

  // set mesitem
  useEffect(() => {
    setItemmes(props.mes);
    setActiveOrganizations([]);
  }, [props.mes]);

  // EVENTOS events ;D

  // -- GET --
  const [eventosget, setEventosget] = useState([]);

  useEffect(() => {
    setEventosget(props.eventos);
  }, [props.eventos]);

  // -- FILTER --
  const eventos = useMemo(() => {
    if (itemmes === "Todos") {
      return eventosget;
    } else {
      var filter = eventosget.filter((evento) => {
        var mesItem = itemmes.toLowerCase();
        var mesEvento = evento.mes.toLowerCase();

        return mesItem === mesEvento;
      });

      return filter?.filter((evento) => {
        return evento.unidade.nome === "Estaca Pacajus";
      });
    }
  }, [eventosget, itemmes]);

  const eventosUnidade = useMemo(() => {
    if (itemmes === "Todos") {
      return eventosget;
    } else {
      var filter = eventosget.filter((evento) => {
        var mesItem = itemmes.toLowerCase();
        var mesEvento = evento.mes.toLowerCase();

        return mesItem === mesEvento;
      });

      return filter.filter((evento) => {
        return evento.unidade.nome === props.selectUnidade?.nome;
      });
    }
  }, [eventosget, itemmes, props.selectUnidade?.nome]);

  const eventosFilter = useMemo(() => {
    return activeOrganizations?.length > 0
      ? eventos?.filter((evento) => {
          return activeOrganizations.includes(
            evento?.selectOrgazinacao?.organizacao
          );
        })
      : eventos;
  }, [activeOrganizations, eventos]);

  const eventosUnidadeFilter = useMemo(() => {
    return activeOrganizations?.length > 0
      ? eventosUnidade?.filter((evento) => {
          return activeOrganizations.includes(
            evento?.selectOrgazinacao?.organizacao
          );
        })
      : eventosUnidade;
  }, [activeOrganizations, eventosUnidade]);

  //
  const organizationsFilter = useMemo(() => {
    if (itemmes === "Todos") {
      return organizations;
    } else {
      if (props.selectUnidade?.nome !== "Estaca Pacajus") {
        return eventosUnidade.map((evento) => {
          return evento?.selectOrgazinacao;
        });
      } else {
        return eventos.map((evento) => {
          return evento?.selectOrgazinacao;
        });
      }
    }
  }, [eventos, eventosUnidade, itemmes, props.selectUnidade?.nome]);

  const organizationsFilterRemoveDuplicated = useMemo(() => {
    const seen = new Set();

    return organizationsFilter.filter((el) => {
      const duplicate = seen.has(el?.organizacao);
      seen.add(el?.organizacao);
      return !duplicate;
    });
  }, [organizationsFilter]);

  return (
    <div className="calendario__mes">
      <p>{itemmes}</p>

      <div className="calendario__mes--organizacoes">
        <p>Filtrar por organização: </p>
        {organizationsFilterRemoveDuplicated?.length > 0
          ? organizationsFilterRemoveDuplicated?.map((org) => (
              <button
                onClick={() => {
                  if (activeOrganizations.includes(org?.organizacao)) {
                    const newlist = activeOrganizations.filter(
                      (item) => item !== org?.organizacao
                    );
                    setActiveOrganizations(newlist);
                  } else {
                    setActiveOrganizations((list) => [
                      ...list,
                      org?.organizacao,
                    ]);
                  }
                }}
                style={{
                  background: activeOrganizations.includes(org?.organizacao)
                    ? `${org?.color}`
                    : "#fff",
                  color: activeOrganizations.includes(org?.organizacao)
                    ? `#fff`
                    : "rgba(14, 57, 86, 1)",
                }}
              >
                {activeOrganizations.includes(org?.organizacao) ? (
                  <AiOutlineClose />
                ) : (
                  ""
                )}
                {org?.organizacao}
              </button>
            ))
          : ""}
      </div>

      <div className="calendario__mes-eventos">
        {props.selectUnidade?.nome !== "Estaca Pacajus" ? (
          eventosUnidadeFilter?.length > 0 ? (
            eventosUnidadeFilter?.map((evento) => (
              <ItemEvento
                // user={props.user}
                user={props.user}
                emailESTACAPACAJUS={evento.unidade.email}
                evento={evento}
                organizacoes={props.organizacoes}
              />
            ))
          ) : (
            <div className="calendario__mes-eventos-not">
              <FiSearch />
              Não achei eventos da unidade {props.selectUnidade?.nome} em{" "}
              {itemmes}
            </div>
          )
        ) : (
          ""
        )}

        {eventosFilter?.length > 0 ? (
          eventosFilter?.map((evento) => (
            <ItemEvento
              user={props.user}
              emailESTACAPACAJUS={evento.unidade.email}
              evento={evento}
              organizacoes={props.organizacoes}
            />
          ))
        ) : (
          <div className="calendario__mes-eventos-not">
            <FiSearch />
            Não achei eventos em {itemmes}
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemMes;
