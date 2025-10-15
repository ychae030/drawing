import { thicknessType } from '../../../App';
import styles from './ThicknessSelector.module.css'

export type ThicknessSelectorProps = {
	thickness: thicknessType;
	setThickness: React.Dispatch<React.SetStateAction<thicknessType>>;
}

export default function ThicknessSelector({ thickness, setThickness }: ThicknessSelectorProps) {
	const options: thicknessType[] = [5, 20, 40];
	
	return (
		<div className={styles.thickness_box}>
			{
				options.map(v => (
					<button
						key={v}
						onClick={() => setThickness(v)}
						className={`${styles['dot'+v]} ${thickness === v ? styles.on : ""}`}
					/>
				))
			}		
		</div>
	);
}

