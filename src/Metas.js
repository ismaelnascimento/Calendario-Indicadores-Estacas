import React, { useEffect, useMemo, useState } from "react";
import GaugeChart from "react-gauge-chart";
import { auth, db } from "./services/Firebase";
import "./styles/metas.css";

import { TiArrowSortedDown } from "react-icons/ti";
import { CgClose } from "react-icons/cg";
import { AiOutlinePlus } from "react-icons/ai";
import { MdRemove } from "react-icons/md";
import iconBatismo from "./icons/iconBatismo.svg";
import iconFrequencia from "./icons/iconFrequencia.svg";
import iconMissionario from "./icons/iconMissionario.svg";
import iconTemplo from "./icons/iconTemplo.svg";
import { useStateValue } from "./providers/StateProvider";
import { actionTypes } from "./providers/reducer";
import { BiLogOut } from "react-icons/bi";
import { HiOutlineUser } from "react-icons/hi";

function Metas({ unidades, loginGoogle }) {
  const [{ user }, dispatch] = useStateValue();
  const [selectUnidade, setSelectUnidade] = useState("Todos");
  const [modalUnidades, setModalUnidades] = useState(false);

  const updateMeta = (idUni, alterar, thenn) => {
    db.collection("unidades").doc(idUni).update(alterar)?.then(thenn);
  };

  const getUnidadeEstaca = () => {
    var filter = unidades?.filter((uni) => {
      return uni?.estaca === true;
    });

    return filter[0];
  };

  const isAdminEstaca = () => {
    return user?.email === getUnidadeEstaca()?.email;
  };

  const isAdmin = () => {
    if (isAdminEstaca()) {
      return true;
    } else if (user?.email === selectUnidade?.email) {
      var filter = unidades.filter((uni) => {
        return uni.email === user?.email;
      });
      return filter.length > 0;
    } else {
      return false;
    }
  };

  const filterUnidade = useMemo(() => {
    if (selectUnidade === "Todos") {
      return unidades?.filter((uni) => {
        return uni?.nome !== getUnidadeEstaca()?.nome;
      });
    } else if (selectUnidade?.nome === getUnidadeEstaca()?.nome) {
      return [];
    } else {
      return unidades?.filter((uni) => {
        return uni?.nome === selectUnidade?.nome;
      });
    }
  }, [selectUnidade?.nome, unidades]);

  const getTotalInfos = () => {
    const infos = {
      batismoConversos: 0,
      frequenciaSacramental: 0,
      campoMissionario: 0,
      nomesAoTemplo: 0,
    };

    unidades.map((uni) => {
      if (
        uni?.nome !== "Grupo Icapuí" &&
        uni?.nome !== getUnidadeEstaca()?.nome
      ) {
        infos.batismoConversos += parseFloat(
          uni?.metasConcluidas?.batismoConversos
        );
        infos.frequenciaSacramental += parseFloat(
          uni?.metasConcluidas?.frequenciaSacramental
        );
        infos.campoMissionario += parseFloat(
          uni?.metasConcluidas?.campoMissionario
        );
        infos.nomesAoTemplo += parseFloat(uni?.metasConcluidas?.nomesAoTemplo);
      }
    });

    return infos;
  };

  const filterEstaca = useMemo(() => {
    return unidades?.filter((uni) => {
      return uni?.nome === getUnidadeEstaca()?.nome;
    });
  }, [unidades]);

  const [selectUnidadeMeta, setSelectUnidadeMeta] = useState(null);

  const [newMetaUnidade1, setNewMetaUnidade1] = useState(0);
  const [newMetaUnidade2, setNewMetaUnidade2] = useState(0);
  const [newMetaUnidade3, setNewMetaUnidade3] = useState(0);
  const [newMetaUnidade4, setNewMetaUnidade4] = useState(0);

  useEffect(() => {
    setNewMetaUnidade1(selectUnidadeMeta?.metas?.batismoConversos);
    setNewMetaUnidade2(selectUnidadeMeta?.metas?.frequenciaSacramental);
    setNewMetaUnidade3(selectUnidadeMeta?.metas?.campoMissionario);
    setNewMetaUnidade4(selectUnidadeMeta?.metas?.nomesAoTemplo);
  }, [selectUnidadeMeta]);

  return (
    <main className="metas">
      <div
        style={{
          opacity: selectUnidadeMeta ? 5 : 0,
          visibility: selectUnidadeMeta ? "visible" : "hidden",
        }}
        className="calendario--modal"
      >
        <div
          style={{
            transform: selectUnidadeMeta ? "scale(1)" : "scale(0)",
          }}
          className="calendario--alterar__evento"
        >
          <div className="calendario--alterar__evento--header">
            <CgClose onClick={() => setSelectUnidadeMeta(null)} />

            <p>Atualizar metas de {selectUnidadeMeta?.nome}</p>
          </div>

          <div className="calendario--alterar__evento--content">
            <p>Batismos de conversos</p>
            <input
              placeholder="Nova meta"
              value={newMetaUnidade1}
              type="number"
              onChange={(e) => setNewMetaUnidade1(e.target.value)}
            />
            <p>Frequência na sacramental</p>
            <input
              placeholder="Nova meta"
              value={newMetaUnidade2}
              type="number"
              onChange={(e) => setNewMetaUnidade2(e.target.value)}
            />
            <p>Jovens enviados ao campo missionário</p>
            <input
              placeholder="Nova meta"
              value={newMetaUnidade3}
              type="number"
              onChange={(e) => setNewMetaUnidade3(e.target.value)}
            />
            <p>Membros enviando nomes ao Templo</p>
            <input
              placeholder="Nova meta"
              value={newMetaUnidade4}
              type="number"
              onChange={(e) => setNewMetaUnidade4(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              updateMeta(
                selectUnidadeMeta?.id,
                {
                  metas: {
                    batismoConversos: parseFloat(newMetaUnidade1),
                    frequenciaSacramental: parseFloat(newMetaUnidade2),
                    campoMissionario: parseFloat(newMetaUnidade3),
                    nomesAoTemplo: parseFloat(newMetaUnidade4),
                  },
                },
                () => {
                  setSelectUnidadeMeta(null);
                }
              );
            }}
          >
            Atualizar
          </button>
        </div>
      </div>

      <div style={{ height: 300 }} className="calendario--banner">
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

          <p>Visão para a Área Brasil - Indicadores de Progresso</p>
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
      </div>

      <section className="metas__content">
        {filterUnidade?.map((uni) =>
          uni?.nome !== "Grupo Icapuí" ? (
            <div className="metas__unidade">
              <p>
                {uni?.nome}{" "}
                {isAdmin() ? (
                  <h5 onClick={() => setSelectUnidadeMeta(uni)}>
                    Editar metas
                  </h5>
                ) : (
                  ""
                )}
              </p>

              <div className="metas__unidade--charts">
                <div>
                  <GaugeChart
                    id="gauge-chart4"
                    nrOfLevels={3}
                    arcPadding={0.1}
                    percent={(
                      ((uni?.metasConcluidas?.batismoConversos /
                        uni?.metas?.batismoConversos) *
                        100) /
                      100
                    ).toFixed(2)}
                  />
                  <section>
                    <img src={iconBatismo} alt="" />
                    <p>
                      Batismos de conversos{" "}
                      {isAdmin() ? (
                        <b>
                          (Meta: {uni?.metasConcluidas?.batismoConversos}/
                          {uni?.metas?.batismoConversos})
                        </b>
                      ) : (
                        ""
                      )}
                    </p>
                  </section>

                  {isAdmin() ? (
                    <main>
                      <AiOutlinePlus
                        onClick={() =>
                          updateMeta(uni?.id, {
                            metasConcluidas: {
                              ...uni?.metasConcluidas,
                              batismoConversos:
                                parseFloat(
                                  uni?.metasConcluidas?.batismoConversos
                                ) + 1,
                            },
                          })
                        }
                      />
                      <input
                        onChange={(e) => {
                          if (
                            e.target.value !== "" &&
                            e.target.value !== undefined &&
                            e.target.value !== null
                          )
                            updateMeta(uni?.id, {
                              metasConcluidas: {
                                ...uni?.metasConcluidas,
                                batismoConversos: e.target.value,
                              },
                            });
                        }}
                        type={"number"}
                        value={uni?.metasConcluidas?.batismoConversos}
                      />
                      {/* <p>{uni?.metasConcluidas?.batismoConversos}</p> */}
                      <MdRemove
                        style={{
                          opacity:
                            parseFloat(uni?.metasConcluidas?.batismoConversos) >
                            0
                              ? ""
                              : 0.5,
                        }}
                        onClick={() => {
                          if (
                            parseFloat(uni?.metasConcluidas?.batismoConversos) >
                            0
                          )
                            updateMeta(uni?.id, {
                              metasConcluidas: {
                                ...uni?.metasConcluidas,
                                batismoConversos:
                                  parseFloat(
                                    uni?.metasConcluidas?.batismoConversos
                                  ) - 1,
                              },
                            });
                        }}
                      />
                    </main>
                  ) : (
                    ""
                  )}
                </div>

                <div>
                  <GaugeChart
                    id="gauge-chart4"
                    nrOfLevels={3}
                    arcPadding={0.1}
                    percent={(
                      ((uni?.metasConcluidas?.frequenciaSacramental /
                        uni?.metas?.frequenciaSacramental) *
                        100) /
                      100
                    ).toFixed(2)}
                  />
                  <section>
                    <img src={iconFrequencia} alt="" />
                    <p>
                      Frequência na sacramental{" "}
                      {isAdmin() ? (
                        <b>
                          (Meta: {uni?.metasConcluidas?.frequenciaSacramental}/
                          {uni?.metas?.frequenciaSacramental})
                        </b>
                      ) : (
                        ""
                      )}
                    </p>
                  </section>

                  {isAdmin() ? (
                    <main>
                      <AiOutlinePlus
                        onClick={() =>
                          updateMeta(uni?.id, {
                            metasConcluidas: {
                              ...uni?.metasConcluidas,
                              frequenciaSacramental:
                                parseFloat(
                                  uni?.metasConcluidas?.frequenciaSacramental
                                ) + 1,
                            },
                          })
                        }
                      />
                      <input
                        onChange={(e) => {
                          if (
                            e.target.value !== "" &&
                            e.target.value !== undefined &&
                            e.target.value !== null
                          )
                            updateMeta(uni?.id, {
                              metasConcluidas: {
                                ...uni?.metasConcluidas,
                                frequenciaSacramental: e.target.value,
                              },
                            });
                        }}
                        type={"number"}
                        value={uni?.metasConcluidas?.frequenciaSacramental}
                      />
                      {/* <p>{uni?.metasConcluidas?.frequenciaSacramental}</p> */}
                      <MdRemove
                        style={{
                          opacity:
                            parseFloat(
                              uni?.metasConcluidas?.frequenciaSacramental
                            ) > 0
                              ? ""
                              : 0.5,
                        }}
                        onClick={() => {
                          if (
                            parseFloat(
                              uni?.metasConcluidas?.frequenciaSacramental
                            ) > 0
                          )
                            updateMeta(uni?.id, {
                              metasConcluidas: {
                                ...uni?.metasConcluidas,
                                frequenciaSacramental:
                                  parseFloat(
                                    uni?.metasConcluidas?.frequenciaSacramental
                                  ) - 1,
                              },
                            });
                        }}
                      />
                    </main>
                  ) : (
                    ""
                  )}
                </div>

                <div>
                  <GaugeChart
                    id="gauge-chart4"
                    nrOfLevels={3}
                    arcPadding={0.1}
                    percent={(
                      ((uni?.metasConcluidas?.campoMissionario /
                        uni?.metas?.campoMissionario) *
                        100) /
                      100
                    ).toFixed(2)}
                  />
                  <section>
                    <img src={iconMissionario} alt="" />
                    <p>
                      Jovens enviados ao campo missionário{" "}
                      {isAdmin() ? (
                        <b>
                          (Meta: {uni?.metasConcluidas?.campoMissionario}/
                          {uni?.metas?.campoMissionario})
                        </b>
                      ) : (
                        ""
                      )}
                    </p>
                  </section>

                  {isAdmin() ? (
                    <main>
                      <AiOutlinePlus
                        onClick={() =>
                          updateMeta(uni?.id, {
                            metasConcluidas: {
                              ...uni?.metasConcluidas,
                              campoMissionario:
                                parseFloat(
                                  uni?.metasConcluidas?.campoMissionario
                                ) + 1,
                            },
                          })
                        }
                      />
                      <input
                        onChange={(e) => {
                          if (
                            e.target.value !== "" &&
                            e.target.value !== undefined &&
                            e.target.value !== null
                          )
                            updateMeta(uni?.id, {
                              metasConcluidas: {
                                ...uni?.metasConcluidas,
                                campoMissionario: e.target.value,
                              },
                            });
                        }}
                        type={"number"}
                        value={uni?.metasConcluidas?.campoMissionario}
                      />
                      {/* <p>{uni?.metasConcluidas?.campoMissionario}</p> */}
                      <MdRemove
                        style={{
                          opacity:
                            parseFloat(uni?.metasConcluidas?.campoMissionario) >
                            0
                              ? ""
                              : 0.5,
                        }}
                        onClick={() => {
                          if (
                            parseFloat(uni?.metasConcluidas?.campoMissionario) >
                            0
                          )
                            updateMeta(uni?.id, {
                              metasConcluidas: {
                                ...uni?.metasConcluidas,
                                campoMissionario:
                                  parseFloat(
                                    uni?.metasConcluidas?.campoMissionario
                                  ) - 1,
                              },
                            });
                        }}
                      />
                    </main>
                  ) : (
                    ""
                  )}
                </div>

                <div>
                  <GaugeChart
                    id="gauge-chart4"
                    nrOfLevels={3}
                    arcPadding={0.1}
                    percent={(
                      ((uni?.metasConcluidas?.nomesAoTemplo /
                        uni?.metas?.nomesAoTemplo) *
                        100) /
                      100
                    ).toFixed(2)}
                  />
                  <section>
                    <img src={iconTemplo} alt="" />
                    <p>
                      Membros enviando nomes ao Templo{" "}
                      {isAdmin() ? (
                        <b>
                          (Meta: {uni?.metasConcluidas?.nomesAoTemplo}/
                          {uni?.metas?.nomesAoTemplo})
                        </b>
                      ) : (
                        ""
                      )}
                    </p>
                  </section>

                  {isAdmin() ? (
                    <main>
                      <AiOutlinePlus
                        onClick={() =>
                          updateMeta(uni?.id, {
                            metasConcluidas: {
                              ...uni?.metasConcluidas,
                              nomesAoTemplo:
                                parseFloat(
                                  uni?.metasConcluidas?.nomesAoTemplo
                                ) + 1,
                            },
                          })
                        }
                      />
                      <input
                        onChange={(e) => {
                          if (
                            e.target.value !== "" &&
                            e.target.value !== undefined &&
                            e.target.value !== null
                          )
                            updateMeta(uni?.id, {
                              metasConcluidas: {
                                ...uni?.metasConcluidas,
                                nomesAoTemplo: e.target.value,
                              },
                            });
                        }}
                        type={"number"}
                        value={uni?.metasConcluidas?.nomesAoTemplo}
                      />
                      {/* <p>{uni?.metasConcluidas?.nomesAoTemplo}</p> */}
                      <MdRemove
                        style={{
                          opacity:
                            parseFloat(uni?.metasConcluidas?.nomesAoTemplo) > 0
                              ? ""
                              : 0.5,
                        }}
                        onClick={() => {
                          if (
                            parseFloat(uni?.metasConcluidas?.nomesAoTemplo) > 0
                          )
                            updateMeta(uni?.id, {
                              metasConcluidas: {
                                ...uni?.metasConcluidas,
                                nomesAoTemplo:
                                  parseFloat(
                                    uni?.metasConcluidas?.nomesAoTemplo
                                  ) - 1,
                              },
                            });
                        }}
                      />
                    </main>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          ) : (
            ""
          )
        )}
        {filterEstaca?.map((uni) => (
          <div className="metas__unidade">
            <p>
              {uni?.nome}
              {isAdmin() ? (
                <h5 onClick={() => setSelectUnidadeMeta(uni)}>Editar metas</h5>
              ) : (
                ""
              )}
            </p>

            <div className="metas__unidade--charts">
              <div>
                <GaugeChart
                  id="gauge-chart4"
                  nrOfLevels={3}
                  arcPadding={0.1}
                  percent={(
                    ((getTotalInfos()?.batismoConversos /
                      uni?.metas?.batismoConversos) *
                      100) /
                    100
                  ).toFixed(2)}
                />
                <section>
                  <img src={iconBatismo} alt="" />
                  <p>
                    Batismos de conversos{" "}
                    {isAdminEstaca() ? (
                      <b>
                        (Meta: {getTotalInfos()?.batismoConversos}/
                        {uni?.metas?.batismoConversos})
                      </b>
                    ) : (
                      ""
                    )}
                  </p>
                </section>
              </div>

              <div>
                <GaugeChart
                  id="gauge-chart4"
                  nrOfLevels={3}
                  arcPadding={0.1}
                  percent={(
                    ((getTotalInfos()?.frequenciaSacramental /
                      uni?.metas?.frequenciaSacramental) *
                      100) /
                    100
                  ).toFixed(2)}
                />
                <section>
                  <img src={iconFrequencia} alt="" />
                  <p>
                    Frequência na sacramental{" "}
                    {isAdminEstaca() ? (
                      <b>
                        (Meta: {getTotalInfos()?.frequenciaSacramental}/
                        {uni?.metas?.frequenciaSacramental})
                      </b>
                    ) : (
                      ""
                    )}
                  </p>
                </section>
              </div>

              <div>
                <GaugeChart
                  id="gauge-chart4"
                  nrOfLevels={3}
                  arcPadding={0.1}
                  percent={(
                    ((getTotalInfos()?.campoMissionario /
                      uni?.metas?.campoMissionario) *
                      100) /
                    100
                  ).toFixed(2)}
                />
                <section>
                  <img src={iconMissionario} alt="" />
                  <p>
                    Jovens enviados ao campo missionário{" "}
                    {isAdminEstaca() ? (
                      <b>
                        (Meta: {getTotalInfos()?.campoMissionario}/
                        {uni?.metas?.campoMissionario})
                      </b>
                    ) : (
                      ""
                    )}
                  </p>
                </section>
              </div>

              <div>
                <GaugeChart
                  id="gauge-chart4"
                  nrOfLevels={3}
                  arcPadding={0.1}
                  percent={(
                    ((getTotalInfos()?.nomesAoTemplo /
                      uni?.metas?.nomesAoTemplo) *
                      100) /
                    100
                  ).toFixed(2)}
                />
                <section>
                  <img src={iconTemplo} alt="" />
                  <p>
                    Membros enviando nomes ao Templo{" "}
                    {isAdminEstaca() ? (
                      <b>
                        (Meta: {getTotalInfos()?.nomesAoTemplo}/
                        {uni?.metas?.nomesAoTemplo})
                      </b>
                    ) : (
                      ""
                    )}
                  </p>
                </section>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

export default Metas;
