const Jwtstrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');

const nconf = require('../config/nconf');

const optionts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: nconf.get('jwt')
}

module.exports = function (passport) {
    passport.use(
        new Jwtstrategy(optionts, async (payload, done) => {
            try{
                const user = await User.findById(payload.userId).select('email id');
                
                if (user){
                    done(null, user) 
                } else {
                    done(null, false)
                }
            } catch (e) {
                console.log(e)
            }

        })
    )
}