fetch("http://localhost:2000/api/movies")
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error));