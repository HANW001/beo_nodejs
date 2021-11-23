const express = require("express");
const fs = require("fs");
const ejs = require("ejs");
const bodyParser = require("body-parser");
let empty = require('is-empty');
const bcrypt = require('bcrypt');
const { users } = require("../models");
let router = express.Router();
const saltRounds = 10;
const mainPage = fs.readFileSync("views/pages/admin.ejs", "utf8");
const listPage = fs.readFileSync("views/pages/list.ejs", "utf8");

var mysql = require("mysql");
const { resourceLimits } = require("worker_threads");
var connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "beo",
  multipleStatements: true,
});

router.post('/login', async (req, res, next) => {
  let id = req.body.id;
  let password = req.body.password;
  if (!empty(id) && !empty(password)) {
    users.findOne({where: {id: id}})
      .then(results => {
          bcrypt.compare(password, results.password, (error, result) => {
              if(error){throw error}else{
                  if (result) {
                      req.session.loginData = {id: id, password: password};
                      req.session.save(error => {
                          if (error) console.log(error)
                      })
                      res.send(results);
                      
                      // res.json(result);
                  } else {
                      // res.json(result);
                      res.json({result: false, error: null, data: null});
                  }
              }
              
          })
      })
      .catch(err => {
          console.error(err);
          res.json({result: false, error: null, data: null});
      });
     
  } else {
      console.error(err);
      res.json({result: false, error: null, data: null});
  }
});

function isEmpty(str) {
  if (typeof str == "undefined" || str == null || str == "") {
    return '';
  } else {
    return str;
  }
}

router.post('/register', async (req, res, next) => {
  let id = req.body.id;
  let password = req.body.password;
  let names = req.body.names;
  let email = req.body.email;
  let img = req.body.img;
  console.log(password);
  if (!empty(id) && !empty(password)) {
      if (users.findOne({where: {id: id}}) == id) {
          res.json({result: false, error: null, data: null});
          console.log(res.json);
      }
      bcrypt.hash(password, saltRounds, (error, hash) => {
          password = hash;
          users.create({
              id: id ,
              password: password,
              names:names,
              email:isEmpty(email),
              img:isEmpty(img)
            
          })
              .then(result => {
                  res.json({result: result, error: null, data: null});
              })
              .catch(err => {
                  console.error(err);
                  res.json({result: false, error: err, data: null});
              });
      })
  } else {
      res.json({result: false, error: null, data: null});
  }
});

router.get("/ages", (req, res) => {
  connection.query("select * from ages", function (error, results) {
    console.log(results);
    if (error) {
      console.log(error);
    } else {
      res.send(results);
      console.log(results);
    }
    // res.json(results)
  });
});

router.post("/ages", (req, res) => {
  let Ages = req.body.Ages;
  let AgeName = req.body.AgeName;
  let parms = [Ages, AgeName];

  connection.query(
    "insert into ages values(?,?)",
    parms,
    function (error, results) {
      console.log(results);
      if (error) {
        console.log(error);
      } else {
        res.send(results);
        console.log(results);
      }
      // res.json(results)
    }
  );
});

router.delete("/ages", (req, res) => {
  let Ages = req.body.Ages;
  let parms = [Ages];

  connection.query(
    "delete from ages where Ages=?",
    parms,
    function (error, results) {
      console.log(results);
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        res.send(results);
        console.log(results);
      }
      // res.json(results)
    }
  );
});

router.put("/ages", (req, res) => {
  let Ages = req.body.Ages;
  let AgeName = req.body.AgeName;
  let originalAges = req.body.originalAges;
  let parms = [AgeName, Ages, originalAges];
  console.log(Ages);
  console.log(AgeName);
  console.log(originalAges);
  connection.query(
    "update beo.ages set AgeName=?, Ages=? where Ages=? ",
    parms,
    function (error, results) {
      console.log(results);
      if (error) {
        console.log(error);
      } else {
        res.send(results);
        console.log(results);
      }
      // res.json(results)
    }
  );
});


