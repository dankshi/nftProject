const initialState = {
  loading: false,
  name: "",
  totalSupply: 0,
  cost: 0,
  error: false,
  errorMsg: "",
  isPublicSaleActive: false,
  isPrivateSaleActive: false,
  maxMintAmount: 3,
  maxPrivateMintAmount: 2,
  maxSupply: 0,
  privateSaleCost: .1,
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_SUCCESS":
      return {
        ...state,
        loading: false,
        name: action.payload.name,
        totalSupply: action.payload.totalSupply,
        cost: action.payload.cost,
        isPublicSaleActive: action.payload.isPublicSaleActive,
        isPrivateSaleActive: action.payload.isPrivateSaleActive,
        maxSupply: action.payload.maxSupply,
        error: false,
        errorMsg: "",
        maxMintAmount: action.payload.maxMintAmount,
        maxPrivateMintAmount: action.payload.maxPrivateMintAmount,
        privateSaleCost: action.payload.privateSaleCost,
      };
    case "CHECK_DATA_FAILED":
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
