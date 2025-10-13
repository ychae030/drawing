import styles from './EraseAllButton.module.css'

type EraseAllButtonProps = {
	handleEraseAllClick: () => void;	
}

export default function EraseAllButton({ handleEraseAllClick }: EraseAllButtonProps) {
	return (
		<div className={styles.eraseAll} onClick={handleEraseAllClick}>
			전체삭제
		</div>
	);
}

