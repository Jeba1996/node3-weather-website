const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forcast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

//Define path for express config
const publicDirectryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(publicDirectryPath))

app.get('', (req, res) => {
    res.render('index', {
        title:'Weather',
        name:'Jeba Shaikh'      
    })
})

app.get('/about', (req, res) => {
    res.render('about',{
        title:'About me',
        name: 'Jeba Shaikh'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helptext:'This is some helpfull text.',
        title:'Help',
        name: 'Jeba Shaikh'
    })
})

app.get('/weather', (req,res) =>{
    if(!req.query.address){
        return res.send({
            error:"You must provide an address!"
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
          if (error){
              return res.send({error})
           }

          forcast(latitude, longitude, (error, forecastData) => {
              if (error){
                  return res.send({error})
               }

              res.send({
                  forecast: forecastData,
                  location,
                  address:req.query.address
                })
            })
        })
    })

app.get('/products', (req, res) =>{
    if(!req.query.search){
    return res.send({
       error:"You must provide a search term"
    })
}
 console.log(req.query.search)
 res.send({
     products: []
 })
})

app.get('/help*', (req,res) => {
    res.render('404',{
        title:'404',
        name: 'Jeba Shaikh',
        errorMessage: 'Help artical not found'
    })
})

app.get('*', (req, res) => {
    res.render('404',{
        title:'404',
        name: 'Jeba Shaikh',
        errorMessage:'Page not found.'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
