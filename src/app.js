const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const fileUpload = require("express-fileupload");
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary').v2;
          

//Middlewares
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(fileUpload({
  useTempFiles: true,
  limits: {fileSize: 50 * 2024 * 1024}
}));

cloudinary.config({ 
  cloud_name: 'dzajaf1mv', 
  api_key: '414987381238598', 
  api_secret: '9gnctjNZf5N3hGdIkwKej-4w5-A' 
});

//Asignacion de servidor
app.set('port', process.env.PORT || 4000);

app.get('/', (req, res)=>{
  res.send('Backend');
})

//Rutas
app.use('/api/histories', require('./routes/historial.route'));
app.use('/api/intents', require('./routes/intents.route'));
app.use('/api/devices', require('./routes/devices.route'));
app.use('/api/services', require('./routes/services.route'));
app.use('/api/preservices', require('./routes/preServices.route'));
app.use('/api/predevices', require('./routes/preDevices.route'));
app.use('/api/array', require('./routes/array.route'));
app.use('/api/cotizacion', require('./routes/cotizaciones.route'));
app.use('/api/reparations', require('./routes/reparaciones.route'));
app.use('/api/users', require('./routes/user.route'));
app.use('/api/inventory', require('./routes/inventory.route'));
app.use('/api/selled', require('./routes/selled.route'));


app.use('/file/excel', require('./routes/excel.route'));

module.exports = app;