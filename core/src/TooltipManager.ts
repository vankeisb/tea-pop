import { Box } from './Box';
import { Pos, pos } from './Pos';

export type TooltipProvider = () => Promise<Box>;

let _refBox: Box | undefined;
let _ttBox: Box | undefined;
let _counter = 0;
let _timeout: any;
let _provider: TooltipProvider | undefined;

export function tooltipMouseEnter(
  mousePos: Pos,
  refBox: Box,
  provider: TooltipProvider,
): void {
  if (_refBox && !_refBox.equals(refBox)) {
    // change of ref box, close existing stuff !
    closeTooltip();
  }
  _refBox = refBox;
  _provider = provider;
  document.addEventListener('mousemove', onMouseMove);
  onMouseMovePos(mousePos);
}

function onMouseMove(ev: MouseEvent): void {
  const p = pos(ev.pageX, ev.pageY);
  onMouseMovePos(p);
}

function onMouseMovePos(p: Pos): void {
  if (_timeout) {
    clearTimeout(_timeout);
  }
  _counter++;
  const c = _counter;
  _timeout = setTimeout(() => {
    // invalid counter, skip
    if (c !== _counter) {
      _timeout = undefined;
      console.log('invalid counter, skipping');
      return;
    }

    // no ref box, invalid state !
    if (!_refBox) {
      console.log('no ref box !');
      closeTooltip();
      return;
    }

    if (_ttBox) {
      console.log('found tt box', _ttBox.toString(), 'pos', p.toString());
      // tt is displayed, check if we are either on
      // ref box, or on tt box

      if (_ttBox.isPointInside(p)) {
        console.log('inside tt box, noop');
        _timeout = undefined;
        return;
      }

      if (_refBox.isPointInside(p)) {
        console.log('inside ref box, noop');
        _timeout = undefined;
        return;
      }
      console.log('not inside ref or tt, closing');
      // mouse neither on ref nor on tooltip : close !
      closeTooltip();
    } else {
      // tt is not yet displayed, trigger it !
      if (_provider) {
        console.log('calling provider');
        _provider()
          .then((ttBox) => {
            if (c === _counter) {
              // mouse hasn't moved since tt triggered,
              // store tt box for subsequent moves
              console.log('got tt box', ttBox.toString());
              _ttBox = ttBox;
            } else {
              // invalid counter
              closeTooltip();
            }
          })
          .catch((e) => {
            console.error('error while retrieving tooltip box', e);
            closeTooltip();
          })
          .finally(() => {
            _timeout = undefined;
          });
      } else {
        // no provider ?
        console.warn('no provider');
        closeTooltip();
      }
    }
  }, 200);
}

export function closeTooltip(): void {
  console.log('closeTooltip');
  if (_timeout) {
    clearTimeout(_timeout);
  }
  _refBox = undefined;
  _ttBox = undefined;
  _counter = 0;
  document.removeEventListener('mousemove', onMouseMove);
}
