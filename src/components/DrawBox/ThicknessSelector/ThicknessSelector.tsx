import { thicknessTpye } from '../DrawBox';
import styles from './ThicknessSelector.module.css'

type ThicknessSelectorProps = {
	thickness: thicknessTpye;
	setThickness: React.Dispatch<React.SetStateAction<thicknessTpye>>;
}

export default function ThicknessSelector({ thickness, setThickness }: ThicknessSelectorProps) {
	const options: thicknessTpye[] = [5, 20, 40];
	
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

