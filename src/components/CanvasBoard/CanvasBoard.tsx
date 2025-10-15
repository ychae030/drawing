import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import styles from './CanvasBoard.module.css'
import { lineType, PenType, thicknessType } from '../../App';

export type CanvasBoardHandle = {
  clearCanvas: () => void; // 외부에서 호출할 API
}

type CanvasBoardProps = {
  penType: PenType;
  thickness: thicknessType
  lineType: lineType;
  color: string;
}

const CanvasBoard = forwardRef<CanvasBoardHandle, CanvasBoardProps>(
  ({ penType, lineType, color, thickness }, ref) => {

    const mainRef = useRef<HTMLCanvasElement>(null); // save
    const overlayRef = useRef<HTMLCanvasElement>(null); // preview
    const [isDrawing, setIsDrawing] = useState<boolean>(false)

    const clearCanvas = () => {}
    useImperativeHandle(ref, () => ({
      clearCanvas
    }), [clearCanvas]);
    
    return (
      <>
        <canvas
          ref={mainRef}
          width={1920}
          height={1080}
          className={styles.main}
          style={{ backgroundColor: color }}
        />
        <canvas
          ref={overlayRef}
          width={1920}
          height={1080}
          className={styles.overlay}
        />
      </>
    );
  }
);

export default CanvasBoard;