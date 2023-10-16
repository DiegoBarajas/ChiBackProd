const readXlsxFile = require('read-excel-file/node');
const color = require('colors/safe');
const fs = require('fs');
const ExcelJS = require('exceljs');
const preServicesModel = require('../models/preServices.model');
const preDevicesModel = require('../models/preDevices.model');
const ctr = {};

ctr.uploadExcel = async(req, res)=>{
    const {excel} = req.files;

    const preservicios = await preServicesModel.find();
    const predevices = await preDevicesModel.find();

    if(!excel.name.endsWith('.xlsx') && !excel.name.endsWith('.xls')){
        res.json({error: 'Error: No es un archivo de Excel'})
    }else{

            const devices = [];
            const services = [];
            const denied = [];

            readXlsxFile(excel.tempFilePath)
            .catch((error) => {
                if(error.code == 'ENOENT') console.log(color.red('El archivo '+excel.name+ ' no ha sido encontrado.\n\n'));
                else console.log(color.red('Ha ocurrido un error: '+error.code+'\n\n'));
            })
            .then((rows) => {
                if (rows == undefined) return;

                rows.map((r, index) => {
                    if(index == 0) return
                    if(r[0] == null || r[1] == null){
                        denied.push({
                            index: index,
                            producto: r[0],
                            precio: r[1]
                        });
                        return
                    }

                    const prodServ = simplifyString(r[0]);
                    const precio = r[1];
                    
                    const device = {
                        name: '',
                        keywords: []
                    }
                    
                    const service = {
                        device_id: '',
                        name: '',
                        price: 0,
                        keywords: [],
                    }

                    if( prodServ.includes('/') ){
                        denied.push({
                            index: index,
                            producto: prodServ,
                            precio: precio
                        });

                        return;
                    }

                    preservicios.map((s) => {
                        if( prodServ.includes(s.alias) ){
                            service.name = s.name;
                            service.keywords = s.keywords;
                            service.price = precio;

                            device.name = prodServ.replace( s.alias + ' ', '');
                            device.keywords = [ prodServ.replace( s.alias + ' ', '').toLowerCase() ];


                            var extra = false;

                            device.name.split(' ').map((n) => {
                                if(!extra){
                                    if(extras.includes(n)){
                                        extra = true;
                                        const partes = device.name.split(' '+n);
                                        partes[1] = ' ' + n + partes[1];
                                        
                                        device.name = partes[0];
                                        device.keywords = [ partes[0].toLowerCase() ]
                                        service.name+=partes[1];

                                        const keywords = [...service.keywords];
                                        service.keywords.map((kw) => {
                                            keywords.push(kw+partes[1].toLowerCase());
                                        })

                                        service.keywords = keywords;
                                    }
                                }

                            })                            

                            
                            devices.push(device);
                            services.push(service);


                        }
                    })

                    if( (service.name == '') || (device.name == '') ){
                        denied.push({
                            index: index,
                            producto: prodServ,
                            precio: precio
                        });
                    }
                    
                })

            devices.map((d, indx) => {
                const { name } = d;

                var band = false;
                predevices.map((p) => {
                    if(!band){
                        const { alias, keywords } = p;
                        const pos = name.search(alias);

                        if(pos > -1){
                            band = true;

                            const part1 = name.substring(0, pos);
                            const part2 = name.substring(alias.length);

                            const kws = [...keywords];
                            keywords.map((kw) => {
                                kws.push((part1+kw+part2).toLowerCase());
                            })

                            devices[indx].keywords = kws;
                        }

                    }
                })
                
            })

            }).finally(()=>{
                const archivoAEliminar = excel.tempFilePath;

                fs.unlink(archivoAEliminar, (err) => {
                if (err) {
                    console.error('Error al eliminar el archivo:', err);
                }

                });

                res.json({
                    services,
                    devices,
                    denied
                });

            })
                
    }
}

ctr.createDeniedExcel = async(req, res)=>{
    const { denied } = req.body;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Mi Hoja de Trabajo');

    worksheet.columns = [
        { header: 'Pieza', key: 'producto', width: 50 },
        { header: 'Precio', key: 'precio', width: 30 },
        { header: 'Index del Excel Original', key: 'index', width: 20 },
    ];


    denied.forEach((row) => {
        worksheet.addRow(row);
    });

    const dir = __dirname.split('src/models')[0]+'tmp/';
    const fileName = +Date.now()+'.xlsx';

    workbook.xlsx.writeFile(dir+fileName)
        .then(() => {
            res.json({
                fileName
            })
        })
        .catch((error) => {
            console.error('Error al crear el archivo Excel:', error);
        });
}

ctr.downloadDeniedExcel = async(req, res)=>{
    const filename = req.params;

    res.sendFile(filename.filename, {root: 'tmp'});

    const dir = __dirname.split('src/models')[0]+'tmp/';
    setTimeout(()=>{
        fs.unlink(dir+filename.filename, (error) => {
            if (error) {
              console.error('Error al borrar el archivo:', error);
            } else {
              console.log('Archivo borrado exitosamente.');
            }
          });            
    }, 10000);
}

module.exports = ctr;

const extras = ['CON', 'NEGRO', 'BLANCO', 'NEGRA', 'BLANCA', 'AZUL', 'VERDE', 'GRIS', 'DORADO', 'VIOLETA', 'ROJO', 'MORADO', 'ORO', 'PLATA', 'PLATEADO', 'ROSA', 'COBRE', 'CAFE', 'PERLA', 'RED', 'PINK', 'LAVANDA', 'DURAZNO', 'SALMON', 'UNICORNIO', 'DORADA', 'AURORA', 'MORADA', 'CIELO', 'ARENA', 'TURQUESA', 'PURPURA', 'NARANJA', 'HIELO', 'BLUE', 'GLOW', 'MAR', 'WHITE', 'LILA', 'CELESTE', 'ASTRO', 'TWILIGHT', 'CREPUSCULO', 'AMARILLO', 'IPS', 'OLED', 'VERSION', 'CRESPUSCULO', 'GREEN', 'SKY', 'AURA', 'PRISMA', 'ORIGINAL', 'SIN', 'LED']

simplifyString = (txt)=>{
    var texto = txt.replace(/á/g, 'a').replace(/Á/g, 'A');
    texto = texto.replace(/é/g, 'e').replace(/É/g, 'E'); 
    texto = texto.replace(/í/g, 'i').replace(/Í/g, 'I'); 
    texto = texto.replace(/ó/g, 'o').replace(/Ó/g, 'O'); 
    texto = texto.replace(/ú/g, 'u').replace(/Ú/g, 'U'); 
    texto = texto.replace(/ü/g, 'u').replace(/Ü/g, 'U'); 
    
    texto = texto.replace(/[*¡.(),\#!$%\?¿^&\;:|+*ż{}=\-_`~]/g, '');
    
    return texto.toUpperCase();
}