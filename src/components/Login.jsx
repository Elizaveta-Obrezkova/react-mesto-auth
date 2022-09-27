import React from 'react';

function Login(props) {

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
    }

    function handleSubmit (e) {
        e.preventDefault();
        props.onLogin(state.email, state.password)
        .then(()=> {
            setState({
                email: '',
                password: '',
            });
        })
        .catch(err => {
            console.log(err);
        })
    }

    return (
        <div className="start-page">
            <h2 className="start-page__title">Вход</h2>
            <form name="login-form" className="start-page__form" onSubmit={handleSubmit}>
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
                <button type="submit" className="start-page__button">Войти</button>
            </form>
        </div>
    );
}

export default Login;