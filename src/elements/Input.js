import React from "react";
import styled from "styled-components";
import { Text, Grid } from "../elements";

const Input = (props) => {

    const{label, placeholder, _onChange} = props;

    // const styles = {label: label, placeholder: placeholder, _onChange: _onChange}

    return(
        <React.Fragment>
            <Grid>
            <Text margin="0px">{label}</Text>
            <ElInput placeholder={placeholder} onChange={_onChange}/>
            </Grid>
        </React.Fragment>
    )
}

Input.defaultProps = {
    label: '텍스트',
    placeholder: '텍스트를 입력해주세요',
    _onChange: () => {}

}

const ElInput = styled.input`
    border: 1px solid #212121;
    width: 100%;
    padding: 12px 4px;
    box-sizing :border-box;

`;




export default Input;