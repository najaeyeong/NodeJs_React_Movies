
import './App.css';
import {BrowserRouter as Router,Routes,Route,} from "react-router-dom"
import Detail from './routers/page/Detail';
import Home from "./routers/page/home"
import { ReviewForm } from './routers/page/ReviewForm';
import Register from './routers/page/Register';
import Login from "./routers/page/Login"


//redux
import {Provider} from 'react-redux';
import store from './store/store'
import { persistStore } from "redux-persist"; // load
import { PersistGate } from "redux-persist/integration/react"; // load

function App() {
  const persistor = persistStore(store); // 정의
  return (
 
    <div className="App">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
              <Routes>
                  <Route path={"/"} element={<Home/>}/>
                  <Route path={"/home/movie"} element={<Home/>}/>
                  <Route path={"/home/movie/:id"} element={<Detail/>}/>
                  <Route path={"/home/movie/review"} element={<ReviewForm/>}/>
                  <Route path={"/register"} element={<Register/>}/>
                  <Route path={"/login"} element={<Login/>}/>

              </Routes>
          </Router>
          </PersistGate>
      </Provider>
    </div> 

  );
}

export default App;
