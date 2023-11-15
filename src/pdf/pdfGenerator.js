const Reparations = require('../models/reparacion.model');
const Selled = require('../models/selled.model');
const User = require('../models/user.model');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const contents = require('./assets/contents.json')

const Generator = {};

const fonts = {
    regular: __dirname+'/fonts/Outfit-Regular.ttf',
    bold: __dirname+'/fonts/Outfit-Bold.ttf',
    light: __dirname+'/fonts/Outfit-Light.ttf',
    semiBold: __dirname+'/fonts/Outfit-SemiBold.ttf',
    medium: __dirname+'/fonts/Outfit-Medium.ttf',
}

const colors = {
    "dark": "#2E413C",
    "primary": "#5BDCB7",
    "light": "#F2FAF8"
}

const images = {
    'logo': __dirname+'/assets/logo.png',
    'logo_gray': __dirname+'/assets/logo_gray.png'
}

Generator.polizaDeGarantia1 = async(folio) => {
    const data = await Reparations.find({folio: folio});
    const reparation = data[0];

    if(data.length === 0) return null;

    const doc = new PDFDocument({
        size: 'A4',
        margins: {
            top: 40,
            bottom: 0,
            left: 40,
            right: 40
        }
    });

    doc.pipe(fs.createWriteStream(`${__dirname}/temp/polizaDeGarantia1_${folio}.pdf`));

    addLogos(doc);
    addHeader(doc, "Póliza de garantía", "Válida para reparaciones", folio, reparation.date, reparation.name, reparation.direction);
    
    doc
        .fontSize(12)
        .moveDown()
        .moveDown()

        // Contenido
        .font(fonts.light)
        .text(contents.poliza1_1, {align: 'justify'})
        .text(contents.poliza1_2)
    
    addFooter(doc);
    
    doc.end();
}

Generator.polizaDeGarantia2 = async(folio) => {
    const data = await Reparations.find({folio: folio});
    const reparation = data[0];

    if(data.length === 0) return null;

    const doc = new PDFDocument({
        size: 'A4',
        margins: {
            top: 40,
            bottom: 0,
            left: 40,
            right: 40
        }
    });

    doc.pipe(fs.createWriteStream(`${__dirname}/temp/polizaDeGarantia2_${folio}.pdf`));
    
    addLogos(doc);
    addHeader(doc, "Póliza de garantía", "Válida para reparaciones", folio, reparation.date, reparation.name, reparation.direction);
    
    doc
    .fontSize(12)
    .moveDown()
    .moveDown()
    
    // Contenido
    .font(fonts.light)
    .text(contents.poliza2_1, {continued: true})
    .fillColor(colors.primary)
    .font(fonts.regular)
    .text(contents.poliza2_2, {continued: true})
    .fillColor(colors.dark)
    .font(fonts.light)
    .text(contents.poliza2_3, {continued: true})
    .text('', 40)
    .moveDown()
    .text(contents.poliza2_4)
    
    addFooter(doc);
        
    doc.end();
}


Generator.ticketComprobanteServicio = async(folio) => {
    const data = await Reparations.find({folio: folio});
    const reparation = data[0];

    if(data.length === 0) return null;

    const doc = new PDFDocument({
        size: 'A4',
        margins: {
            top: 40,
            bottom: 0,
            left: 40,
            right: 40
        }
    });

    doc.pipe(fs.createWriteStream(`${__dirname}/temp/ticketComprobanteServicio_${folio}.pdf`));

    addLogos(doc);
    addHeader(doc, "Ticket de reparación", "Comprobante de contratación de servicios", folio, reparation.date, reparation.name, reparation.direction);
    
    doc
        // Contenido
        // #    Header
        .font(fonts.medium)
        .fontSize(14)
        .text("", 40, 205)
        .text("Descripción",{align: 'left'})
        .text("", 40, 205)
        .text("Garantía",{align: 'center'})
        .text("", 40, 205)
        .text("Importe a pagar",{align: 'right'})

        .strokeColor(colors.light)
        .lineWidth(2)
        .moveTo(40, 230)
        .lineTo(555, 230)
        .stroke()
        
        // #    Content
        .opacity(1)
        .font(fonts.regular)
        .fontSize(12)
        .text("", 42, 270)
        .text(capitalizarPalabras(`${reparation.device} ${reparation.service}`), {align: 'left', width: 200})
        .text("", 40, 270)
        .text("6 Meses",{align: 'center'})
        .text("", 40, 270)
        .fontSize(15)
        .font(fonts.bold)
        .text(`$${reparation.total.toLocaleString()} MXN`,{align: 'right'})

        // #    Precio
        .font(fonts.semiBold)
        .fontSize(20)
        .text("Importe total", 40, 690)
        .font(fonts.light)
        .fontSize(12)
        .text("Pago de contado")

        .font(fonts.bold)
        .fontSize(32)
        .text("", 40, 690)
        .text(`$${reparation.total.toLocaleString()} MXN`, {align: 'right'})

        addFooter(doc);
    
        doc.end();
}

