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
}) => {
  let color = 'grey';

  if (colorMode === COLOR_MODES.TAG) {
    const tag = tags.find(({ id }) => variables.tags.includes(id)) || tags[0];
    if (!!tag) {
      color = uniqueHexColor(tag.id);
    }
  } else if (colorMode === COLOR_MODES.TYPE) {
    color = typeColorsMap[type];
  }

  let style;

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
  } else {
    style = {
      backgroundColor: color,
    };
  }

  return { style };
};
