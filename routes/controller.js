const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = express.Router();
const fs = require('fs-extra')
const moment = require('moment')
var mysql      = require('mysql');
var md5 = require('md5')
const multer = require('multer');
// local
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '',
//   database : 'lechon_db'
// });
// actual
var connection = mysql.createConnection({
  host     : 'bz5a14bynjzyfxh2d8je-mysql.services.clever-cloud.com',
  user     : 'usnf8gshygvcflnl',
  password : 'awfz5NAGMeHs2oECnR81',
  database : 'bz5a14bynjzyfxh2d8je'
});

router.use(cors()); //Cross-Origin Resource Sharing (CORS)
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
router.get('/',(req,res)=>{
  res.send('Hello Worlds!')
})
// LOGIN 
router.get('/login/:email/:password',(req,res)=>{ 
    let email =req.params.email.toUpperCase()
    let password = md5(req.params.password.toUpperCase())


    let sql =`SELECT * FROM tbl_account WHERE email = '${email}' AND status = 1 `;
    connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        if(results.length > 0 ){
            if(results[0].password == password){
                res.send(results)
            }else{
                res.send([])
            }
        }else{
            res.send([])
        }
    });

})
//SIGNUP / UPDATE 
router.post('/addEditAccount' ,(req,res)=>{ 
  let sql = ''
  if(req.body.method==0){
    sql=`insert into tbl_account
    ( fullname , email , password , shipping_id , address , type )
    values
    ('${req.body.fullname.toUpperCase()}', '${req.body.email.toUpperCase()}' , '${md5(req.body.password.toUpperCase())}' , ${req.body.shipping_id} ,'${req.body.address}' ,'USER' )
    `
  }else{
    sql =`update tbl_account set 
    fullname='${req.body.fullname.toUpperCase()}',
    password='${md5(req.body.password.toUpperCase())}' , 
    shipping_id=${req.body.shipping_id},
    address='${req.body.address}' ,
    status = ${req.body.status} , 
    type='${req.body.type}' where acc_id=${req.body.acc_id} `
  }
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    res.send(results)
  });
})
router.get('/loadAccounts' ,(req,res)=>{
  let sql ='select * from tbl_account '
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    res.send(results)
  });
})
router.get('/getAccount/:email/:pass' ,(req,res)=>{
  let email = req.params.email
  let pass = req.params.pass

  let sql =`SELECT * FROM tbl_accoubt WHERE email='${email.toUpperCase()}' and pass='${md5(pass.toUpperCase())}'`
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    res.send(results)
  });
})
// UPLOAD PRODUCTS 
let path_product='./uploads/products'
const product_storage = multer.diskStorage(
    {
      destination:function(req,file,cb){
        console.log(req)
        fs.mkdirSync(path_product , {recursive:true})
        cb( null ,path_product )
      },
      filename: function (req, file, cb) {
        cb(null,file.originalname)
      } 
    }
  )
   
  var upload_product = multer({ storage: product_storage })
  router.post('/uploadProducts', upload_product.single("file"), (req, res)=>{
    // console.log(req.file)
    // console.log('success')
    res.send('success')
  })
// Load Products
router.get('/loadProducts' ,(req,res)=>{ 
  let sql =`SELECT * FROM tbl_products`
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    res.send(results)
  });

})
// INSERT UPDATE PRODUCTS
router.post('/addEditProducts' , (req,res)=>{ 
  console.log(req.body )
  let sql =``
  if(req.body.method == 0 ){
    sql =`INSERT INTO tbl_products 
    (img_product , product_name , product_price , category , ratings )
    VALUES
    ('${req.body.img_product}' , '${req.body.product_name}',${parseFloat(req.body.product_price).toFixed(2)} , ${req.body.category},${req.body.ratings})
    `
  }else{
    sql =`UPDATE tbl_products SET img_product='${req.body.img_product}' , product_name='${req.body.product_name}' , product_price=${parseFloat(req.body.product_price).toFixed(2)},
    status=${req.body.status} , category=${req.body.category},ratings=${req.body.ratings} WHERE product_id = ${req.body.product_id}`
  }

  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    res.send(results)
  });
})

router.get('/deleteProducts/:id' ,(req,res)=>{ 
  let id = req.params.id
  let sql = `delete from tbl_products where product_id=${id}`
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    res.send(results)
  });
})


// SHIPPING FEES 
router.post('/insertUpdateFees',(req,res)=>{ 
  let sql=''
  if(req.body.method == 0 ){
    sql = `insert into tbl_shipping 
    ( municipality , fees )
    VALUES
    ('${req.body.municipality}' , ${req.body.fees})
    
    `
  }else{
    sql=`update tbl_shipping SET municipality='${req.body.municipality}' , fees = ${req.body.fees} WHERE shipping_id =${req.body.shipping_id}`
  }
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    res.send(results)
  });
})

