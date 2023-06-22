const RIGHT_TAG = "Right";
export const right = (right) => ({
  _tag: RIGHT_TAG,
  right,
});

const LEFT_TAG = "Left";
export const left = (left) => ({
  _tag: LEFT_TAG,
  left,
});

export const is = (tag) => (either) => either._tag === tag;
export const isLeft = is(LEFT_TAG);
export const isRight = is(RIGHT_TAG);
