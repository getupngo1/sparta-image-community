//Post.js
import React from "react";
import Grid from "../elements/Grid";
import Image from "../elements/image";

const Post =(props) =>{
    
    return (
        <React.Fragment>
            <Grid >
                <Grid is_flex>

                </Grid>
                <Grid padding = "16px">
                    <Image shape="circle" src={props.src}/>
                </Grid>
                <Grid>
                    <Image shape="rectangle" src ={props.src}/>
                </Grid>
                <Grid padding="16px">
                    
                </Grid>
            <div>
                user profile / user name / insert_dt 
            </div>
            <div>contents</div>
            <div>image</div>
            <div>comment cnt</div>
            </Grid>
        </React.Fragment>
    )
}

Post.defaultProps = {
    user_info: {
        user_name : "getupngo",
        user_profile: "https://t1.daumcdn.net/cfile/blog/246BD24252FF853D15"
    },
    image_url:"https://t1.daumcdn.net/cfile/blog/246BD24252FF853D15",
    contents: "강아지네요!",
    Comment_cnt: 10,
    insert_dt: "2021-02-27 10:00:00",
};

export default Post