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
    const setupStroke = (ctx: CanvasRenderingContext2D) => {
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = penType === 'namepen' ? 0.3 : 1;
      ctx.globalCompositeOperation = penType === 'erase' ? 'destination-out' : 'source-over';
      ctx.setLineDash([]); // solid
      
      if(penType !== 'erase') ctx.strokeStyle = color;
    }

    /* --- draw preview --- */
    const drawPreview = (toX: number, toY: number) => {
      const ov = overlayRef.current;
      const start = startRef.current;
      if(!ov || !start) return;

      const octx = ov.getContext('2d');
      if(!octx) return;

      // octx.clearRect(0, 0, ov.width, ov.height);
      setupStroke(octx);
      octx.beginPath();
      octx.moveTo(start.x, start.y);

      // 자유곡선(연필,마커,지우개)
      octx.lineTo(toX, toY);
      octx.stroke();

      startRef.current = { x: toX, y: toY };
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