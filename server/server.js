
const Web3 = require('web3');
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const exp = require('constants');
const os = require('os');

const app = express();
const port = 3000;
app.use(express.static('images'));
// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'blockchain'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (HTML, CSS, JS, etc.) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve registration HTML page
app.get('/', (req, res) => {
  console.log("connected");
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/cert', (req, res) => {
  res.sendFile(path.join(__dirname, 'certification.html'));
});

app.get('/wh', (req, res) => {
  res.sendFile(path.join(__dirname, 'wholesaler_version3.html'));
});



app.get('/supplier', (req, res) => {
  res.sendFile(path.join(__dirname, 'supplier_app.html'));
});

app.get('/manufacturer', (req, res) => {
  res.sendFile(path.join(__dirname, 'manufacturer_app.html'));
});

app.get('/wholesaler', (req, res) => {
  res.sendFile(path.join(__dirname, 'wholeseller_app.html'));
});
// Serve the track.html file and include the userInput parameter in the URL
app.get('/track_qr', (req, res) => {
  console.log('Con');
  const userInput = req.query.userInput;  // Get userInput from the query parameter
  if (userInput) {
    // Serve the track.html file and inject the userInput as a query parameter in the URL
    const filePath = path.join(__dirname, 'track_update.html');
    res.sendFile(filePath, { headers: { 'userInput': userInput } });
  } else {
    res.status(400).send('Missing userInput parameter');
  }
});





app.post('/register', (req, res) => {
  const { email, username, password, type } = req.body;

  // Insert user into the database
  const sql = 'INSERT INTO users (username, password, type, email) VALUES (?, ?, ?, ?)';
  db.query(sql, [username, password, type, email], (err, result) => {
    if (err) {
      throw err;
    }

    console.log('User registered');
    const userId = result.insertId; // Get the ID of the inserted user
    console.log('Inserted ID:', userId);

    res.send(`<center>Your registration request is pending! Your user ID is <b>${userId}.<b> <br> <a href="/certification?userId=${userId}">Complete Sign Up</a></center>`);
  });
});

// Serve login HTML page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
  console.log("Connected");
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, results) => {
    if (err) throw err;
    const userId = results[0].id;
    if (results.length > 0 ) {
      console.log('Login successful');
          //  
      if (results[0].type === 'SUPPLIER') {
        res.redirect(`/sup?userId=${userId}`);
  
        // Redirect to a new page upon successful login
       // res.sendFile(path.join(__dirname, 'supplier_app.html'));
      } 
      if (results[0].type === 'MANUFACTURER') {
        console.log('Login successful');
  
        // Redirect to a new page upon successful login
        res.redirect(`/man?userId=${userId}`);
      }
      if (results[0].type === 'WHOLESALER') {
        console.log('Login successful');
  
        // Redirect to a new page upon successful login
       // res.sendFile(path.join(__dirname, 'wholeseller_app.html'));
       res.redirect(`/wh?userId=${userId}`);
      }
      if (results[0].type === 'RETAILER') {
        console.log('Login successful');
  
        // Redirect to a new page upon successful login
       // res.sendFile(path.join(__dirname, 'wholeseller_app.html'));
       res.redirect(`/rt?userId=${userId}`);
      }
      if (results[0].type === 'ADMIN') {
        console.log('Login successful');
  
        // Redirect to a new page upon successful login
       // res.sendFile(path.join(__dirname, 'wholeseller_app.html'));
       res.redirect(`/admin?userId=${userId}`);
      }


      if (results[0].type === 'REQ_SUPPLIER') {
        console.log('Login successful');
  
        // Redirect to a new page upon successful login
       // res.sendFile(path.join(__dirname, 'wholeseller_app.html'));
       res.redirect(`/certification?userId=${userId}`);
      }
      if (results[0].type === 'REQ_MANUFACTURER') {
        console.log('Login successful');
  
        // Redirect to a new page upon successful login
       // res.sendFile(path.join(__dirname, 'wholeseller_app.html'));
       res.redirect(`/certification?userId=${userId}`);
      }
      if (results[0].type === 'REQ_WHOLESALER') {
        console.log('Login successful');
  
        // Redirect to a new page upon successful login
       // res.sendFile(path.join(__dirname, 'wholeseller_app.html'));
       res.redirect(`/certification?userId=${userId}`);
      }
      if (results[0].type === 'REQ_RETAILER') {
        console.log('Login successful');
  
        // Redirect to a new page upon successful login
       // res.sendFile(path.join(__dirname, 'wholeseller_app.html'));
       res.redirect(`/certification?userId=${userId}`);
      }






    } 
    else {
      console.log('Invalid credentials');
      res.send('Invalid credentials. Please try again.');
    }


  });
});


app.post('/verify_cred', (req, res) => {
  const { user_id, password } = req.body;
  console.log(user_id,password);
  // Check user credentials in the database
  const sql = 'SELECT * FROM users WHERE id = ? AND password = ?';
  db.query(sql, [user_id, password], (err, results) => {
    if (err) throw err;
      console.log(results);
    if (results.length > 0 ) {
      const userId = results[0].id;
      console.log('Verified');

      // Determine the user type and send a true response
      if (results[0].type === 'REQ_SUPPLIER') {
        res.json({ msg:"true" });
      } else if (results[0].type === 'REQ_MANUFACTURER') {
        res.json({ msg:"true" });
      } else if (results[0].type === 'REQ_WHOLESALER') {
        res.json({ msg:"true" });
      } else if (results[0].type === 'REQ_RETAILER') {
        res.json({ msg:"true" });
      }
    } else {
      console.log('Invalid credentials');
      res.send(false); // Send false for invalid credentials
    }
  });
}); 



