const express=require('express');
const cors=require('cors');
require('dotenv').config();

const profileRoutes=require('./routes/profileroutes');

const app=express();

app.use(cors({
    origin : '*',
    methods : ['GET', 'POST'],
    allowedHeaders : ['Content-Type' , 'Authorization']
}));
app.use(express.json());
app.use(express.static('public'));
app.get('/' , (req, res)=>{
    res.send('Backend is running ');
});
app.use('/api', profileRoutes);
app.use((err , req, res , next)=>{
    console.error(err.stack);
    res.status(500).json({error : 'Something broke!'});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
