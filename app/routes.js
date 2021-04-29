const ObjectId = require('mongodb').ObjectId;
const request = require('request');

module.exports = function(app, passport, db) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function(req, res) {
    console.log(req);
    db.collection('parks').find().toArray((err, result) => {
      if (err) return console.log(err)
      console.log(result);
      res.render('profile.ejs', {
        user: req.user,
        parks: result
      })
    })
  });

  app.get('/foursquare', isLoggedIn, function(req, res) {

    request({
        url: 'https://api.foursquare.com/v2/venues/explore',
        method: 'GET',
        qs: {
          client_id: 'RMVKQV1TNW5SRPR4VB2FCXND22OEVVSXHXUF0W2EUJJ5DCFL',
          client_secret: 'TIPHFMKR3GO3QCLB3HMLAXDX1NS3R3XFZAYPEGH0VIWUS2XM',
          ll: '42.2771,-71.0914',
          categoryId: '4bf58dd8d48988d1e1941735',
          v: '20210401',
          limit: 20,
        },
      },
      function(err, queryResponse, body) {
        if (err) {
          console.error(err, 'LINE 43 IM HEERRREE');
        } else {
          res.render('profileTwo.ejs', {
            user: req.user,
            parks: JSON.parse(body).response.groups[0].items

          })
          // put parks in mongodb
          console.log(JSON.parse(body).response.groups[0].items, ' json body IS HERRE LINE 45');
        }
      }
    );

  })

  //PARK SECTION ===============================================================
  app.get('/park/:parkid', isLoggedIn, function(req, res) {
    db.collection('parks').findOne({
      _id: ObjectId(req.params.parkid)
    }, (err, result) => {
      if (err) return console.log(err)
      console.log(result);
      db.collection('checkins').find({
        parkid: ObjectId(req.params.parkid),

      }).toArray((err, checkinresults) => {
        checkinresults = checkinresults.filter(c => new Date() - c.timestamp < 5 * 60 * 60 * 1000)
        res.render('park.ejs', {
          user: req.user,
          park: result,
          checkins: checkinresults
        })
      })
    });
  });
  //parkTwo section============
  app.get('/parkTwo/:parkid', isLoggedIn, function(req, res) {
    //park id is now the foursquare id not the mongodb id
    request({
        url: `https://api.foursquare.com/v2/venues/${req.params.parkid}`,
        method: 'GET',
        qs: {
          client_id: 'B3QUZDFH2JYRFTI3BPMINCL3HAUXVP2WSL1OALSHLEUQ5DUG',
          client_secret: 'R3O4O4CFMG3PL5N1HGSHQG44JQW0S2ELQCUIJWTFIVX5WSDI',
          id: req.params.parkid,
          v: '20210401',
          limit: 1,
        },
      },
      function(err, queryResponse, body) {
        if (err) {
          console.error(err, 'LINE 43 IM HEERRREE');
        } else {
          db.collection('checkins').find({
            parkid: ObjectId(req.params.parkid),

          }).toArray((err, checkinresults) => {
            checkinresults = checkinresults.filter(c => new Date() - c.timestamp < 5 * 60 * 60 * 1000)
            const park = JSON.parse(body).response.venue
            console.log(park, 'the park is herrree')
            console.log(park.location, 'PARK location HERE!!');
            console.log(park.photos, ' here are the phoototooos');
            res.render('parkTwo.ejs', {
              user: req.user,
              park: park,
              checkins: checkinresults
            })
          })

          // // res.render('parkTwo.ejs', {
          //   user: req.user,
          //
          //   // parks: JSON.parse(body).response.groups[0].items
          // })
          // put parks in mongodb
          // console.log(JSON.parse(body).response.groups[0].items, ' json body IS HERRE LINE 45');
        }
      }
    );
  })
  //     db.collection('checkins').find({
  //       parkid: ObjectId(req.params.parkid),
  //
  //     }).toArray((err, checkinresults) => {
  //       checkinresults = checkinresults.filter(c => new Date() - c.timestamp < 5 * 60 * 60 * 1000)
  //       res.render('park.ejs', {
  //         user: req.user,
  //         park: result,
  //         checkins: checkinresults
  //       })
  //     })
  //   });
  // });

  //favorite page.ejs get request
  app.get('/FavoritePark', isLoggedIn, function(req, res) {
    db.collection('monFavoriteParks').find({
      userid: req.user._id

    }).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('favoritesPage.ejs', {
        user: req.user,
        favs: result
      })
    })
  })
  //post for favorites Parks
  app.post('/parkFavorites', isLoggedIn, function(req, res) {
    console.log(req.body.parkname, 'Name is HERE', req.body.address, 'address is HERE!!');
    db.collection('monFavoriteParks').findOneAndUpdate({
      parkid: req.body.parkID,
      userid: req.user._id
    }, {
      $set: {
        parkname: req.body.parkname,
        parkid: req.body.parkID,
        userid: req.user._id
      }

    }, {
      upsert: true

    }, (err, result) => {
      if (err) return console.log(err)
      console.log('save to database');
      res.redirect('/FavoritePark')
    })
  })
  //Need to make it a POST

  app.post('/checkin/:parkid', isLoggedIn, function(req, res) {
    console.log(req, 'DOOOGGGGYYY');
    console.log(res, ' CAAAAATTTT');
    db.collection('checkins').findOne({
      parkid: ObjectId(req.params.parkid),
      userid: ObjectId(req.user._id),

    }, (err, result) => {
      if (err) return console.log(err)
      if (result) {
        console.log('result founded, no new checkIn');
        res.redirect(`/parkTwo/${req.params.parkid}`)
      } else {
        //To do: May need to remove else block
        db.collection('checkins').insertOne({
          parkid: ObjectId(req.params.parkid),
          userid: ObjectId(req.user._id),
          username: req.user.local.username,
          timestamp: new Date()
        }, (err, result) => {
          //keep err
          if (err) return console.log(err)
          console.log('checked into database')
          res.redirect(`/parkTwo/${req.params.parkid}`)
        })
      }
    })
  })

  // Post Route: CREATE CheckIn time to mongodb

  // app.post('/checkin', (req, res) => {
  //   console.log(req.body, 'REQ LOOOKK HEERRREE!');
  //   console.log(req.body.parkid,req.user._id, "IS IT WORKING!");
  //   // console.log(res, 'RES RIIGHHTT HERE!!');
  //   db.collection('checkins').save(
  //     {
  //
  //       parkid: ObjectId(req.body.parkid),
  //       userid: ObjectId(req.user._id),
  //       username: req.user.local.username,
  //       timestamp: new Date(),
  //
  //     },
  //     (err, result) => {
  //       if (err) return console.log(err)
  //       console.log('saved to database')
  //       res.redirect(`/park/${req.body.parkid}`)
  //     })
  // })


  //PUT ROUTE: Update the number of Hoopers or Favorites Counter
  app.put('/messages', (req, res) => { // add to our thumbs up
    db.collection('messages')
      .findOneAndUpdate({
        name: req.body.name,
        msg: req.body.msg
      }, {
        $set: {
          thumbUp: req.body.thumbUp + 1
        }
      }, {
        sort: {
          _id: -1
        },
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })


  //DELETE ROUTE: DELETE Time Checked In from user

  // app.delete('/checkin/:parkid', (req, res) => {
  //   console.log("response from delete ", `timestamp: new Date()`);
  //   console.log(req,'request ITS A TEST, DOG');
  //   const documentId = req.body.id
  //   db.collection('checkins').deleteOne({ _id: new mongo.ObjectId(documentId) })
  //         .then( (err, res) => {
  //     if (err) return res.send(500, err)
  //     res.send('Message deleted!')
  //   })
  // })


  app.post('/checkout/:parkid', isLoggedIn, (req, res) => {
    console.log("request for delete ", req.body.userid);
    db.collection('checkins').findOneAndDelete({

      parkid: ObjectId(req.params.parkid),
      userid: ObjectId(req.user._id)

    }, (err, result) => {
      if (err) return res.send(500, err)
      res.redirect(`/parkTwo/${req.params.parkid}`)

    })
  })

  // LOGOUT ==============================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // message board routes ===============================================================

  app.post('/loversnotes', (req, res) => {
    db.collection('loversnotes').save({
      to: req.body.to,
      from: req.body.from,
      note: req.body.note,
      heart: 0
    }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/profile')
    })
  })

  app.put('/messages', (req, res) => { // add to our thumbs up
    db.collection('loversnotes')
      .findOneAndUpdate({
        to: req.body.to,
        note: req.body.note
      }, {
        $set: {
          heart: req.body.heart + 1
        }
      }, {
        sort: {
          _id: -1
        },
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })
  // app.put('/thumbDown', (req, res) => { // add to our thumbs up
  //   db.collection('loversnotes') //refers to the mongodb that holds user information
  //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
  //     $set: {
  //       thumbUp:req.body.thumbUp - 1
  //     }
  //   }, {
  //     sort: {_id: -1},
  //     upsert: true
  //   }, (err, result) => {
  //     if (err) return res.send(err)
  //     res.send(result)
  //   })
  // })




  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function(req, res) {
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/foursquare', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/foursquare', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function(req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
