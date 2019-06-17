import React from 'react';

function Demo() {
  const list = Array(200)
    .fill(0)
    .map((item, idx) => {
      return (
        <li className="Demo-item" key={idx} onClick={()=>{
          if(idx === 66) {
            setTimeout(() => {
              throw new Error('throw an error for test');
            }, 100);
          }
        }}>
          <span>Item - {idx}</span>
        </li>
      );
    });
  return (
    <div className="Demo">
      <ul className="Demo-list">{list}</ul>
    </div>
  );
}

export default Demo;