app.get('/certification', (req, res) => {
  res.sendFile(path.join(__dirname, 'certification.html'));
});






// Serve dashboard HTML page after successful login
app.get('/sup', (req, res) => {
  res.sendFile(path.join(__dirname, 'supplier_version2.html'));
});
// Handle adding supplier information to the database
app.post('/addSupplierToDB', (req, res) => {
  const { supplierId, name, license, expiryDate } = req.body;
  console.log(expiryDate);

  // Insert supplier into the database
  const sql = 'INSERT INTO suppliers (id, name, license, expiry_date) VALUES (?, ?, ?, ?)';
  db.query(sql, [supplierId, name, license, expiryDate], (err, result) => {
    if (err) {
      if (err.errno === 1062) {
        console.error(err);
        res.json({ message: "Duplicate Entry" }); // Respond with specific error message
      } else {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" }); // Handle other errors
      }
    } else {
      console.log('Supplier added successfully');
      res.status(200).json({ message: "Supplier added successfully" }); // Respond with success message
    }
  });
});





























// Handle adding Manufacturer information to the database


app.get('/admin', (req, res) => {
  const sql = 'SELECT id, username, email, password, type FROM users';

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Render admin.ejs page with user data
    res.render('admin', { users: results });
  });
});



app.get('/sup_tab', (req, res) => {
  const sql = 'SELECT id, name, license,expiry_date  FROM suppliers';

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Render admin.ejs page with user data
    res.render('sup_tab', { users: results });
  });
});





app.get('/man_tab', (req, res) => {
  const sql = 'SELECT id, emp_name, manuf_addr, manuf_factory  FROM manufacturer';

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Render admin.ejs page with user data
    res.render('man_tab', { users: results });
  });
});


app.get('/wh_tab', (req, res) => {
  const sql = 'SELECT id, name, trade_license,expiry  FROM wholesaler';

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Render admin.ejs page with user data
    res.render('ret_tab', { users: results });
  });
});

app.get('/ret_tab', (req, res) => {
  const sql = 'SELECT id, name, trade_license,expiry  FROM retailer';

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Render admin.ejs page with user data
    res.render('ret_tab', { users: results });
  });
});










app.get('/man', (req, res) => {
  res.sendFile(path.join(__dirname, 'manufacturer_version3.html'));
});

app.get('/rt', (req, res) => {
  res.sendFile(path.join(__dirname, 'retailer_version3.html'));
});

app.get('/ota', (req, res) => {
  res.sendFile(path.join(__dirname, 'ota4.html'));
});


app.post('/apk_endpoint', (req, res) => {
  const receivedData = req.body.data;
    console.log('Received data:', receivedData);
});





app.post('/addMan', (req, res) => {
  const { id,adrDB, m_name,ceo } = req.body;
console.log(adrDB);
  // Insert manufacturer into the database
  const sql = 'INSERT INTO manufacturer ( id,emp_name,manuf_addr,manuf_factory) VALUES (?,?, ?, ?)';
  db.query(sql, [ id,m_name,adrDB,ceo], (err, result) => {
    if (err) { 
      if (err.errno === 1062) {
        console.error(err);
        res.json({ message: "Duplicate Entry" }); // Respond with specific error message
      } else {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" }); // Handle other errors
      }
    } else {
      console.log('Manufacturer added to the database');
      res.status(200).json({ message:"success" });
    }
  });
});


app.post('/addWh', (req, res) => {
  const { id,u_name,trade_license,date } = req.body;
console.log(req.body);
  // Insert manufacturer into the database
  const sql = 'INSERT INTO wholesaler ( id,name,trade_license,expiry) VALUES (?,?, ?, ?)';
  db.query(sql, [ id,u_name,trade_license,date], (err, result) => {
    if (err) {
      if (err.errno === 1062) {
        console.error(err);
        res.json({ message: "Duplicate Entry" }); // Respond with specific error message
      } else {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" }); // Handle other errors
      }
    } else {
      console.log(' added to the database');
      res.status(200).json({ message:"success" });
    }
  });
});

app.post('/addRt', (req, res) => {
  const { id,u_name,trade_license,date } = req.body;
console.log(req.body);
  // Insert manufacturer into the database
  const sql = 'INSERT INTO retailer ( id,name,trade_license,expiry) VALUES (?,?, ?, ?)';
  db.query(sql, [ id,u_name,trade_license,date], (err, result) => {
    if (err) {
      if (err.errno === 1062) {
        console.error(err);
        res.json({ message: "Duplicate Entry" }); // Respond with specific error message
      } else {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" }); // Handle other errors
      }
    } else {
      console.log(' added to the database');
      res.status(200).json({ message:"ok" });
    }
  });
});




// REQUEST APPROVALS FROM ADMIN PAGE
app.post('/approve_SUP', (req, res) => {
  const {id } = req.body;

  // Insert manufacturer into the database
  const sql = "UPDATE users SET type = 'SUPPLIER' WHERE id= ? ";
  db.query(sql, [ id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Manufacturer added to the database');
      res.status(200).send('Manufacturer added to the database successfully!');
    }
  });
});


