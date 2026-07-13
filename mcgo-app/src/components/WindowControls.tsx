import { memo, useCallback, useEffect, useState } from 'react';

function isTauri(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('__TAURI_INTERNALS__' in window || '__TAURI__' in window)
  );
}

async function getAppWindow() {
  const { getCurrentWindow } = await import('@tauri-apps/api/window');
  return getCurrentWindow();
}

/** Minimize / maximize / close — top-right corner (Windows layout). */
export const WindowControls = memo(function WindowControls() {
  const [maximized, setMaximized] = useState(false);
  const tauri = isTauri();

  useEffect(() => {
    if (!tauri) return;
    let unlisten: (() => void) | undefined;

    (async () => {
      try {
        const win = await getAppWindow();
        setMaximized(await win.isMaximized());
        unlisten = await win.onResized(async () => {
          setMaximized(await win.isMaximized());
        });
      } catch {
        /* browser */
      }
    })();

    return () => {
      unlisten?.();
    };
  }, [tauri]);

  const minimize = useCallback(async () => {
    if (!tauri) return;
    try {
      await (await getAppWindow()).minimize();
    } catch {
      /* noop */
    }
  }, [tauri]);

  const toggleMax = useCallback(async () => {
    if (!tauri) return;
    try {
      const win = await getAppWindow();
      await win.toggleMaximize();
      setMaximized(await win.isMaximized());
    } catch {
      /* noop */
    }
  }, [tauri]);

  const close = useCallback(async () => {
    if (!tauri) return;
    try {
      await (await getAppWindow()).close();
    } catch {
      /* noop */
    }
  }, [tauri]);

  return (
    <div className="win-controls" role="toolbar" aria-label="窗口控制">
      <button
        type="button"
        className="win-controls__btn"
        onClick={minimize}
        aria-label="最小化"
        tabIndex={-1}
      >
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M2.25 6h7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>
      <button
        type="button"
        className="win-controls__btn"
        onClick={toggleMax}
        aria-label={maximized ? '还原' : '最大化'}
        tabIndex={-1}
      >
        {maximized ? (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
              d="M4 3.25h4.75V8H4V3.25Z"
              stroke="currentColor"
              strokeWidth="1.15"
              strokeLinejoin="round"
            />
            <path
              d="M3.25 4.5H2.75v4.75h4.75v-.5"
              stroke="currentColor"
              strokeWidth="1.15"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
            <rect
              x="2.75"
              y="2.75"
              width="6.5"
              height="6.5"
              rx="1"
              stroke="currentColor"
              strokeWidth="1.15"
            />
          </svg>
        )}
      </button>
      <button
        type="button"
        className="win-controls__btn win-controls__btn--close"
        onClick={close}
        aria-label="关闭"
        tabIndex={-1}
      >
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path
            d="M3.2 3.2l5.6 5.6M8.8 3.2l-5.6 5.6"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
});