router.get("/category", (req, res) => {
  connection.query("select * from category", function (error, results) {
    console.log(results);
    if (error) {
      console.log(error);
    } else {
      res.send(results);
      console.log(results);
    }
    // res.json(results)
  });
});

router.post("/category", (req, res) => {
  let Category = req.body.Category;
  let CategoryName = req.body.CategoryName;
  let parms = [Category, CategoryName];

  connection.query(
    "insert into category values(?,?)",
    parms,
    function (error, results) {
      console.log(results);
      if (error) {
        console.log(error);
      } else {
        res.send(results);
        console.log(results);
      }
      // res.json(results)
    }
  );
});

router.delete("/category", (req, res) => {
  let Category = req.body.Category;
  let parms = [Category];

  connection.query(
    "delete from category where Category=?",
    parms,
    function (error, results) {
      console.log(results);
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        res.send(results);
        console.log(results);
      }
      // res.json(results)
    }
  );
});

router.put("/category", (req, res) => {
  let Category = req.body.Category;
  let CategoryName = req.body.CategoryName;
  let originalAges = req.body.originalCategory;
  let parms = [Category, CategoryName, originalAges];
  connection.query(
    "update beo.category set Category=?, CategoryName=? where Category=? ",
    parms,
    function (error, results) {
      console.log(results);
      if (error) {
        console.log(error);
      } else {
        res.send(results);
        console.log(results);
      }
      // res.json(results)
    }
  );
});

router.get("/gifttypes", (req, res) => {
  connection.query("select * from gifttypes", function (error, results) {
    console.log(results);
    if (error) {
      console.log(error);
    } else {
      res.send(results);
      console.log(results);
    }
    // res.json(results)
  });
});

router.post("/gifttypes", (req, res) => {
  let GiftType = req.body.GiftType;
  let GiftTypeName = req.body.GiftTypeName;
  let parms = [GiftType, GiftTypeName];

  connection.query(
    "insert into gifttypes values(?,?)",
    parms,
    function (error, results) {
      console.log(results);
      if (error) {
        console.log(error);
      } else {
        res.send(results);
        console.log(results);
      }
      // res.json(results)
    }
  );
});

router.delete("/gifttypes", (req, res) => {
  let GiftType = req.body.GiftType;
  let parms = [GiftType];

  connection.query(
    "delete from gifttypes where GiftType=?",
    parms,
    function (error, results) {
      console.log(results);
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        res.send(results);
        console.log(results);
      }
      // res.json(results)
    }
  );
});

router.put("/gifttypes", (req, res) => {
  let GiftType = req.body.GiftType;
  let GiftTypeName = req.body.GiftTypeName;
  let originalGiftType = req.body.originalGiftType;
  let parms = [GiftType, GiftTypeName, originalGiftType];
  connection.query(
    "update beo.category set GiftType=?, GiftTypeName=? where GiftType=? ",
    parms,
    function (error, results) {
      console.log(results);
      if (error) {
        console.log(error);
      } else {
        res.send(results);
        console.log(results);
      }
      // res.json(results)
    }
  );
});

router.get("/interest", (req, res) => {
  connection.query("select * from interest", function (error, results) {
    console.log(results);
    if (error) {
      console.log(error);
    } else {
      res.send(results);
      console.log(results);
    }
    // res.json(results)
  });
});

router.post("/interest", (req, res) => {
  let Interest = req.body.Interest;
  let InterestName = req.body.InterestName;
  let parms = [Interest, InterestName];

  connection.query(
    "insert into interest values(?,?)",
    parms,
    function (error, results) {
      console.log(results);
      if (error) {
        console.log(error);
      } else {
        res.send(results);
        console.log(results);
      }
      // res.json(results)
    }
  );
});

router.get("/keywords", (req, res) => {
  connection.query("select * from keywords", function (error, results) {
    console.log(results);
    if (error) {
      console.log(error);
    } else {
      res.send(results);
      console.log(results);
    }
    // res.json(results)
  });
});

