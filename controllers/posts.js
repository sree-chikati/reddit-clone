const Post = require('../models/post');

module.exports = (app) => {
    
    // get all posts
    app.get('/', (req, res) => {
      var currentUser = req.user;
      Post.find({}).lean()
        .then(posts => {
          res.render('posts-index', { posts , currentUser});
        })
        .catch(err => {
          console.log(err.message);
        })
    })

    app.get('/posts/new', (req, res) => {
      var currentUser = req.user;
      console.log('Loading posts-new')
      res.render('posts-new', { currentUser });
    })

    // CREATE
    app.post('/posts/new', (req, res) => {
      if(req.user){
        const post = new Post(req.body);
        // SAVE INSTANCE OF POST MODEL TO DB
        post.save((err, post) => {
          return res.redirect('/');
        })
      }
      else {
        return res.status(401); // UNAUTHORIZED
      }
    });

    // SUBREDDIT
    app.get("/n/:subreddit", function(req, res) {
      var currentUser = req.user;
      Post.find({ subreddit: req.params.subreddit }).lean()
        .then(posts => {
          res.render("posts-index", { posts, currentUser });
        })
        .catch(err => {
          console.log(err);
        });
    });

    // can search post by id
    app.get("/posts/:id", function(req, res) {
        var currentUser = req.user;
        // LOOK UP THE POST
        Post.findById(req.params.id).lean().populate('comments')
        .then((post) => {
          res.render('posts-show', { post, currentUser })
        })
        .catch((err) => {
          console.log(err.message)
        })
    });
  
  };