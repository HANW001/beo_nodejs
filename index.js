const express = require('express')
const path = require('path');
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const static = require('serve-static');
const router = require("./routes/user"); //라우터 모듈 등록 (라우터 모듈안에 다이어리 스키마 모듈을 불러오고 있으므로 아래와 같이 라우터만!
const giftRouter = require("./routes/gift"); 

const passport = require('passport')
const KakaoStrategy = require('passport-kakao').Strategy
// const summuryRouter = require("./routes/summury"); 
let sequelize = require('./models/index').sequelize;
let app = express();
sequelize.sync();

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(cookieParser());
app.use(
    session({
        key: "loginData",
        secret: "testSecret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60 * 60 * 24
        }
    })
);
app
    .use(express.static(path.join(__dirname, 'upload')))
    .use(static(path.join(__dirname, 'upload')))
    .use('/api/', router)
    .use('/gift/', giftRouter)
    // .use('/summury/', summuryRouter)
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));


// https://kakao-tam.tistory.com/65?category=866966 카카오 로그인
app.use(passport.initialize())
app.use(passport.session())

passport.use(new KakaoStrategy({
        clientID : "592b62707a03c5616e19cdbbf985a42b", //"REST API KEY를 입력하세요" 근데 JS키 사용함
        clientSecret: "", // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
        callbackURL : "http://localhost:5000/oauth"
    },
    (accessToken, refreshToken, profile, done) => {
        // authorization 에 성공했을때의 액션
        console.log(`accessToken : ${accessToken}`)
        console.log(`사용자 profile: ${JSON.stringify(profile._json)}`)
        let user = {
            profile: profile._json,
            accessToken: accessToken
        }
        return done(null, user)
        // return done('true', user)
    }
))

passport.serializeUser(function (user, done) {
    console.log(`user : ${user.profile.id}`)
    done(null, user)
})
passport.deserializeUser(function (obj, done) {
    console.log(`obj : ${obj}`)
    done(null, obj)
})

app.get('/oauth', passport.authenticate('kakao'), function (req, res) {
    // 로그인 시작시 state 값을 받을 수 있음
    res.send(`id : ${req.user.profile.id} / accessToken : ${req.user.accessToken} `)
})



