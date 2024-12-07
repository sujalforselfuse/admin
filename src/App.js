import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './pages/Navbar';
import Product from './pages/Product';
import Category from './pages/Category';
import Orders from './pages/Orders';
import Coupon from './pages/Coupon';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Reset from './pages/Reset';
import EmployLogin from './pages/EmployLogin';
import PrivateRoute from './PrivateRoute';
import PrivateRouteEmploy from './PrivateRouteEmploy';
import EmployRegister from './pages/EmployRegister';
import Employ from './pages/Employ';
import Sample from './pages/Sample';
import SpecificOrder from './pages/SpecificOrder';
import Visitor from './pages/Visitor';
import Drafts from './pages/Drafts';
import Abandoned from './pages/Abandoned';
function App() {
  return (
    <Router>
      <div className="flex">
        <Navbar />
        <div className="flex-grow h-screen overflow-auto">
          <Routes>
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/addproduct" element={<PrivateRoute><Product /></PrivateRoute>} />
            <Route path="/addcategory" element={<PrivateRoute><Category /></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
            <Route path="/order/:orderId" element={<PrivateRoute><SpecificOrder /></PrivateRoute>} />
            <Route path="/generatecoupon" element={<PrivateRoute><Coupon /></PrivateRoute>} />
            <Route path="/createemployee" element={<PrivateRoute><EmployRegister /></PrivateRoute>} />
            <Route path="/visitor" element={<PrivateRoute><Visitor /></PrivateRoute>} />
            <Route path="/drafts" element={<PrivateRoute><Drafts /></PrivateRoute>} />
            <Route path="/abandoned" element={<PrivateRoute><Abandoned /></PrivateRoute>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />            
            <Route path="/sample" element={<Sample />} />
            <Route path="/reset" element={<Reset />}></Route>
            <Route path="/employeelogin" element={<EmployLogin/>}></Route>       
            <Route path="/employ" element={<PrivateRouteEmploy><Employ/></PrivateRouteEmploy>}></Route>       
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
