const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

// Cloud Hosted Database
// const db = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD,
// );

// Local Hosted Database
const db = process.env.DATABASE_LOCAL.replace(
  '<LOCAL_PORT_DATABASE>',
  process.env.LOCAL_PORT_DATABASE,
);

mongoose
  .connect(db, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    // useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`running on port ${port}, ${process.env.NODE_ENV} env 🚀`);
});

process.on('unhandledRejection', (err) => {
  console.log('Undhandler Rejection!!!! Shutting down 💥');
  server.close(() => {
    process.exit(1);
  });
});
