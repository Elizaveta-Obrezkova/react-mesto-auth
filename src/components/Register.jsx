import { Link } from 'react-router-dom';
import React from 'react';


function Register(props) {

    const [state, setState] = React.useState({
        email: '',
        password: '',
    });

    function handleChange (e) {
        const {name, value} = e.target;

        setState(old =>({
            ...old,
            [name]: value,
        }));
    };

    function handelSubmit (e) {
        e.preventDefault();

        props.onRegister(state.email, state.password)
        .then(()=> {
            setState({
                email: '',
                password: '',
            }); 
        })
        .catch(err => {
            console.log(err);
        })
    };

    return (
        <div className="start-page">
            <h2 className="start-page__title">Регистрация</h2>
            <form name="login-form" className="start-page__form" onSubmit={handelSubmit}>
                <div className="input-container">
                    <input id="email" name="email" type="email" placeholder='Email' value={state.email} onChange={handleChange}
                        className="start-page__input" required minLength="5" maxLength="40" />
                    <span id="error-name-owner" className="error-message"></span>
                </div>
                <div className="input-container">
                    <input id="password" name="password" type="password" placeholder='Пароль' value={state.password} onChange={handleChange}
                        className="start-page__input" required minLength="6" maxLength="20" />
                    <span id="error-about-owner" className="error-message"></span>
                </div>
                <button type="submit" className="start-page__button">Зарегистрироваться</button>
            </form>
            <Link to="/sign-in" className="start-page__link">Уже зарегистрированы? Войти</Link>
        </div>
    );
}

export default Register;