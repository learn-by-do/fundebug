import React from 'react';
import './PlayCtrl.css';
import cn from 'classnames';

export default function PlayCtrl(props) {
  const { progress, isPlaying, onPlayPause } = props;
  return (
    <div className={cn('PlayCtrl', !isPlaying && 'paused')} onClick={()=>{
      onPlayPause(false);
    }}>
      {!isPlaying && (
        <div
          className="PlayCtrl-btn"
          onClick={(event) => {
            event.stopPropagation()
            onPlayPause(true);
          }}
        />
      )}
      <div
        className="PlayCtrl-progress"
        style={{ width: progress * 100 + '%' }}
      />
    </div>
  );
}
