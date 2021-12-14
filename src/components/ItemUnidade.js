import React, { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { FiEdit2 } from "react-icons/fi";
import { VscAdd } from "react-icons/vsc";
import { BiLogOut } from "react-icons/bi";
import { HiOutlineUser } from "react-icons/hi";
import { BsCheck2, BsTrash } from "react-icons/bs";
import { TiArrowSortedDown } from "react-icons/ti";
import { SiFacebook, SiTwitter, SiWhatsapp } from "react-icons/si";
import { db } from "../services/Firebase";

function ItemUnidade(props) {
  const [updateUnidadeM, setUpdateUnidadeM] = useState(false);
  const [INPUTnomeUnidadeUpdate, setINPUTnomeUnidadeUpdate] = useState("");
  const [INPUTemailUnidadeUpdate, setINPUTemailUnidadeUpdate] = useState("");

  useEffect(() => {
    setINPUTnomeUnidadeUpdate(props.uni.nome);
    setINPUTemailUnidadeUpdate(props.uni.email);
  }, [props.uni]);

  const updateUnidade = (e, uni) => {
    e.preventDefault();

    const objUnidade = {
      nome: INPUTnomeUnidadeUpdate,
      email: INPUTemailUnidadeUpdate,
    };

    db.collection("unidades").doc(uni.id).update(objUnidade);

    setINPUTnomeUnidadeUpdate(uni.nome);
    setINPUTemailUnidadeUpdate(uni.email);
    setUpdateUnidadeM(false);
  };

  return (
    <div>
      {updateUnidadeM ? (
        <>
          <input
            placeholder="Novo para unidade"
            style={{ background: "rgba(229, 231, 232, 0.89)" }}
            value={INPUTnomeUnidadeUpdate}
            onChange={(e) => setINPUTnomeUnidadeUpdate(e.target.value)}
          />

          <input
            style={{
              marginTop: "10px",
              background: "rgba(229, 231, 232, 0.89)",
            }}
            placeholder="Novo email para unidade"
            value={INPUTemailUnidadeUpdate}
            onChange={(e) => setINPUTemailUnidadeUpdate(e.target.value)}
          />
        </>
      ) : (
        <>
          <p>{props.uni.nome}</p>
          <a
            rel="noreferrer"
            target="_blank"
            href={`mailto:${props.uni.email}`}
          >
            {props.uni.email}
          </a>
        </>
      )}

      <button
        style={{ right: 40 }}
        onClick={() => setUpdateUnidadeM(!updateUnidadeM)}
      >
        {INPUTnomeUnidadeUpdate !== props.uni.nome ||
        INPUTemailUnidadeUpdate !== props.uni.email ? (
          <BsCheck2 onClick={(e) => updateUnidade(e, props.uni)} />
        ) : updateUnidadeM ? (
          <VscAdd
            style={{
              transform: updateUnidadeM ? "rotate(45deg)" : "",
            }}
          />
        ) : (
          <FiEdit2 />
        )}
      </button>
      <button onClick={() => props.removeUnidade(props.uni)}>
        <BsTrash />
      </button>
    </div>
  );
}

export default ItemUnidade;
