export const BASE_URL= "https://auth.nomoreparties.co"

function request ({url, method = 'POST', token, data, error400 = 'что-то пошло не так', error401 = 'что-то пошло не так'}) {
return fetch(`${BASE_URL}${url}`, {
    method,
    headers:{
        "Content-Type": "application/json",
        ...!!token && {'Authorization' : `Bearer ${token}`}
    },
    ...!!data &&  {body: JSON.stringify(data)},
})
.then(res =>{
    if (res.ok){
    return res.json();
}
if (res.status === 400){
    return Promise.reject(`${res.status} - ${error400}`);
}
if (res.status === 401){
    return Promise.reject(`${res.status} - ${error401}`);
}   
return Promise.reject(`Что-то пошло не так: ${res.status}`);
});
}  

export function register (email, password) {
     return request({
        url: '/signup',
        data: {"password": password, 
        "email": email},
        error400: 'некорректно заполнено одно из полей'
     })
}

export function authorize (email, password) {
    return request({
        url: '/signin',
        data: {"password": password, 
        "email": email},
        error400: 'не передано одно из полей',
        error401: 'пользователь с email не найден'
     })
}

export function getContent (token) {
    return request({
        url: '/users/me',
        method: 'GET',
        token,
        error400: 'Токен не передан или передан не в том формате',
        error401: 'Переданный токен некорректен'
     })
}