import { getTagColor } from 'Components/TagSelect/utils';

export const COLOR_MODES = {
  TYPE: 0,
  TAG: 1,
};

export const getEventStyles = ({
  colorMode,
  viewedBy,
  type,
  tags,
  inviteStatus,
  typeColorsMap,
  filterTagIds,
}) => {
  let color = '#333';
  let style;

  if (colorMode === COLOR_MODES.TAG && tags.length) {
    const tag = tags.find(({ id }) => filterTagIds.includes(id)) || tags[0];
    color = getTagColor(tag);
    style = {
      backgroundColor: color,
    };
  } else if (colorMode === COLOR_MODES.TYPE) {
    color = typeColorsMap[type];
    style = {
      backgroundColor: color,
    };
  } else {
    style = {
      borderColor: color,
      borderStyle: 'solid',
      borderWidth: '2px',
      backgroundColor: 'transparent',
      color: '#303030',
      boxSizing: 'content-box',
      width: 'calc(100% - 15px)',
    };
  }

  if (!!viewedBy && inviteStatus !== 'Accepted') {
    style = {
      borderColor: color,
      borderStyle: 'solid',
      borderWidth: '2px',
      marginBottom: '-1px',
      backgroundColor: 'transparent',
      color: '#303030',
    };

    if (inviteStatus === 'Declined') style.textDecoration = 'line-through';
  }

  return { style };
};
