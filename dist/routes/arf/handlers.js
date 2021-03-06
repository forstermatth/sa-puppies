'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

exports['default'] = [function findPuppyList(req, res, next) {
  var _this = this;

  // retrieve the cuteness
  (0, _request2['default'])('http://arf.ab.ca/animals/dogs/', function (err, response, body) {
    if (err) {
      res.send(400, err);
      res.end();
    }

    _this.vars.puppies = body.match(/(http:\/\/arf.ab.ca\/animal\/(?:\d*)[a-z]?(-(?:[a-z]*))*\/)/ig);

    var temp = [];
    for (var i in _this.vars.puppies) {
      var puppy = _this.vars.puppies[i];
      if (!_lodash2['default'].includes(temp, puppy)) temp.push(puppy);
    }

    _this.vars.puppies = temp;
    return next();
  });
}, function findNewPuppies(req, res, next) {
  var _this2 = this;

  // store the cuteness
  var getKnownPups = this.modules.puppyCrate.gatherPuppies('arf');

  var savePups = getKnownPups.then(function (knownPups) {

    _this2.vars.newPuppies = _lodash2['default'].compact(_this2.vars.puppies.map(function (puppy) {
      if (!_lodash2['default'].includes(knownPups, puppy)) {
        _this2.modules.log.info('Found new pup! ' + puppy);
        return puppy;
      }
    }));

    return _this2.modules.puppyCrate.addNew('arf', _this2.vars.puppies);
  });

  savePups.then(function () {
    res.send(_this2.vars.newPuppies);
    res.end();
    return next();
  });
}, function yoNewPuppies(req, res, next) {
  // beam the cuteness
  this.modules.yo.all(this.vars.newPuppies).then(function () {
    return next();
  });
}];
module.exports = exports['default'];