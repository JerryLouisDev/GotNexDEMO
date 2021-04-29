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
