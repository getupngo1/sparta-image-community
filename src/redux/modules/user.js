import { createAction, handleAction, handleActions } from "redux-actions";
import { produce } from "immer";

import { setCookie, getCookie, deleteCookie } from "../../shared/Cookie";

import { auth } from "../../shared/firebase.js";
import firebase from "@firebase/app-compat";

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  onAuthStateChanged
} from "firebase/auth";

//actions
const LOG_IN = "LOG_IN";
const LOG_OUT = "LOG_OUT";
const GET_USER = "GET_USER";
const SET_USER = "SET_USER";

//action creators

// const logIn = createAction(LOG_IN, (user) => ({user}));
const logOut = createAction(LOG_OUT, (user) => ({ user }));
const getUser = createAction(GET_USER, (user) => ({ user }));
const setUser = createAction(SET_USER, (user) => ({ user }));

// initialState
const initialState = {
  user: null,
  is_login: false,
};

const user_initial = {
  user_name: "getupngo",
};

//middleware actions

const loginFB = (id, pwd) => {
  return function (dispatch, getState, { history }) {
    const auth = getAuth();
    setPersistence(auth, browserSessionPersistence)
      .then((res) => {
        // const auth = getAuth();
        signInWithEmailAndPassword(auth, id, pwd)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(user);
            dispatch(
              setUser({
                user_name: user.displayName,
                id: id,
                user_profile: "",
                uid: user.uid,
              })
            );
            history.push("/");
            // ...
            // dispatch(setUser({ id: id, user_profile: ''}))
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage, errorCode);
          });
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };
};

// const loginAction =  (user) => {
//     return function (dispatch, getState, {history}){
//         console.log(history);
//         dispatch(setUser(user));
//         history.push('/');
//     };
// };

const signupFB = (id, pwd, user_name) => {
  return function (dispatch, getState, { history }) {
    //         auth.createUserWithEmailAndPassword(id, pwd)
    //   .then((userCredential) => {
    //     // Signed in
    //     var user = userCredential.user;
    //     // ...
    //     console.log(user)
    //   })
    //   .catch((error) => {
    //     var errorCode = error.code;
    //     var errorMessage = error.message;

    //     console.log(errorCode, errorMessage)
    //     // ..
    //   });

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, id, pwd)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        console.log(user);
        updateProfile(auth.currentUser, {
          displayName: user_name,
        })
          .then(() => {
            dispatch(
              setUser({
                user_name: user_name,
                id: id,
                user_profile: "",
                uid: user.uid,
              })
            );
            history.push("/");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode, errorMessage);
        // ..
      });
  };
};

const loginCheckFB = () => {
    return function (dispatch, getState, {history}){
        const auth = getAuth();
        onAuthStateChanged(auth, (user)=>{
            if(user){
                dispatch(
                    setUser({
                        user_name: user.displayName,
                        user_profile: "",
                        id: user.email,
                        uid: user.uid, 
                    })
                );
            } else{
                dispatch(logOut());
            }
        })
    }
}

// reducer
//action 안에 type과 payload가 있는데 payload가 받아온 값

export default handleActions(
  {
    [SET_USER]: (state, action) =>
      produce(state, (draft) => {
        setCookie("is_login", "success");
        draft.user = action.payload.user;
        draft.is_login = true;
      }),
    [LOG_OUT]: (state, action) =>
      produce(state, (draft) => {
        deleteCookie("is_login");
        draft.user = null;
        draft.is_login = false;
      }),
    [GET_USER]: (state, action) => produce(state, (draft) => {}),
  },
  initialState
);

// action creator export
const actionCreators = {
  // logIn,
  logOut,
  getUser,
  // loginAction,
  signupFB,
  loginFB,
  loginCheckFB,
};

export { actionCreators };

// 기존 action creators
// const logIn = (user) => {
//     return {
//         type: LOG_IN, user
//     }
// }

// 기존 reducer
// const reducer = (state={}, action={}) => {
//     switch(action.type){
//         case "LOG_IN" : {
//             state.user = action.user;
//         }
//     }
// }
