import React from "react";
import styled from "styled-components";
import { Text, Grid } from "../elements";

const Input = (props) => {
  const { label, placeholder, _onChange, type, multiLine, value, is_submit, onSubmit } = props;

  // const styles = {label: label, placeholder: placeholder, _onChange: _onChange}
  if (multiLine) {
    return (
      <Grid>
        {label && <Text margin="0px">{label}</Text>}
        <ElTextarea
          rows={10}
          value={value}
          placeholder={placeholder}
          onChange={_onChange}
        ></ElTextarea>
      </Grid>
    );
  }

  return (
    <React.Fragment>
      <Grid>
        {label && <Text margin="0px">{label}</Text>}
        {/* value유무가 아니라 is_submit유무로 따로 빼줘야 
        댓글 내용 초기화가 적용 왜? */}
        {is_submit ? (
          <ElInput
            type={type}
            placeholder={placeholder}
            onChange={_onChange}
            value={value}
            //엔터키 눌러서 실행
            onKeyPress={(e) => {
              if(e.key === "Enter"){
                onSubmit(e);
              }
            }}
          />
        ) : (
          <ElInput 
          type={type} 
          placeholder={placeholder} 
          onChange={_onChange} />
        )}
      </Grid>
    </React.Fragment>
  );
};

Input.defaultProps = {
  multiLine: false,
  label: false,
  placeholder: "텍스트를 입력해주세요",
  _onChange: () => {},
  type: "text",
  value: "",
  is_submit: false,
  onSubmit: () => {},
};

const ElTextarea = styled.textarea`
  border: 1px solid #212121;
  width: 100%;
  padding: 12px 4px;
  box-sizing: border-box;
`;

const ElInput = styled.input`
  border: 1px solid #212121;
  width: 100%;
  padding: 12px 4px;
  box-sizing: border-box;
`;

export default Input;
