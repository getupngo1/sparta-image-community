import React from "react";
import {Badge} from "@material-ui/core";
import NotificationsIcon from '@mui/icons-material/Notifications';

import { realtime } from "../shared/firebase";
import { useSelector } from "react-redux";

const NotiBadge = (props) => {

    const [is_read, setIsRead] = React.useState(false);
    const user_id = useSelector(state => state.user.user.uid);

    const notiCheck = () => {
        const notiDB = realtime.ref(`noti/${user_id}`);
        notiDB.update({read: true});

        //notiCheck안에서 props의 _onClick이 일어나도록 해줌
        props._onClick();
    };

    React.useEffect(()=> {
        const notiDB = realtime.ref(`noti/${user_id}`);

        notiDB.on("value", (snapshot) => {
            //값이 바뀌었을 때 ~를 동작해달라 라는게 여기 들어감
            console.log(snapshot.val());

            setIsRead(snapshot.val().read);
            //여기 왜 false일때 불이 들어오나 useState에서 준 기본값과 같으면
            //불 들어오는 것?
        });
        //항상 구독하면 구독 해제 즉 return을 해줘야 함
        return () => notiDB.off();
    }, [])
    
    return(
        <React.Fragment>
            <Badge color="secondary" variant="dot" invisible={is_read} onClick={notiCheck}>
                <NotificationsIcon></NotificationsIcon>
            </Badge>
        </React.Fragment>
    )
}

NotiBadge.defaultProps = {
    _onClick: () => {}
}

export default NotiBadge;