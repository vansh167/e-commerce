import Navbar from './components/navbar/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Cart from './pages/Cart'
import LoginSignUp from './pages/LoginSignUp'
import ShopCategory from './pages/ShopCategory'
import Footer from './components/footer/Footer'
import men_banner from './components/Assets/banner_mens.png'
import kid_banner from './components/Assets/banner_kids.png'
import women_banner from './components/Assets/banner_women.png'
import Checkout from './components/cartItems/CheckOut'
import Payment from './components/cartItems/Payment'
import TrackOrderPage from './components/UserProfile/TrackOrderPage'
import Setting from './components/UserProfile/Setting'
import OrderSuccessPage from './components/cartItems/OrderSuccess'
import Admin from './pages/Admin'
import NewCollections from './components/newCollection/NewCollections'
import AboutEcommerce from './LearnMore/LearnMore'

// import Profile from './MyProfile/MyProfile'




function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Shop />} />
          <Route path='/mens' element={<ShopCategory banner={men_banner} category="men" />} />
          <Route path='/womens' element={<ShopCategory banner={women_banner} category="women" />} />
          <Route path='/kids' element={<ShopCategory banner={kid_banner} category="kids" />} />
          <Route path='product' element={<Product />}>
            <Route path=':productId' element={<Product />} /></Route>
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/payment' element={<Payment />} />
          <Route path='/login' element={<LoginSignUp />} />
          <Route path="/orders" element={<TrackOrderPage />} />
          <Route path="/Learn" element={<AboutEcommerce/>} />
          <Route path="/settings" element={<Setting/>} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/new-collections" element={<NewCollections/>} />

          
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
