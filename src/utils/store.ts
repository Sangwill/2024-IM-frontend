import { legacy_createStore as createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const isBrowser = typeof(window) !== "undefined";

const defaultState = {
    webSocket: null,
    userId: 0,
    csrf: "",
    imgMap: {} as { [key: number]: any },
    username: "",
    token: "",
    message: {} as { [key: number]: any },
    memberMap: {} as { [key: number]: any },
};

const persistConfig = {
    key: "root",
    storage,
};

const reducer = (state = defaultState, action: any) => {
      switch(action.type) {
          case "socketConnect":
              return {...state, webSocket: action.data};
          case "getId":
              return {...state, userId: action.data};
          case "csrf":
              return {...state, csrf: action.data};
          case "addImage":
            const  {key, value} = action.data;
            state.imgMap[key] = value;
            return { ...state, imgMap: state.imgMap };
          case "getUsername":
              return { ...state, username: action.data };
          case "getToken":
              return { ...state, token: action.data };
              case 'addMessage':
                const id = action.message.key;
                const msg = action.message.value;
                state.message[id] = msg;
              return { ...state, message: state.message };
          case "addMember":
                const  {mem_key, mem_value} = action.data;
                state.memberMap[mem_key] = mem_value;
                return { ...state, memberMap: state.memberMap };
          default:
              return state;
      }
};

const persistedReducer = persistReducer(persistConfig, reducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);
export {store, persistor};