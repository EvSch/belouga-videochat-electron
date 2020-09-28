import styled, { keyframes, css } from 'styled-components';
import { widths, widthTransition, animationTiming, animationSpeed } from '../../utils/drawer-style-variables';
import { getProvided } from '../../theme/util';
import { zIndex } from '../../shared-variables';

var entryAnimation = function entryAnimation(offscreenX) {
  return keyframes(["\n  from { transform: translateX(", "); }\n  to { transform: translateX(0); }\n"], offscreenX);
};

var exitAnimation = function exitAnimation(offscreenX) {
  return keyframes(["\n  from { transform: translateX(0); }\n  to { transform: translateX(", "); }\n"], offscreenX);
};

var getAnimation = function getAnimation(_ref) {
  var isOpen = _ref.isOpen,
      isAnimating = _ref.isAnimating,
      width = _ref.width;
  var offscreenX = widths[width].offScreenTranslateX;
  var animation = isOpen ? entryAnimation(offscreenX) : exitAnimation(offscreenX);
  console.log(animation);

  if (isAnimating) {
    let test = css`animation: ${animation} ${animationSpeed.concat(" ").concat(animationTiming, " forwards;")}`;
    console.log(test);
    return test;
  }
  let test = css`\n    animation: none;\n    left: ${isOpen ? 0 : offscreenX };\n`;
  return test.join('');
};

var DrawerInner = styled.div.withConfig({
  displayName: "DrawerInner",
  componentId: "azrblo-0"
})(["\n  background-color: ", ";\n  color: ", ";\n  display: flex;\n  height: 100%;\n  overflow: hidden;\n  position: fixed;\n  left: 0;\n  top: 0;\n  transition: ", ";\n  width: ", ";\n  z-index: ", ";\n  ", ";\n"], function (_ref2) {
  var theme = _ref2.theme;
  return getProvided(theme).background.tertiary;
}, function (_ref3) {
  var theme = _ref3.theme;
  return getProvided(theme).text;
}, widthTransition, function (_ref4) {
  var width = _ref4.width;
  return widths[width].width;
}, zIndex.drawer, getAnimation);
DrawerInner.displayName = 'DrawerInner';
export default DrawerInner;
