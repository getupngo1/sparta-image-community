import React from "react";
import { Button, Grid,  Input,} from "../elements";

import { actionCreators as commentActions } from "../redux/modules/comment";
import { useDispatch, useSelector } from "react-redux";

const CommentWrite = (props) => {
    const dispatch = useDispatch();

    const [comment_text, setCommentText] = React.useState();

    const {post_id} = props;
    const onChange = (e) => {
        setCommentText(e.target.value);
    }

   

    const write = () => {
        
        //여기서 텍스트 날림
        dispatch(commentActions.addCommentFB(post_id, comment_text));
        setCommentText("");
    }
    
    return (
        <React.Fragment>
            <Grid padding="16px" is_flex>
                {/* 여기 인풋에 벨류를 물고가게 한 이유는 작성 눌렀는데 텍스트 있으면
                안좋으니 텍스트 날리기 위해서 가져가는 것 */}
                <Input 
                placeholder="댓글내용을 입력해주세요 :)" 
                _onChange={onChange} 
                value={comment_text} 
                //엔터키 누르는 이름을 onSubmit으로 한거임 헷갈리지 말기
                onSubmit={write}
                is_submit/>
                <Button width="50px" margin="0px 2px 0px 2px" _onClick={write}>작성</Button>
            </Grid>
        </React.Fragment>
    )
}

export default CommentWrite;