app.post('/approve_MAN', (req, res) => {
  const {id } = req.body;

  // Insert manufacturer into the database
  const sql = "UPDATE users SET type = 'MANUFACTURER' WHERE id= ? ";
  db.query(sql, [ id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Manufacturer added to the database');
      res.status(200).send('Manufacturer added to the database successfully!');
    }
  });
});


app.post('/approve_WH', (req, res) => {
  const {id } = req.body;

  // Insert wholesaler into the database
  const sql = "UPDATE users SET type = 'WHOLESALER' WHERE id= ? ";
  db.query(sql, [ id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Manufacturer added to the database');
      res.status(200).send('Manufacturer added to the database successfully!');
    }
  });
});



app.post('/approve_ret', (req, res) => {
  const {id } = req.body;

  // Insert retailer into the database
  const sql = "UPDATE users SET type = 'RETAILER' WHERE id= ? ";
  db.query(sql, [ id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Manufacturer added to the database');
      res.status(200).send(' added to the database successfully!');
    }
  });
});





app.post('/fetchSupplierInfo', (req, res) => {
  const { id } = req.body;

  // Query to select the name from users where id = ?
  const sql = 'SELECT username FROM users WHERE id = ?';
console.log(id);
  // Execute the query
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      // If a row is found, send the name back to the client
      if (result.length > 0) {
        //console.log(result[0]);
        res.status(200).json({ name: result[0]});
      } else {
        res.status(404).send('User not found');
      }
    }
  });
});

app.post('/apk_login', (req, res) => {
  const { username, password } = req.body;

  // Check user credentials in the database
  const sql = 'SELECT * FROM users WHERE id = ? AND password = ?';
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
      if (results.length > 0) {
        console.log('Login successful');
        const userId = results[0].id;
        res.status(200).json({ success: true, message: 'Login successful', role: results[0].type});
      } else {
        console.log('Invalid credentials');
        res.status(401).json({ success: false, message: 'Invalid credentials. Please try again.' });
      }
    }
  });
});











app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});






// APK ENDPOINTS START


// THIS ONE FOR OTA
let x=0;
app.get('/getString', (req, res) => {
  const st = performance.now();
  // myString = "Hello ";
  x=x+1;
  const userInput = req.query.userInput;
  console.log(userInput+"connected"+x);
  
   fetchContractData(userInput)
   .then(result => {
     
      console.log(result.toString());
      const et = performance.now();
const executionTime1 = et - st;
console.log('S Execetuion Time:'+executionTime1+'ms');
      res.status(200).send(result+"".toString());
   })
   .catch(error => {
     console.error('Error fetching contract data:', error);
     res.status(500).send('Internal Server Error');
   });
});

app.get('/ota_clone', (req, res) => {
  res.sendFile(path.join(__dirname, 'ota_clone_version3.html'));
 
});

app.get('/check_validity', (req, res) => {
  // myString = "Hello ";
  x=x+1;
  const userInput = req.query.userInput;
  res.redirect(`/ota_clone?userInput=${userInput}`);
 
});








async function fetchContractData(userInput) {

 
  const startTime = performance.now();
  
  const inputData = userInput.split('-');
  const supplier = inputData[0];
  const manufacturer = inputData[0] + "-" + inputData[1];
  const wholesaler = inputData[0] + "-" + inputData[1] + "-" + inputData[2];
  const retailer = inputData[0] + "-" + inputData[1] + "-" + inputData[2];



  const startTime1 = performance.now();
  
  const resultSupplier = await callSmartContract('0xb5D75Be9b6626c25be43fCb18CE050E2bDC48dF5', [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_supplier_id",
				"type": "uint256"
			},
			{
				"internalType": "string[]",
				"name": "_packages",
				"type": "string[]"
			}
		],
		"name": "addSupplier",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_package",
				"type": "string"
			}
		],
		"name": "findSupplierByPackage",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllSupplies",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "getSupplier",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getSupplierCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "suppliers",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "supplier_id",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
], 'findSupplierByPackage', supplier);

const endTime1 = performance.now();
const executionTime1 = endTime1 - startTime1;
console.log('S Execetuion Time:'+executionTime1+'ms');
//console.log(resultSupplier[0]);


