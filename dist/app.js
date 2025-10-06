"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const routes_1 = __importDefault(require("./routes"));
const morgen_1 = require("./shared/morgen");
const globalErrorHandler_1 = __importDefault(require("./globalErrorHandler/globalErrorHandler"));
const notFound_1 = require("./app/middleware/notFound");
const welcome_1 = require("./utils/welcome");
const config_1 = __importDefault(require("./config"));
const path_1 = __importDefault(require("path"));
const cronJobs_1 = __importDefault(require("./utils/cronJobs"));
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
//morgan
app.use(morgen_1.Morgan.successHandler);
app.use(morgen_1.Morgan.errorHandler);
//body parser
// app.use(
//      cors({
//           origin: config.allowed_origins || '*',
//           credentials: true,
//      }),
// );
app.use((0, cors_1.default)({ origin: ['http://10.10.7.21:3000', 'https://mijanur3000.binarybards.online', "https://dashboard.raconliapp.com", "https://www.dashboard.raconliapp.com", "https://api.raconliapp.com", "https://www.api.raconliapp.com"], credentials: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Session configuration for OAuth
app.use((0, express_session_1.default)({
    secret: config_1.default.express_session,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: config_1.default.node_env === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
}));
//file retrieve
app.use(express_1.default.static('uploads'));
app.use(express_1.default.static('public'));
//router
app.use('/api/v1', routes_1.default);
//live response
app.get('/', (req, res) => {
    res.send((0, welcome_1.welcome)());
});
//global error handle
app.use(globalErrorHandler_1.default);
//handle not found route;
app.use(notFound_1.notFound);
(0, cronJobs_1.default)();
exports.default = app;
