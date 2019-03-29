const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nconf = require('../config/nconf');
const errorHandler = require('../utils/errorHandler');
module.exports.login = async function (req, res) {

    const candidate =  await User.findOne({email: req.body.email});

    if (candidate) {
        // пользователь найден, сверяем пароли
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);
        if (passwordResult) {
            //Генерируем токен, если пароли совпали
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, nconf.get('jwt'), {expiresIn: 3600});
            res.status(200).json({token: `Bearer ${token}`});
        } else {
            //выдаем ошибку, если пароли не совпали
            res.status(401).json({
                message: 'Введенны пароль не верен, попробуйте снова'
            })
        }
    } else {
        //пользователь не найден, выдаем ошибку
        res.status(404).json({
            message: 'Пользователь с таким имел не найден'
        });
    }
}

module.exports.register = async function (req, res) {
    const candidate = await User.findOne({email: req.body.email});

    if (candidate){
        //если имейл существует
        res.status(409).json({
            message: "Такой имейл уже используется"
        })
    } else {
        //если имейл не существет
        const salt = bcrypt.genSaltSync(10);
        const password = req.body.password;
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        });
        try {
            //сохраняем юзера в бд
            res.status(201).json(user);
            await user.save();
        } catch (e) {
            errorHandler(res, e)
        }
        
    }
}