const startTime2 = performance.now();
  const resultManufacturer = await callSmartContract('0x578aD209108f5ee12F88a6a102c5A94F3Dcd6174', [
{
"inputs": [],
"stateMutability": "nonpayable",
"type": "constructor"
},
{
"anonymous": false,
"inputs": [
{
"indexed": false,
"internalType": "uint256",
"name": "manufacturerId",
"type": "uint256"
},
{
"indexed": false,
"internalType": "string",
"name": "packageId",
"type": "string"
},
{
"indexed": false,
"internalType": "uint256",
"name": "timestamp",
"type": "uint256"
}
],
"name": "PackagePosted",
"type": "event"
},
{
"inputs": [
{
"internalType": "uint256",
"name": "_manufacturerId",
"type": "uint256"
},
{
"internalType": "string",
"name": "_packageId",
"type": "string"
}
],
"name": "postManufacturedPackage",
"outputs": [],
"stateMutability": "nonpayable",
"type": "function"
},
{
"inputs": [],
"name": "getManufacturedPackagesCount",
"outputs": [
{
"internalType": "uint256",
"name": "",
"type": "uint256"
}
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [
{
"internalType": "string",
"name": "_packageId",
"type": "string"
}
],
"name": "getPackageByPackageId",
"outputs": [
{
"internalType": "uint256",
"name": "",
"type": "uint256"
},
{
"internalType": "string",
"name": "",
"type": "string"
},
{
"internalType": "uint256",
"name": "",
"type": "uint256"
}
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [
{
"internalType": "uint256",
"name": "_manufacturerId",
"type": "uint256"
}
],
"name": "getPackageIndicesByManufacturerId",
"outputs": [
{
"internalType": "uint256[]",
"name": "",
"type": "uint256[]"
}
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [
{
"internalType": "uint256",
"name": "",
"type": "uint256"
}
],
"name": "manufacturedPackages",
"outputs": [
{
"internalType": "uint256",
"name": "manufacturerId",
"type": "uint256"
},
{
"internalType": "string",
"name": "packageId",
"type": "string"
},
{
"internalType": "uint256",
"name": "timestamp",
"type": "uint256"
}
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [],
"name": "manufacturer",
"outputs": [
{
"internalType": "address",
"name": "",
"type": "address"
}
],
"stateMutability": "view",
"type": "function"
}
], 'getPackageByPackageId', manufacturer);

  const endTime2 = performance.now();
const executionTime2 = endTime2 - startTime2;
console.log('M Execetuion Time:'+executionTime2+'ms');

//console.log(resultManufacturer[0]);
//console.log(resultManufacturer[2]);
const startTime3 = performance.now();
  const resultWholesaler = await callSmartContract('0xBcE8cad57A3b286a817Eb5f72CCE1c8A59E2D8CA',  [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_wholesalerId",
          "type": "uint256"
        },
        {
          "internalType": "string[]",
          "name": "_packageNames",
          "type": "string[]"
        }
      ],
      "name": "addPackage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "countPackages",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_wholesalerId",
          "type": "uint256"
        }
      ],
      "name": "findPackagesByWholesaler",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_packageName",
          "type": "string"
        }
      ],
      "name": "findWholesalerByPackage",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getPackage",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "packages",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "wholesalerId",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ], 'findWholesalerByPackage', wholesaler);


const endTime3 = performance.now();
const executionTime3 = endTime3 - startTime3;
console.log('W Execetuion Time:'+executionTime3+'ms');

//console.log(resultWholesaler);



const startTime4 = performance.now();
  const resultRetailer = await callSmartContract('0x729C18672d0179a3a0974428fE40D9d0ECfB0f90', [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "packageInfo",
          "type": "string"
        }
      ],
      "name": "RetailerRegistered",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "getRetailerById",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_packageInfo",
          "type": "string"
        }
      ],
      "name": "getRetailerByPackageInfo",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_packageInfo",
          "type": "string"
        }
      ],
      "name": "registerRetailer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ], 'getRetailerByPackageInfo', retailer);


const endTime4 = performance.now();
const executionTime4 = endTime4 - startTime4;
console.log('R Execetuion Time:'+executionTime4+'ms');
//console.log(resultRetailer[0]);




let res_supplier,res_wholesaler, res_retailer,res_supplier_time;
let man_id, man_time;

if (resultSupplier[0] != null) {
  res_supplier = resultSupplier[0];
  res_supplier_time = resultSupplier[1];
} else {
  res_supplier = "Nan";
}

if (resultManufacturer != null) {
  man_id = resultManufacturer[0];
  man_time = resultManufacturer[2];
} else {
  man_id = "Nan";
  man_time = "Nan";
}
if (resultWholesaler.length !== 0) {
  res_wholesaler = resultWholesaler;
} else {
  res_wholesaler = "Nan";
}

if (resultRetailer[0].length !== 0) {
  res_retailer = resultRetailer[0];
} else {
  res_retailer = "Nan";
}
const endTime = performance.now();
const executionTime = endTime - startTime;
const concatenatedResult = res_supplier + ','+res_supplier_time+"," + man_id
+ ',' + man_time+ ',' + res_wholesaler+ ',' + res_retailer+","+executionTime;



console.log('Total Execution:'+executionTime+'ms');
return concatenatedResult;
}



async function callSmartContract(contractAddress, contractAbi, functionName, parameter) {
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
  const contract = new web3.eth.Contract(contractAbi, contractAddress);

  try {
      const result = await contract.methods[functionName](parameter).call();
      return result;
  } catch (error) {
      console.error(error);
      return null;
  }
}

app.post('/apk_registration', (req, res) => {
  const { email, username, password, type } = req.body;

  // Insert user into the database
  const sql = 'INSERT INTO users (username, password, type, email) VALUES (?, ?, ?, ?)';
  db.query(sql, [username, password, type, email], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
      console.log('User registered');
      res.status(200).json({ success: true, message: 'User registered successfully!' });
    }
  });
});

// SUPPLIER RELATED APK ENDPOINTS
app.get('/apk_add_supplier', (req, res) => {
  const startTime2 = performance.now();
  const userInput = req.query.userInput;
  const [id, pkg] = userInput.split(',');
console.log(userInput);
  addSupplier(id,pkg)
    .then(result => {
      res.status(200).json({
        success: true,
        message: 'Contract data fetched successfully',
        data: result
      });

  const endTime2 = performance.now();
const executionTime2 = endTime2 - startTime2;
console.log('S Response Time:'+executionTime2+'ms');
    })
    .catch(error => {
      console.error('Error fetching contract data:', error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error'
      });
    });
});





