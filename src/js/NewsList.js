import createRequest from './createRequest';

export default class NewsList {
  constructor() {
    this.container = document.querySelector('.container');
    this.newsList = this.container.querySelector('.news_list');
    this.error = this.container.querySelector('.error');
    this.data = null;
    this.url = 'https://sw-0bdq.onrender.com/news';
  }

  init() {
    this.createLoading();
    this.addServiceWorker();
    this.getData();
  }

  async getData() {
    try {
      this.data = await createRequest(this.url);
      this.newsList.replaceChildren();
      const news = JSON.parse(this.data.news);
      news.forEach((el) => {
        this.createNews(el);
      });
    } catch (err) {
      console.log(`getData${err}`);
      if (this.error.classList.contains('hide')) {
        this.error.classList.remove('hide');
      }
    }
  }

  createNews(el) {
    const boxText = `
                  <div class="news data-id ="${el.id}">
                  <div class="news_date">${el.received}</div>
                  <div class="news_content ">
                    <div class="news_img_box">
                      <img src="" alt="image">
                    </div>
                    <div class="news_text ">
                    <p class="loader_title">${el.description}</p>
                    </div>
                  </div>
                </div>
        `;
    this.newsList.insertAdjacentHTML('afterbegin', boxText);
  }

  createLoading() {
    const boxText = `
        <div class="news">
        <div class="news_date loading "></div>
        <div class="news_content ">
          <div class="news_img_box loading">
            <img>
          </div>
          <div class="news_text ">
          <p class="loader_title loading"></p>
          <p class="loader_title loading"></p>
          <p class="loader_title loading"></p>
          </div>
        </div>
      </div>
  `;
    for (let i = 0; i < 3; i += 1) {
      this.newsList.insertAdjacentHTML('afterbegin', boxText);
    }
  }

  addServiceWorker() {
    if (!this.error.classList.contains('hide')) {
      this.error.classList.add('hide');
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js', { scope: './' })
        .then((reg) => {
          console.log(`registration succeded/ Scope is ${reg.scope}`);
        }).catch((error) => {
          console.log(`registration failed with ${error}`);
        });
    }
  }
}
