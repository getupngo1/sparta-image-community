//PostList.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";

import Post from "../components/Post"
import { actionCreators as postActions } from "../redux/modules/post";


const PostList =(props) =>{

    const dispatch = useDispatch();
    const post_list = useSelector((state) => state.post.list);

    console.log(post_list)

    React.useEffect(()=>{
        //여기에 if문 없이 dispatch부분만 있으면
        //게시물이 순서대로 나오지 않게 됨(전체가 리렌더링 되기때문)
        if(post_list.length === 0){
            dispatch(postActions.getPostFB());
        }
        
    },[]);

    return (
        <React.Fragment>
            {/* <Post/> */}
            {post_list.map((p,idx)=>{
                return <Post key={p.id} {...p}/>
            })}
        </React.Fragment>
    )
}

export default PostList