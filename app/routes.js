const ObjectId = require('mongodb').ObjectId;

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

  //Need to make it a POST
  app.get('/checkin/:parkid', isLoggedIn, function(req, res) {
      console.log(req, 'DOOOGGGGYYY');
      console.log(res, ' CAAAAATTTT');
    db.collection('checkins').findOne({
      parkid: ObjectId(req.params.parkid),
      userid: ObjectId(req.user._id),

    }, (err, result) => {
      if (err) return console.log(err)
      if (result) {
        console.log('result founded, no new checkIn');
        res.redirect(`/park/${req.params.parkid}`)
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
          res.redirect(`/park/${req.params.parkid}`)
        })
      }
    })
  })

  // Post Route: CREATE CheckIn time to mongodb

  app.post('/checkin', (req, res) => {
    console.log(req.body, 'REQ LOOOKK HEERRREE!');
    console.log(req.body.parkid,req.user._id, "IS IT WORKING!");
    // console.log(res, 'RES RIIGHHTT HERE!!');
    db.collection('checkins').save(
      {

        parkid: ObjectId(req.body.parkid),
        userid: ObjectId(req.user._id),
        username: req.user.local.username,
        timestamp: new Date(),

      },
      (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect(`/park/${req.body.parkid}`)
      })
  })


  //PUT ROUTE: Update the number of Hoopers or Favorites Counter
  app.put('/messages', (req, res) => { // add to our thumbs up
    db.collection('messages')
    .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
      $set: {
        thumbUp:req.body.thumbUp + 1
      }
    }, {
      sort: {_id: -1},
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


  app.delete('/checkin/:parkid', isLoggedIn, (req, res) => {
    console.log("request for delete ", req.body.userid);
    db.collection('checkin').findOneAndDelete({
      delete: req.body.timestamp
    }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
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
    successRedirect: '/profile', // redirect to the secure profile section
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
    successRedirect: '/profile', // redirect to the secure profile section
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
