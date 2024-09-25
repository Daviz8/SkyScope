import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "process";
import { configDotenv } from "dotenv";



const app = express();
const port = 3000;
const ApiKey = process.env.ApiKeY; 
const API_URL= "https://api.openweathermap.org/data/2.5/"; 
const __dirname = dirname(fileURLToPath(import.meta.url));

app.set('view-engine', 'ejs');
app.use( express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// GET ROUTE FOR THE SITE 
app.get('/', (req,res)=>{
res.render("index.ejs");
});


// POST route for submitting the city
app.post("/submit", async (req, res) => {
  const City = req.body.city;
  if (!City) {
      return res.status(400).send("City is required");
  }
  try {
      const result = await axios.get(`${API_URL}weather`, {
          params: {
              q: City,
              appid: ApiKey
          }
      });

      // JSON VARIABLES  from "https://api.openweathermap.org/data/2.5/ API "
      const temperature = result.data.main.temp;
      const description = result.data.weather[0].description;
      const feels_like = result.data.main.feels_like;
      const humidity = result.data.main.humidity;
       const  name = result.data.name;
      const country =  result.data.sys.country;
      const weatherMain = result.data.weather[0].main;
    
      const icon = weatherMain.toLowerCase();

     
      res.render("index.ejs", { weatherMain : weatherMain, temp : ( Math.floor(temperature - 273)) ,  name : name , country: country,  feels_like:  ( Math.floor(feels_like - 273))  , humidity: humidity, description: description , icon : icon });
  } catch (error) {
      res.status(404).send(error.message);
  }
});


app.listen( port , ()=> { console.log (`app is listening at port ${port}`);

});