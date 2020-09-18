require('./dataBase/connection')
const moment = require('moment')

const express = require('express')
const graphqlHTTP = require('express-graphql');
const schema = require('./graphql/schema')
const Authorization = require('./middleWare/auth')
const cors = require('cors')
var fs = require('fs');
const { graphqlUploadExpress } = require('graphql-upload')
var multer = require('multer')
const { imageUpload, jwtClient } = require('./API/drive')
const { recentClear, setConsultations, manualConsultations } = require('./tasks/everyDayTasks')

const upload = multer({
    dest: 'images'

    ,
    limits: { fileSize: 1000000000 }
    // fileFilter(req,file,cb){
    //     if(!file.originalname.endsWith('.png')){
    //         return cb(new Error(file.originalname))
    //     }
    //     cb(undefined,true)
    // }
})


const app = express();
app.post('/upload', upload.single('upload'), async (req, res) =>
{


    const newPath = './images/' + new Date().toDateString() + '.jpg'


    fs.rename('./images/' + req.file.filename, newPath, async function (err)
    {

        await imageUpload(req.headers.id, newPath, jwtClient)


        fs.unlink(newPath, function (err)
        {
            if (err) throw err;
            // if no error, file has been deleted successfully

        });
    });
    res.send()




})
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(Authorization)
app.use('/graphql', graphqlHTTP({ schema, graphiql: true }))

app.listen(3006, async () =>
{
    console.log('Server Started on Port 3006')
    await setConsultations()
    await recentClear()
    await manualConsultations()
    // await  funn()




})
