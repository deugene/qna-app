import { QnaAppPage } from './app.po';

describe('qna-app App', function() {
  let page: QnaAppPage;

  beforeEach(() => {
    page = new QnaAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
