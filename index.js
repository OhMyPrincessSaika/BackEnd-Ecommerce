const express = require('express');
const app = express();
const cors = require('cors');
//configure dot env
require('dotenv').config();
require('express-async-errors');
//connect to mongodb
const dbConnect = require('./db/dbConnect');
const port = process.env.PORT || 5000;
//routes
const authRoute = require('./router/AuthRoute');
const userRoute = require('./router/UserRoute');
const adminRoute = require('./router/AdminRoute');
const productRoute = require('./router/ProductRoute');
const orderRoute = require('./router/OrderRoute');
const brandRoute = require('./router/BrandRoute');
const categoryRoute = require('./router/CategoryRoute');
const colorRoute = require('./router/ColorRoute');
const enqRoute = require('./router/EnqRoute');
const uploadRoute = require('./router/uploadRoute');
const blogRoute = require('./router/BlogRoute');
const blogCatRoute = require('./router/BlogCatRoute');
const bannerRoute = require('./router/BannerRoute');
const bannerCatRoute = require('./router/BannerCatRoute');
//middleware
const errorHandler = require('./middlewares/errorhandler')

const notfoundmiddleware = require('./middlewares/notfoundhandler');
app.use(express.json());
app.use(cors());
app.use('/',authRoute);
app.use('/user',userRoute);
app.use('/admin',adminRoute);
app.use('/product',productRoute);
app.use('/brand',brandRoute);
app.use('/category',categoryRoute);
app.use('/color',colorRoute);
app.use('/enquiry',enqRoute);
app.use('/upload',uploadRoute)
app.use('/blog',blogRoute);
app.use('/order',orderRoute)
app.use('/blog-category',blogCatRoute);
app.use('/banner',bannerRoute);
app.use('/bannercategory',bannerCatRoute);
app.use(notfoundmiddleware)

app.use(errorHandler);
const start = async() => {
    await dbConnect(process.env.MONG0_URI)
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`)
    })
}
start();
