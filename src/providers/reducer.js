export const initialState = {
  user: null,
};

export const actionTypes = {
  SET_USER: "SET_USER",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
};

export default reducer;

export const organizations = [
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
    color: "#EBCA49",
    organizacao: "Primária",
  },
  {
    color: "#E8237D",
    organizacao: "Moças",
  },
  {
    color: "#EB5757",
    organizacao: "Rapazes e Moças",
  },
  {
    color: "#348feb",
    organizacao: "Rapazes",
  },
  {
    color: "#f7a41e",
    organizacao: "Instituto",
  },
  {
    color: "#4955e3",
    organizacao: "Seminário",
  },
  {
    color: "#b2e349",
    organizacao: "JAS",
  },
  {
    color: "#db3fe0",
    organizacao: "MAS",
  },
  {
    color: "#2f5c9c",
    organizacao: "Bispado",
  },
  {
    color: "#9c2f61",
    organizacao: "Conselhos",
  },
  {
    color: "#fc6a21",
    organizacao: "Quórum de Elderes",
  },
  {
    color: "#ffd429",
    organizacao: "Obra Missionária",
  },
  {
    color: "#74d624",
    organizacao: "Serviços Familiares",
  },
  {
    color: "#53EBFF",
    organizacao: "Escola Dominical",
  },
];
