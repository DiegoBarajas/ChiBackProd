const app = require('./app');
require('./database');

async function main(){
    await app.listen(app.get('port'));
    console.clear();

    console.log('El servidor se lanzó en el puerto '+app.get('port'));
}

main();