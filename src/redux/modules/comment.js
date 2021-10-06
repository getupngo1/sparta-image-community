import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, realtime } from "../../shared/firebase";
import "moment";
import moment from "moment";

import firebase from "@firebase/app-compat";
import { actionCreators as postActions } from "./post";

const SET_COMMENT = "SET_COMMENT";
const ADD_COMMENT = "ADD_COMMENT";

const LOADING = "LOADING";

const setComment = createAction(SET_COMMENT, (post_id, comment_list) => ({
  post_id,
  comment_list,
}));
const addComment = createAction(ADD_COMMENT, (post_id, comment) => ({
  post_id,
  comment,
}));

const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

const initialState = {
  list: {},
  is_loading: false,
};

const addCommentFB = (post_id, contents) => {
  return function (dispatch, getState, { history }) {
      
    const commentDB = firestore.collection("comment");
    
    const user_info = getState().user.user;

     let comment = {
      post_id: post_id,
      user_id: user_info.uid,
      user_name: user_info.user_name,
      //user_propfile: user_info.user_propfile,
      contents: contents,
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };

    
    
    commentDB.add(comment).then((doc) => {
      const postDB = firestore.collection("post");
      const post = getState().post.list.find((l) => l.id === post_id);
      //firestore에서 increment안의 숫자만큼 현재 값에서 더해줌
      const increment = firebase.firestore.FieldValue.increment(1);
      // comment_cnt +1 이라고 생각하면 됨

      //그대로 comment 보내면 id가없기 때문에
      comment={...comment, id: doc.id};
      postDB
        .doc(post_id)
        .update({ comment_cnt: increment })
        .then((_post) => {
            
          dispatch(addComment(post_id, comment));

          if (post) {
            //리덕스만 고치는 부분이기 때문에 FB안붙임
            //묵시적 형변환 고려해서 parseInt 사용
            dispatch(
              postActions.editPost(post_id, {
                comment_cnt: parseInt(post.comment_cnt) + 1,
              })
            );
           
            //참조 가져오는 것 (collection가져오는 것과 비슷)
            const notiDB = realtime.ref(`noti/${post.user_info.user_id}`);
            notiDB.update({read: false});

          }
          //dispatch()
        });
    });
  };
};

const getCommentFB = (post_id = null) => {
  return function (dispatch, getState, { history }) {
    //post_id 가 없는 상태로 들어오면 안되기 때문에
    //막아둠
    if (!post_id) {
      return;
    }
    const commentDB = firestore.collection("comment");

    //파이어스토어 post_id와 현재 가져온 post_id비교
    commentDB
      .where("post_id", "==", post_id)
      .orderBy("insert_dt", "desc")
      .get()
      .then((docs) => {
        let list = [];
        docs.forEach((doc) => {
          list.push({ ...doc.data(), id: doc.id });
        });
        dispatch(setComment(post_id, list));
      })
      .catch((err) => {
        window.alert("댓글 정보를 가져올 수 없습니다!", err);
      });
  };
};

export default handleActions(
  {
    [SET_COMMENT]: (state, action) =>
      produce(state, (draft) => {
        // let data = {[post_id]: com_list, ... } 이상태로 저장
        draft.list[action.payload.post_id] = action.payload.comment_list;
      }),
    [ADD_COMMENT]: (state, action) => produce(state, (draft) => {
        //역순 정렬 하기위해 unshift사용 push는 맨 뒤에 붙음
        draft.list[action.payload.post_id].unshift(action.payload.comment);
    }),
    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading;
      }),
  },
  initialState
);

const actionCreators = {
  getCommentFB,
  addCommentFB,
  setComment,
  addComment,
};

export { actionCreators };
