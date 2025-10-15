import { useRef, useState } from 'react';
import './App.css';
import CanvasBoard from './components/CanvasBoard/CanvasBoard';
import DrawBox from './components/DrawBox/DrawBox';
import { color } from './constant';

export type PenType = 'pencil' | 'namepen' | 'erase' | null;
export type thicknessType = 5 | 20 | 40;
export type lineType = 'line1' | 'line2' | 'line3' | null;

function App() {
  const canvasRef = useRef(null);
  const [pentype, setPentype] = useState<PenType>('pencil')
  const [thickness, setThickness] = useState<thicknessType>(5)
  const [lineType, setLineType] = useState<lineType>(null)
  const [colorIdx, setColorIdx] = useState<number>(0);

  const handlePenClick = (pen: PenType) => {
    setPentype(pen);
    setLineType(null);
  }

  const handleLineClick = (line: lineType) => {
    setLineType(line);
    setPentype(null);
  }

  const handleEraseAllClick = () => {
    setPentype('pencil');
    setLineType(null);
  }

  return (
    <div>
      <CanvasBoard 
        ref={canvasRef} 
        penType={pentype}
        thickness={thickness}
        lineType={lineType}
        color={color[colorIdx]}
      />
      <DrawBox
        pentype={pentype}
        handlePenClick={handlePenClick}
        thickness={thickness}
        setThickness={setThickness}
        lineType={lineType}
        handleLineClick={handleLineClick}
        colorIdx={colorIdx}
        setColorIdx={setColorIdx}
        handleEraseAllClick={handleEraseAllClick}
      />
    </div>
  );
}

export default App;

