import React from "react";
import _ from "lodash";
import { Spinner } from "../elements";


const InfinityScroll = (props) => {


    const {children, callNext, is_next, loading} = props;

    const _handleScroll = _.throttle(()=>{

        if(loading){
            return;
        }

        const {innerHeight} = window;
        const {scrollHeight} = document.body;

        //document에 documentElement가 있으면 가져오고
        //없으면 document.body.scrollTop 여기서 가져와라
        const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

        if(scrollHeight - innerHeight - scrollTop < 200){
        callNext();
        }
    },300);

    const handleScroll = React.useCallback(_handleScroll, [loading]);


    React.useEffect(()=>{
        
        if(loading){
            return;
        }

        if(is_next){
             //아래처럼 이벤트 구독
            window.addEventListener("scroll", handleScroll);
        }else{
            window.removeEventListener("scroll", handleScroll);
        }
        //클래스형에선 언마운트 함수형에선? 리턴으로 넘겨줘버림(클린업)
        //언마운트랑 비슷하게 동작
        return () => window.removeEventListener("scroll", handleScroll);
    },[is_next, loading])
       
       

    return(
        <React.Fragment>
            {props.children}
            {is_next && (<Spinner/>)}
        </React.Fragment>
    )
}

InfinityScroll.defaultProps = {
    children : null,
    callNext : () => {},
    is_next: false,
    loading: false,
}

export default InfinityScroll;