Generator.ticketComprobantePago = async(folio) => {
    const data = await Reparations.find({folio: folio});
    const reparation = data[0];

    if(data.length === 0) return null;

    const doc = new PDFDocument({
        size: 'A4',
        margins: {
            top: 40,
            bottom: 0,
            left: 40,
            right: 40
        }
    });

    doc.pipe(fs.createWriteStream(`${__dirname}/temp/ticketComprobantePago_${folio}.pdf`));
    
    addLogos(doc);
    addHeader(doc, "Ticket de reparación", "Comprobante de pago", folio, reparation.date, reparation.name, reparation.direction);

    doc
        // Contenido
        // #    Header
        .font(fonts.medium)
        .fontSize(14)
        .text("", 40, 205)
        .text("Descripción",{align: 'left'})
        .text("", 40, 205)
        .text("Garantía",{align: 'center'})
        .text("", 40, 205)
        .text("Importe a pagar",{align: 'right'})
        
        .strokeColor(colors.light)
        .lineWidth(2)
        .moveTo(40, 230)
        .lineTo(555, 230)
        .stroke()
        
        // #    Content
        .opacity(1)
        .font(fonts.regular)
        .fontSize(12)
        .text("", 42, 270)
        .text(capitalizarPalabras(`${reparation.device} ${reparation.service}`), {align: 'left', width: 200})
        .text("", 40, 270)
        .text("6 Meses",{align: 'center'})
        .text("", 40, 270)
        .fontSize(15)
        .font(fonts.bold)
        .text(`$${reparation.total.toLocaleString()} MXN`,{align: 'right'})

        // #    Precio
        .font(fonts.semiBold)
        .fontSize(20)
        .text("Importe total", 40, 690)
        .font(fonts.light)
        .fontSize(12)
        .text("Pago de contado")

        .font(fonts.bold)
        .fontSize(32)
        .text("", 40, 690)
        .text(`$${reparation.total.toLocaleString()} MXN`, {align: 'right'})

        addFooter(doc);
    
        doc.end();
}

// Ventas
Generator.polizaDeGarantiaVenta1 = async(id) => {
    const selled = await Selled.findById(id)

    if(selled === null) return null;

    const doc = new PDFDocument({
        size: 'A4',
        margins: {
            top: 40,
            bottom: 0,
            left: 40,
            right: 40
        }
    });

    doc.pipe(fs.createWriteStream(`${__dirname}/temp/polizaDeGarantiaVenta1_${selled.folio}.pdf`));

    addLogos(doc);
    addHeader(doc, "Póliza de garantía", "Válida para compras", selled.folio, selled.date, selled.buyer, selled.phone);
    
    doc
        .fontSize(12)
        .moveDown()
        .moveDown()

        // Contenido
        .font(fonts.light)
        .text(contents.poliza1_1, {align: 'justify'})
        .text(contents.poliza1_2)
    
    addFooter(doc, false);
    
    doc.end();
}

