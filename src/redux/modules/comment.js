import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore } from "../../shared/firebase";
import "moment";
import moment from "moment";

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
              list.push({...doc.data(), id: doc.id});
          })
          dispatch(setComment(post_id, list));
      }).catch(err => {
          window.alert("댓글 정보를 가져올 수 없습니다!", err);
      });
  };
};

export default handleActions(
  {
    [SET_COMMENT]: (state, action) => produce(state, (draft) => {
        // let data = {[post_id]: com_list, ... } 이상태로 저장
        draft.list[action.payload.post_id] = action.payload.comment_list;
    }),
    [ADD_COMMENT]: (state, action) => produce(state, (draft) => {}),
    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading;
      }),
  },
  initialState
);

const actionCreators = {
  getCommentFB,
  setComment,
  addComment,
};

export { actionCreators };
