//NOT LOADING THIS FILE,DONT NEED IT ANYMORE!!!=================


document.querySelector('.saveParkFav').addEventListener('click', favParks);

function favParks(){
  console.log('savePark')
  let address = this.parentNode.querySelector('#address').innerText
  let name = this.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[1].ininnerText
  console.log(address);
  console.log(name, 'here is the name');

  fetch('parkFavorites', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({
      'name': name,
      'address': address
    })
  }).then(function (response) {
    if (response.ok) {
      return response.json()
    }
    window.location.reload()
  })
}