Generator.polizaDeGarantiaVenta2 = async(id) => {
    const selled = await Selled.findById(id)

    if(selled === null) return null;
    const doc = new PDFDocument({
        size: 'A4',
        margins: {
            top: 40,
            bottom: 0,
            left: 40,
            right: 40
        }
    });

    doc.pipe(fs.createWriteStream(`${__dirname}/temp/polizaDeGarantiaVenta2_${selled.folio}.pdf`));
    
    addLogos(doc);
    addHeader(doc, "Póliza de garantía", "Válida para compras", selled.folio, selled.date, selled.buyer, selled.phone);
    
    doc
    .fontSize(12)
    .moveDown()
    .moveDown()
    
    // Contenido
    .font(fonts.light)
    .text(contents.poliza2_1, {continued: true})
    .fillColor(colors.primary)
    .font(fonts.regular)
    .text(contents.poliza2_2, {continued: true})
    .fillColor(colors.dark)
    .font(fonts.light)
    .text(contents.poliza2_3, {continued: true})
    .text('', 40)
    .moveDown()
    .text(contents.poliza2_4)
    
    addFooter(doc, false);
        
    doc.end();
}

Generator.ticketVenta = async(id) => {
    const selled = await Selled.findById(id)

    if(selled === null) return null;

    const doc = new PDFDocument({
        size: 'A4',
        margins: {
            top: 40,
            bottom: 0,
            left: 40,
            right: 40
        }
    });

    doc.pipe(fs.createWriteStream(`${__dirname}/temp/ticketVenta_${selled.folio}.pdf`));
    
    addLogos(doc);
    addHeader(doc, "Ticket de compra", "Comprobante de adquisición de equipo", selled.folio, selled.date, selled.buyer, selled.phone);

    doc
        // Contenido
        // #    Header
        .font(fonts.medium)
        .fontSize(14)
        .text("", 40, 205)
        .text("Descripción",{align: 'left'})
        .text("", 40, 205)
        .text("Garantía",{align: 'center'})
        .text("", 40, 205)
        .text("Importe a pagar",{align: 'right'})
        
        .strokeColor(colors.light)
        .lineWidth(2)
        .moveTo(40, 230)
        .lineTo(555, 230)
        .stroke()
        
        // #    Content
        .opacity(1)
        .font(fonts.regular)
        .fontSize(12)
        .text("", 42, 270)
        .text(capitalizarPalabras(selled.device), {align: 'left', width: 200})
        .text("", 40, 270)
        .text("1 Año",{align: 'center'})
        .text("", 40, 270)
        .fontSize(15)
        .font(fonts.bold)
        .text(`$${selled.price.toLocaleString()} MXN`,{align: 'right'})

        // #    Precio
        .font(fonts.semiBold)
        .fontSize(20)
        .text("Importe total", 40, 690)
        .font(fonts.light)
        .fontSize(12)
        .text("Pago de contado")

        .font(fonts.bold)
        .fontSize(32)
        .text("", 40, 690)
        .text(`$${selled.price.toLocaleString()} MXN`, {align: 'right'})

        addFooter(doc, false);
    
        doc.end();
}