router.post("/keywords", (req, res) => {
  let Keyword = req.body.Keyword;
  let KeywordName = req.body.KeywordName;
  let parms = [Keyword, KeywordName];

  connection.query(
    "insert into keywords values(?,?)",
    parms,
    function (error, results) {
      console.log(results);
      if (error) {
        console.log(error);
      } else {
        res.send(results);
        console.log(results);
      }
      // res.json(results)
    }
  );
});

router.get("/natures", (req, res) => {
  connection.query("select * from natures", function (error, results) {
    console.log(results);
    if (error) {
      console.log(error);
    } else {
      res.send(results);
      console.log(results);
    }
    // res.json(results)
  });
});

router.post("/natures", (req, res) => {
  let Nature = req.body.Nature;
  let NatureName = req.body.NatureName;
  let Priority = req.body.Priority;
  let parms = [Nature, NatureName, Priority];

  connection.query(
    "insert into natures values(?,?,?)",
    parms,
    function (error, results) {
      console.log(results);
      if (error) {
        console.log(error);
      } else {
        res.send(results);
        console.log(results);
      }
      // res.json(results)
    }
  );
});

router.get("/price", (req, res) => {
  connection.query("select * from prices", function (error, results) {
    console.log(results);
    if (error) {
      console.log(error);
    } else {
      res.send(results);
      console.log(results);
    }
    // res.json(results)
  });
});

router.post("/price", (req, res) => {
  let PriceRange = req.body.PriceRange;
  let ToPrice = req.body.ToPrice;
  let FromPrice = req.body.FromPrice;
  let parms = [PriceRange, FromPrice, ToPrice];
  console.log(PriceRange);
  console.log(ToPrice);
  console.log(FromPrice);

  connection.query(
    "insert into prices values(?,?,?)",
    parms,
    function (error, results) {
      console.log(results);
      if (error) {
        console.log(error);
      } else {
        res.send(results);
        console.log(results);
      }
      // res.json(results)
    }
  );
});

router.get("/products", (req, res) => {
  connection.query("select * from products", function (error, results) {
    console.log(results);
    if (error) {
      console.log(error);
    } else {
      res.send(results);
      console.log(results);
    }
    // res.json(results)
  });
});

router.post("/products", (req, res) => {
  let ProductID = req.body.ProductID;
  let ProductName = req.body.ProductName;
  let Price = req.body.Price;
  let ProductDesc = req.body.ProductDesc;
  let Reason = req.body.Reason;
  let ReasonEdit = req.body.ReasonEdit;
  let SiteLink = req.body.SiteLink;
  let TagLines = req.body.TagLines;
  let Custom = req.body.Custom;
  let Property = req.body.Property;
  let CreateName = req.body.CreateName;
  let CreateDate = req.body.CreateDate;
  let Gender = req.body.Gender;
  let DbKeepon = req.body.DbKeepon;
  let parms = [
    ProductID,
    ProductName,
    Price,
    ProductDesc,
    Reason,
    ReasonEdit,
    SiteLink,
    TagLines,
    Custom,
    Property,
    CreateName,
    CreateDate,
    Gender,
    DbKeepon,
  ];

  connection.query(
    "insert into products values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    parms,
    function (error, results) {
      console.log(results);
      if (error) {
        console.log(error);
      } else {
        res.send(results);
        console.log(results);
      }
      // res.json(results)
    }
  );
});

router.get("/purposes", (req, res) => {
  connection.query("select * from purposes", function (error, results) {
    console.log(results);
    if (error) {
      console.log(error);
    } else {
      res.send(results);
      console.log(results);
    }
    // res.json(results)
  });
});

router.post("/purposes", (req, res) => {
  let Purpose = req.body.Purpose;
  let PurposeName = req.body.PurposeName;
  let parms = [Purpose, PurposeName];

  connection.query(
    "insert into purposes values(?,?)",
    parms,
    function (error, results) {
      console.log(results);
      if (error) {
        console.log(error);
      } else {
        res.send(results);
        console.log(results);
      }
      // res.json(results)
    }
  );
});

