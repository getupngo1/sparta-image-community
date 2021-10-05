import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, storage } from "../../shared/firebase";
import "moment";
import moment from "moment";

import { actionCreators as imageActions } from "./image";

//actions
const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";

//action creators
const setPost = createAction(SET_POST, (post_list) => ({ post_list }));
const addPost = createAction(ADD_POST, (post) => ({ post }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({
  post_id,
  post,
}));

//initial state

//이 리듀서가 사용할 initialState
const initialState = {
  list: [],
};

//게시글 하나에 대한 기본정보
const initialPost = {
  // id: 0,
  // user_info: {
  //   user_name: "getupngo",
  //   user_profile: "https://t1.daumcdn.net/cfile/blog/246BD24252FF853D15",
  // },
  image_url: "https://t1.daumcdn.net/cfile/blog/246BD24252FF853D15",
  contents: "",
  Comment_cnt: 0,
  insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
  // insert_dt: "2021-02-27 10:00:00",
};

//middlewares

//혹시라도 값이 안들어오면 튕겨내기 위해 null이랑 빈값줌
const editPostFB = (post_id = null, post = {}) => {
  return function (dispatch, getState, { history }) {
    //아이디가 없으면 뒤가 모두 에러뜨기때문에 여기서 잡아줌
    if (!post_id) {
      window.alert("게시물 정보가 없어요!");
      return;
    }
    const _image = getState().image.preview;

    const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);
    const _post = getState().post.list[_post_idx];

    console.log(_post);

    const postDB = firestore.collection("post");

    //현재 프리뷰의 이미지와 가져온 이미지가 같다면
    //사진은 바꾸지 않은 것이기 때문에
    if (_image === _post.image_url) {
      postDB
        .doc(post_id)
        .update(post)
        .then((doc) => {
          dispatch(editPost(post_id, { ...post }));
          history.replace("/");
        });

      return;
    } else {
      const user_id = getState().user.user.uid;
      const _upload = storage
        .ref(`images/${user_id}_${new Date().getTime()}`)
        .putString(_image, "data_url");

      _upload.then((snapshot) => {
        snapshot.ref
          .getDownloadURL()
          .then((url) => {
            console.log(url);

            return url;
          })
          .then((url) => {
            postDB
              .doc(post_id)
              .update({ ...post, image_url: url })
              .then((doc) => {
                dispatch(editPost(post_id, { ...post, image_url: url }));
                history.replace("/");
              });
          })
          .catch((err) => {
            window.alert("앗 이미지 업로드에 문제가 있어요!");
            console.log("앗! 이미지 업로드에 문제가 있어요!", err);
          });
      });
    }
  };
};

const addPostFB = (contents = "") => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");
    console.log(postDB);
    //getState로 스토어의 정보 가져옴
    const _user = getState().user.user;

    const user_info = {
      user_name: _user.user_name,
      user_id: _user.uid,
      user_profile: _user.user_profile,
    };

    const _post = {
      ...initialPost,
      contents: contents,
      //불려오는 시점 생각해서 여기서 한번 더 넣는 것
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };

    const _image = getState().image.preview;
    console.log(_image);
    console.log(typeof _image);

    const _upload = storage
      .ref(`images/${user_info.user_id}_${new Date().getTime()}`)
      .putString(_image, "data_url");

    _upload.then((snapshot) => {
      snapshot.ref
        .getDownloadURL()
        .then((url) => {
          console.log(url);

          return url;
        })
        .then((url) => {
          // console.log({...user_info, ..._post});
          // return;

          // ~~.add({추가할정보})
          //then((doc)=>{})  doc이란 이름으로 추가된 데이터 받아옴
          postDB
            .add({ ...user_info, ..._post, image_url: url })
            .then((doc) => {
              //모양새 바꿔서 넣어줘야하니 dispatch전에 생각하기
              //리덕스데이터랑 파이어스토어 데이터랑 지금 형태가 다름
              let post = { user_info, ..._post, id: doc.id, image_url: url };
              dispatch(addPost(post));
              history.replace("/");

              dispatch(imageActions.setPreview(null));
            })
            .catch((err) => {
              window.alert("앗! 포스트 작성에 문제가 있어요!");
              console.log("post 작성에 실패했어요!", err);
            });
        })
        .catch((err) => {
          window.alert("앗 이미지 업로드에 문제가 있어요!");
          console.log("앗! 이미지 업로드에 문제가 있어요!", err);
        });
    });
  };
};

