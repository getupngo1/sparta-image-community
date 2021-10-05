//PostList.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";

import Post from "../components/Post"
import { Grid } from "../elements";
import { actionCreators as postActions } from "../redux/modules/post";
import InfinityScroll from "../shared/InfinityScroll";


const PostList =(props) =>{

    const dispatch = useDispatch();
    const post_list = useSelector((state) => state.post.list);
    const user_info = useSelector((state) => state.user.user);
    const is_loading = useSelector((state) => state.post.is_loading);
    const paging = useSelector((state) => state.post.paging);

    const {history} = props;

    console.log(post_list)

    React.useEffect(()=>{
        //여기에 if문 없이 dispatch부분만 있으면
        //게시물이 순서대로 나오지 않게 됨(전체가 리렌더링 되기때문)
        if(post_list.length < 2){
            dispatch(postActions.getPostFB());
        }
        
    },[]);

    return (
        <React.Fragment>
            <Grid bg={"#EFF6FF"} padding="20px 0px">
            {/* <Post/> */}
            <InfinityScroll
                callNext={() => {
                    dispatch(postActions.getPostFB(paging.next));
                }}
                is_next = {paging.next? true : false}
                //is_loading 이 false일 때 callNext가 실행 됨
                loading = {is_loading}
            >
                {post_list.map((p,idx)=>{
                    //로그인 안한상태에는 user_info 가 null이기 때문에
                    //옵셔널체이닝 사용 ?로
                    if(p.user_info.user_id === user_info?.uid){
                    return (
                        <Grid margin="10px 0px"bg="#ffffff" key={p.id} _onClick={() => {history.push(`/post/${p.id}`)}}>
                            <Post key={p.id} {...p} is_me/>
                        </Grid>
                    )
                    }else{
                        return (
                            <Grid _onClick={() => {history.push(`/post/${p.id}`)}}>
                            <Post key={p.id} {...p} />
                            </Grid>
                        )
                    }

                    
                })}
                
            </InfinityScroll>
            </Grid>
            {/* 실험용 추가로드버튼 */}
            {/* <button onClick={()=>{
                    dispatch(postActions.getPostFB(paging.next));
                }}>추가로드</button> */}
        </React.Fragment>
    )
}

export default PostList