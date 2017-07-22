/*******************************************************************************
 *  
 *  Author: Peter Prib
 *  Copyright Frygma Pty Ltd (ABN 90 791 388 622 2009). 2014 All rights reserved.
 * 
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *********************************************************************************/
module.exports = {
	getLogon : function(app) {
			if(this.SSO==undefined)
				this.initialize(app);
			if (this.isNotDefined())  return "";
			return '<a href="/auth/login">Login</a>';
		}
	,isDefined : function() {
		return !this.isNotDefined();
		}
	,isNotDefined : function() {
			if (this.SSO==null)
				this.SSO = JSON.parse(process.env.SSO||'{"client_id":"dummy","client_secret":"secret"}');
			return this.SSO.client_id=="dummy";
		}
	,initialize : function(app) {
			if (this.isNotDefined()) {
				console.log("SSO not configured ");
				return;
			}
			this.ssoIdStrategy = require('passport-ibmid-oauth2').Strategy;
			this.passport = require('passport')
			app.use(passport.initialize());
			app.use(passport.session());
			passport.serializeUser(function(user, done) {
					done(null, user);
				});
			passport.deserializeUser(function(obj, done) {
					done(null, obj);
				});
			passport.use('ssoId'
				, new ssoIdStrategy({
					clientID: SSO.client_id
					,clientSecret: SSO.client_secret
					,callbackURL: 'https://' + baseUrl + '/auth/ssoId/callback'
					,passReqToCallback: true
					}
				, function(req, accessToken, refreshToken, profile, done) {
						req.session.ssoId = {};
						req.session.ssoId.profile = profile;
						return done(null, profile);
					}
				));
			app.get('/auth/ssoId'
					,passport.authenticate('ssoId', { scope: ['profile'] })
					,function(req, res) {
						}
				);
			app.get('/auth/ssoId/callback'
					,passport.authenticate('ssoId'
						, { failureRedirect: '/auth/error', scope: ['profile'] }
						)
					,function(req, res) {
							res.redirect('/private')
						}
				);
			app.get('/auth/error', function(req, res) {
					res.send('Failed to authenticate\n');
				});
			app.get('/auth/login'
					,this.authenticate()
					,function(req, res) {
						var profile = req.session.ssoId.profile;
						res.send('Hello ' + profile.firstName + ' ' + profile.lastName + '! <a href="/auth/logout">Logout</a>\n');
					}
				);
			app.get('/auth/logout', function(req, res) {
					passport._strategy('ssoId').logout(req, res, 'https://' + baseUrl + '/');
				});
		}
		,authenticate : function() {
				return function(req, res, next) {
						if (!req.isAuthenticated() || req.session.ssoId == undefined)
							res.redirect('/auth/ssoId');
						else
							next();
					};
			}
	}