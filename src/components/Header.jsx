import logo from '../Images/Logo_Mesto.svg';
import { Link } from 'react-router-dom';


function Header(props) {
    return (
        <header className="header page__header">
            <img src={logo} className="logo" alt="Логотип проекта Место" />
            <div className='header__info'>
                <p className='header__info-about-user'>{props.user}</p>
                <Link to={props.link} className="header__link" onClick={props.onLogout}>{props.text}</Link>
            </div>
        </header>
    );
}

export default Header;
