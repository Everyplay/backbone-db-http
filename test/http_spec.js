var Promises = require('backbone-promises');
require('chai').should();
var when = require('when');

var Model = Promises.Model;
var Db = require('..');

var mockResponse = {
 id: 55,
  user_id: 1,
  profile_id: 4489,
  group_id: 1638,
  name: 'Angry Botsit',
  redirect_uri: 'https://m.everyplay.com/auth',
  permalink_uri: '',
  external_url: 'https://itunes.apple.com/app/id457251993',
  external_id: '457251993',
  content_advisory_rating: 4,
  content_rating: 4,
  play_id: '',
  type: 'app',
  show_appstore_button: true,
  force_private: false,
  sdk_version: 0,
  sandbox_sdk_version: 0,
  created_at: '2013-01-10T11:33:26.220Z',
  video_count: 0,
  status: 'public',
  facebook_sdk_enabled: false,
  profile:
   { id: 4489,
     username: 'Angry Botsit',
     status: 'normal',
     created_at: '2013-01-10T11:33:26.220Z',
     permalink: 'angry-botsit',
     country: '',
     cover_url: 'https://www.everyplay.com/assets/img/icon-default-cover.jpeg',
     cover_url_small: 'https://www.everyplay.com/assets/img/icon-default-cover.jpeg',
     avatar_url: 'http://static.everyplay.com/everyplay/avatars/large/3787288722572.3584-4489.jpg',
     unread_notifications_since: '2014-11-18T13:08:26.694Z',
     acl_roles: [ 'group_1638_moderator' ],
     admin: false,
     public_video_count: 0,
     comment_count: 0,
     total_comment_count: 0,
     public_roles: [ 'game_profile' ],
     acl: { has_access_to: [Object] } },
  acl: { has_access_to: [ 'read', 'create' ] }
};

describe('backbone-db-http tests', function () {

  before(function() {
    this.db = new Db('game', {
      base_url: 'http://api.everyplay.com'
    });
    // mock server response
    this.db.request = function() {
      return when.resolve(mockResponse);
    };
    this.Model = Model.extend({
      url: function() {
        var base = '/games/';
        return base + (this.id ? this.id : '');
      },
      db: this.db,
      sync: this.db.sync
    });
  });

  it('should fetch model', function() {
    var model = new this.Model({id: 55});
    return model.fetch().then(function() {
      model.get('name').should.equal('Angry Botsit');
    });
  });

});
