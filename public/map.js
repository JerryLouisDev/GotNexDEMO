var mymap = L.map('mapid').setView([32.2436, -71.0617069917815], 12);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiamVycnlsb3VpcyIsImEiOiJja25keTFpeXQxZjY4Mm9rOGU1bjgyZHJoIn0.qNBOMLhWNpcRy31fDnq_Hg'
}).addTo(mymap);


// var heart = document.getElementsByClassName("fa-heart");
// var trash = document.getElementsByClassName("fa-trash");



// Array.from(heart).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const to = this.parentNode.parentNode.childNodes[1].innerText
//         const note = this.parentNode.parentNode.childNodes[5].innerText
//         const heart = parseFloat(this.parentNode.parentNode.childNodes[7].innerText)
//         console.log(to,note,heart);
//         fetch('/messages', {
//           method: 'put',
//           headers: {'Content-Type': 'application/json'},
//           body: JSON.stringify({
//             'to': to,
//             // 'from': from
//             'note': note,
//             'heart': heart
//           })
//         })
//         .then(response => {
//           if (response.ok) return response.json()
//         })
//         .then(data => {
//           console.log(data)
//           window.location.reload(true)
//         })
//       });
// });
// Array.from(thumbDown).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
//         fetch('thumbDown', {
//           method: 'put',
//           headers: {'Content-Type': 'application/json'},
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg,
//             'thumbUp':thumbUp
//           })
//         })
//         .then(response => {
//           if (response.ok) return response.json()
//         })
//         .then(data => {
//           console.log(data)
//           window.location.reload(true)
//         })
//       });
// });

// Array.from(trash).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const to = this.parentNode.parentNode.childNodes[1].innerText
//         const note = this.parentNode.parentNode.childNodes[5].innerText
//         const id = this.parentNode.parentNode.getAttribute('data-id')
//         console.log(this.parentNode.parentNode.getAttribute('data-id'));
//         fetch('/messages', {
//           method: 'delete',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             // 'to': to,
//             // // 'from': from,
//             // 'note': note
//             'id': id
//           })
//         }).then(function (response) {
//           window.location.reload()
//         })
//       });
// });