router.get('/loadShippingFees' ,(req,res)=>{ 
  let sql='select * from tbl_shipping'
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    res.send(results)
  });
})

router.get('/deleteShippingFees/:id',(req,res)=>{
  let id = req.params.id
  let sql = `delete from tbl_shipping where shipping_id=${id}`
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    res.send(results)
  });
})

router.get('/getShippingFee/:id',(req,res)=>{ 
  let id = req.params.id
  let sql = `select * from tbl_shipping WHERE shipping_id = ${id}`
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    res.send(results)
  });
})
// ADD TO CART 
router.get('/loadCart/:accid',(req,res)=>{ 
  let accid = req.params.accid
  let sql =`select * from tbl_cart A INNER JOIN tbl_products B 
  ON A.product_id = B.product_id WHERE A.account_id = ${accid}
  `
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    res.send(results)
  });
})
router.post('/addToCart' , (req,res)=>{ 
  let sql =`INSERT INTO tbl_cart 
  (account_id , product_id , quantity , total_price)
  VALUES
  (${req.body.account} , ${req.body.data.product_id} , ${req.body.data.quantity} , ${req.body.data.total_price})`
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    res.send(results)
  });
})
router.post('/deleteToCart/:id',(req,res)=>{ 
  let id = req.params.id
  let sql =`DELETE FROM tbl_cart  WHERE cart_id=${id}`
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    res.send(results)
  });
})

// LIST OF ORDERS 
router.get('/loadOrders/:id' , (req,res)=> { 
  let id = req.params.id 
  let sql =''
  if(id > -1 ){
     sql = `SELECT A.* , B.* , A.created_at AS 'DateCreated' from tbl_all_invoice A  
     INNER JOIN tbl_account B ON A.account_id = B.acc_id
     WHERE A.account_id = ${id}`

  }else{
     sql = `SELECT A.* , B.* , A.created_at AS 'DateCreated' from tbl_all_invoice A  
     INNER JOIN tbl_account B ON A.account_id = B.acc_id`
  }
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    res.send(results)
  });
})
//NOTIFICATIONS FOR ADMIN 
router.get('/loadLogs/:id',(req,res)=>{ 
  let id = req.params.id
  let sql =''
  if(id >-1 ){
    sql = `select * from tbl_logs where acc_id = ${id}`
  }else{
    sql = `select * from tbl_logs where acc_id IS NULL `
  }
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    res.send(results)
  });
})
// proceed to payment 
router.post('/proceedPayment', (req,res)=>{ 
  let invoice = makeid(20)
  let sqlInvoice1='',sqlInvoice2=''
  if(req.body.type=='buynow'){
    //PARA SA SAVING NG INVOICE PARA SA BAWAT PRODUCT
    sqlInvoice1=`INSERT INTO tbl_invoice  
    (invoice , product_id)
    VALUES
    ('${invoice}',${req.body.data.product_id})`

    connection.query(sqlInvoice1, function (error, results, fields) {
      if (error) throw error;
    });
  }else{
     req.body.data.filter(rec => {
      sqlInvoice1=`INSERT INTO tbl_invoice  
      (invoice , product_id)
      VALUES
      ('${invoice}',${rec.product_id})`
  
      connection.query(sqlInvoice1, function (error, results, fields) {
        if (error) throw error;
      });


      let sql = `DELETE FROM tbl_cart WHERE product_id = ${rec.product_id} AND account_id = ${req.body.account}`
      connection.query(sql, function (error, results, fields) {
        if (error) throw error;
      });
    
     });
  }
      // NOTIFICATION KAY ADMIN 
      let message = `${req.body.fullname } made an order
      Invoice : ${invoice} `
      let sql = `insert into tbl_logs 
      ( message , invoice )
      values
      ( '${message}' ,'${invoice}')
      `
      connection.query(sql, function (error, results, fields) {
        if (error) throw error;
      });

      // PARA SA SAVING NG ISANG INVOICE MAG DIDISPLAY PARA SA MONITORING NG PAYMENT SAKA DELIVERY
      sqlInvoice2=`INSERT INTO tbl_all_invoice  
      (invoice_id  , shipping_fee , total_price , account_id , type_of_payment)
      VALUES
      ('${invoice}',${req.body.shipping} , ${req.body.total} ,${req.body.account} , '${req.body.payment}')`
      connection.query(sqlInvoice2, function (error, results, fields) {
        if (error) throw error;
        res.send(results)
      });
})

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
module.exports = router