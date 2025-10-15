import { lineType } from '../../../App';
import styles from './LineSelector.module.css'

export type LineSelectorProps = {
	lineType: lineType;
	handleLineClick: (line: lineType) => void;
}

export default function LineSelector({ lineType, handleLineClick }: LineSelectorProps) {
	const options: Exclude<lineType, null>[] = ['line1', 'line2', 'line3'];

	return (
		<div className={styles.line_area}>
			{
				options.map(v => (
					<button
						key={v}
						onClick={() => handleLineClick(v)}
						className={`${styles[v]} ${lineType === v ? styles[v+'on'] : ""}`}
					/>
				))
			}			
		</div>
	);
}

