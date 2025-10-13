import styles from './PenSelector.module.css'
import { PenType } from '../DrawBox';

type PenSelectorProps = {
	pentype: PenType;
	handlePenClick: (pen: PenType) => void;
}

export default function PenSelector({ pentype, handlePenClick }: PenSelectorProps) {
	const options: Exclude<PenType, null>[] = ['pencil', 'namepen', 'erase']

	return (
		<div className={styles.pen}>
			{
				options.map(v => (
					<button
						key={v}
						onClick={() => handlePenClick(v)}
						className={`${styles[v]} ${pentype === v ? styles.on : ""}`} />
				))
			}
		</div>
	);
}
