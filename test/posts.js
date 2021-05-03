//test/posts.js
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

// Agent that will keep track of our cookies
const agent = chai.request.agent(server);


// CODE STARTS HERE
const Post = require('../models/post');
const User = require("../models/user");

describe('Posts', function() {
    // Post that we'll use for testing purposes
    const newPost = {
        title: 'post title',
        url: 'https://www.google.com',
        summary: 'post summary',
        subreddit: 'subreddit'
    };

    const user = {
        username: 'poststest',
        password: 'testposts'
    }

    before(function (done) {
        agent
        .post('/sign-up')
        .set("content-type", "application/x-www-form-urlencoded")
        .send(user)
        .then(function(res) {
            done();
        })
        .catch(function(err) {
            done(err);
        });
    });

  it('Should create with valid attributes at POST /posts/new', function(done) {
    // Checks how many posts there are now
    Post.estimatedDocumentCount()
        .then(function (initialDocCount) {
            agent
            .post("/posts/new")
            //This line fakes a form post,
            //since we're not actually filing out a form
            .set("content-type", "application/x-www-form-urlencoded")
            //make a request to create another
            .send(newPost)
            .then(function (res) {
                Post.estimatedDocumentCount()
                .then(function (newDocCount) {
                    //Check that hte database has one more post in it
                    expect(res).to.have.status(200);
                    //Check that the database has one more post in it
                    expect(newDocCount).to.be.equal(initialDocCount + 1)
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
            })
            .catch(function (err) {
                done(err);
            });
        })
        .catch(function (err) {
            done(err)
        });
    });

    after(function (done) {
        Post.findOneAndDelete(newPost)
        .then(function (res) {
            agent.close()
      
            User.findOneAndDelete({
                username: user.username
            })
              .then(function (res) {
                  done()
              })
              .catch(function (err) {
                  done(err);
              });
        })
        .catch(function (err) {
            done(err);
        });
    });
});