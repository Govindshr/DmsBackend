
// const mongoose = require('mongoose');

// mongoose.connect('mongodb://127.0.0.1:27017/new_db')
//   .then(() => console.log('Connected!'));


  const mongoose = require('mongoose')

// const url = `mongodb+srv://akssmbr91:CqGu8uIfp2Hhs4hC@cluster0.mtbcggb.mongodb.net/glueple_demo?retryWrites=true&w=majority`;
const url = `mongodb+srv://tolet:tolet@cluster0.nlbdxil.mongodb.net/glueple_demo?retryWrites=true&w=majority`;

const connectionParams={
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true ,
    // connectTimeoutMS: 90000,
    
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })