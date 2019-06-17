(function(win) {
  if (win._FD) {
    console.warn('fundebug SDK has already defined in window._FD');
    return;
  }

  const payload = [];
  const MAX_RECORD_NUMBER = 100;
  const MOUSE_THROTTLE_INTERVAL = 300; // ms

  function addRecord(data) {
    if (payload.length === MAX_RECORD_NUMBER) {
      payload.shift();
    }
    payload.push({ ts: Date.now(), ...data });
  }

  const dot = (data = payload) => {
    localStorage.setItem(
      'dot',
      JSON.stringify({
        timeline: data,
        client: { w: win.innerWidth, h: win.innerHeight }
      })
    );
  };

  const monitor = () => {
    handleError();
    handleMouseEvent();
    handleScroll();
  };

  const handleMouseEvent = () => {
    win.addEventListener('click', function(event) {
      const { clientX: x, clientY: y } = event;
      addRecord({ type: 'mouse:click', x, y });
    });
    win.addEventListener(
      'mousemove',
      throttle(function(event) {
        const { clientX: x, clientY: y } = event;
        addRecord({ type: 'mouse:move', x, y });
      }, MOUSE_THROTTLE_INTERVAL),
      {
        passive: true,
        capture: true
      }
    );
  };
  const handleScroll = () => {
    win.addEventListener(
      'scroll',
      throttle(function(event) {
        // const { pageXoffset: x, pageYoffset: y } = event.currentTarget;
        const { scrollX: x, scrollY: y } = window;
        addRecord({ type: 'scroll', x, y });
      }, MOUSE_THROTTLE_INTERVAL),
      {
        passive: true,
        capture: true
      }
    );
  };
  const handleError = () => {
    const oldHandler = window.onerror;
    window.onerror = (msg, url, lineNo, columnNo, error) => {
      if (oldHandler && typeof oldHandler === 'function') {
        oldHandler.call(msg, url, lineNo, columnNo, error);
      }

      const data = { type: 'error', msg, url, lineNo, columnNo, error };

      addRecord(data);
      dot();
    };
  };

  function throttle(fn, interval) {
    let hasCoolDown = true;
    let _args = (_this = null);
    return function wraper(...args) {
      if (!hasCoolDown) {
        _this = this;
        _args = args;
        return;
      }

      hasCoolDown = false;
      fn.apply(this, args);

      setTimeout(() => {
        hasCoolDown = true;
        if (_args) {
          wraper.apply(_this, _args);

          _this = _args = null;
        }
      }, interval);
    };
  }

  const sdk = {
    monitor,
    dot
  };
  win._FD = sdk;
  sdk.monitor();
})(window);
