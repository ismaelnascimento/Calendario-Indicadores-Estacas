import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Metas from "../Metas";
import Missionarios from "../Missionarios";
import Loading from "./loading-buffering.gif";

function MissionariosApp({ loginGoogle, getEstaca, unidades, eventos }) {
  const { estacaUID } = useParams();
  const [notUnidades, setNotUnidades] = useState(false);

  const getUnidades = () => {
    return unidades?.filter((uni) => {
      return uni?.estacaUID === estacaUID;
    });
  };

  useEffect(() => {
    setTimeout(() => {
      if (getUnidades()?.length > 0) {
        setNotUnidades(false);
      } else {
        setNotUnidades(true);
      }
    }, [2000]);
  }, [getUnidades()]);

  const getEventos = () => {
    return eventos?.filter((ev) => {
      return ev?.estacaUID === estacaUID;
    });
  };

  return getUnidades()?.length > 0 ? (
    <Missionarios
      unidades={getUnidades()}
      eventos={getEventos()}
      loginGoogle={loginGoogle}
    />
  ) : notUnidades ? (
    <p style={{ textAlign: "center", margin: 30 }}>Não encontrado</p>
  ) : (
    <p style={{ textAlign: "center", margin: 40 }}>
      <img width="50px" src={Loading} alt="" />
    </p>
  );
}

export default MissionariosApp;