async function addSupplier(supplierId, packageName) {
  const startTime2 = performance.now();
  const Web3 = require('web3');

const web3 = new Web3('http://localhost:7545');


const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_supplier_id",
				"type": "uint256"
			},
			{
				"internalType": "string[]",
				"name": "_packages",
				"type": "string[]"
			}
		],
		"name": "addSupplier",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_package",
				"type": "string"
			}
		],
		"name": "findSupplierByPackage",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllSupplies",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "getSupplier",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getSupplierCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_supplierId",
				"type": "uint256"
			}
		],
		"name": "getSuppliesById",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "suppliers",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "supplier_id",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const contractAddress = '0x21520A63315E3Dc94175793b45b0A20f3c025265';


const contract = new web3.eth.Contract(contractABI, contractAddress);
  try {
     
      const accounts = await web3.eth.getAccounts();
      const result = await contract.methods.addSupplier(supplierId, [packageName]).send({ from: accounts[0],gas:200000 });

      // Log transaction receipt
      console.log('Transaction receipt:', result);
      const endTime2 = performance.now();
    const executionTime2 = endTime2 - startTime2;
    console.log('insertion time: '+executionTime2+'ms');
      return result;
  } catch (error) {
      console.error('Error adding supplier:', error);
      throw error;
  }
}


// MANUFACTURER's APK END

app.get('/getAllSupplies', async (req, res) => {

  try {
      const supplies = await getAllSuppliesAsString();
      console.log(supplies);
      res.send(supplies);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
  }
});


async function getAllSuppliesAsString() {
  
  
  const contractAbi = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_supplier_id",
          "type": "uint256"
        },
        {
          "internalType": "string[]",
          "name": "_packages",
          "type": "string[]"
        }
      ],
      "name": "addSupplier",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_package",
          "type": "string"
        }
      ],
      "name": "findSupplierByPackage",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllSupplies",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        },
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        }
      ],
      "name": "getSupplier",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getSupplierCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_supplierId",
          "type": "uint256"
        }
      ],
      "name": "getSuppliesById",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "suppliers",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "supplier_id",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]; 
  const contractAddress = '0x21520A63315E3Dc94175793b45b0A20f3c025265'; // Replace with your contract address
  const Web3 = require('web3');
  const web3 = new Web3('HTTP://127.0.0.1:7545'); // Replace with your Ganache provider URL
  const contract = new web3.eth.Contract(contractAbi, contractAddress);

  try {
    const result = await contract.methods.getAllSupplies().call();
    const allSupplies = result[1];

    let allSuppliesString = '';

    // Concatenate supplies into a single string with comma-separated values
    allSupplies.forEach(supply => {
        allSuppliesString += `${supply}, `;
    });

    // Remove the trailing comma and space
    allSuppliesString = allSuppliesString.slice(0, -2);

    console.log(allSuppliesString);
    return allSuppliesString;
} catch (error) {
    console.error(error);
    return ''; // Return empty string in case of error
}
}



app.get('/apk_add_manufacturer', (req, res) => {

  const startTime2 = performance.now();
  const Web3 = require('web3');
  const web3 = new Web3('HTTP://127.0.0.1:7545'); 
  
  const userInput = req.query.userInput;
  console.log(userInput);

  // Parse the userInput string
  const [username, packages] = userInput.split(',');

  // Convert packages string to an array
  const packageArray = packages.split(',');

  // Get the contract instance
  const contract = new web3.eth.Contract([
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "manufacturerId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "packageId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "PackagePosted",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_manufacturerId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_packageId",
          "type": "string"
        }
      ],
      "name": "postManufacturedPackage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getManufacturedPackagesCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_packageId",
          "type": "string"
        }
      ],
      "name": "getPackageByPackageId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_manufacturerId",
          "type": "uint256"
        }
      ],
      "name": "getPackageIndicesByManufacturerId",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "manufacturedPackages",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "manufacturerId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "packageId",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "manufacturer",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ], '0x578aD209108f5ee12F88a6a102c5A94F3Dcd6174');

  // Call the postManufacturedPackage function for each package
  packageArray.forEach(async (packageId) => {
    try {
      const startTime3 = performance.now();
      const accounts = await web3.eth.getAccounts();
      // Call the postManufacturedPackage function of the contract
      await contract.methods.postManufacturedPackage(username, packageId).send({ from: accounts[0],gas: 200000 });
      
      console.log(`Package ${packageId} posted successfully.`);
  const endTime3 = performance.now();
const executionTime3 = endTime3 - startTime3;
console.log('M insertion Time:'+executionTime3+'ms');

const endTime2 = performance.now();
const executionTime2 = endTime2 - startTime2;
console.log('M Response Time:'+executionTime2+'ms');

    } catch (error) {
      console.error(`Failed to post package ${packageId}:`, error);
    }
  });

  // Send response


  res.send('Data posted to blockchain');
});

// APK WHOLESALER ENDPOINTS


app.get('/getAllManufactured', async (req, res) => {
  try {
      const commaSeparatedPackageNames = await fetchManufacturedPackagesAsString();

      // Log the return string
      console.log(commaSeparatedPackageNames);

      // Send the return string in the response
      res.send(commaSeparatedPackageNames);
  } catch (error) {
      console.error('Error fetching manufactured packages:', error);
      res.status(500).send('Error fetching manufactured packages');
  }
});



