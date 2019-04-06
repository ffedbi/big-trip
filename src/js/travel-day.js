import Component from "./component";

export default class TravelDay extends Component {
  constructor(data) {
    super();
    this._date = data.split(` `);
  }

  get template() {
    const MOUTH_AND_YEAR = `${this._date[1]} ${this._date[2]}`;
    return `<section class="trip-day">
              <article class="trip-day__info">
                <span class="trip-day__caption">Day</span>
                <p class="trip-day__number">${this._date[0]}</p>
                <h2 class="trip-day__title">${MOUTH_AND_YEAR}</h2>
              </article>

              <div class="trip-day__items"></div>
            </section>`.trim();
  }
}
