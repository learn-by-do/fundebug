import React from 'react';
import './Mouse.css';

export default function Mouse(props) {
  let { type, x = 0, y = 0 } = props.mouse;

  return (
    <div
      className={['Replay-Mouse', type === 'click' ? 'click' : ''].join(' ')}
      style={{ left: x + 10, top: y + 58 }}
    />
  );
}
