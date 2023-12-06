import { attr, className, div, style, text } from './HtmlBuilder';

describe('HtmlBuilder tests', () => {
  it('build empty div', () => {
    const d = div([]);
    const d2 = document.createElement('div');
    expect(d).toEqual(d2);
  });

  it('build div with ID', () => {
    const d = div([attr('id', 'yalla')]);
    const d2 = document.createElement('div');
    d2.id = 'yalla';
    expect(d).toEqual(d2);
  });

  it('build div with class', () => {
    const d = div([className('yalla')]);
    const d2 = document.createElement('div');
    d2.className = 'yalla';
    expect(d).toEqual(d2);
  });

  it('build divs nested', () => {
    const d = div([attr('id', 'yalla')], div([attr('id', 'yolo')]));
    const d2 = document.createElement('div');
    d2.id = 'yalla';
    const d3 = document.createElement('div');
    d3.id = 'yolo';
    d2.appendChild(d3);
    expect(d).toEqual(d2);
  });

  it('styled', () => {
    const d = div([style({ position: 'absolute' })]);
    const d2 = document.createElement('div');
    d2.style.position = 'absolute';
    expect(d).toEqual(d2);
  });

  it('combo', () => {
    const d = div(
      [
        style({ position: 'absolute', height: '0' }),
        className('yalla'),
        attr('id', 'funky'),
      ],
      div([], text('I am empty')),
    );
    const d2 = document.createElement('div');
    d2.style.position = 'absolute';
    d2.style.height = '0';
    d2.id = 'funky';
    d2.className = 'yalla';
    const d3 = document.createElement('div');
    d3.innerHTML = 'I am empty';
    d2.appendChild(d3);
    expect(d).toEqual(d2);
  });
});
