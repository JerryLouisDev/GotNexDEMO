// Step 1: Create a function to Delete CheckIn that come in
function deleteCheckedIn(){
// Step 2: Create a varaible that is assigned to the checkoutButton
const checkOut = document.getElementById('checkOut');
//Step 3: Inside that function we need to grab the checkIn timestamp

//NOTE: the idea is to find based on user's id and then delete the timestamp 
// based on the local user

//var userCheckIn = document.getElementById(`${user._id}`); <---Tried this, doesn't work
//console.log(userCheckIn, 'sample)

//NOTE: this is selecting only the first checkin TIME <---- You will need to loop through
//                                                          all your checkinTimes and find
//                                                          the checkinTime of the local user
//                                                          look at park.ejs code, user._id
//                                                          line 36 and checkins[i].userid line 54
//                                                          match once, but I'm unsure how to grab
//                                                          that user._id (maybe make it an ID),
//                                                          but it's unique, so your function 
//                                                          deleteCheckedIn. Maybe pass an Event?
                                                       
var checkIn = document.querySelector('.checkInTimes').innerText  
console.log(checkIn, '1ST FUNCTION - only selects first checkin ');

//Step 4: Now we want to delete the timestamp from out mongodb
fetch('checkin', {
  method: 'delete',
  headers: {
    'Content-Type': 'application/json'
  },
  body:JSON.stringify({
    'checkIn': checkIn
  })
// }).then(function (response) {
//   window.location.reload()
// })
//Step 5: celebrate our function deleted out timestamp from mongodb
})
}
document.getElementById('checkOut').addEventListener('click', deleteCheckedIn());



//Savage Auth Delete Code,
//So the Bottom code dosn't delete yet, but it selects the timestamp needed
//based on which transcan you select.
//Your checkout button needs to do this same select process of a timestamp
//while not being a transcan next to the item you want to delete...

var trash = document.getElementsByClassName("fa-trash");

var timestamp = document.getElementsByClassName("checkInTimes") 

Array.from(timestamp).forEach(function(element) {
  console.log('selected Timestamp?')
  element.addEventListener('click', function(element){

    //NOTED: HERE you ARE selecting the innerTEXT right next to the trash can
    //       you selected but using 'element.target' <--- if you console log this
    //       you'll see it's always the thing you click on, to make this work
    //       line 57 needs the callback function meaning 'function(element)' to have
    //       element passed through into it.

    const timestampNextToTrashCan = element.target.parentNode.innerText;
    console.log(timestampNextToTrashCan, '2nd Function - THIS IS THE TEXT NEXT TO TRASH CAN')
 
    //sample code, it doesn't select what you want (it gets the park address above though)

    // const userId = this.parentNode.parentNode.childNodes[3].innerText
    // console.log(userId,'USERID OBTAINED')
    // const timeStamp = this.parentNode.parentNode.childNodes[1].innerText
    // console.log(timeStamp, 'TIMESTAMP IS SELECTED')


    //THIS PART, GET MORE INSIGHT:
    //error: main.js:27 DELETE http://localhost:1995/park/checkin 404 (Not Found) always appears
    //I think this is due to the GET routes or maybe it's not finding a route that ends with
    //park/checkin? **Fixing this below should allow you to delete a timestamp, but then
    //you need to modify it to only work for a local user, maybe conditionally making
    //the trashcan only appear if local user?

    fetch('checkin', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'timestamp': timestampNextToTrashCan
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});
