import React, { CSSProperties, useEffect, useState } from 'react';
import styles from './Container.module.css'

type ContainerProps = {
  children: React.ReactNode;
}

export default function Container({ children }: ContainerProps) {
	const [style, setStyle] = useState<CSSProperties>();

	useEffect(() => {

		function calcScale() {
      const bw = 1920;
      const bh = 1080;
      const sw = window.innerWidth / bw;
      const sh = window.innerHeight / bh;
      const scale = Math.min(sw, sh);

      const tx = (window.innerWidth - bw * scale) / 2;
      const ty = (window.innerHeight - bh * scale) / 2;

      setStyle({
        transform: `translate(${tx}px, ${0}px) scale(${scale})`,
        transformOrigin: "0 0"
      });
    }

		calcScale();
    window.addEventListener("resize", calcScale);

		return () => window.removeEventListener("resize", calcScale);

	}, []);
	
	return (
		<div className={styles.container} style={style}>
			{children}
		</div>
	);
}