async function fetchManufacturedPackagesAsString() {
  const Web3 = require('web3');
  const web3 = new Web3('HTTP://127.0.0.1:7545'); 
  const postManufacturedAddress = '0x578aD209108f5ee12F88a6a102c5A94F3Dcd6174';
  const postManufacturedABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "manufacturerId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "packageId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "PackagePosted",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_manufacturerId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_packageId",
          "type": "string"
        }
      ],
      "name": "postManufacturedPackage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getManufacturedPackagesCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_packageId",
          "type": "string"
        }
      ],
      "name": "getPackageByPackageId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_manufacturerId",
          "type": "uint256"
        }
      ],
      "name": "getPackageIndicesByManufacturerId",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "manufacturedPackages",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "manufacturerId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "packageId",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "manufacturer",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const postManufacturedContract = new web3.eth.Contract(postManufacturedABI, postManufacturedAddress);

  try {
      const totalPackages = await postManufacturedContract.methods.getManufacturedPackagesCount().call();

      const packageNames = [];
      for (let i = totalPackages - 5; i < totalPackages; i++) {
          const result = await postManufacturedContract.methods.manufacturedPackages(i).call();
          packageNames.push(result[1]); // Assuming the package name is at index 1
      }

      // Concatenate package names into a single comma-separated string
      const commaSeparatedPackageNames = packageNames.join(',');
      console.log(commaSeparatedPackageNames);
      return commaSeparatedPackageNames;
  } catch (error) {
      console.error(error);
      throw error;
  }
}

// Define the endpoint to handle the request
app.get('/apk_add_wholesaler', async (req, res) => {
  const startTime2 = performance.now();
  const userInput = req.query.userInput;

  // Split the userInput string by '%'
  const userInputParts = userInput.split('%');

  // Extract wholesaler name and package names
  const wholesalerName = userInputParts[0];
  const packageNames = userInputParts[1].split(',');

  console.log('Wholesaler Name:', wholesalerName);
  console.log('Package Names:', packageNames);

  try {
    // Call the function to add the package to the blockchain
    await addPackageToBlockchain(wholesalerName, packageNames);
    
    // Send response
  const endTime2 = performance.now();
const executionTime2 = endTime2 - startTime2;
console.log('W Response Time:'+executionTime2+'ms');
    res.send('Package posted successfully');
  } catch (error) {
    console.error('Error posting package:', error);
    res.status(500).send('Error posting package');
  }
});
async function addPackageToBlockchain(wholesalerName, packageNames) {
  const startTime2 = performance.now();
  const Web3 = require('web3');
  const web3 = new Web3('HTTP://127.0.0.1:7545'); 
  const accounts = await web3.eth.getAccounts();
  const contractABI = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_wholesalerId",
          "type": "uint256"
        },
        {
          "internalType": "string[]",
          "name": "_packageNames",
          "type": "string[]"
        }
      ],
      "name": "addPackage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "countPackages",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_wholesalerId",
          "type": "uint256"
        }
      ],
      "name": "findPackagesByWholesaler",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_packageName",
          "type": "string"
        }
      ],
      "name": "findWholesalerByPackage",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getPackage",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "packages",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "wholesalerId",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  
  const contractAddress = '0xBcE8cad57A3b286a817Eb5f72CCE1c8A59E2D8CA'; 
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  try {
    // Call the addPackage function of the contract
    await contract.methods.addPackage(wholesalerName, packageNames)
      .send({ from: accounts[0] ,gas:2000000}); // Use the default account or specify one
    
  const endTime2 = performance.now();
const executionTime2 = endTime2 - startTime2;
console.log('W insertion Time:'+executionTime2+'ms');
    console.log('Package added to blockchain successfully');
  } catch (error) {
    throw new Error('Failed to add package to blockchain');
  }
}



// Define your endpoint
app.get('/apk_add_retailer', async (req, res) => {

  const startTime2 = performance.now();


  const userInput = req.query.userInput;
  console.log(userInput);
  const userInputParts = userInput.split(',');

  // Extract wholesaler name and package names
  const retailer = userInputParts[0];
  const package = userInputParts[1];
  try {
    await add_retail_package(retailer, package);


  const endTime2 = performance.now();
const executionTime2 = endTime2 - startTime2;
console.log('R Response Time:'+executionTime2+'ms');
    res.status(200).json({ message: 'Retailer data inserted successfully!' });
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
}


});


async function add_retail_package(name,packageInfo) {
  const startTime2 = performance.now();
          const Web3 = require('web3');
        const contractAddress = '0x729C18672d0179a3a0974428fE40D9d0ECfB0f90';
        const contractABI = [
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "string",
                "name": "packageInfo",
                "type": "string"
              }
            ],
            "name": "RetailerRegistered",
            "type": "event"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
              }
            ],
            "name": "getRetailerById",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "",
                "type": "string"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "string",
                "name": "_packageInfo",
                "type": "string"
              }
            ],
            "name": "getRetailerByPackageInfo",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "",
                "type": "string"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "_packageInfo",
                "type": "string"
              }
            ],
            "name": "registerRetailer",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ];

        const web3 = new Web3('HTTP://127.0.0.1:7545'); // Assuming Ganache is running on this port
        const contract = new web3.eth.Contract(contractABI, contractAddress);
  try {
      const accounts = await web3.eth.getAccounts();
      const from = accounts[0];

      const gasLimit = 300000; // Specify a higher gas limit here

      await contract.methods.registerRetailer(name, packageInfo).send({ from: from, gas: gasLimit });

  const endTime2 = performance.now();
const executionTime2 = endTime2 - startTime2;
console.log('R insertion Time:'+executionTime2+'ms');
      console.log("retailer"+name+"posted"+packageInfo);
      
  } catch (error) {
      console.error(error);
  }
}







