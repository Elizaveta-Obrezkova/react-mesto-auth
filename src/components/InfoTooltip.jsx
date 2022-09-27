import React from 'react';
import okey from '../Images/Union.svg';
import error from '../Images/Error.svg';


export default function InfoTooltip(props) {

    return (
        <div className={props.isOpen ? `popup popup_opened` : `popup` }>
            <div className={`popup__container popup__container_type_status-auth`}>
                <button type="button" className="popup__close" aria-label="Закрыть." onClick={props.onClose}></button>
                <img src={props.status? okey : error} className="popup__status-image" alt={props.status ? "Получилось" : "Ошибка"} />
                <h2 className="popup__title popup__title_type_status">{props.status? "Вы успешно зарегистрировались!" : "Что-то пошло не так!Попробуйте ещё раз." }</h2>
            </div>
        </div>
    )
}