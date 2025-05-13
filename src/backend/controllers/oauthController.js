import passport from 'passport';

export const githubAuth = passport.authenticate('github', { scope: ['user:email'] });

export const githubCallback = passport.authenticate('github', { failureRedirect: '/login'});

export const githubCallbackSuccess = (req, res) => {
    res.redirect('/');
};
