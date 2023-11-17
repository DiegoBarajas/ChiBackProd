const Finanzas = require('../models/finanzas.model');
const ctrl = {}

ctrl.getAll = async(req, res) => {
    const data = await Finanzas.find();

    var { hoy, restantes } = getFinanzasOfToday(data);
    var { ayer, restantes } = getFinanzasOfYesterday(restantes);
    var { proximo, restantes } = getFinanzasOfNextDays(restantes);
    var { mes, restantes } = getFinanzasOfThisMonth(restantes);
    var restantes = getFinanzasRemaining(restantes);

    const thisMonth = getFinanzasOfThisMonth( getFinanzasOfNextDays(data).restantes );

    var total = 0;
    var ingresos = 0;
    var egresos = 0;

    thisMonth.mes.map(m => {
        if(m.transaccion === "Entrada"){
            total += m.cantidad;
            ingresos += m.cantidad; 
        } 
        if(m.transaccion === "Salida"){
            total -= m.cantidad;
            egresos += m.cantidad;
        }
        
    });


    res.json({
        hoy,
        ayer,
        proximo,
        mes,
        restantes,
        total,
        ingresos,
        egresos
    })
}

ctrl.create = async(req, res) => {
    const { date, cantidad, transaccion, motivo, tipo, quien } = req.body;

    const newFinanza = await new Finanzas({
        date, 
        cantidad, 
        transaccion, 
        motivo, 
        tipo, 
        quien
    }).save();
    

    res.json(newFinanza);
}


module.exports = ctrl;

function getFinanzasOfToday(data) {
    // Obtener fecha de hoy en formato AAAA-MM-DD
    const today = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'America/Mexico_City' });

    const [{ value: month },,{ value: day },,{ value: year }] = formatter.formatToParts(today);
    const formattedDate = `${year}-${month}-${day}`;

    const hoy = [];
    const rest = [];

    data.map((d, index) => {
        if(d.date == formattedDate){
            hoy.push(d);
            return;
        }else{
            rest.push(d);
        }
    });

    return {
        hoy: hoy,
        restantes: rest
    }
}

function getFinanzasOfYesterday(data) {
    // Obtener la fecha actual en la zona horaria de la Ciudad de México
    const today = new Date();
    const yesterday = new Date(today);

    // Restar un día a la fecha de hoy
    yesterday.setDate(today.getDate() - 1);

    const formatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'America/Mexico_City' });
    const [{ value: month },,{ value: day },,{ value: year }] = formatter.formatToParts(yesterday);
    const formattedDate = `${year}-${month}-${day}`;

    const ayer = [];
    const rest = [];

    data.map(d => {
        if(d.date == formattedDate){
            ayer.push(d);
            return;
        }else{
            rest.push(d);
        }
    });

    return {
        ayer: ayer,
        restantes: rest
    }
}

function getFinanzasOfNextDays(data) {
   // Obtener la fecha actual en la zona horaria de la Ciudad de México
    const today = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'America/Mexico_City' });

    const [{ value: month },,{ value: day },,{ value: year }] = formatter.formatToParts(today);

    const fechaDeHoyEnMexicoCity = `${year}-${month}-${day}`;
    const dateToday = new Date(fechaDeHoyEnMexicoCity);


    const prox = [];
    const rest = [];

    data.map(d => {

        const fechaCompararObj = new Date(d.date);

        if(dateToday < fechaCompararObj){
            prox.push(d);
            return;
        }else{
            rest.push(d);
        }
    });

    return {
        proximo: prox,
        restantes: rest
    }
}

function getFinanzasOfThisMonth(data) {
    // Obtener la fecha actual en la zona horaria de la Ciudad de México
     const today = new Date();
     const formatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'America/Mexico_City' });
 
     const [{ value: month },,{ value: day },,{ value: year }] = formatter.formatToParts(today);
 
     const fechaDeHoyEnMexicoCity = `${year}-${month}-${day}`;
     const dateToday = new Date(fechaDeHoyEnMexicoCity);
 
 
     const mes = [];
     const rest = [];
 
     data.map(d => {
 
         const fechaCompararObj = new Date(d.date);
 
            if ( (dateToday.getFullYear() === fechaCompararObj.getFullYear()) && (dateToday.getMonth() === fechaCompararObj.getMonth()) ) {
             mes.push(d);
             return;
         }else{
             rest.push(d);
         }
     });
 
     return {
         mes: mes,
         restantes: rest
     }
 }

function getFinanzasRemaining(data){

    const meses = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
    ];

    const restantes = {};

    data.map(d => {
        const fecha = d.date.split('-');
        const atr = `${meses[ parseInt(fecha[1]) -1 ]}-${fecha[0]}`;

        if(restantes[atr] === undefined){
            restantes[atr] = [];
        }

        restantes[atr].push(d);

    });

    return restantes;
}