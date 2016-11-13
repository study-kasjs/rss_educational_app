describe('Sign up a new user account', function () {
	var mongoose = require('mongoose'),
		userPassword = '123456789aA!',
		userEmail = 'testemail@test.com',
		host = 'http://rss-reader.azurewebsites.net/#/register',
		localhost = 'http://localhost:8080/#/register'

	it('should go to register page and register new user account', function () {
		browser.get(localhost ? localhost : host);
		element(by.model('user.email')).sendKeys(userEmail);
		element(by.model('user.password')).sendKeys(userPassword);
		element(by.model('user.repPassword')).sendKeys(userPassword);
		element(by.model('agreeWith')).click().then(function () {
			element(by.id('sub_btn')).click();
		});
		expect(element(by.binding('error.message')).getText()).toEqual('First you have to approve you email. We have send verification link to your email');
	});

	it('should approve email and return link from email', function () {
		browser.get(localhost ? localhost : host);
		element(by.model('user.email')).sendKeys(userEmail);
		element(by.model('user.password')).sendKeys(userPassword);
		element(by.model('user.repPassword')).sendKeys(userPassword);
		element(by.model('agreeWith')).click().then(function () {
			element(by.id('sub_btn')).click().click();
		});
		expect(element(by.binding('error.message')).getText()).toEqual('Please check your email to continue registration');
	});
});