// FETCH CORRESPONDING INFOS

app.get('/view', (req, res) => {

  
  const userInput = req.query.userInput;
  const [id, type] = userInput.split(',');
  console.log(id);
  const sql = 'SELECT * FROM ?? WHERE id= ?'; 

  db.query(sql, [type,id],(error, results) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error'
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Data fetched successfully',
        data: results
      });
      console.log(results);
    }
  });
});


const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545'); 

// SECONDARY RESEARCH
async function getPackageInf(packageId) {
  // Web3 and contract setup inside the function
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');  // Local or provider URL
  const supplyChainContractAddress = '0xf2217BC765B57DA79091c8251B8FdB712Fe0d1ff';  // Replace with your contract address
  const supplyChainABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_packageId",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_packageInfo",
          "type": "string"
        }
      ],
      "name": "addManufacturer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_packageId",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_packageInfo",
          "type": "string"
        }
      ],
      "name": "addRetailer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_packageId",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_packageInfo",
          "type": "string"
        }
      ],
      "name": "addSupplier",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_packageId",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_packageInfo",
          "type": "string"
        }
      ],
      "name": "addWholesaler",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "entity",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "packageId",
          "type": "string"
        }
      ],
      "name": "PackageAdded",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_packageId",
          "type": "string"
        }
      ],
      "name": "getManufacturerInfo",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_packageId",
          "type": "string"
        }
      ],
      "name": "getRetailerInfo",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_packageId",
          "type": "string"
        }
      ],
      "name": "getSupplierInfo",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_packageId",
          "type": "string"
        }
      ],
      "name": "getWholesalerInfo",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "manufacturers",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "packageInfo",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "retailers",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "packageInfo",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "suppliers",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "packageInfo",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "wholesalers",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "packageInfo",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];  // Replace with your contract ABI
  
  // Create contract instance
  const supplyChainContract = new web3.eth.Contract(supplyChainABI, supplyChainContractAddress);

  let supplierInfo, manufacturerInfo, wholesalerInfo, retailerInfo;

  // Split the packageId by '-'
  const packageParts = packageId.split('-');

  // Get supplier info (for X)
  if (packageParts.length >= 1) {
      try {
          const supplier = await supplyChainContract.methods.getSupplierInfo(packageParts[0]).call();
          supplierInfo = {
              id: supplier[0],
              packageInfo: supplier[1],
              timestamp: new Date(supplier[2] * 1000).toLocaleString()
          };
      } catch (error) {
          supplierInfo = 'Supplier info not found';
      }
  }

  // Get manufacturer info (for X-Y)
  if (packageParts.length >= 2) {
      try {
          const manufacturer = await supplyChainContract.methods.getManufacturerInfo(packageParts[0] + '-' + packageParts[1]).call();
          manufacturerInfo = {
              id: manufacturer[0],
              packageInfo: manufacturer[1],
              timestamp: new Date(manufacturer[2] * 1000).toLocaleString()
          };
      } catch (error) {
          manufacturerInfo = 'Manufacturer info not found';
      }
  }

  // Get wholesaler info (for X-Y-Z)
  if (packageParts.length >= 3) {
      try {
          const wholesaler = await supplyChainContract.methods.getWholesalerInfo(packageParts.join('-')).call();
          wholesalerInfo = {
              id: wholesaler[0],
              packageInfo: wholesaler[1]
          };
      } catch (error) {
          wholesalerInfo = 'Wholesaler info not found';
      }
  }

  // Get retailer info (for X-Y-Z)
  if (packageParts.length >= 3) {
      try {
          const retailer = await supplyChainContract.methods.getRetailerInfo(packageParts.join('-')).call();
          retailerInfo = {
              id: retailer[0],
              packageInfo: retailer[1]
          };
      } catch (error) {
          retailerInfo = 'Retailer info not found';
      }
  }

  return {
      supplierInfo,
      manufacturerInfo,
      wholesalerInfo,
      retailerInfo
  };
}

// API route to fetch package info
app.get('/getPackageInfo', async (req, res) => {
  const memoryUsage = process.memoryUsage();
  const cpuUsage = os.cpus();
  const st = performance.now();
  const packageId = req.query.packageId;

  if (!packageId) {
      return res.status(400).send('Package ID is required');
  }

  try {
      const packageInfo = await getPackageInf(packageId);
      const et = performance.now();
      const executionTime = et - st;

      // Log the execution time
      console.log(`Execution Time: ${executionTime.toFixed(2)} ms`);
      console.log(packageInfo);
      // Send the response with package info and execution time
      return res.status(200).json({
          ...packageInfo,
          executionTime: `${executionTime.toFixed(2)} ms`,mem: memoryUsage, cpu:cpuUsage
      });
  } catch (error) {
      return res.status(500).send('Error fetching package info: ' + error.message);
  }
});

