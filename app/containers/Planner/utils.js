export const getSelectionOnSelect = (item, selected, matcher) => {
  const selection = selected.reduce((newSelection, selectedItem) => {
    if (!matcher(item, selectedItem)) {
      newSelection.push(selectedItem);
    }

    return newSelection;
  }, []);

  if (selection.length === selected.length) {
    selection.push(item);
  }

  return selection;
};
