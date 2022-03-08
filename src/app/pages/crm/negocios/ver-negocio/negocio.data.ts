const negocioData={
    id: '#NZ1214',
    pais:'Colombia',
    fechaEntrega:'2024-11-30',
    empresa:{
      name:'empresa de prueba',
      logo:'https://png.pngtree.com/template/20191014/ourlarge/pngtree-real-estate-business-logo-template-building-property-development-and-construction-logo-image_317796.jpg'
    },
    contacto:'Maria Alejandra',
    detalles:'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original.',
    presupuestos:[{
      descripcion:'Descripcion de prueba Presupuesto 1',
      fecha:'2019-12-06',
      valor:100000000
    }],
    cotizaciones:[{
      descripcion:'descripcion de prueba Cotizacion 1',
      fecha:'2020-05-31',
      valor:20000000 
    }],
    qr:'https://previews.123rf.com/images/newromashka/newromashka1309/newromashka130900017/22777706-c%C3%B3digo-qr-dice-prueba-gratuita-.jpg'
  }

const OTRAS_COTIZACIONES:any[]=[{
    id:787,
    empresa:'20', 
    descripcion:'Cotizacion 2 (maq)',
    valor:'3000000',
    fecha:'2021-02-16'
},{
    id:888,
    empresa:'20', 
    descripcion:'Cotizacion 2 (maq)',
    valor:'3000000',
    fecha:'2015-10-25'
},{
    id:9999,
    empresa:'20', 
    descripcion:'Cotizacion 2 (maq)',
    valor:'3000000',
    fecha:'2019-12-01'
},
]

const OTROS_PRESUPUESTOS:any[]=[{
    id:230,
    empresa:'20', 
    descripcion:'Presupuesto 2 (maq1)',
    valor:'3000000',
    fecha:'2021-02-16'
},{
    id:650,
    empresa:'20', 
    descripcion:'Presupuesto 2 (maq2)',
    valor:'3000000',
    fecha:'2015-10-25'
},{
    id:444,
    empresa:'20', 
    descripcion:'Presupuesto 2 (maq3)',
    valor:'3000000',
    fecha:'2019-12-01'
},
]

  export {negocioData, OTRAS_COTIZACIONES, OTROS_PRESUPUESTOS}