router.get("/relations", (req, res) => {
  connection.query("select * from relations", function (error, results) {
    console.log(results);
    if (error) {
      console.log(error);
    } else {
      res.send(results);
      console.log(results);
    }
    // res.json(results)
  });
});

router.post("/relations", (req, res) => {
  let Relation = req.body.Relation;
  let RelationName = req.body.RelationName;
  let parms = [Relation, RelationName];

  connection.query(
    "insert into relations values(?,?)",
    parms,
    function (error, results) {
      console.log(results);
      if (error) {
        console.log(error);
      } else {
        res.send(results);
        console.log(results);
      }
      // res.json(results)
    }
  );
});

router.get("/temp_age", (req, res) => {
  connection.query("select * from temp_age", function (error, results) {
    console.log(results);
    if (error) {
      console.log(error);
    } else {
      res.send(results);
      console.log(results);
    }
    // res.json(results)
  });
});

router.post("/temp_age", (req, res) => {
  let ProductID = req.body.ProductID;
  let n1 = req.body.n1;
  let n2 = req.body.n2;
  let n3 = req.body.n3;
  let n4 = req.body.n4;
  let n5 = req.body.n5;
  let n6 = req.body.n6;
  let n7 = req.body.n7;
  let n8 = req.body.n8;
  let n9 = req.body.n9;
  let n10 = req.body.n10;
  let n11 = req.body.n11;
  let parms = [ProductID, n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11];

  connection.query(
    "insert into temp_age values(?,?,?,?,?,?,?,?,?,?,?,?)",
    parms,
    function (error, results) {
      console.log(results);
      if (error) {
        console.log(error);
      } else {
        res.send(results);
        console.log(results);
      }
      // res.json(results)
    }
  );
});

router.get("/temp_category", (req, res) => {
  connection.query("select * from temp_category", function (error, results) {
    console.log(results);
    if (error) {
      console.log(error);
    } else {
      res.send(results);
      console.log(results);
    }
    // res.json(results)
  });
});

router.post("/temp_category", (req, res) => {
  let ProductID = req.body.ProductID;
  let n1 = req.body.n1;
  let n2 = req.body.n2;
  let n3 = req.body.n3;
  let n4 = req.body.n4;
  let n5 = req.body.n5;

  let parms = [ProductID, n1, n2, n3, n4, n5];

  connection.query(
    "insert into temp_category values(?,?,?,?,?,?)",
    parms,
    function (error, results) {
      console.log(results);
      if (error) {
        console.log(error);
      } else {
        res.send(results);
        console.log(results);
      }
      // res.json(results)
    }
  );
});

router.get("/temp_interest", (req, res) => {
  connection.query("select * from temp_interest", function (error, results) {
    console.log(results);
    if (error) {
      console.log(error);
    } else {
      res.send(results);
      console.log(results);
    }
    // res.json(results)
  });
});

router.post("/temp_interest", (req, res) => {
  let ProductID = req.body.ProductID;
  let n1 = req.body.n1;
  let n2 = req.body.n2;
  let n3 = req.body.n3;
  let n4 = req.body.n4;
  let n5 = req.body.n5;
  let n6 = req.body.n6;
  let n7 = req.body.n7;
  let n8 = req.body.n8;

  let parms = [ProductID, n1, n2, n3, n4, n5, n6, n7, n8];

  connection.query(
    "insert into temp_interest values(?,?,?,?,?,?,?,?,?)",
    parms,
    function (error, results) {
      console.log(results);
      if (error) {
        console.log(error);
      } else {
        res.send(results);
        console.log(results);
      }
      // res.json(results)
    }
  );
});

router.get("/temp_nature", (req, res) => {
  connection.query("select * from temp_nature", function (error, results) {
    console.log(results);
    if (error) {
      console.log(error);
    } else {
      res.send(results);
      console.log(results);
    }
    // res.json(results)
  });
});