// VS 4 smart

async function getSupplierInfo(packageId) {
  const supplierABI =[
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_packageId",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_packageInfo",
          "type": "string"
        }
      ],
      "name": "addPackage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_packageId",
          "type": "string"
        }
      ],
      "name": "getPackageInfo",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "packages",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "packageInfo",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  const supplierContractAddress = '0x7A94047D33d802254F8b848C95611E0380E5e6f0';  // Replace with actual contract address
  const supplierContract = new web3.eth.Contract(supplierABI, supplierContractAddress);

  try {
    const supplier = await supplierContract.methods.getPackageInfo(packageId).call();
    return {
      id: supplier[0],
      packageInfo: supplier[1],
      timestamp: new Date(supplier[2] * 1000).toLocaleString()
    };
  } catch (error) {
    return 'Supplier info not found';
  }
}

// Function to interact with Manufacturer Contract
async function getManufacturerInfo(packageId) {
  const manufacturerABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_packageId",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_packageInfo",
          "type": "string"
        }
      ],
      "name": "addPackage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_packageId",
          "type": "string"
        }
      ],
      "name": "getPackageInfo",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "packages",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "packageInfo",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  const manufacturerContractAddress = '0xC5EEA625B8Ad624be12950d2d0C7F30A1810aa68';  // Replace with actual contract address
  const manufacturerContract = new web3.eth.Contract(manufacturerABI, manufacturerContractAddress);

  try {
    const manufacturer = await manufacturerContract.methods.getPackageInfo(packageId).call();
    return {
      id: manufacturer[0],
      packageInfo: manufacturer[1],
      timestamp: new Date(manufacturer[2] * 1000).toLocaleString()
    };
  } catch (error) {
    return 'Manufacturer info not found';
  }
}

// Function to interact with Wholesaler Contract
async function getWholesalerInfo(packageId) {
  const wholesalerABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_packageId",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_packageInfo",
          "type": "string"
        }
      ],
      "name": "addPackage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_packageId",
          "type": "string"
        }
      ],
      "name": "getPackageInfo",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "packages",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "packageInfo",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  const wholesalerContractAddress = '0x045a764eC69d185F3249dA2D2F61342856C17A85';  // Replace with actual contract address
  const wholesalerContract = new web3.eth.Contract(wholesalerABI, wholesalerContractAddress);

  try {
    const wholesaler = await wholesalerContract.methods.getPackageInfo(packageId).call();
    return {
      id: wholesaler[0],
      packageInfo: wholesaler[1]
    };
  } catch (error) {
    return 'Wholesaler info not found';
  }
}

// Function to interact with Retailer Contract
async function getRetailerInfo(packageId) {
  const retailerABI =[
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_packageId",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_packageInfo",
          "type": "string"
        }
      ],
      "name": "addPackage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_packageId",
          "type": "string"
        }
      ],
      "name": "getPackageInfo",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "packages",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "packageInfo",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  const retailerContractAddress = '0xc14542540CEBC7bD4134236F9E25F6d7C8fcb2a5';  // Replace with actual contract address
  const retailerContract = new web3.eth.Contract(retailerABI, retailerContractAddress);

  try {
    const retailer = await retailerContract.methods.getPackageInfo(packageId).call();
    return {
      id: retailer[0],
      packageInfo: retailer[1]
    };
  } catch (error) {
    return 'Retailer info not found';
  }
}

// Function to fetch package info for all stakeholders
async function getPackageInfo(packageId) {
  const packageParts = packageId.split('-'); // Split the packageId by "-"

  let supplierInfo, manufacturerInfo, wholesalerInfo, retailerInfo;

  // Get Supplier info (for X)
  if (packageParts.length >= 1) {
    console.log(packageParts[0]);
    supplierInfo = await getSupplierInfo(packageParts[0]);
  }

  // Get Manufacturer info (for X-Y)
  if (packageParts.length >= 2) {
    manufacturerInfo = await getManufacturerInfo(packageParts[0] + '-' + packageParts[1]);
  }

  // Get Wholesaler info (for X-Y-Z)
  if (packageParts.length >= 3) {
    wholesalerInfo = await getWholesalerInfo(packageParts.join('-'));
  }

  // Get Retailer info (for X-Y-Z)
  if (packageParts.length >= 3) {
    retailerInfo = await getRetailerInfo(packageParts.join('-'));
  }

  return { supplierInfo, manufacturerInfo, wholesalerInfo, retailerInfo };
}

// API route to fetch package info
app.get('/getPackageInfo2', async (req, res) => {
  const memoryUsage = process.memoryUsage();
  const cpuUsage = os.cpus();
  const st = performance.now();
  const packageId = req.query.packageId;

  if (!packageId) {
    return res.status(400).send('Package ID is required');
  }

  try {
    const packageInfo = await getPackageInfo(packageId);
    const et = performance.now();
    const executionTime = et - st;

    console.log(`Execution Time: ${executionTime.toFixed(2)} ms`);

    return res.status(200).json({
      ...packageInfo,
      executionTime: `${executionTime.toFixed(2)} ms`,mem: memoryUsage, cpu: cpuUsage
    });
  } catch (error) {
    return res.status(500).send('Error fetching package info: ' + error.message);
  }
});

