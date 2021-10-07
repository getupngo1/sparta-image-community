//Post.js
import React from "react";
// import Grid from "../elements/Grid";
// import Image from "../elements/image";
// import Text from "../elements/Text";

import { history } from "../redux/configureStore";

import { Button, Grid, Image, Text } from "../elements";

const Post = React.memo((props)=>{
  console.log('hi! im post component!')
  return (
    <React.Fragment>
      <Grid>
        <Grid is_flex padding="16px">
          <Grid is_flex width="auto">
            <Image shape="circle" src={props.src} />
            <Text bold>{props.user_info.user_name}</Text>
          </Grid>
          <Grid is_flex width="auto">
            <Text>{props.insert_dt}</Text>
            {props.is_me && (
              <Button width="auto" margin="4px" padding="4px" _onClick={()=>{
                  history.push(`/write/${props.id}`);
              }}>
                수정
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid padding="16px">
          <Text>{props.contents}</Text>
        </Grid> 
        <Grid>
          <Image shape="rectangle" src={props.image_url} />
        </Grid>
        <Grid padding="16px">
          <Text margin="0px" bold>
            댓글 {props.comment_cnt}개
          </Text>
        </Grid>
      </Grid>
    </React.Fragment>
  );
});

// const Post = (props) => {
//   console.log(props);

//   console.log('hi! im post component!')
//   return (
//     <React.Fragment>
//       <Grid>
//         <Grid is_flex padding="16px">
//           <Grid is_flex width="auto">
//             <Image shape="circle" src={props.src} />
//             <Text bold>{props.user_info.user_name}</Text>
//           </Grid>
//           <Grid is_flex width="auto">
//             <Text>{props.insert_dt}</Text>
//             {props.is_me && (
//               <Button width="auto" margin="4px" padding="4px" _onClick={()=>{
//                   history.push(`/write/${props.id}`);
//               }}>
//                 수정
//               </Button>
//             )}
//           </Grid>
//         </Grid>
//         <Grid padding="16px">
//           <Text>{props.contents}</Text>
//         </Grid>
//         <Grid>
//           <Image shape="rectangle" src={props.image_url} />
//         </Grid>
//         <Grid padding="16px">
//           <Text margin="0px" bold>
//             댓글 {props.comment_cnt}개
//           </Text>
//         </Grid>
//       </Grid>
//     </React.Fragment>
//   );
// };

Post.defaultProps = {
  user_info: {
    user_name: "getupngo",
    user_profile: "https://t1.daumcdn.net/cfile/blog/246BD24252FF853D15",
  },
  image_url: "https://t1.daumcdn.net/cfile/blog/246BD24252FF853D15",
  contents: "강아지네요!",
  Comment_cnt: 10,
  insert_dt: "2021-02-27 10:00:00",
  is_me: false,
};

export default Post;
