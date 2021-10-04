import React from "react";
import {Grid, Text, Button, Image, Input} from "../elements";
import Upload from "../shared/Upload";

import { useSelector, useDispatch } from "react-redux";
import { actioCreators as postActions } from "../redux/modules/post";


const PostWrite = (props) => {
    const dispatch = useDispatch();
    const is_login = useSelector((state)=> state.user.is_login);
    const {history} = props;

    const [contents, setContents] = React.useState("");
    const changeContents = (e) => {
        setContents(e.target.value);
    }

    const addPost = () => {
        dispatch(postActions.addPostFB(contents));
    }

        console.log(contents)
    if(!is_login){
        return(
            <Grid margin="100px 0px" padding="16px" center>
                <Text size="32px" bold>앗! 잠깐!</Text>
                <Text size="16px">로그인 후에만 글을 쓸 수 있어요!</Text>
                <Button _onClick={() => {history.replace("/");}}>로그인 하러가기</Button>
            </Grid>
        )
    }

    return(
        <React.Fragment>
            <Grid padding = "16px">
                <Text margin="0px" size="36px" bold>게시글 작성</Text>
                <Upload/>

            </Grid>

            <Grid>
                <Grid>
                    <Text margin="0px" size="24px" bold>미리보기</Text>
                </Grid>

                <Image shape="rectangle"/>
            </Grid>

            <Grid padding="16px">
                <Input _onChange={changeContents} label="게시글 내용" placeholder="게시글 작성" multiLine/>
            </Grid>

            <Grid padding="16px">
                <Button text="게시글 작성" _onClick={addPost}></Button>
            </Grid>
        </React.Fragment>
    )
}

export default PostWrite