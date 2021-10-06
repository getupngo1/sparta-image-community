import React, { useState } from "react";
import {Grid, Text, Image} from "../elements";
import Card from "../components/Card";

import { realtime } from "../shared/firebase";
import { useSelector } from "react-redux";


const Notification = (props) => {
    const user = useSelector(state => state.user.user);
    const [noti, setNoti] = React.useState([]);

    React.useEffect(()=>{
        if(!user){
            return;
        }

        const notiDB = realtime.ref(`noti/${user.uid}/list`);
        //리얼타임DB에는 그냥 orderby가 없음. 
        // orderByChild사용 또한 desc는 사용 불가
        // 내림차순을 지원하지 않음
        const _noti = notiDB.orderByChild("insert_dt");

        //한번만 가지고 올거고 구독하지 않기 때문에 on 대신 once사용
        _noti.once("value", snapshot =>{
            if(snapshot.exists()){
                let _data = snapshot.val();

                // console.log(_data)
                //_data의 키값들만 들고와서 정렬해주기 위해 object.keys 사용
                //+.reverse로 역순 정렬
                let _noti_list = Object.keys(_data).reverse().map(s => {
                    //키만 가져가면 안되니 다시 값도 같이 넣어줌map통해서
                    return _data[s];
                })
                console.log(_noti_list);
                setNoti(_noti_list);
            }
        })

        
        //유저정보 업데이트 되면 다시 들어오게 하기위해 []안에 넣음
    }, [user])

    // let noti = [
    //     {user_name: "aaaaa", post_id: "post1", image_url:"",},
    // ];

    return(
        <React.Fragment>
            <Grid padding = "16px" bg="#EFF6FF">
                {noti.map((n, idx)=>{
                    return(
                        //한 게시물에 여러 댓글을달면 같은 key가 생겨버림
                        //순서값을 줘버리면 해결
                        <Card key={`noti_${idx}`} {...n}/>
                    )
                })}
            </Grid>
        </React.Fragment>
    )
}

export default Notification;