const getPostFB = () => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");

    //쿼리 날려서 게시물 정렬
    let query = postDB.orderBy("insert_dt","desc").limit(2);

    query.get().then(docs => {
      let post_list = [];
      docs.forEach((doc) => {
        // console.log(doc.id, doc.data());

        //고수용 데이터 양식 맞추는 법
        let _post = doc.data();
        //키값들을 배열로 만들어 줌
        //['comment_cnt', 'contents', ...] 이런 식으로
        //배열이 되면 내장함수를 사용할 수 있음
        //reduce라는 내장함수는 누산 -> 연산한것을 또 연산 순서대로
        //1번째 인자(acc)는 누산된 값, 2번째 인자(cur)은 현재값

        let post = Object.keys(_post).reduce(
          (acc, cur) => {
            //만약 cur(키값)에 user_ 가 포함이 되면(-1이아니면 포함이라는 뜻)
            if (cur.indexOf("user_") !== -1) {
              return {
                ...acc,
                user_info: { ...acc.user_info, [cur]: _post[cur] },
              };
            }
            //3-3심화21분 다시보기
            return { ...acc, [cur]: _post[cur] };
          },
          { id: doc.id, user_info: {} }
        );
        post_list.push(post);

        // 하수용 데이터 양식 맞추는 법
        // let _post = {
        //     id: doc.id,
        //     ...doc.data()
        // };

        // let post = {
        //     id: doc.id,
        //     user_info: {
        //         user_name: _post.user_name,
        //         user_profile: _post.user_profile,
        //         user_id: _post.user_id,
        //     },
        //     image_url: _post.image_url,
        //     contents: _post.contents,
        //     Comment_cnt: _post.Comment_cnt,
        //     insert_dt: _post.insert_dt,
        // };
        // post_list.push(post);
      });
      console.log(post_list);

      dispatch(setPost(post_list));
    });

    return;
    postDB.get().then((docs) => {
      let post_list = [];
      docs.forEach((doc) => {
        // console.log(doc.id, doc.data());

        //고수용 데이터 양식 맞추는 법
        let _post = doc.data();
        //키값들을 배열로 만들어 줌
        //['comment_cnt', 'contents', ...] 이런 식으로
        //배열이 되면 내장함수를 사용할 수 있음
        //reduce라는 내장함수는 누산 -> 연산한것을 또 연산 순서대로
        //1번째 인자(acc)는 누산된 값, 2번째 인자(cur)은 현재값

        let post = Object.keys(_post).reduce(
          (acc, cur) => {
            //만약 cur(키값)에 user_ 가 포함이 되면(-1이아니면 포함이라는 뜻)
            if (cur.indexOf("user_") !== -1) {
              return {
                ...acc,
                user_info: { ...acc.user_info, [cur]: _post[cur] },
              };
            }
            //3-3심화21분 다시보기
            return { ...acc, [cur]: _post[cur] };
          },
          { id: doc.id, user_info: {} }
        );
        post_list.push(post);

        // 하수용 데이터 양식 맞추는 법
        // let _post = {
        //     id: doc.id,
        //     ...doc.data()
        // };

        // let post = {
        //     id: doc.id,
        //     user_info: {
        //         user_name: _post.user_name,
        //         user_profile: _post.user_profile,
        //         user_id: _post.user_id,
        //     },
        //     image_url: _post.image_url,
        //     contents: _post.contents,
        //     Comment_cnt: _post.Comment_cnt,
        //     insert_dt: _post.insert_dt,
        // };
        // post_list.push(post);
      });
      console.log(post_list);

      dispatch(setPost(post_list));
    });
  };
};

//reducer
//action 안에 type과 payload가 있는데 payload가 받아온 값
//불변성 유지를 위해 immer(produce) 사용

export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list = action.payload.post_list;
      }),

    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        //여기서 .push가 아닌 unshift를 쓰는 이유는 배열의
        //앞이 아닌 뒤로 넣어야 하기 때문에
        //.push 는 배열위 앞에 붙음
        draft.list.unshift(action.payload.post);
      }),
    [EDIT_POST]: (state, action) =>
      produce(state, (draft) => {
        //findIndex로 조건에 맞는 것을 가져옴
        //가져온 아이디와 현재 리덕스에 있는 list에 있는 아이디가 동일하면
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);

        //이미지는 냅두고 게시글만 바꿀 수도 있게 스프레드문법을 씀
        draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
      }),
  },
  initialState
);

//action export하는 부분

const actionCreators = {
  setPost,
  addPost,
  editPost,
  getPostFB,
  addPostFB,
  editPostFB,
};

export { actionCreators };
