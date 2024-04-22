const express = require('express');
const morgan = require('morgan');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const globalErroHandler = require('./controllers/errorController');
const cookieParser = require('cookie-parser');
var cors = require('cors');

const app = express();
const serviceRouter = require('./routes/laboratories/serviceRoutes');
const supplierRouter = require('./routes/equipments/supplierRoutes');
const equipmentCategoryRouter = require('./routes/equipments/equipmentCategoryRoutes');
const equipmentRouter = require('./routes/equipments/equipmentRoutes');
const incidentRouter = require('./routes/incidents/incidentRoutes');
const userRouter = require('./routes/users/userRoutes');
const laboratoryRouter = require('./routes/laboratories/laboratoryRoutes');
const roomRouter = require('./routes/laboratories/roomRoutes');
const maintenanceRouter = require('./routes/maintenances/maintenanceRoutes');
const maintenanceSheetRouter = require('./routes/maintenances/maintenanceSheetRoutes');
// const viewRouter = require('./routes/viewRoutes');
const AppError = require('./utils/appError');

// app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, 'views'));


// Global MIDDLEWARES
// 1.Security packages
// set security HTTP headers
app.use(helmet({ contentSecurityPolicy: false }));

// limiting JSON files
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(cors());

// limit request from same IP
const limiter = rateLimit({
  max: 10000000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from the same ip, try again later',
});

app.use('/api', limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

///////////////////////////////////////////////////////////////

// 2.APP packages
// Use morgan dependencies for dev env
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// serving static file
app.use(express.static(`${__dirname}/public`));

//3. Routes
// app.use('/', viewRouter);
app.use('/api/service', serviceRouter);
app.use('/api/supplier', supplierRouter);
app.use('/api/equipmentCat', equipmentCategoryRouter);
app.use('/api/equipment', equipmentRouter);
app.use('/api/incident', incidentRouter);
app.use('/api/user', userRouter);
app.use('/api/laboratory', laboratoryRouter);
app.use('/api/room', roomRouter);
app.use('/api/maintenance', maintenanceRouter);
app.use('/api/maintenanceSheet', maintenanceSheetRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// with err params express know that is a middleware error function
app.use(globalErroHandler);

module.exports = app;
