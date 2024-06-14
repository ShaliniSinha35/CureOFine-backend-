const express = require("express");
const mysql = require("mysql");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const path = require("path")
const cors = require('cors');
const sdk = require('api')('@msg91api/v5.0#6n91xmlhu4pcnz');
const axios = require('axios');
const multer = require('multer');
app.use(cors())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true); 
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use('/upload/', express.static("upload/"));


// Msg91 API authentication
sdk.auth('413483A3W9I40kb5g7659e5c6fP1');

const sendSms = async (mobileNumber, otp) => {

  const apiKey = '413483A3W9I40kb5g7659e5c6fP1';
  const apiUrl = 'https://api.msg91.com/api/v5/flow/';

  try {
    const response = await axios.post(apiUrl, {
      flow_id: '659e5ebeb6ea785bac43ae09',
      sender: 'CUREOF',
      mobiles: `91${mobileNumber}`,
      otp: otp,
    }, {
      headers: {
        'authkey': apiKey,
        'content-type': 'application/json',
      },
    });

    console.log('Msg91 API response:', response.data);
  } catch (error) {
    console.error('Error sending SMS:', error.message);
  }
};



const connection = mysql.createConnection({


connectionLimit: 10,
host: "119.18.55.247",
user: "cureofine_final_user",
password: "99OM@dN6cEm}",
database: "cureofine_final_db"

});

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected");
  }
});





const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'upload', 'idproof');
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    if (!req.uploadedImages) {
      req.uploadedImages = [];
    }
    const uploadedImage = uniqueName + extension;
    req.uploadedImages.push(uploadedImage);
    cb(null, uploadedImage);
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.fields([{ name: 'photo' }, { name: 'aadhar' }]), (req, res) => {
  const uploadedImages = req.uploadedImages;

  if (!uploadedImages || uploadedImages.length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const imageUrls = uploadedImages.map(image => {
    return `${req.protocol}://${req.get('host')}/upload/idproof/${image}`;
  });

  res.status(200).json({
    message: 'Images uploaded successfully',
    uploadedImages: imageUrls
  });
});

app.get("/api/api/about", (req, res) => {
  connection.query(
    "SELECT `content` FROM `static_page` WHERE id=1;",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/api/api/privacy", (req, res) => {
  connection.query(
    "SELECT `content` FROM `static_page` WHERE id=3;",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/api/api/term", (req, res) => {
  connection.query(
    "SELECT `content` FROM `static_page` WHERE id=4;",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/api/api/return", (req, res) => {
  connection.query(
    "SELECT `content` FROM `static_page` WHERE id=5;",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/api/api/faq", (req, res) => {
  connection.query(
    "SELECT `content` FROM `static_page` WHERE id=6;",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.post("/api/api/contact", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var message = req.body.message;
  var phone = req.body.phone;
  var subject = req.body.subject;

  var sql = `INSERT INTO contact_us (Name, Email, Details, mobile, subject, status, entry_time) VALUES ("${name}", "${email}", "${message}", "${phone}", "${subject}", "New", NOW())`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("record inserted");
   
  });
});

app.post("/api/api/enquiry", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var message = req.body.message;
  var phone = req.body.phone;
  var address = req.body.address;
  var city = req.body.city;

  var sql = `INSERT INTO business_enq (Name, Email, mobile, message, city, address, entry_time) VALUES ("${name}", "${email}", "${phone}", "${message}", "${city}", "${address}", NOW())`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("record inserted");
  });
});



app.get("/api/api/presence", (req, res) => {
  connection.query(
    "SELECT `id`, `location_id`, `name`, `image`, `status` FROM `manage_location` WHERE status= 'Active'",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
   
        return res.json(results);
      }
    }
  );
});



