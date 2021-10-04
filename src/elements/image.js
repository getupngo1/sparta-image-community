//PostList.js
import React from "react";
import styled from "styled-components";


const Image =(props) =>{
    
    const {shape, src, size} = props;

    const styles = {
        src: src,
        size: size,
    }


    if(shape === "circle"){
        return(
            <ImageCircle {...styles}></ImageCircle>
        )
    } 

    if(shape === "rectangle"){
        return (
            <AspectOutter>
                <AspectInner {...styles}/>
            </AspectOutter>
        )
    }


    return (
        <React.Fragment>
            <ImageDefault {...styles}></ImageDefault>
        </React.Fragment>
    )
}

Image.defaultProps = {
    shape: "circle",
    src: "https://t1.daumcdn.net/cfile/blog/246BD24252FF853D15",
    size: 36,
}

const ImageDefault = styled.div`
     --size: ${(props) => props.size}px;
    width: var(--size);
    height: var(--size);

    background-image: url("${(props)=>props.src}");
    background-size: cover;
`;

const AspectOutter = styled.div`
    width: 100%;
    min-width: 250px;

`;

const AspectInner = styled.div`
    position: relative;
    padding-top: 75%;
    overflow: hidden;
    background-image: url("${(props) => props.src}");
    background-size: cover;
`;

const ImageCircle = styled.div`
    --size: ${(props) => props.size}px;
    width: var(--size);
    height: var(--size);
    border-radius: var(--size);

    background-image: url("${(props)=>props.src}");
    background-size: cover;
    margin: 4px;
`;

export default Image;