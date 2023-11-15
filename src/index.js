const colors = require('colors/safe')
const app = require('./app');
require('./database');

async function main(){
    await app.listen(app.get('port'));
    console.clear();

    console.log(colors.cyan('El servidor se lanzó en el puerto '+app.get('port')));
}

main();