app.get("/api/api/banner", (req, res) => {
  connection.query(
    "SELECT `id`, `image`, `page` FROM `banner` ",    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/api/api/offerBanner", (req, res) => {
  connection.query(
    "SELECT `id`, `image` FROM `offerbanner` ",    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});


app.get("/api/api/service", (req, res) => {
  connection.query(
    "SELECT `id`, `ser_id`, `name`, `image`, `cby`, `status` FROM `manage_service` ",    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/api/api/doctorsList", (req, res) => {
  connection.query(
    "SELECT * FROM `manage_doctor` WHERE status= 'Active' ",    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/api/api/languages", (req, res) => {
  connection.query(
    "SELECT * FROM `manage_language` WHERE status= 'Active' ", (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/api/api/surgeryCategory", (req, res) => {
  connection.query(
    "SELECT `id`, `cat_id`, `name`, `image`, `cby`, `cdate`, `status` FROM `manage_surgery_category` WHERE status= 'Active'",   
     (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});


app.get("/api/api/surgeryList", (req, res) => {
  const { cat_id,location_id } = req.query;


  connection.query(
    "SELECT s.id AS `surgery_id`,s.`name`, s.`display_price`,s.`opd`, s.`ser_id`, s.`location` AS `surgery_location`, s.`category`, s.`hospital`, h.`name` AS `hospital_name`, h.`location` AS `hospital_location`, h.`image` AS `hospital_image`, h.`address` AS `hospital_address`, h.`mobile1` AS `hospital_mobile1`, h.`mobile2` AS `hospital_mobile2`, h.`contact_person` AS `hospital_contact_person`, h.`facility_type`, h.`service_type`, h.`h_type`, h.`employee_id`, h.`hospital_display_id`, h.`hos_rand`, h.`entity_type`, h.`registration_document`, h.`details` AS `hospital_details`, h.`hospital_time`, h.`sun_start`, h.`sun_end`, h.`mon_start`, h.`mon_end`, h.`tue_start`, h.`tue_end`, h.`wed_start`, h.`wed_end`, h.`thu_start`, h.`thu_end`, h.`fri_start`, h.`fri_end`, h.`sat_start`, h.`sat_end`, h.`sun_status`, h.`mon_status`, h.`tue_status`, h.`wed_status`, h.`thu_status`, h.`fri_status`, h.`sat_status`, s.`price`, s.`offer_price`, s.`details` AS `surgery_details`, s.`tranding`, s.`status`, s.`cby`, s.`cdate` FROM `surgery` s JOIN `manage_hospital` h ON s.`hospital` = h.`hos_id` WHERE s.`status` = 'Active' AND h.`status` = 'Active' AND s.category = ? AND s.location = ? ",
    [cat_id,location_id],
    (error, results) => {
      if (error) {
        console.error("Error executing SQL query:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results);
      }
    }
  );
});





app.get("/api/api/ivfList", (req, res) => {
  const { cat_id,location_id } = req.query;

  connection.query(
    "SELECT ivf.`id` AS `ivf_id`, ivf.`ser_id`,ivf.`display_price`,ivf.`opd`, ivf.`location` AS `ivf_location`, ivf.`category`, ivf.`hospital`, ivf.name, ivf.`price`, ivf.`offer_price`, ivf.`details` AS `dental_details`, ivf.`tranding`, h.`name` AS `hospital_name`, h.`location` AS `hospital_location`, h.`image` AS `hospital_image`, h.`address` AS `hospital_address`, h.`mobile1` AS `hospital_mobile1`, h.`mobile2` AS `hospital_mobile2`, h.`contact_person` AS `hospital_contact_person`, h.`facility_type`, h.`service_type`, h.`h_type`, h.`employee_id`, h.`hospital_display_id`, h.`hos_rand`, h.`entity_type`, h.`registration_document`, h.`details` AS `hospital_details`, h.`hospital_time`, h.`sun_start`, h.`sun_end`, h.`mon_start`, h.`mon_end`, h.`tue_start`, h.`tue_end`, h.`wed_start`, h.`wed_end`, h.`thu_start`, h.`thu_end`, h.`fri_start`, h.`fri_end`, h.`sat_start`, h.`sat_end`, h.`sun_status`, h.`mon_status`, h.`tue_status`, h.`wed_status`, h.`thu_status`, h.`fri_status`, h.`sat_status` FROM `ivf` ivf JOIN `manage_hospital` h ON ivf.`hospital` = h.`hos_id` WHERE ivf.`status` = 'Active' AND h.`status` = 'Active' AND ivf.category = ? AND ivf.location = ? ;",
    [cat_id,location_id],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});


app.get("/api/api/dentalList", (req, res) => {
  const { cat_id,location_id } = req.query;
  connection.query(
    "SELECT d.`id` AS `dental_id`, d.`ser_id`,d.`display_price`,d.`opd`, d.`location` AS `dental_location`, d.`category`, d.`hospital`, d.name, d.`price`, d.`offer_price`, d.`details` AS `dental_details`, d.`tranding`, d.`status`, h.`name` AS `hospital_name`, h.`location` AS `hospital_location`, h.`image` AS `hospital_image`, h.`address` AS `hospital_address`, h.`mobile1` AS `hospital_mobile1`, h.`mobile2` AS `hospital_mobile2`, h.`contact_person` AS `hospital_contact_person`, h.`facility_type`, h.`service_type`, h.`h_type`, h.`employee_id`, h.`hospital_display_id`, h.`hos_rand`, h.`entity_type`, h.`registration_document`, h.`details` AS `hospital_details`, h.`hospital_time`, h.`sun_start`, h.`sun_end`, h.`mon_start`, h.`mon_end`, h.`tue_start`, h.`tue_end`, h.`wed_start`, h.`wed_end`, h.`thu_start`, h.`thu_end`, h.`fri_start`, h.`fri_end`, h.`sat_start`, h.`sat_end`, h.`sun_status`, h.`mon_status`, h.`tue_status`, h.`wed_status`, h.`thu_status`, h.`fri_status`, h.`sat_status` FROM `dental` d JOIN `manage_hospital` h ON d.`hospital` = h.`hos_id` WHERE d.`status` = 'Active' AND h.`status` = 'Active' AND d.category = ? AND d.location = ? ;",
    [cat_id,location_id],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results);
      }
    }
  );
});



app.get("/api/api/hairList", (req, res) => {
  const { cat_id,location_id } = req.query;
  connection.query(
    "SELECT hair.`id` AS `hair_id`,hair.`display_price`,hair.`opd`, hair.`ser_id`, hair.`location` AS `hair_location`, hair.`category`, hair.`hospital`, hair.name, hair.`price`, hair.`offer_price`, hair.`details` AS `hair_details`, hair.`tranding`, h.`name` AS `hospital_name`, h.`location` AS `hospital_location`, h.`image` AS `hospital_image`, h.`address` AS `hospital_address`, h.`mobile1` AS `hospital_mobile1`, h.`mobile2` AS `hospital_mobile2`, h.`contact_person` AS `hospital_contact_person`, h.`facility_type`, h.`service_type`, h.`h_type`, h.`employee_id`, h.`hospital_display_id`, h.`hos_rand`, h.`entity_type`, h.`registration_document`, h.`details` AS `hospital_details`, h.`hospital_time`, h.`sun_start`, h.`sun_end`, h.`mon_start`, h.`mon_end`, h.`tue_start`, h.`tue_end`, h.`wed_start`, h.`wed_end`, h.`thu_start`, h.`thu_end`, h.`fri_start`, h.`fri_end`, h.`sat_start`, h.`sat_end`, h.`sun_status`, h.`mon_status`, h.`tue_status`, h.`wed_status`, h.`thu_status`, h.`fri_status`, h.`sat_status` FROM `hair` hair JOIN `manage_hospital` h ON hair.`hospital` = h.`hos_id` WHERE hair.`status` = 'Active' AND h.`status` = 'Active' AND hair.category = ? AND hair.location =? ;",
    [cat_id,location_id],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results);
      }
    }
  );
});



app.get("/api/api/ivf", (req, res) => {
  connection.query(
    "SELECT `id`, `cat_id`, `name`, `image`, `cby`, `cdate`, `status` FROM `manage_ivf_category` WHERE status= 'Active'",   
     (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/api/api/dental", (req, res) => {
  connection.query(
    "SELECT `id`, `cat_id`, `name`, `image`, `cby`, `cdate`, `status` FROM `manage_dental_category` WHERE status= 'Active'",   
     (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/api/api/hairCosmetic", (req, res) => {
  connection.query(
    "SELECT `id`, `cat_id`, `name`, `image`, `cby`, `cdate`, `status` FROM `manage_hair_category` WHERE status= 'Active'",   
     (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/api/api/ayurveda", (req, res) => {
  connection.query(
    "SELECT `id`, `ayu_id`, `name`, `image`, `details`, `inclusion`, `excluation`, `price`, `offer_price`, `location`, `tranding`, `cby`, `cdate`, `status` FROM `ayurveda` WHERE status= 'Active'",   
     (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/api/api/testimonials", (req, res) => {
  connection.query(
    "SELECT `id`, `name`, `profession`, `date_of_speak`, `content`, `img`, `entry_time`, `entry_by`, `status` FROM `testimonial` WHERE status= 'Active'",   
     (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/api/api/brands", (req, res) => {
  connection.query(
    "SELECT `id`, `brand_id`, `name`, `logo`, `status`, `banner` FROM `brand` WHERE status= 'Active'",   
     (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});


app.get("/api/api/state", (req, res) => {
  connection.query(
    "SELECT `id`, `State` FROM `state` ",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});


app.get("/api/api/city", (req, res) => {
  connection.query(
    "SELECT `id`, `name` FROM `manage_district` ",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});



app.get("/api/api/products", (req, res) => {
  connection.query(
    "SELECT `id`, `name`, `duration`, `price`, `offer_price`, `image`, `details` FROM `physiotherapy`",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});


app.get("/api/api/surgery", (req, res) => {
  connection.query(
    "SELECT `id`, `name`, `description` FROM `scategory`",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});


app.get("/api/api/specialization", (req, res) => {
  connection.query(
    "SELECT `id`, `name`, `image` FROM `specialization` ",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});


app.get("/api/api/staticText", (req, res) => {
  connection.query(
    "SELECT `page_menu`, `content` FROM `static_page` WHERE id=2;",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});


app.get("/api/api/contactInfo", (req, res) => {
  connection.query(
    "SELECT `id`, `domain`, `facebook`, `twitter`, `youtube`, `linkdin`, `whatsapp`, `instagram`, `address_1`, `address_2`, `email`, `mobile_1`, `mobile_2`, `cus_care_num`, `hits`, `office_hour` FROM `website_data`",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});



app.get("/api/api/hospitals", (req, res) => {
  connection.query(
    "SELECT * FROM `manage_hospital` WHERE status= 'Active'",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});



app.get("/api/api/facilityType", (req, res) => {
  connection.query(
    "SELECT `id`, `fac_id`, `name` FROM `manage_facility` WHERE status= 'Active'",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});





app.post("/api/api/updateProfile", async (req, res) => {


  const phoneNumber = req.body.phone;
  const name = req.body.name;
  const city = req.body.city;
  const state = req.body.state;
  const country = req.body.country;
  const email = req.body.email;
  const pincode = req.body.pincode;
  const gender = req.body.gender;
  const image = req.body.image;

  const updateProfileQuery =
    "UPDATE web_user SET name = ?, email = ?, gender = ?, image = ?, city = ?, state = ?, country = ?, pincode = ? WHERE mobile = ?";

  connection.query(
    updateProfileQuery,
    [name, email, gender, image, city, state, country, pincode, phoneNumber],
    (updateErr, updateResults) => {
      if (updateErr) {
        console.error(updateErr);
        return res.status(500).json({ message: "Error updating status" });
      } else {
        console.log("Updation successful");
        res.json({ message: "Updation successful", result: updateResults });
      }
    }
  );
});


app.get("/api/api/userInfo", (req, res) => {
  const phoneNumber = req.query.phone; 
  console.log(phoneNumber);

  const getUserQuery = "SELECT * FROM `web_user` WHERE mobile = ?";
  
  connection.query(getUserQuery, [phoneNumber], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching user information" });
    } else {
      res.json(results);
    }
  });
});





  app.post("/api/api/generateOtp", async (req, res) => {
    const phoneNumber = req.body.phone;

    const checkUserQuery = "SELECT * FROM web_user WHERE mobile = ?";
    connection.query(checkUserQuery, [phoneNumber], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }
      if (results.length === 0) {
        console.log("User does not exist, insert the user and generate OTP")
     
        const otp = Math.floor(100000 + Math.random() * 900000);
        
        const insertUserQuery = "INSERT INTO web_user(mobile, otp_details, cdate) VALUES (?, ?, NOW())";
        connection.query(insertUserQuery, [phoneNumber, otp], (err, result) => {
          if (err) {
            console.error("Error inserting data into the database:", err);
            res.status(500).json({ message: "Database error" });
          } else {
      
            sdk.sendSms({
              template_id: 'your_msg91_template_id',
              recipients: [{ mobiles: phoneNumber, VAR1: otp.toString() }]
            })
            .then(({ data }) => {
              console.log("Msg91 API response:", data);
              res.json({ message: "User and OTP inserted successfully", number: phoneNumber });
            })
            .catch(err => {
              console.error("Error sending SMS:", err);
              res.status(500).json({ message: "Error sending SMS" });
            });
          }
        });
      }
     else if (results.length != 0) {
      console.log("User exists, generate and insert OTP")
        // User exists, generate and insert OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
  
        const insertOtpQuery = "UPDATE web_user SET otp_details = ? WHERE mobile = ?";
        connection.query(insertOtpQuery, [otp, phoneNumber], (err, result) => {
          if (err) {
            console.error("Error inserting OTP into the database:", err);
            res.status(500).json({ message: "Database error" });
          } else {
            // Send OTP to the user using Msg91 API
            // sdk.sendSms({
            //   template_id: '659e5ebeb6ea785bac43ae09',
            //   recipients: [{ mobiles: phoneNumber, VAR1: otp.toString() }]
            // })
           sendSms(phoneNumber,otp)
            .then(() => {
              // console.log("Msg91 API response:", data);
              res.json({ message: "OTP generated and sent successfully", number: phoneNumber });
            })
            .catch(err => {
              console.error("Error sending SMS:", err);
              res.status(500).json({ message: "Error sending SMS" });
            });
          }
        });
      }
    });
  });
  
  app.post("/api/api/verifyOTP", async (req, res) => {
    const phoneNumber = req.body.phone;
    const enteredOTP = req.body.otp;
  
    // Verify OTP against the stored OTP in the database
    const verifyOtpQuery = "SELECT * FROM web_user WHERE mobile = ? AND otp_details = ?";
    connection.query(verifyOtpQuery, [phoneNumber, enteredOTP], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }
  
      if (results.length > 0) {

        const updateStatusQuery = "UPDATE web_user SET status = '1' WHERE mobile = ?";
        connection.query(updateStatusQuery, [phoneNumber], (updateErr, updateResults) => {

          if (updateErr) {
            console.error(updateErr);
            return res.status(500).json({ message: "Error updating status" });
          }
          else{
            console.log("OTP verification successful",results[results.length - 1].id)
            const userid= results[results.length - 1].id
            console.log("userid",userid)
            res.json({ message: "OTP verification successful", number: phoneNumber, results: userid });
          }
        })
       

      } else {
        res.status(400).json({ message: "Invalid OTP" });
      }
    });
  });





  app.post("/api/api/bookSurgery", async (req, res) => {
    // console.log(req.body);
    const user_id = req.body.user_id;
    const service_id = req.body.service_id;
    const name = req.body.name;
    const gender = req.body.gender;
    const age = req.body.age;
    const address = req.body.address;
    const mobile = req.body.mobile;
    const email = req.body.email;
    const service_name = req.body.service_name;
    const service_date = req.body.service_date;
    const service_time = req.body.service_time;
    const amount = req.body.amount;
    const book_type = req.body.book_type;
    const display_price= req.body.display_price;
    const tax = req.body.tax
    const opd_price= req.body.opd_price;
    const emi = req.body.emi



  
    const sqlInsert = `INSERT INTO common_book (user_id,service_id, name, gender, age, address, mobile, email, service_name, service_date, service_time, amount, cdate, book_type,display_price,tax,cby,status,opd_date,opd_time,opd,need_emi) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?,?,?,?,'1',?,?,?,?)`;
  
    connection.query(
      sqlInsert,
      [user_id,service_id, name, gender, age, address, mobile, email, service_name, service_date, service_time, amount, book_type,display_price,tax,user_id,service_date,service_time,opd_price,emi],
      (insertErr, insertResults) => {
        if (insertErr) {
          console.error(insertErr);
          return res.status(500).json({ message: "Error inserting data" });
        }
  
        // Retrieve the last inserted ID
        const lastInsertId = insertResults.insertId;
  
        // Construct the booking_id
        const booking_id = `CUR000${lastInsertId}`;
  
        // Update the record with the generated booking_id
        const sqlUpdate = `UPDATE common_book SET booking_id = ? WHERE id = ?`;
  
        connection.query(
          sqlUpdate,
          [booking_id, lastInsertId],
          (updateErr, updateResults) => {
            if (updateErr) {
              console.error(updateErr);
              return res.status(500).json({ message: "Error updating booking_id" });
            }
  
            console.log("Insertion successful");
            res.json({ message: "Insertion successful", result: updateResults });
          }
        );
      }
    );
  });



  app.post("/api/api/emiForm", async (req, res) => {
    // console.log(req.body);
    const name = req.body.name;
    const attendant_name= req.body.attendant_name;
    const age = req.body.age;
    const gender = req.body.gender;
    const mobile = req.body.mobile;
    const email = req.body.email;
    const reason_emi= req.body.reason_emi
    const selfi = req.body.selfi;
    const aadhaar = req.body.aadhaar;
    const amount = req.body.amount;
    const required_amount = req.body.required_amount;
    const address = req.body.address;
    const service_name = req.body.service_name;
    const service_id = req.body.service_id; 
    const book_type = req.body.book_type;
  
    const sqlInsert = `INSERT INTO emi_form(user_id, name,attendant_name, age, gender, mobile, email, reason_emi, selfi, aadhaar, amount, required_amount, cdate, address, service_name, service_id, book_type) VALUES ('1',?,?,?,?,?,?,?,?,?,?,?,NOW(),?,?,?,?)`;
  
    connection.query(
      sqlInsert,
      [name,attendant_name,age, gender, mobile, email, reason_emi,selfi,aadhaar,amount, required_amount, address, service_name,service_id,book_type],
      (insertErr, insertResults) => {
        if (insertErr) {
          console.error(insertErr);
          return res.status(500).json({ message: "Error inserting data" });
        }
  
        // Retrieve the last inserted ID
        const lastInsertId = insertResults.insertId;
  
        // Construct the booking_id
        const booking_id = `Emi000${lastInsertId}`;
  
        // Update the record with the generated booking_id
        const sqlUpdate = `UPDATE emi_form SET booking_id = ? WHERE id = ?`;
  
        connection.query(
          sqlUpdate,
          [booking_id, lastInsertId],
          (updateErr, updateResults) => {
            if (updateErr) {
              console.error(updateErr);
              return res.status(500).json({ message: "Error updating booking_id" });
            }
  
            console.log("Insertion successful");
            res.json({ message: "Insertion successful", result: updateResults });
          }
        );
      }
    );
  });
  

 


const phonepeRoute = require('./routes/phonepayRoute')
app.use("/api/api/api", phonepeRoute);


app.post("/api/api/updatePaymentTransactionSuccess", async (req, res) => {
  console.log(req.body,"updatePaymentTransactionSuccessCalled");

  const phoneNumber = req.body.phone;
  const transactionId = req.body.transaction_id;
  const user_id = req.body.user_id;
  const booking_id = req.body.booking_id
  const opd_transaction_id = req.body.opd_transaction_id
  const opd_payment_status = req.body.opd_payment_status
  const payment_status = req.body.payment_status

  const updateProfileQuery =
    "UPDATE common_book SET transaction_id = ?, payment_status = ? , payment_date = NOW(), opd_payment_status = ?, opd_transaction_id=? WHERE mobile = ? AND booking_id = ? AND user_id = ? ;";

  connection.query(
    updateProfileQuery,
    [transactionId,payment_status, opd_payment_status,opd_transaction_id, phoneNumber,booking_id,user_id],
    (updateErr, updateResults) => {
      if (updateErr) {
        console.error(updateErr);
        return res.status(500).json({ message: "Error updating status" });
      } else {
        console.log("Updation successful");
        res.json({ message: "Updation successful", result: updateResults });
      }
    }
  );
});

app.post("/api/api/updatePaymentTransactionFailure", async (req, res) => {
  console.log(req.body,"updatePaymentTransactionFailureCalled");

  const phoneNumber = req.body.phone;
  const transactionId = req.body.transaction_id;
  const user_id = req.body.user_id;
  const booking_id = req.body.booking_id
  const opd_transaction_id = req.body.opd_transaction_id
  const opd_payment_status = req.body.opd_payment_status
  const payment_status = req.body.payment_status

  const updateProfileQuery =
    "UPDATE common_book SET transaction_id = ?, payment_status = ? , payment_date = NOW(), opd_payment_status = ?, opd_transaction_id=? WHERE mobile = ? AND booking_id = ? AND user_id = ? ;";

  connection.query(
    updateProfileQuery,
    [transactionId,payment_status, opd_payment_status,opd_transaction_id, phoneNumber,booking_id,user_id],
    (updateErr, updateResults) => {
      if (updateErr) {
        console.error(updateErr);
        return res.status(500).json({ message: "Error updating status" });
      } else {
        console.log("Updation successful");
        res.json({ message: "Updation successful", result: updateResults });
      }
    }
  );
});




app.get('/api/api/totalAppointment', (req, res) => {
 
  const mobile = req.query.mobile;
  const userId = req.query.userId;
  connection.query('SELECT COUNT(*) AS count FROM common_book WHERE mobile = ? AND user_id = ? AND (book_type != "Consultation" AND book_type != "Ayurveda")', [mobile, userId], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    const count = results[0].count;
    console.log(count,"count")
    res.json({ count });
  });
});
pp.get('/api/api/totalEmi', (req, res) => {
 
  const mobile = req.query.mobile;
  const userId = req.query.userId;
  connection.query('SELECT COUNT(*) AS count FROM common_book WHERE mobile = ? AND user_id = ? AND need_emi = "yes" AND (service_name != "Voice Consultation" AND service_name != "Video Consultation" AND service_name != "Chat Consultation")', [mobile, userId], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    const count = results[0].count;
    res.json({ count });
  });
});
a

app.get('/api/api/totalVoice', (req, res) => {
 
  const mobile = req.query.mobile;
  const userId = req.query.userId;
  connection.query('SELECT COUNT(*) AS count FROM common_book WHERE mobile = ? AND service_name = "Voice Consultation" AND user_id = ? AND payment_status = 1', [mobile,userId],(error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    const count = results[0].count;
    console.log("967",count)
    res.json({ count });
  });
});


app.get('/api/api/totalVideo', (req, res) => {
 
  const mobile = req.query.mobile;
  const userId = req.query.userId;
  connection.query('SELECT COUNT(*) AS count FROM common_book WHERE mobile = ? AND service_name = "Video Consultation" AND user_id = ? AND payment_status = 1', [mobile,userId], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    const count = results[0].count;
    res.json({ count });
  });
});

app.get('/api/api/totalChat', (req, res) => {
 
  const mobile = req.query.mobile;
  const userId = req.query.userId;
  console.log(mobile,userId)
  connection.query('SELECT COUNT(*) AS count FROM common_book WHERE mobile = ? AND service_name = "Chat Consultation" AND user_id = ? AND payment_status = 1', [mobile,userId],(error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    const count = results[0].count;
    res.json({ count });
  });
});


app.get('/api/api/totalVoiceData', (req, res) => {
  const mobile = req.query.mobile;
  const userId = req.query.userId;

  const query = `
    SELECT 
        cb.booking_id, 
        cb.service_id,
        cb.service_name, 
        cb.service_date, 
        cb.service_time, 
        cb.amount, 
        cb.payment_status, 
        cb.status, 
        cb.payment_date, 
        cb.book_type, 
        cb.tax, 
        cb.read_status, 
        cb.update_date, 
        cb.reason, 
        cb.opd, 
        cb.display_price, 
        cb.opd_date, 
        cb.opd_time, 
        cb.opd_payment_status, 
        cb.opd_transaction_id,
        cb.cdate,
        md.name AS doctor_name
    FROM 
        common_book cb
    JOIN 
        manage_doctor md
    ON 
        cb.service_id = md.doctor_id
    WHERE 
        cb.mobile = ? 
        AND cb.service_name = "Voice Consultation" 
        AND cb.user_id = ? 
        AND cb.payment_status = 1;
  `;

  connection.query(query, [mobile, userId], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).send('Internal Server Error');
    }

    res.status(200).json(results);
  });
});


app.get('/api/api/totalVideoData', (req, res) => {
 
  const mobile = req.query.mobile;
  const userId = req.query.userId;
  const query = `
    SELECT 
        cb.booking_id, 
        cb.service_id,
        cb.service_name, 
        cb.service_date, 
        cb.service_time, 
        cb.amount, 
        cb.payment_status, 
        cb.status, 
        cb.payment_date, 
        cb.book_type, 
        cb.tax, 
        cb.read_status, 
        cb.update_date, 
        cb.reason, 
        cb.opd, 
        cb.display_price, 
        cb.opd_date, 
        cb.opd_time, 
        cb.opd_payment_status, 
        cb.opd_transaction_id,
        cb.cdate,
        md.name AS doctor_name
    FROM 
        common_book cb
    JOIN 
        manage_doctor md
    ON 
        cb.service_id = md.doctor_id
    WHERE 
        cb.mobile = ? 
        AND cb.service_name = "Video Consultation" 
        AND cb.user_id = ? 
        AND cb.payment_status = 1;
  `;

  connection.query(query, [mobile, userId], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).send('Internal Server Error');
    }

    res.status(200).json(results);
  });
});


app.get('/api/api/totalChatData', (req, res) => {
 
  const mobile = req.query.mobile;
  const userId = req.query.userId;
  const query = `
    SELECT 
        cb.booking_id, 
        cb.service_id,
        cb.service_name, 
        cb.service_date, 
        cb.service_time, 
        cb.amount, 
        cb.payment_status, 
        cb.status, 
        cb.payment_date, 
        cb.book_type, 
        cb.tax, 
        cb.read_status, 
        cb.update_date, 
        cb.reason, 
        cb.opd, 
        cb.display_price, 
        cb.opd_date, 
        cb.opd_time, 
        cb.opd_payment_status, 
        cb.opd_transaction_id,
        cb.cdate,
        md.name AS doctor_name
    FROM 
        common_book cb
    JOIN 
        manage_doctor md
    ON 
        cb.service_id = md.doctor_id
    WHERE 
        cb.mobile = ? 
        AND cb.service_name = "Chat Consultation" 
        AND cb.user_id = ? 
        AND cb.payment_status = 1;
  `;

  connection.query(query, [mobile, userId], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).send('Internal Server Error');
    }

    res.status(200).json(results);
  });
});




app.get('/api/api/treatmentList', async (req, res) => {
  const { mobile, userId } = req.query;

console.log(mobile,userId)
  const query = `
    (
      SELECT 
        cb.booking_id, 
        cb.service_id,
        cb.service_name,
        cb.name,
        cb.mobile, 
        cb.service_date, 
        cb.service_time, 
        cb.amount, 
        cb.payment_status,  
        cb.status, 
        cb.payment_date, 
        cb.book_type, 
        cb.opd,  
        cb.opd_date, 
        cb.opd_time, 
        cb.opd_payment_status, 
        cb.opd_transaction_id,
        s.hospital AS hospital_id,
        h.name AS hospital_name
      FROM 
        common_book cb
      JOIN 
        surgery s ON cb.service_id = s.ser_id
      JOIN 
        manage_hospital h ON s.hospital = h.hos_id
      WHERE 
        cb.mobile = ? AND cb.user_id = ? AND cb.book_type = 'surgery'
    )
    UNION ALL
    (
      SELECT 
        cb.booking_id, 
        cb.service_id,
        cb.service_name, 
        cb.name,
        cb.mobile, 
        cb.service_date, 
        cb.service_time, 
        cb.amount, 
        cb.payment_status,  
        cb.status, 
        cb.payment_date, 
        cb.book_type, 
        cb.opd,  
        cb.opd_date, 
        cb.opd_time, 
        cb.opd_payment_status, 
        cb.opd_transaction_id,
        d.hospital AS hospital_id,
        h.name AS hospital_name
      FROM 
        common_book cb
      JOIN 
        dental d ON cb.service_id = d.ser_id
      JOIN 
        manage_hospital h ON d.hospital = h.hos_id
      WHERE 
        cb.mobile = ? AND cb.user_id = ? AND cb.book_type = 'dental'
    )
    UNION ALL
    (
      SELECT 
        cb.booking_id, 
        cb.service_id,
        cb.service_name,
        cb.name,
        cb.mobile, 
        cb.service_date, 
        cb.service_time, 
        cb.amount, 
        cb.payment_status,  
        cb.status, 
        cb.payment_date, 
        cb.book_type, 
        cb.opd,  
        cb.opd_date, 
        cb.opd_time, 
        cb.opd_payment_status, 
        cb.opd_transaction_id,
        h.hospital AS hospital_id,
        mh.name AS hospital_name
      FROM 
        common_book cb
      JOIN 
        hair h ON cb.service_id = h.ser_id
      JOIN 
        manage_hospital mh ON h.hospital = mh.hos_id
      WHERE 
        cb.mobile = ? AND cb.user_id = ? AND cb.book_type = 'hair'
    )
    UNION ALL
    (
      SELECT 
        cb.booking_id, 
        cb.service_id,
        cb.service_name,
        cb.name,
        cb.mobile,   
        cb.service_date, 
        cb.service_time, 
        cb.amount, 
        cb.payment_status,  
        cb.status, 
        cb.payment_date, 
        cb.book_type, 
        cb.opd,  
        cb.opd_date, 
        cb.opd_time, 
        cb.opd_payment_status, 
        cb.opd_transaction_id,
        ivf.hospital AS hospital_id,
        mh.name AS hospital_name
      FROM 
        common_book cb
      JOIN 
        ivf ivf ON cb.service_id = ivf.ser_id
      JOIN 
        manage_hospital mh ON ivf.hospital = mh.hos_id
      WHERE 
        cb.mobile = ? AND cb.user_id = ? AND cb.book_type = 'IVF'
    );
  `;

  connection.query(query, [mobile, userId, mobile, userId, mobile, userId, mobile, userId], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
    // console.log(results);
  });
});






app.post("/api/api/updateTransactionSuccess", async (req, res) => {
  // console.log(req.body);

  const phoneNumber = req.body.phone;
  const transactionId = req.body.transaction_id;
  const service_name = req.body.service_name;
  const user_id = req.body.user_id

  const updateProfileQuery =
    "UPDATE common_book SET transaction_id = ?, payment_status = '1' , payment_date = NOW() WHERE mobile = ? AND service_name = ? AND user_id = ?;";

  connection.query(
    updateProfileQuery,
    [transactionId,  phoneNumber,service_name,user_id],
    (updateErr, updateResults) => {
      if (updateErr) {
        console.error(updateErr);
        return res.status(500).json({ message: "Error updating status" });
      } else {
        // console.log("Updation successful");
        res.json({ message: "Updation successful", result: updateResults });
      }
    }
  );
});

app.post("/api/api/updateTransactionFailure", async (req, res) => {
  // console.log(req.body);

  const phoneNumber = req.body.phone;
  const transactionId = req.body.transaction_id;
  const service_name = req.body.service_name;
  const user_id = req.body.user_id

  const updateProfileQuery =
    "UPDATE common_book SET transaction_id = ?, payment_status = '0' , payment_date = NOW() WHERE mobile = ? AND service_name = ? AND user_id= ?";

  connection.query(
    updateProfileQuery,
    [transactionId,  phoneNumber, service_name,user_id],
    (updateErr, updateResults) => {
      if (updateErr) {
        console.error(updateErr);
        return res.status(500).json({ message: "Error updating status" });
      } else {
        console.log("Updation successful");
        res.json({ message: "Updation successful", result: updateResults });
      }
    }
  );
});




app.post("/api/api/bookSurgeryForConsultation", async (req, res) => {
  // console.log(req.body);
  const user_id = req.body.user_id;
  const service_id = req.body.service_id;
  const name = req.body.name;
  const gender = req.body.gender;
  const age = req.body.age;
  const address = req.body.address;
  const mobile = req.body.mobile;
  const email = req.body.email;
  const service_name = req.body.service_name;
  const service_date = req.body.service_date;
  const service_time = req.body.service_time;
  const amount = req.body.amount;
  const book_type = req.body.book_type;

  const sqlInsert = `INSERT INTO common_book (user_id,service_id, name, gender, age, address, mobile, email, service_name, service_date, service_time, amount, cdate, book_type,cby) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?,?)`;

  connection.query(
    sqlInsert,
    [user_id,service_id, name, gender, age, address, mobile, email, service_name, service_date, service_time, amount, book_type,user_id],
    (insertErr, insertResults) => {
      if (insertErr) {
        console.error(insertErr);
        return res.status(500).json({ message: "Error inserting data" });
      }

      // Retrieve the last inserted ID
      const lastInsertId = insertResults.insertId;

      // Construct the booking_id
      const booking_id = `CUR000${lastInsertId}`;

      // Update the record with the generated booking_id
      const sqlUpdate = `UPDATE common_book SET booking_id = ? WHERE id = ?`;

      connection.query(
        sqlUpdate,
        [booking_id, lastInsertId],
        (updateErr, updateResults) => {
          if (updateErr) {
            console.error(updateErr);
            return res.status(500).json({ message: "Error updating booking_id" });
          }

          console.log("Insertion successful");
          res.json({ message: "Insertion successful", result: updateResults });
        }
      );
    }
  );
});






app.listen(port, () => {
  console.log("server is running");
});
