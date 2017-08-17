'use strict';


const models = module.exports = {};

models.band = {
  name: 'pussyslayer',
  genre: 'bluegrass',
};

models.bandTwo = {
  bandName: 'slayer',
  genre: 'thras metal',
  userID: 'gotohell'
};

models.firstUser = {
  username: 'linus_torvalds',
  email: 'reeeeeeee@gnu.com',
  password: 'eeeeeeeeeeeeee',
}

models.user = {
  username: 'steve_jobs',
  email: 'windowsCanSuckIt@apple.com',
  password: 'googleSucksTo',
};

models.secondUser = {
  username: 'bill_gates',
  email: 'appleIsGarbage@windows.com',
  password: 'allHailWindows',
}

models.album = {
  albumTitle: 'fogofwar',
  numberOfTracks: 10,
  datePublished: new Date()
};

models.secondAlbum = {
  albumTitle: 'skrim',
  numberOfTracks: 12,
  datePublished: new Date()
};

models.booking = {
  date: new Date()
};

models.coordinate = {
  address: '8901 W. Sunset Blvd',
  city: 'Los Angeles',
  state: 'CA'
};

models.member = {
  memberName: 'cleatus',
  instrument: 'banjo',
  bio: 'african dictator'
};

models.message = {
  content: 'Thist is a test. It will probably fail :D. But if it doesn\'t, that\'s great!!!'
};

models.show = {

};

models.track = {
  title: 'trillville',
  url: 'http://localhost:1234'
};

// 16795 Say Road
// Wamego, Kansas, 66547
// United States 

models.venueLocation1 = {
  // userID: {type: Schema.Types.ObjectId, required: true},
  // venueID: {type: Schema.Types.ObjectId, required: true},
  address: '16795 Say Rd',
  city: 'Wamego',
  state: 'Kansas',
  zipCode: '66547'
}

models.venueLocation2 = {
  // userID: {type: Schema.Types.ObjectId, required: true},
  // venueID: {type: Schema.Types.ObjectId, required: true},
  address: '2901 3rd Ave',
  city: 'Seattle',
  state: 'WA',
  zipCode: '98101'
}

models.venue = {
  name: 'Hell', 
  // location: {type: Schema.Types.ObjectId, required: true},
  // schedule: {type: Schema.Types.ObjectId, required: true},
  // review: [{type: Schema.Types.ObjectId, ref: 'review'}],
  // media: {type: Schema.Types.ObjectId, required: false},
  // shows: [{type: Schema.Types.ObjectId, ref: 'show'}],
  desc: 'All sorts of sin and stufff'
};



models.url = `http://localhost:${process.env.PORT}`;
