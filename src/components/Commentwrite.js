import React from "react";
import { Button, Grid,  Input,} from "../elements";

const CommentWrite = (props) => {
    
    return (
        <React.Fragment>
            <Grid padding="16px" is_flex>
                <Input placeholder="댓글내용을 입력해주세요 :)"/>
                <Button width="50px" margin="0px 2px 0px 2px">작성</Button>
            </Grid>
        </React.Fragment>
    )
}

export default CommentWrite;