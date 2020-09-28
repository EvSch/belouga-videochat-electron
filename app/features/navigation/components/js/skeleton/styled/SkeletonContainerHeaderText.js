import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { multiply, divide } from '@atlaskit/theme/math';
var SkeletonContainerHeaderText = styled.div.withConfig({
  displayName: "SkeletonContainerHeaderText",
  componentId: "s5b309-0"
})(["\n  height: ", "px;\n  background-color: currentColor;\n  border-radius: ", "px;\n  opacity: 0.3;\n  ", ";\n  width: ", "px;\n"], multiply(gridSize, 2.5), divide(gridSize, 2), function (props) {
  return !props.isAvatarHidden && "margin-left: ".concat(gridSize() * 2, "px");
}, gridSize() * 18);
SkeletonContainerHeaderText.displayName = 'SkeletonContainerHeaderText';
export default SkeletonContainerHeaderText;