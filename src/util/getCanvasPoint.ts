export default function getCanvasPoint(
  e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  target: HTMLCanvasElement
) {
  const isTouch = "touches" in e;
  let clientX: number, clientY: number, pageX: number, pageY: number;

  if(isTouch) {
    const t = e.touches?.[0] ?? e.changedTouches?.[0];
    if(!t) return null;
    clientX = t.clientX;
    clientY = t.clientY;
    pageX = t.pageX;
    pageY = t.pageY;
  }else {
    clientX = e.clientX;
    clientY = e.clientY;
    pageX = e.pageX;
    pageY = e.pageY;
  }

  const rect = target.getBoundingClientRect();
  const scaleX = target.width / rect.width;
  const scaleY = target.height / rect.height;

  const x = (clientX - rect.left) * scaleX;
  const y = (clientY - rect.top) * scaleY;

  return {
    x, y,
    pageX, pageY,
    isMobile: isTouch,
    path: e.nativeEvent?.composedPath?.(),
    srcElement: e.target,
    timeStamp: e.timeStamp
  }
}

