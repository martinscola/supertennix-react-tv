import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';

// PAGES
import Home from './pages/Home/Home';
import Sport from './pages/Sport/Sport';
import Shows from './pages/Shows/Shows';
import Show from './pages/Show/Show';
import Search from './pages/Search/Search';
import Profile from './pages/Profile/Profile';
import AuthContext from './components/AuthContext';
import VideoPlayer from './pages/VideoPlayer/VideoPlayer';
import Login from './pages/Login/Login';
import FastLogin from './pages/Login/FastLogin';
import EmailLogin from './pages/Login/EmailLogin';

import placeholderBackground
    from './resources/img/appTV/placeholder-bgTV-2.png';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = createRoot(document.getElementById('root'));
root.render(
    <HashRouter>
        <React.StrictMode>
            <Routes>
                <Route path="/" element={ <App/> }>
                    <Route path="login" element={ <Login/> }>
                        <Route index element={ <FastLogin/> }/>
                        <Route path="email" element={ <EmailLogin/> }/>
                    </Route>
                    <Route index element={
                        <AuthContext>
                            <Home
                                placeholderBackground={ placeholderBackground }/>
                        </AuthContext>
                    }
                    />
                    <Route path= "home"
                        element={
                            <AuthContext>
                                <Home
                                placeholderBackground={placeholderBackground}/>
                            </AuthContext>
                        }
                    />
                    <Route path="1"
                    element={ <AuthContext><Sport/></AuthContext> }/>
                    <Route path="2"
                        element={ <AuthContext><Sport/></AuthContext> }/>
                    <Route path="shows"
                        element={ <AuthContext><Shows/></AuthContext> }/>
                    <Route path="search"
                        element={ <AuthContext><Search/></AuthContext> }/>
                    <Route path="profile"
                        element={ <AuthContext><Profile/></AuthContext> }/>
                    <Route path="show/:showId"
                        element={ <AuthContext><Show/></AuthContext> }/>
                    <Route path="watch"
                        element={ <AuthContext><VideoPlayer/></AuthContext> }/>

                </Route>
            </Routes>
            
        </React.StrictMode>
    </HashRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();