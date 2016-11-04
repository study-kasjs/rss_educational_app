describe("ArticlesService testing", function () {
	var articlesService,
		httpBackend,
		xmlString = "<?xml version='1.0' encoding='UTF-8'?><rss version='2.0'><channel><title>ITC.ua</title><link>http://itc.ua</link><description>ITC.UA – самый популярный в Украине онлайн-ресурс, посвященный IT</description><item><title>Новый экран ноутбуков HP не дает другим людям видеть изображение на дисплее</title><link>http://itc.ua/blogs/novyiy-ekran-noutbukov-hp-ne-daet-drugim-lyudyam-videt-izobrazhenie-na-displee/</link><pubDate>Fri, 26 Aug 2016 07:49:00 +0000</pubDate><description><![CDATA[<div style='float: left; margin: 0px 10px 7px 0;'><img width='268' height='190' src='http://i1.wp.com/itc.ua/wp-content/uploads/2016/08/hp-sure-view-3m-screen-0001-1500x1000.jpg?resize=268%2C190' class='attachment-thumbnail size-thumbnail wp-post-image' alt='hp-sure-view-3m-screen-0001-1500x1000' srcset='http://i1.wp.com/itc.ua/wp-content/uploads/2016/08/hp-sure-view-3m-screen-0001-1500x1000.jpg?resize=268%2C190 268w, http://i1.wp.com/itc.ua/wp-content/uploads/2016/08/hp-sure-view-3m-screen-0001-1500x1000.jpg?zoom=2&amp;resize=268%2C190 536w, http://i1.wp.com/itc.ua/wp-content/uploads/2016/08/hp-sure-view-3m-screen-0001-1500x1000.jpg?zoom=3&amp;resize=268%2C190 804w' sizes='(max-width: 268px) 100vw, 268px' /></div>анию с помощью горячей клавиши. Если в большинстве обычных экранов углы обзора матрицы могут доходить почти до 180 градусов, то в новых ноутбуках HP этот показатель можно будет регулировать с [&#8230;]]]></description></item></channel></rss>",
		feed = {
			category: "IT",
			description: "ITC.UA – самый популярный в Украине онлайн-ресурс, посвященный IT",
			format: "RSS",
			link: "http://itc.ua",
			rsslink: "http://itc.ua/feed",
			title: "ITC.ua"
		},
		assert_article = {
			title: "Новый экран ноутбуков HP не дает другим людям видеть изображение на дисплее",
			link: "http://itc.ua/blogs/novyiy-ekran-noutbukov-hp-ne-daet-drugim-lyudyam-videt-izobrazhenie-na-displee/",
			date: 1472197740000,
			img: "http://i1.wp.com/itc.ua/wp-content/uploads/2016/08/hp-sure-view-3m-screen-0001-1500x1000.jpg?resize=268%2C190"
		}
		article = {},
		RESPOND_SUCCESS = {
			responseData: {
				xmlString: xmlString
			}
		}
	beforeEach(angular.mock.module('rssreader'));
	
	beforeEach(inject(function (_articlesService_, _$q_, _$httpBackend_) {
		articlesService = _articlesService_;
		$q = _$q_;
		httpBackend = _$httpBackend_;
	}));

	it("articlesService should exist", function () {
		expect(articlesService).toBeDefined();
	});

	it('Read article from XML', function () {
		var res;
		httpBackend.whenGET("./partials/home.html").respond(200);
		httpBackend.whenGET("/translation/locale-en.json").respond(200);
		httpBackend.whenJSONP("https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=" + "50" + "&q=" + encodeURIComponent(feed.rsslink) + "&method=JSONP&callback=JSON_CALLBACK&output=xml").respond(RESPOND_SUCCESS);
		articlesService.getArticlesByFeed(feed).then(function (response) {
	        article = articlesService.articles[0];
		});
		httpBackend.flush();
	});
	it('Check parsed article', function () {
		expect(article.title).toEqual(assert_article.title);
		expect(article.link).toEqual(assert_article.link);
		expect(article.img).toEqual(assert_article.img);
		expect(article.date).toEqual(assert_article.date);
	});
})