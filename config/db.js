const mongoose = require ('mongoose');
mongoose.connect('mongodb+srv://'+ process.env.DB_USER_PASS+'@cluster0.oclmr.mongodb.net/facebook-project',
{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:true
}
).then(()=> console.log('Connected to MongoBD'))
.catch((err)=> console.log('Failed to connect to MongoBD',err));