import React from 'react';

function Demo() {
  const list = Array(200)
    .fill(0)
    .map((item, idx) => {
      return (
        <li className="Demo-item" key={idx} onClick={()=>{
          if(idx === 44) {
            setTimeout(() => {
              try {
                throw new Error('throw an error for test');
              }catch(e) {
                if (window._FD) {
                  window._FD.addRecord({type:'error', msg: e.message, stack: e.stack})
                  window._FD.dot();
                }
              }
              
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
