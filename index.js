const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const static = require("serve-static");
const router = require("./routes/user"); //라우터 모듈 등록 (라우터 모듈안에 다이어리 스키마 모듈을 불러오고 있으므로 아래와 같이 라우터만!
const giftRouter = require("./routes/gift");
const adminRouter = require("./routes/admin");
const fs = require("fs");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
var mysql = require("mysql");
// const summuryRouter = require("./routes/summury");
let sequelize = require("./models/index").sequelize;
const { response } = require("express");
let app = express();

const mainPage = fs.readFileSync("views/pages/admin.ejs", "utf8");

app.use(static(path.join(__dirname, "views/page/images")));
app.use(static(path.join(__dirname, "views/page/fonts")));

var connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "beo",
  multipleStatements: true,
});

app.use(express.json());
app.use(bodyParser.urlencoded());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

sequelize.sync();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  session({
    key: "loginData",
    secret: "testSecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);
app
  .use(express.static(path.join(__dirname, "upload")))
  .use(static(path.join(__dirname, "upload")))
  .use("/api/", router)
  .use("/gift/", giftRouter)
  .use("/admin/", adminRouter)
  // .use('/summury/', summuryRouter)
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  // .get('/', (req, res) => res.render('pages/admin'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

// https://kakao-tam.tistory.com/65?category=866966 카카오 로그인
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new KakaoStrategy(
    {
      clientID: "592b62707a03c5616e19cdbbf985a42b", //"REST API KEY를 입력하세요" 근데 JS키 사용함
      clientSecret: "", // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
      callbackURL: "http://localhost:5000/oauth",
    },
    (accessToken, refreshToken, profile, done) => {
      // authorization 에 성공했을때의 액션
      console.log(`accessToken : ${accessToken}`);
      console.log(`refreshToken : ${refreshToken}`);
      console.log(`사용자 profile: ${JSON.stringify(profile._json)}`);
      let user = {
        profile: profile._json,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return done(null, user);
      // return done('true', user)
    }
  )
);

passport.serializeUser(function (user, done) {
  console.log(`user : ${user.profile.id}`);
  console.log(`properties : ${user.profile.connected_at}`);
  console.log(`properties : ${user.profile.properties.nickname}`);
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  console.log(`obj : ${obj}`);
  done(null, obj);
});

app.get("/oauth", passport.authenticate("kakao"), function (req, res) {
  // 로그인 시작시 state 값을 받을 수 있음
  // res.send(`id : ${req.user.profile.id} / accessToken : ${req.user.accessToken} / nickname : ${req.user.profile.properties.nickname} `)
  // res.send(`nickname : ${req.user.profile.properties.nickname} nickname : ${req.user.profile.properties.profile_image}`)
  //   console.log(req.user.profile.login);
  //   res.json({login: true,id:req.user.profile.id, nickname:req.user.profile.properties.nickname, img:req.user.profile.properties.profile_image,email:req.user.profile.kakao_account.email})
  if (req.user.profile.id ) {
    res.sendFile(__dirname + "/views/page/gift2.html");
  } else {
    connection.query(
      "insert into users values(?,?,?,?,?)",
      [
        req.user.profile.id,
        null,
        req.user.profile.properties.nickname,
        req.user.profile.kakao_account.email,
        req.user.profile.properties.profile_image,
      ],
      function (error, results) {
        console.log(results);
        if (error) {
          console.log(error);
        } else {
        //   res.send(results);
          console.log(results);
        }
        // res.json(results)
      }
    );
    res.sendFile(__dirname + "/views/page/gift2.html");
  }
  // console.log(req.user);
});

app.get("/", (req, res) => {
  var page = ejs.render(mainPage, {
    title: "Temporary Title",
  });
  res.send(page);
});

app.get("/gift2", (req, res) => {
  res.sendFile(__dirname + "/views/page/gift2.html");
});

app.get("/mypage", (req, res) => {
  res.sendFile(__dirname + "/views/page/mypage.html");
});

app.get("/link", (req, res) => {
  res.sendFile(__dirname + "/views/page/link.html");
});

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/views/page/login.html");
  });
