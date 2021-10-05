import React from "react";
import Post from "../components/Post";
import CommentList from "../components/CommentList";
import CommentWrite from "../components/Commentwrite";

import { useDispatch, useSelector } from "react-redux";
import { firestore } from "../shared/firebase";

import { actionCreators as postActions } from "../redux/modules/post";



const PostDetail = (props) => {
    const dispatch = useDispatch();
    const id = props.match.params.id;
    console.log(id);
    
    const user_info = useSelector((state) => state.user.user);

    const post_list = useSelector(store => store.post.list);
    const post_idx = post_list.findIndex(p => p.id === id);
    const post = post_list[post_idx];

    // const post_data = post_list[post_idx];
    // const [post, setPost] = React.useState(post_data? post_data : null);

    
    console.log(post)

    React.useEffect(()=>{

        if(post){
            return;
        }

        dispatch(postActions.getOnePostFB(id));
        // const postDB = firestore.collection("post");
        // postDB.doc(id).get().then(doc => {
        //     console.log(doc);
        //     console.log(doc.data());

        //     let _post = doc.data();
        //     let post = Object.keys(_post).reduce(
        //         (acc, cur) => {
        //           //만약 cur(키값)에 user_ 가 포함이 되면(-1이아니면 포함이라는 뜻)
        //           if (cur.indexOf("user_") !== -1) {
        //             return {
        //               ...acc,
        //               user_info: { ...acc.user_info, [cur]: _post[cur] },
        //             };
        //           }
        //           //3-3심화21분 다시보기
        //           return { ...acc, [cur]: _post[cur] };
        //         },
        //         { id: doc.id, user_info: {} }
        //       );

        //       setPost(post);
        // })



    }, []);

    

    return (
        <React.Fragment>
            {post && <Post {...post} is_me={post.user_info.user_id === user_info?.uid}/>}
            {/* 여기서 게시글의 id를 props로 넘겨줌 */}
            <CommentWrite post_id = {id}/>
            <CommentList post_id = {id}/>
        </React.Fragment>
    )
}

export default PostDetail;