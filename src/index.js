const searchInput=document.getElementById("search-input");
const currentLocationBtn=document.getElementById("getCurrLocation");
const recentSearch=document.querySelector(".recentSearch");
const searchHistory=document.getElementById("search-history-dropdown");
const submitBtn=document.querySelector("#submitBtn");

const option=document.createElement("option");
const select=document.getElementById("search");

let searchResult=[];

let day=new Date();
const month=day.getMonth()+1;
const date=day.getDate();
const year=day.getFullYear();
const hours=day.getHours();
const min=day.getMinutes();
const s=day.getSeconds();


//on page load
getApi("Delhi");
fiveDaysDataDisplay("Delhi");

//on enter press
searchInput.addEventListener("keypress",(e)=>clickMe(e));

function clickMe(e){
  if (e.key==="Enter" ) {
    e.preventDefault();
    let input=searchInput.value;
    if (input.length!==0) {
      searchResult.unshift(input);
      console.log(searchResult)
    localStorage.setItem("search-history",JSON.stringify(searchResult));
      searchData(input);
    
    getApi(input);
    fiveDaysDataDisplay(input);
  }else{
    alert("Please type something to search")
  }
  searchInput.value="" ;
}}

//udate data in dropdown
function searchData(element){
      let opt = element;
      let el = document.createElement("option");
      el.textContent = opt;
      el.value = opt;
      select.appendChild(el);
}




function dropdownHandle(event) {
  const tar=event.target.value;
  console.log(tar);
  getApi(tar);
  fiveDaysDataDisplay(tar);
  
}
select.addEventListener("click",(e)=>dropdownHandle(e));


//current location
currentLocationBtn.addEventListener("click",()=>{
  let name="";
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position=>{
      const latitude=position.coords.latitude;
      const longitude=position.coords.longitude;
      const locationData=`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=b169b31281ffa2a2b70b9e8ac22c3e88&units=imperial`;
      

      fetch(locationData).then(res=>res.json())
      .then(data=>{
        name=data.city.name;
        getApi(name)
        fiveDaysDataDisplay(name);
      })
    })
  
  }else{
    alert("Unable to fetch data from Geolocation") 
   }
})


function fiveDaysDataDisplay(city){
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=b169b31281ffa2a2b70b9e8ac22c3e88&units=metric`)
  .then(res=>res.json())
  .then(data=>{
    let i=0;
    let j=1;
    console.log(data);
  data.list.forEach (element =>{
    for(let i=1;i<6;i++){
      if (element.dt_txt===`${year}-${month}-${date+i} 12:00:00`) {
        //data display
        document.querySelector(`#date${j}`).innerHTML= `( ${date+i}/${month}/${year} )`;
        document.querySelector(`#temp${j}`).innerHTML=element.main.temp;
        document.querySelector(`#wind${j}`).innerHTML=element.wind.speed;
        document.querySelector(`#humidity${j}`).innerHTML=element.main.humidity;
        let icon_id=element.weather[0].icon;
        document.querySelector(`#weatherImg${j}`).src=`http://openweathermap.org/img/wn/${icon_id}@2x.png`;
        j++;
        
      }
    }
 
  })
})}



//fetches api using the user data
function getApi(value){
// let cityName=searchInput.value;
const requestUrl=`https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=b169b31281ffa2a2b70b9e8ac22c3e88&units=imperial`;

fetch(requestUrl).then(response=>response.json())
.then(data=>{
  // console.log(data)
displayWeather(data);

}).catch(err=>{
  alert("Unable to connect to OpenWeather");
  
})
}



// uses api data from getApi() and replaces text in html
let displayWeather=function(weatherData){

    document.querySelector("#location").innerHTML=weatherData.name + " ("+date+"/"+month+"/"+year+")";
    document.querySelector("#temp").innerHTML=((weatherData.main.temp-32)/1.8).toFixed(2);
    document.querySelector("#wind").innerHTML=weatherData.wind.speed;
    document.querySelector("#humidity").innerHTML=weatherData.main.humidity;
    document.querySelector("#description").innerHTML=weatherData.weather[0].description;
    let icon_id=weatherData.weather[0].icon;
    document.querySelector("#main-forecast-img").src=`http://openweathermap.org/img/wn/${icon_id}@2x.png`;
  }



// .searchContainer:focus-within .recentSearch {
//   display: block;
// }