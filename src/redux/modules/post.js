import {createAction, handleActions} from "redux-actions";
import{ produce } from "immer";

//actions
const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";


//action creators
const setPost = createAction(SET_POST, (post_list) => ({post_list}));
const addPost = createAction(ADD_POST, (post) => ({post}));

//initial state

//이 리듀서가 사용할 initialState
const initialState = {
    list: [],
};


//게시글 하나에 대한 기본정보
const initialPost = {
    id: 0,
    user_info: {
        user_name : "getupngo",
        user_profile: "https://t1.daumcdn.net/cfile/blog/246BD24252FF853D15"
    },
    image_url:"https://t1.daumcdn.net/cfile/blog/246BD24252FF853D15",
    contents: "강아지네요!",
    Comment_cnt: 10,
    insert_dt: "2021-02-27 10:00:00",

};

//reducer
//불변성 유지를 위해 immer(produce) 사용

export default handleActions(
    {
        [SET_POST]: (state, action) => produce(state, (draft)=>{

        }),

        [ADD_POST]: (state, action) => produce(state, (draft)=>{

        })
    }, initialState
);

//action export하는 부분

const actioCreators ={
    setPost,
    addPost,
}

export {actioCreators};