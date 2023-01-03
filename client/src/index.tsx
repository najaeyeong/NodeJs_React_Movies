import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// import {Provider} from 'react-redux';
// import store from './store/store'

//store data 사용방법 
// const dispatch = useDispatch()
// dispatch({type:'searchDataSlice/search',data:2})
// dispatch(searchDataSlice.actions.update(2))
  // const searchDate = useSelector(state=>{
  //   return state.search.value;
  // })



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
  //<React.StrictMode>
<>
      <App />

      
      {/* <script type="text/javascript" src="https://code.jquery.com/jquery-1.12.4.min.js" ></script>
      
      <script type="text/javascript" src="https://cdn.iamport.kr/js/iamport.payment-1.1.8.js"></script> */}
</>
  //</React.StrictMode>

);

