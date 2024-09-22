const MOVIES_LIST_URL = "https://japceibal.github.io/japflix_api/movies-data.json";


let showSpinner = function(){
    document.getElementById("spinner-wrapper").style.display = "block";
  }
  
  let hideSpinner = function(){
    document.getElementById("spinner-wrapper").style.display = "none";
  }
  
  let getJSONData = function(url){
      let result = {};
      showSpinner();
      return fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }else{
          throw Error(response.statusText);
        }
      })
      .then(function(response) {
            result.status = 'ok';
            result.data = response;
            hideSpinner();
            return result;
      })
      .catch(function(error) {
          result.status = 'error';
          result.data = error;
          hideSpinner();
          return result;
      });
  }

