import asynciterify from './asynciterify.mjs';
import BaseComponent from './base-component.mjs';


customElements.define('test-click', class TestClick extends BaseComponent {
  static* count(input) {
    let i = 0;
    for (const value of input()) {
      console.log('*count', i, value);
      yield i++;
    }
  }

  /** login constructor */
  constructor() {
    // super({
    //   events: {
    //     'click button'() {
    //       console.log('click');
    //     },
    //   },
    // });
    super({ events: {} });

    // const countGen = function* () { while (true) yield; };
    // this.count = TestClick.count(countGen);
    // this.countInc = function () {
    //   countGen.next();
    // };
    this.click = asynciterify(this, 'click');
    // async function* filterClick(click) {
    //   console.log('this.count gen', { click });
    //   for await (const ev of click) {
    //     console.log('this.count: ev from click', ev);
    //     if (ev.target.matches('button')) { console.log('this.count: ev from click', { ev }); yield ev; }
    //   }
    //   console.log('filterClick ended');
    // }
    // this.count = filterClick(this.click);
    this.count = this.click;
    console.log(this.count);
    this.render`<button>Click</button> count ${this.count}`;
  }
});
