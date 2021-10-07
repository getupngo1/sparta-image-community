import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './shared/App';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux"

import store from "./redux/configureStore";

import {analytics} from "./shared/firebase";

ReactDOM.render(
  <Provider store = {store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);


function sendToAnalytics(metric){
  const _report = JSON.stringify(metric);

  //첫번째 인수로 이벤트 이름, 두번째로 기록할 값
  analytics.logEvent("web_vital_report", _report);

  console.log(_report);
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(sendToAnalytics);
