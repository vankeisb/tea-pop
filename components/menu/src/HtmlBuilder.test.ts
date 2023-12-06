import { div } from './HtmlBuilder';

describe('HtmlBuilder tests', () => {
  it('build empty div', () => {
    const d = div({});
    const d2 = document.createElement('div');
    expect(d).toEqual(d2);
  });

  it('build div with ID', () => {
    const d = div({ id: 'yalla' });
    const d2 = document.createElement('div');
    d2.id = 'yalla';
    expect(d).toEqual(d2);
  });

  it('build divs nested', () => {
    const d = div({ id: 'yalla' }, div({ id: 'yolo' }));
    const d2 = document.createElement('div');
    d2.id = 'yalla';
    const d3 = document.createElement('div');
    d3.id = 'yolo';
    d2.appendChild(d3);
    expect(d).toEqual(d2);
  });

  it('recurses in props', () => {
    const d = div({ style: { position: 'absolute' } });
    const d2 = document.createElement('div');
    d2.style.position = 'absolute';
    expect(d).toEqual(d2);
  });
});
