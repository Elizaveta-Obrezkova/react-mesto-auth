import React from 'react';
import '../index.css';
import Header from './Header'
import Main from './Main'
import Footer from './Footer'
import PopupWithForm from './PopupWithForm'
import EditProfilePopup from './EditProfilePopup'
import EditAvatarPopup from './EditAvatarPopup'
import AddPlacePopup from './AddPlacePopup'
import ProtectedRoute from './ProtectedRoute'
import ImagePopup from './ImagePopup'
import Login from './Login'
import Register from './Register'
import { api } from '../utils/Api.js'
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import * as auth from '../utils/auth.js'
import { useEffect } from 'react';
import InfoTooltip from './InfoTooltip'

function App() {

    const [isEditProfilePopupOpen, openEditPopup] = React.useState(false);
    const [isAddPlacePopupOpen, openAddPopup] = React.useState(false);
    const [isEditAvatarPopupOpen, openAvatarPopup] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState({});
    const [currentUser, setCurrentUser] = React.useState({});
    const [cards, setCards] = React.useState([]);
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [userEmail, setUserEmail] = React.useState('');
    const [statusPopup, setStatusPopup] = React.useState(false);
    const [status, setStatus] = React.useState(false);
    const history = useHistory()

    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === currentUser._id);
        if (!isLiked) {
            api.likeCard(card._id)
                .then((newCard) => {
                    setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
                })
                .catch((err) => { console.log(err); });
        }
        else {
            api.deleteLike(card._id)
                .then((newCard) => {
                    setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
                })
                .catch((err) => { console.log(err); });
        }
    }

    function handleCardDelete(card) {
        api.deleteCard(card._id)
            .then(() => {
                setCards((state) => state.filter((c) => c._id !== card._id));
            })
            .catch((err) => { console.log(err); });
    }

    React.useEffect(() => {
        api.getCards()
            .then((items) => {
                setCards(items);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    React.useEffect(() => {
        api.getUserData()
            .then((values) => {
                setCurrentUser(values)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    function closeAllPopups() {
        openEditPopup(false);
        openAddPopup(false);
        openAvatarPopup(false);
        setStatusPopup(false);
        setSelectedCard({})
    }

    function handleEditAvatarClick() {
        openAvatarPopup(true)
    }

    function handleEditProfileClick() {
        openEditPopup(true)
    }

    function handleAddPlaceClick() {
        openAddPopup(true)
    }

    function handleCardClick(item) {
        setSelectedCard(item)
    }

    function handleUpdateUser(info) {
        api.editUserinfo(info)
            .then((res) => {
                setCurrentUser(res)
            })
            .then(() => {
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            })
    }

    function handleUpdateAvatar(info) {
        api.updateAvatar(info)
            .then((res) => {
                setCurrentUser(res)
            })
            .then(() => {
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            })
    }

    function handleAddPlace(info) {
        api.createCard(info)
            .then((newCard) => {
                setCards([newCard, ...cards]);
            })
            .then(() => {
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            })
    }

    function handleLogin (email, password) {
       return auth.authorize(email, password)
        .then((res) => {
            console.log(res)
            if (!res?.token) return
            setUserEmail(email);
            localStorage.setItem('jwt', res.token);
            setLoggedIn(true);
        })
        .catch(err => {
            console.log(err);
        })
    };  

    useEffect(() =>{
        console.log(loggedIn)
        if (!loggedIn) return;

        history.push('/')
    }, [loggedIn]);

    function handleRegister (email, password) {
        return auth.register(email, password)
        .then((res) => {
            console.log(res)
            if (res) { setStatus(true)}
            else {setStatus(false)}
            history.push('/sign-in')
        })
        .catch(err => {
            console.log(err);
        })
        .finally(() => {
            setStatusPopup(true)
        })
    }

    useEffect(()=> {
        function tokenCheck () {
            if (!localStorage.getItem('jwt')) return;
            const jwt = localStorage.getItem('jwt');
            auth.getContent(jwt)
            .then((res)=> {
                setUserEmail(res.email)
                setLoggedIn(true);
            })
            .then(() => {
                history.push('/')
            })
            .catch(err => {
                console.log(err);
            })
        }
        tokenCheck()
    }, [])

    function handleLogout () {
        localStorage.removeItem('jwt');
        setLoggedIn(false);
        setUserEmail('');
        history.push('/sign-in')
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="page">
                <Switch>
                    <ProtectedRoute exact path="/" loggedIn={loggedIn}>
                        <Header link="/sign-in" text="Выйти" onLogout={handleLogout} user={userEmail}/>
                        <Main
                            onEditProfile={handleEditProfileClick}
                            onAddPlace={handleAddPlaceClick}
                            onEditAvatar={handleEditAvatarClick}
                            onSelectedCard={handleCardClick}
                            cards={cards}
                            onCardLike={handleCardLike}
                            onCardDelete={handleCardDelete}
                        />
                        <Footer />
                        <EditProfilePopup
                            isOpen={isEditProfilePopupOpen}
                            onClose={closeAllPopups}
                            onUpdateUser={handleUpdateUser}
                        />
                        <AddPlacePopup
                            isOpen={isAddPlacePopupOpen}
                            onClose={closeAllPopups}
                            onAddPlace={handleAddPlace}
                        />
                        <PopupWithForm name="delete-card" title="Вы уверены?" text="Да" onClose={closeAllPopups} />
                        <EditAvatarPopup
                            isOpen={isEditAvatarPopupOpen}
                            onClose={closeAllPopups}
                            onUpdateAvatar={handleUpdateAvatar}
                        />
                        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
                    </ProtectedRoute>
                    <Route path="/sign-up">
                        <Header link="/sign-in" text="Войти"/>
                        <Register onRegister={handleRegister}/>
                        <Footer />
                        <InfoTooltip status={status} isOpen={statusPopup} onClose={closeAllPopups}/>
                    </Route>
                    <Route path="/sign-in">
                        <Header link="/sign-up" text="Регистрация"/>
                        <Login onLogin={handleLogin}/>
                        <Footer />
                        <InfoTooltip status={status} isOpen={statusPopup} onClose={closeAllPopups}/>
                    </Route>
                    <Route path="*">
                        {loggedIn && <Redirect to="/sign-in" />}
                    </Route>
                </Switch>
            </div>
        </CurrentUserContext.Provider>

    );
}

export default App;
