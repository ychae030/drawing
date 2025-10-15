import styles from './DrawBox.module.css'
import PenSelector, { PenSelectorProps } from './PenSelector/PenSelector';
import ThicknessSelector, { ThicknessSelectorProps } from './ThicknessSelector/ThicknessSelector';
import LineSelector, { LineSelectorProps } from './LineSelector/LineSelector';
import ColorPalette, { ColorPaletteProps } from './ColorPalette/ColorPalette';
import EraseAllButton, { EraseAllButtonProps } from './EraseAllButton/EraseAllButton';

type DrawBoxProps =
	PenSelectorProps &
	ThicknessSelectorProps &
	LineSelectorProps &
	ColorPaletteProps & 
	EraseAllButtonProps

export default function DrawBox({
	pentype,
	handlePenClick,
	thickness,
	setThickness,
	lineType,
	handleLineClick,
	colorIdx,
	setColorIdx,
	handleEraseAllClick
}: DrawBoxProps) {
	
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

