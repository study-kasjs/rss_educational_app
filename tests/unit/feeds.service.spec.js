describe("FeedsService testing", function () {
	var feedsService,
		httpBackend,
		$q,
		xmlString = "<?xml version='1.0' encoding='UTF-8'?><rss version='2.0'><channel><title>ITC.ua</title><link>http://itc.ua</link><description>ITC.UA – самый популярный в Украине онлайн-ресурс, посвященный IT</description></channel></rss>",
		format,
		feed = {
			link: 'http://itc.ua/feed',
			category: 'IT'
		},
		RESPOND_SUCCESS = {
			responseData: {
				xmlString: xmlString
			}
		},
		assert_feed = {
			category: "IT", 
			description: "ITC.UA – самый популярный в Украине онлайн-ресурс, посвященный IT",
			format: "RSS",
			link: "http://itc.ua",
			rsslink: "http://itc.ua/feed",
			title: "ITC.ua"
		}
	beforeEach(angular.mock.module('rssreader'));

	beforeEach(inject(function (_feedsService_, _$q_, $httpBackend) {
		feedsService = _feedsService_;
		$q = _$q_;
		httpBackend = $httpBackend;
	}));

	it("feedService should exist", function () {
		expect(feedsService).toBeDefined();
	});

	it('Should receive RSS XML documnt and parse it', function () {
		httpBackend.whenGET("./partials/home.html").respond(200);
		httpBackend.whenGET("/translation/locale-en.json").respond(200);
		httpBackend.whenJSONP("https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&q=" + encodeURIComponent("http://itc.ua/feed") + "&method=JSON&callback=JSON_CALLBACK&output=xml").respond(RESPOND_SUCCESS);
		httpBackend.whenPOST("/users/" + undefined + "/addFeed").respond(assert_feed);

		feedsService.addFeed(feed).then(function (data) {
			result = data;
		});
		httpBackend.flush();
	});
	it('Check XML RSS format', function () {
		format = feedsService.getRssChecker()(new DOMParser().parseFromString(xmlString, "text/xml"));
		expect(format).toEqual('RSS');
	});
	it("Check parsing", function () {
		result = feedsService.getFeedGenerator()(new DOMParser().parseFromString(xmlString, "text/xml"), feed, format);
		expect(result.category).toEqual(assert_feed.category);
		expect(result.description).toEqual(assert_feed.description);
		expect(result.format).toEqual(assert_feed.format);
		expect(result.link).toEqual(assert_feed.link);
		expect(result.rsslink).toEqual(assert_feed.rsslink);
		expect(result.title).toEqual(assert_feed.title);
	});
});