const app = require('./app');
const nconf = require('./config/nconf');

app.set('port', nconf.get('port'));

app.listen(nconf.get('port'), (err) => {
    if (err) {
        console.log(`что то пошло не так`);
    }console.log(`server is listening port 8888`);
})