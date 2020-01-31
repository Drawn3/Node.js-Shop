const keys = require('../keys')
module.exports = function(email,name){
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: `${name}, Ваш аккаунт успешно создан`,
        html: `
             <h1>Добро пожаловать в наш магазин</h1>
             <p>Вы успешно создали аккаунт ${email}</p>
             < /hr>
             <a href="${keys.BASE_URL}">Перейти в магазин</a>
        `
    }
}