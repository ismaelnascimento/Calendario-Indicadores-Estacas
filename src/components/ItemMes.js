import React, { useEffect, useMemo, useState } from "react";
import { db } from "../services/Firebase";
import ItemEvento from "./ItemEvento";
import "../styles/ItemMes.css";
import { FiSearch } from "react-icons/fi";

function ItemMes(props) {
  const [itemmes, setItemmes] = useState(props.mes);

  // set mesitem
  useEffect(() => {
    setItemmes(props.mes);
  }, [props.mes]);

  // EVENTOS events ;D

  // -- GET --
  const [eventosget, setEventosget] = useState([]);

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

  // -- FILTER --
  const eventos = useMemo(() => {
    if (itemmes === "Todos") {
      return eventosget;
    } else {
      return eventosget.filter((evento) => {
        var mesItem = itemmes.toLowerCase();
        var mesEvento = evento.mes.toLowerCase();

        return mesItem === mesEvento;
      });
    }
  }, [eventosget, itemmes]);

  //

  return (
    <div className="calendario__mes">
      <p>{itemmes}</p>

      <div className="calendario__mes-eventos">
        {eventos?.length > 0 ? (
          eventos?.map((evento) => (
            <ItemEvento
              user={props.user}
              emailESTACAPACAJUS={props.emailESTACAPACAJUS}
              evento={evento}
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
