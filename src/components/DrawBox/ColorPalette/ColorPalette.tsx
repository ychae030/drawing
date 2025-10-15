import React from 'react';
import styles from './ColorPalette.module.css';
import { color } from '../../../constant';

type ColorPaletteProps = {
	colorIdx: number;
	setColorIdx: React.Dispatch<React.SetStateAction<number>>
}

export default function ColorPalette({ colorIdx, setColorIdx }: ColorPaletteProps) {
	return (
		<div className={styles.color_box}>
			{
				color.map((v, i) => (
					<button 
						key={v}
						className={`${colorIdx === i ? styles.on : ""}`}
						onClick={() => setColorIdx(i)}
						style={{ backgroundColor: v }}
					/>
				))
			}
		</div>
	);
}

