const getCookie = (name) => {
    //맨 앞부분도 아래 스플릿을 적용하기 위해 앞에; 추가
    //원래 "user_id=perl; user_pwd=pppp"으로 오는것을
    // "; user_id=perl; user_pwd=pppp" 이렇게 오게해서
    //아래 필터(스플릿) 양식을 맞춰줌
    //split해주는 곳을 보면 중간에 스페이스도 있기때문에
    //아래처럼 아예 스페이스까지 맞춰줘야함
    let value = "; "+document.cookie;
    
    
    // aa=xx; user_id=aaa; 를 아래처럼 자르면 
    // [aa=xx / aaa; abbb=sssss;] 등으로 들어오게 됨(3번째는 더 온다면)
    // aa=xx부분은 버리게되고 ;앞의 부분만 가져오면 바로 값임 === aaa
    // 따라서 aaa포함 뒤부분을 ;로 한번 더 스플릿해주고 첫 번째 것을 가져오면 됨
    // pop과 shift를 통해 - pop은 배열의 마지막부분을 떼어 옴,
    // shift는 배열의 첫 번째 부분을 떼어 옴
    let parts = value.split(`; ${name}=`); 

    //let b = parts.pop()이라하면 위 예시 배열에서
    //aaa; abbb=sssss; 이렇게 됨
    //위 상태에서 스플릿해주고 shift를 쓰면
    //aaa만 남게 됨
    if(parts.length === 2){
        return parts.pop().split(";").shift();
    }


};
const setCookie = (name, value, exp = 5) => {

    let date = new Date();
    date.setTime(date.getTime() + exp*24*60*60*1000);

    document.cookie = `${name}=${value}; expires=${date.toUTCString()}`;
};

const deleteCookie = (name) =>{
    let date = new Date("2020-01-01").toUTCString();

    console.log(date);

    //user_id를 받아오면 ? =;는 왜들어감
    document.cookie = name+"=; expires="+date;

};

export {getCookie, setCookie, deleteCookie}