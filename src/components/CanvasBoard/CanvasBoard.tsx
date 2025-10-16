import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import styles from './CanvasBoard.module.css'
import { lineType, PenType, thicknessType } from '../../App';
import getCanvasPoint from '../../util/getCanvasPoint';

export type CanvasBoardHandle = {
  clearCanvas: () => void; // 외부에서 호출할 API
}

type CanvasBoardProps = {
  penType: PenType;
  thickness: thicknessType
  lineType: lineType;
  color: string;
  width?: number;
  height?: number;
}

const CanvasBoard = forwardRef<CanvasBoardHandle, CanvasBoardProps>(
  ({ penType, lineType, color, thickness, width=1920, height=1080 }, ref) => {

    const mainRef = useRef<HTMLCanvasElement>(null); // save
    const overlayRef = useRef<HTMLCanvasElement>(null); // preview
    const isDrawingRef = useRef<boolean>(false); // flag (state는 렌더링에 영향을 주므로 useRef사용)
    const startRef = useRef<{ x: number, y: number} | null>(null); // 그림 그릴 때 시작좌표

    /* --- external API --- */
    const clearCanvas = useCallback(() => {
      console.log('Clear Canvas')

      const cvs = mainRef.current;
      if (!cvs) return;
      const ctx = cvs.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, cvs.width, cvs.height);

      // 오버레이도 정리
      const ov = overlayRef.current;
      const octx = ov?.getContext("2d");
      if (ov && octx) octx.clearRect(0, 0, ov.width, ov.height);
    }, []);
    useImperativeHandle(ref, () => ({ clearCanvas }), [clearCanvas]);

    /* --- setup common stroke --- */
    const setupStroke = (
      ctx: CanvasRenderingContext2D,
      mode: 'overlay' | 'main'
    ) => {
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = penType === 'namepen' ? 0.5 : 1;

      switch(penType) {
        case 'erase': {ctx.globalCompositeOperation = 'destination-out'}; break;
        case 'pencil': ctx.globalCompositeOperation = 'source-over'; break;
        case 'namepen' : ctx.globalCompositeOperation = 'xor'; break;
      }
      ctx.setLineDash([]); // solid
      console.log(ctx);
      if(penType !== 'erase') {
        ctx.strokeStyle = color
        ctx.fillStyle = color
      }else {
        ctx.strokeStyle = 'rgba(0,0,0,1)'
        ctx.fillStyle = 'rgba(0,0,0,1)'
      };
    }

    /* --- draw preview --- */
    const drawPreview = (toX: number, toY: number) => {
      const ov = overlayRef.current;
      const main = mainRef.current;
      const start = startRef.current;
      if(!ov || !main || !start) return;

      const octx = ov.getContext('2d');
      const mctx = main.getContext('2d');
      if(!octx || !mctx) return;

      // octx.clearRect(0, 0, ov.width, ov.height);
      setupStroke(octx, 'overlay');
      // setupStroke(mctx, 'main');

      octx.beginPath();
      octx.moveTo(start.x, start.y);

      if (lineType === "line1") {
        // 직선
        octx.clearRect(0, 0, ov.width, ov.height);
        octx.lineTo(toX, toY);
        octx.stroke();
      } else if (lineType === "line2") {
        // 점선
        octx.clearRect(0, 0, ov.width, ov.height);
        octx.setLineDash([thickness * 2, thickness * 1.2]);
        octx.lineTo(toX, toY);
        octx.stroke();
      } else if (lineType === "line3") {
        // 화살표(간단)
        octx.clearRect(0, 0, ov.width, ov.height);
        octx.lineTo(toX, toY);
        octx.stroke();

        const angle = Math.atan2(toY - start.y, toX - start.x);
        const head = Math.max(6, thickness * 2);
        octx.beginPath();
        octx.moveTo(toX, toY);
        octx.lineTo(
          toX - head * Math.cos(angle - Math.PI / 6),
          toY - head * Math.sin(angle - Math.PI / 6)
        );
        octx.moveTo(toX, toY);
        octx.lineTo(
          toX - head * Math.cos(angle + Math.PI / 6),
          toY - head * Math.sin(angle + Math.PI / 6)
        );
        octx.stroke();
      } else {
        // 자유곡선(연필/마커/지우개) → 프리핸드 느낌
        octx.lineTo(toX, toY);
        octx.stroke();
        startRef.current = { x: toX, y: toY };
      }
    }

    /* --- combine overlay with main --- */
    const commitPreview = () => {
      const main = mainRef.current;
      const ov = overlayRef.current;
      if(!main || !ov) return;

      const mctx = main.getContext('2d');
      const octx = ov.getContext('2d');
      if(!mctx || !octx) return;

      mctx.drawImage(ov, 0, 0);
      octx.clearRect(0 ,0 ,ov.width, ov.height);
    }

    /* --- Mouse Event --- */
    const onMouseDown: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
      e.preventDefault();
      const p = getCanvasPoint(e, e.currentTarget);
      if(!p) return;
      startRef.current = { x: p.x, y: p.y };
      isDrawingRef.current = true;
    }

    const onMouseMove: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
      if(!isDrawingRef.current) return;
      const p = getCanvasPoint(e, e.currentTarget);
      if(!p) return;
      drawPreview(p.x, p.y);
    }

    const onMouseUp: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
      if(!isDrawingRef.current) return;
      commitPreview();
      isDrawingRef.current = false;
      startRef.current = null;
    }
    
    return (
      <>
        <canvas
          ref={mainRef}
          width={width}
          height={height}
          className={styles.main}
        />
        <canvas
          ref={overlayRef}
          width={width}
          height={height}
          className={styles.overlay}
        />
        <canvas 
          width={width}
          height={height}
          className={styles.hit}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        />
      </>
    );
  }
);

export default CanvasBoard;

/* --- 
카테고리별 지출 > 통제
--- */