Generator.ticketRecoleccion = async(folio) => {
    const data = await Reparations.find({folio: folio});
    const reparation = data[0];

    if(data.length === 0) return null;

    const repartidor = await User.findById(reparation.id_repartidor);
    
    const doc = new PDFDocument({
        size: [ (8.5 * 72), (5.5 * 72) ],
        //size: "A4",
        margins: {
            top: 35,
            bottom: 0,
            left: 50,
            right: 50
        }
    });

    doc.pipe(fs.createWriteStream(`${__dirname}/temp/ticketRecoleccion_${folio}.pdf`));
    
    doc
        // Logo a color de chipsi
        .image(images.logo, 500, 36, {
                fit: [41, 41],
                align: 'center',
                valign: 'center'
        })

        // Marca de agua
        doc.image(images.logo_gray, 290, 130, {
            fit: [350, 350], 
            align: 'right',
            valign: 'bottom',
            opacity: 0.5
        })

        // Titulo del documento
        .font(fonts.bold)
        .fontSize(22)
        .fillColor(colors.dark)
        
        // Subtitulo del documento
        .text('Recolección de dispositivo')
        .font(fonts.light)
        .fontSize(12)
        .text('¡Gracias por reparar con chipsi! Por tu seguridad, ', {continued: true})
        .font(fonts.medium)
        .text("conserva este ticket")
        .font(fonts.light)
        .text("para la entrega de tu dispositivo.")

        // Contenido
        // #    Dispositivo
        .font(fonts.bold)
        .fontSize(16)
        .text("Dispositivo", 50, 125)
        .fontSize(14)
        .font(fonts.regular)
        .text(capitalizarPalabras(reparation.device))

        // #    Monto total
        .font(fonts.bold)
        .fontSize(16)
        .text("Dispositivo", (8.5 * 72)/2, 125)
        .fontSize(14)
        .font(fonts.regular)
        .text(`$${reparation.total.toLocaleString()} MXN`)


        // #    Falla
        .font(fonts.bold)
        .fontSize(16)
        .text("Servicio", 50, 190)
        .fontSize(14)
        .font(fonts.regular)
        .text(capitalizarPalabras(reparation.service))

        // #    Anticipo
        .font(fonts.bold)
        .fontSize(16)
        .text("Anticipo", (8.5 * 72)/2, 190)
        .fontSize(14)
        .font(fonts.regular)
        .text(`$${reparation.abono.toLocaleString()} MXN`)


        // #    Folio
        .font(fonts.bold)
        .fontSize(16)
        .text("", 50, 255)
        .text("Núm. Folio ", {continued: true})
        .fillColor(colors.primary)
        .text("(Clave)")
        .fillColor(colors.dark)
        .fontSize(9)
        .font(fonts.light)
        .text("El repartidor solicitará este número. Consérvalo.")
        .fontSize(14)
        .font(fonts.regular)
        .text(reparation.folio)

        // #    Nombre del repartidor
        .font(fonts.bold)
        .fontSize(16)
        .text("Nombre del repartidor", (8.5 * 72)/2, 255)
        .fontSize(14)
        .font(fonts.regular)
        .text(repartidor.name)

        // Footer
        .font(fonts.bold)
        .fontSize(14)
        .text("Donde encontrarnos", 50, 330)
        .fontSize(12)
        .font(fonts.light)
        .text("C. Josefa Ortiz de Domínguez 999, Las Huertas, 44739 Guadalajara, Jal.")

        doc.end();
}

// Funciones de generacion de contenido para el documento
function addLogos(doc){
    doc
        // Logo a color de chipsi
        .image(images.logo, 514, 36, {
            fit: [41, 41],
            align: 'center',
            valign: 'center'
        })

        // Marca de agua
        .image(images.logo_gray, 290, 545, {
            fit: [400, 400], 
            align: 'right',
            valign: 'bottom',
            opacity: 0.5
        })
}

function addHeader(doc, title, subtitle, folio, date, name, direction ){
    doc
        // Titulo del documento
        .font(fonts.bold)
        .fontSize(28)
        .fillColor(colors.dark)

        // Subtitulo del documento
        .text(title)
        .font(fonts.light)
        .fontSize(12)
        .text(subtitle)

        // Folio
        .font(fonts.semiBold)
        .fontSize(16)
        .text('Núm. Folio: ', 40, 110)
        .font(fonts.regular)
        .text(folio, 126, 110)

        // Fecha
        .font(fonts.semiBold)
        .text(getDate(date), 40, 133)

        // Informacion del cliente
        .font(fonts.regular)
        .fontSize(16)
        .text('', 40, 110)
        .text(truncateText(name, 23), {align: 'right'})

        // Fecha
        .font(fonts.light)
        .text(truncateText(direction, 24), {align: 'right'})

}

function addFooter(doc, reestrenar=true){
    doc
        // Footer
        .fontSize(12)
        .fillColor(colors.primary)
        .font(fonts.bold)
        .text('', 40, 775)
        .text('chipsi.mx', {link: 'chipsi.vercel.app'})
        .font(fonts.regular)
        .fillColor(colors.dark)
        .text(reestrenar ? '¡A reestrenar!' : '¡A estrenar!')
}

module.exports = Generator;

const getDate = (d) => {
    const date = new Date(d);
    const months = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ];
    const fecha = `${String(date.getDate()).padStart(2,'0')} de ${months[date.getMonth()]} de ${date.getFullYear()}`
    
    return(fecha);
}

function truncateText(text, maxSize) {
    if (text.length > maxSize) {
      return text.substring(0, maxSize - 3) + '...';
    }

    return text;
}

function capitalizarPalabras(frase) {
    frase = frase.toLowerCase();

    return frase.replace(/\b\w/g, function (letra) {
      return letra.toUpperCase();
    });
}