export function dynamicDeckIsDisabled(itemCount, isSelected) {
  return itemCount === 0 && !isSelected;
}
