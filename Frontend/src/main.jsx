
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './store/index.js'
import { Provider } from 'react-redux'
import { ToastContainer} from 'react-toastify';




ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
     <Provider store={store}>
    <App />
    <ToastContainer
    autoClose={3000}
    hideProgressBar={false}/>
  </Provider>
    </Router>
)