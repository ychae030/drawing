import { useState } from 'react';
import styles from './DrawBox.module.css'
import PenSelector from './PenSelector/PenSelector';
import ThicknessSelector from './ThicknessSelector/ThicknessSelector';
import LineSelector from './LineSelector/LineSelector';
import ColorPalette from './ColorPall/ColorPalette';
import EraseAllButton from './EraseAllButton/EraseAllButton';

export type PenType = 'pencil' | 'namepen' | 'erase' | null;
export type thicknessTpye = 5 | 20 | 40;
export type lineType = 'line1' | 'line2' | 'line3' | null;

export default function DrawBox() {
	const [pentype, setPentype] = useState<PenType>('pencil')
	const [thickness, setThickness] = useState<thicknessTpye>(5)
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
		<div className={styles.draw_box}>
			<div className={styles.menu_top}>
				<PenSelector pentype={pentype} handlePenClick={handlePenClick} />
				<ThicknessSelector thickness={thickness} setThickness={setThickness} />
				<LineSelector lineType={lineType} handleLineClick={handleLineClick} />
			</div>
			<ColorPalette colorIdx={colorIdx} setColorIdx={setColorIdx} />
			<EraseAllButton handleEraseAllClick={handleEraseAllClick} />
		</div>
	);
}

