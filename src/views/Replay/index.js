import React, { useState } from 'react';
import Mouse from './components/Mouse';
import PlayCtrl from './components/PlayCtrl';

const RATIO = 0.6;
const initialMouse = { left: 0, top: 0, type: 'move' };
let mIframe;
let rafStart = 0
let rafElapse = 0;
let rafId;

// records
let timeline = []
let records = {client: {}, timeline: []}
let lastTime = 0
let w,h

function getData() {
  records = localStorage.getItem('dot');
  try {
    records = JSON.parse(records);
  } catch (e) {
    console.warn('no user records');
  }
  timeline = records.timeline
  if(timeline.length) {
    lastTime = timeline[timeline.length - 1].ts;
    
  };
  ({ w=0, h =0 } = records.client);
}
getData();
export default function Demo() {
  let [mouse, setMouse] = useState(initialMouse);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  
  const handlePlayPause = play => {
    if (!timeline.length) {
      getData();
    }
    setPlaying(play);
    if (play) {
      rafStart = 0
      rafId = window.requestAnimationFrame(tick); // start tick
    } else {
      rafElapse += (performance.now() - rafStart)
      // console.log(rafElapse);
      window.cancelAnimationFrame(rafId);
    }

    function tick(timestamp) {
      if (!rafStart) rafStart = timestamp;
      const progress = timestamp - rafStart + rafElapse;
      handleUiChange(progress);
    }

    function handleUiChange(ts) {
      if (!timeline.length) {
        window.cancelAnimationFrame(rafId);
        setTimeout(() => {
          setPlaying(false);
          setProgress(0);
          setMouse(initialMouse);
          mIframe && mIframe.contentWindow.scrollTo(0, 0);
        }, 500);
        return;
      }

      if (ts >= timeline[0].ts) {
        // console.log(ts, rafElapse, timeline.length);
        let record = timeline.shift();
        const pos = { x: record.x * RATIO, y: record.y * RATIO };
        setProgress(record.ts / lastTime);
        if (record.type === 'mouse:move') {
          setMouse({ type: 'move', ...pos });
        } else if (record.type === 'mouse:click') {
          setMouse({ type: 'click', ...pos });
        } else if (record.type === 'scroll') {
          mIframe = document.querySelector('#mIframe');
          mIframe && mIframe.contentWindow.scrollTo(record.x, record.y);
        }
      }
      rafId = window.requestAnimationFrame(tick);
    }
  };

  return (
    <div className="Replay" style={{ width: w * RATIO, height: h * RATIO }}>
      <iframe
        id="mIframe"
        title="replay"
        src="http://localhost:3000/Demo"
        style={{
          width: w,
          height: h,
          transform: 'scale(' + RATIO + ')',
          transformOrigin: '0 0'
        }}
        frameBorder="0"
      />
      <PlayCtrl
        isPlaying={playing}
        progress={progress}
        onPlayPause={handlePlayPause}
      />
      <Mouse mouse={mouse} />
    </div>
  );
}
