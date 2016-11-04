describe("DashboardService testing", function () {
	var dashboardService;
	beforeEach(angular.mock.module('rssreader'));

	beforeEach(inject(function (_dashboardService_) {
		dashboardService = _dashboardService_;
	}));

	it("dashboardService should exist", function () {
		expect(2 + 2).toEqual(4);
		expect(dashboardService).toBeDefined();
	});

	describe("viewModes count", function () {
		it("to equal 3", function () {
			expect(dashboardService.viewModes.length).toEqual(3);
		});
	});
})