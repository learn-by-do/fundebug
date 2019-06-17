import React, { useState } from 'react';

let flag = false;
const RATIO = .75;
export default function Demo() {
  let data = localStorage.getItem('dot');
  let [mouse, setMouse] = useState({ left: 0, top: 0, type: 'move' });
  try {
    data = JSON.parse(data);
  } catch (e) {
    console.warn('no user data');
  }
  const timeline = data.timeline;
  let startTime = timeline[0].ts;
  if (!flag) {
    timeline.forEach(event => {
      const delay = event.ts - startTime;
      const pos = { x: event.x , y: event.y };

      setTimeout(() => {
        if (event.type === 'mouse:move') {
          setMouse({ type: 'move', ...pos });
        } else if (event.type === 'mouse:click') {
          setMouse({ type: 'click', ...pos });
        } else if (event.type === 'scroll') {
          const mIframe = document.querySelector('#mIframe');
          mIframe && mIframe.contentWindow.scrollTo(event.x, event.y);
        }
      }, delay);
    });
    flag = true
  }
  const { w, h } = data.client;

  return (
    <div className="Replay">
      <iframe
        id="mIframe"
        title="replay"
        style={{ width: w * RATIO, height: h * RATIO }}
        src="http://localhost:3000/Demo"
        frameBorder="1"
      />
      <div
        className={[
          'Replay-Mouse',
          mouse.type === 'click' ? 'click' : ''
        ].join(' ')}
        style={{ left: mouse.x, top: mouse.y + 76}}
      />
    </div>
  );
}
