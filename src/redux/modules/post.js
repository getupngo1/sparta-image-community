import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore } from "../../shared/firebase";
import "moment";
import moment from "moment";


//actions
const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";

//action creators
const setPost = createAction(SET_POST, (post_list) => ({ post_list }));
const addPost = createAction(ADD_POST, (post) => ({ post }));

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

const addPostFB = (contents="",) => {
  return function (dispatch, getState, {history}){
    const postDB = firestore.collection("post");
    //getState로 스토어의 정보 가져옴(?)
    const _user = getState().user.user;

    const user_info = {
      user_name: _user.user_name,
      user_id: _user.uid,
      user_profile: _user.user_profile
    };

    const _post = {
      ...initialPost,
      contents: contents,
      //불려오는 시점 생각해서 여기서 한번 더 넣는 것 (?)
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };


    // console.log({...user_info, ..._post});
    // return;
   
    // ~~.add({추가할정보})
    //then((doc)=>{})  doc이란 이름으로 추가된 데이터 받아옴
    postDB.add({...user_info, ..._post}).then((doc) =>{

      //모양새 바꿔서 넣어줘야하니 dispatch전에 생각하기
      //리덕스데이터랑 파이어스토어 데이터랑 지금 형태가 다름
      let post = {user_info, ..._post, id:doc.id};
      dispatch(addPost(post));
      history.replace("/");
    }).catch((err) => {
      console.log("post 작성에 실패했어요!", err);
    }); 
  }
}

const getPostFB = () => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");

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

    [ADD_POST]: (state, action) => produce(state, (draft) => {
      //여기서 .push가 아닌 unshift를 쓰는 이유는 배열의
      //앞이 아닌 뒤로 넣어야 하기 때문에
      //.push 는 배열위 앞에 붙음
      draft.list.unshift(action.payload.post);
    }),
  },
  initialState
);

//action export하는 부분

const actionCreators = {
  setPost,
  addPost,
  getPostFB,
  addPostFB,
};

export { actionCreators };
