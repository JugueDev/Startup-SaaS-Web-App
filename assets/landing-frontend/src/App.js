import React, { Component } from 'react';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import Home from './component/home';
import About from './component/about';
import Contact from './component/contact';
import Header from './component/header';
import Footer from './component/footer';
import './App.css';

class App extends Component {
render() {
	return (
	<Router>
		<div className="App">

		<Header/>
		<Footer/>
		<div className="Content">

			<Routes>
					<Route exact path='/' element={< Home />}></Route>
					<Route exact path='/about' element={< About />}></Route>
					<Route exact path='/contact' element={< Contact />}></Route>
			</Routes>
		</div>
		</div>
	</Router>
);}}

export default App;
