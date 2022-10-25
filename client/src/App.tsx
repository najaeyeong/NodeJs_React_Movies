
import './App.css';
import {BrowserRouter as Router,Routes,Route,} from "react-router-dom"
import Detail from './routers/page/Detail';
import Home from "./routers/page/home"
import { ReviewForm } from './routers/page/ReviewForm';
import Register from './routers/page/Register';
import Login from "./routers/page/Login"
import TopBar from './component/topBar';

function App() {


  return (
    <div className="App">
      <Router>

          <Routes>

            <Route path={"/home/movie"} element={<Home/>}/>
            <Route path={"/home/movie/:id"} element={<Detail/>}/>
            <Route path={"/home/movie/review"} element={<ReviewForm/>}/>

            <Route path={"/register"} element={<Register/>}/>
            <Route path={"/login"} element={<Login/>}/>
          </Routes>
      </Router>
    </div> 
  );
}

export default App;
