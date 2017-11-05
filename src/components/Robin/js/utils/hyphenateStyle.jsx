import {keys, zipObject} from 'lodash';
import hyphenateStyleName from 'fbjs/lib/hyphenateStyleName';

export default function hyphenateStyle(style) {
  const styleNames = keys(style);
  const hyphenatedStylenames = styleNames.map(styleName =>
    hyphenateStyleName(styleName)
  );
  const values = styleNames.map(styleName => style[styleName]);

  return zipObject(hyphenatedStylenames, values);
}