router.post("/temp_nature", (req, res) => {
  let ProductID = req.body.ProductID;
  let n1 = req.body.n1;
  let n2 = req.body.n2;

  let parms = [ProductID, n1, n2];

  connection.query(
    "insert into temp_nature values(?,?,?)",
    parms,
    function (error, results) {
      console.log(results);
      if (error) {
        console.log(error);
      } else {
        res.send(results);
        console.log(results);
      }
      // res.json(results)
    }
  );
});

router.get("/temp_purpose", (req, res) => {
  connection.query("select * from temp_purpose", function (error, results) {
    console.log(results);
    if (error) {
      console.log(error);
    } else {
      res.send(results);
      console.log(results);
    }
    // res.json(results)
  });
});

router.post("/temp_purpose", (req, res) => {
  let ProductID = req.body.ProductID;
  let n1 = req.body.n1;
  let n2 = req.body.n2;
  let n3 = req.body.n3;
  let n4 = req.body.n4;
  let n5 = req.body.n5;
  let n6 = req.body.n6;
  let n7 = req.body.n7;
  let n8 = req.body.n8;
  let n9 = req.body.n9;
  let n10 = req.body.n10;
  let n11 = req.body.n11;
  let n12 = req.body.n12;
  let n13 = req.body.n13;
  let n14 = req.body.n14;
  let n15 = req.body.n15;
  let n16 = req.body.n16;
  let n17 = req.body.n17;
  let n18 = req.body.n18;

  let parms = [
    ProductID,
    n1,
    n2,
    n3,
    n4,
    n5,
    n6,
    n7,
    n8,
    n9,
    n10,
    n11,
    n12,
    n13,
    n14,
    n15,
    n16,
    n17,
    n18,
  ];

  connection.query(
    "insert into temp_purpose values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    parms,
    function (error, results) {
      console.log(results);
      if (error) {
        console.log(error);
      } else {
        res.send(results);
        console.log(results);
      }
      // res.json(results)
    }
  );
});

router.get("/temp_relation", (req, res) => {
  connection.query("select * from temp_relation", function (error, results) {
    console.log(results);
    if (error) {
      console.log(error);
    } else {
      res.send(results);
      console.log(results);
    }
    // res.json(results)
  });
});

router.post("/temp_relation", (req, res) => {
  let ProductID = req.body.ProductID;
  let n1 = req.body.n1;
  let n2 = req.body.n2;
  let n3 = req.body.n3;
  let n4 = req.body.n4;
  let n5 = req.body.n5;
  let n6 = req.body.n6;
  let n7 = req.body.n7;
  let n8 = req.body.n8;
  let n9 = req.body.n9;
  let n10 = req.body.n10;

  let parms = [ProductID, n1, n2, n3, n4, n5, n6, n7, n8, n9, n10];

  connection.query(
    "insert into temp_relation values(?,?,?,?,?,?,?,?,?,?,?)",
    parms,
    function (error, results) {
      console.log(results);
      if (error) {
        console.log(error);
      } else {
        res.send(results);
        console.log(results);
      }
      // res.json(results)
    }
  );
});

router.get("/temp_season", (req, res) => {
  connection.query("select * from temp_season", function (error, results) {
    console.log(results);
    if (error) {
      console.log(error);
    } else {
      res.send(results);
      console.log(results);
    }
    // res.json(results)
  });
});

router.post("/temp_season", (req, res) => {
  let ProductID = req.body.ProductID;
  let n1 = req.body.n1;
  let n2 = req.body.n2;
  let n3 = req.body.n3;
  let n4 = req.body.n4;
  let n5 = req.body.n5;
  let n6 = req.body.n6;
  let n7 = req.body.n7;
  let n8 = req.body.n8;
  let n9 = req.body.n9;
  let n10 = req.body.n10;
  let n11 = req.body.n11;
  let n12 = req.body.n12;

  let parms = [ProductID, n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11, n12];

  connection.query(
    "insert into temp_season values(?,?,?,?,?,?,?,?,?,?,?,?,?)",
    parms,
    function (error, results) {
      console.log(results);
      if (error) {
        console.log(error);
      } else {
        res.send(results);
        console.log(results);
      }
      // res.json(results)
    }
  );
});

module.exports = router;
