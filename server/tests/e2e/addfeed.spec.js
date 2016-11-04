// describe('Add Feed test', function () {
// 	var EC = protractor.ExpectedConditions;

// 	it('Should login first', function () {
// 	    console.log("Should login first");
// 		browser.get('http://localhost:8080/');

// 		element(by.id('login-btn')).click();

// 		var input = element(by.id("InputEmail"));
// 		browser.wait(EC.elementToBeClickable(input), 1000);
// 		input.sendKeys("qwerty@qwerty");

// 		input = element(by.id("InputPassword"));
// 		browser.wait(EC.elementToBeClickable(input), 1000);
// 		input.sendKeys("Qwerty1_\n");
	  
// 	});
// 	it('Should see error if feed already exist', function () {
// 		var input;
// 		element(by.id('sidebar-toggle')).click();
// 		element(by.id('add-feed-test-btn')).click();
// 		element(by.id('sidebar-toggle')).click();

// 		input = element(by.id("url"));
// 		browser.wait(EC.elementToBeClickable(input), 1000);
// 		input.sendKeys("http://itc.ua/feed/");

// 		var select = element(by.model('obj.category'));
// 		select.$('[value="string:IT"]').click();

// 		element(by.id('add-feed-btn-submit')).click();
// 		expect(element(by.binding('error')).getText()).toBe('You have already added this feed');
// 	});

// 	it('Should add new feed', function () {
// 		var input;
// 		input = element(by.id("url"));
// 		input.clear();
// 		browser.wait(EC.elementToBeClickable(input), 1000);
// 		input.sendKeys("http://www.3dnews.ru/news/rss/");

// 		var select = element(by.model('obj.category'));
// 		select.$('[value="string:Culture"]').click();
// 		element(by.id('add-feed-btn-submit')).click();
// 	});

// 	it('Should delete recently added feed', function () {
// 		element(by.id('sidebar-toggle')).click();
// 		element.all(by.css('.sidebar-item')).get(3).click();
// 		element(by.id('sidebar-toggle')).click();
// 		element(by.css('.app-btn-delete')).click();
// 	});
// });

