import { uniqueHexColor } from 'Utils/color';

export const getTagColor = (tag) => uniqueHexColor(tag.id + tag.code);
