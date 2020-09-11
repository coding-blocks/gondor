import classNames from 'classnames';
import { getTagColor } from 'Components/TagSelect/utils';
import './style.scss';

const TagSelectLabel = ({ tag, className, full, showDeselect, onDeselect }) => (
  <div
    className={classNames('d-inline-flex tag-search-label', className)}
    title={tag.title}>
    <div
      className="color-box mr-1"
      style={{
        backgroundColor: getTagColor(tag),
      }}
    />
    {full ? (
      <span>
        <strong>{tag.code}:</strong> {tag.title || 'create new tag'}
      </span>
    ) : (
      <span>{tag.code}</span>
    )}
    {showDeselect && (
      <i
        className="simple-icon-close ml-2 hover-primary"
        onClick={() => onDeselect(tag)}
      />
    )}
  </div>
);

export default TagSelectLabel;
